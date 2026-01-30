from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pyautogui
import time
import os
import threading
from typing import Dict, List, Optional
import json

app = FastAPI(title="OBS Control API")

# 允许跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # 你的前端端口
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 全局状态
recording_status = {
    "is_recording": False,
    "current_resolution": 0,
    "current_fps": 0,
    "total_resolutions": 10,
    "progress": 0,
    "current_task": "",
    "logs": []
}

# 默认坐标配置
COORDS = {
    "source_item": (487, 667),
    "res_dropdown": (514, 518),
    "fps_dropdown": (290, 589),
    "ok_button": (1411, 797),
    "record_button": (1345, 723),
}

# 配置
VIDEO_PATH = "/Users/yunxi/Movies"
RECORD_DURATION = 5
WAIT_UI = 2.0

def add_log(message: str):
    """添加日志记录"""
    timestamp = time.strftime("%H:%M:%S")
    log_entry = f"[{timestamp}] {message}"
    recording_status["logs"].append(log_entry)
    if len(recording_status["logs"]) > 100:  # 保持最近100条日志
        recording_status["logs"].pop(0)

def get_latest_file(path):
    """获取最新视频文件"""
    valid_extensions = ('.mp4', '.mkv', '.mov', '.ts', '.flv')
    files = [os.path.join(path, f) for f in os.listdir(path) if f.lower().endswith(valid_extensions)]
    if not files:
        return None
    return max(files, key=os.path.getctime)

def rename_video(res_index, fps_val):
    """重命名视频文件"""
    add_log("等待 OBS 释放文件...")
    
    max_retries = 10
    for i in range(max_retries):
        time.sleep(3)
        old_file = get_latest_file(VIDEO_PATH)
        
        if not old_file:
            add_log(f"警告：在 {VIDEO_PATH} 中没找到任何视频文件")
            continue
            
        size_before = os.path.getsize(old_file)
        time.sleep(1)
        size_after = os.path.getsize(old_file)
        
        if size_before == size_after and size_after > 0:
            ext = os.path.splitext(old_file)[1]
            timestamp = time.strftime("%H%M%S")
            new_filename = f"Item_{res_index + 1}_{fps_val}fps_{timestamp}{ext}"
            new_path = os.path.join(VIDEO_PATH, new_filename)
            
            try:
                os.rename(old_file, new_path)
                add_log(f"✅ 成功重命名为: {new_filename}")
                return
            except Exception as e:
                add_log(f"重命名失败 (第{i + 1}次尝试): {e}")
        else:
            add_log("文件正忙，等待中...")
    
    add_log("错误：达到最大重试次数，重命名失败")

def click_source_properties():
    pyautogui.doubleClick(COORDS["source_item"])
    time.sleep(WAIT_UI)

def set_resolution(index):
    add_log(f"正在切换到第 {index + 1} 个分辨率格式...")
    pyautogui.click(COORDS["res_dropdown"])
    time.sleep(0.5)
    pyautogui.press('home')
    time.sleep(0.5)
    for _ in range(index):
        pyautogui.press('down')
    pyautogui.press('enter')
    time.sleep(0.5)

def set_fps(fps_val):
    add_log(f"尝试设置帧率: {fps_val}...")
    pyautogui.click(COORDS["fps_dropdown"])
    time.sleep(0.5)
    pyautogui.press('home')
    
    if fps_val == 60:
        pass  # 假设60在第一行
    elif fps_val == 30:
        for _ in range(3):  # 假设需要按3次down到30
            pyautogui.press('down')
    
    pyautogui.press('enter')
    time.sleep(0.5)

def run_record_cycle(res_idx, fps_val):
    """执行单次录制流程"""
    recording_status["current_resolution"] = res_idx
    recording_status["current_fps"] = fps_val
    recording_status["current_task"] = f"录制 {fps_val}fps - 分辨率 {res_idx + 1}"
    
    click_source_properties()
    set_resolution(res_idx)
    set_fps(fps_val)
    
    pyautogui.click(COORDS["ok_button"])
    time.sleep(WAIT_UI)
    
    # 开始录制
    pyautogui.click(COORDS["record_button"])
    add_log(f"正在录制 {fps_val}fps，等待 {RECORD_DURATION} 秒...")
    time.sleep(RECORD_DURATION)
    
    # 停止录制
    pyautogui.click(COORDS["record_button"])
    rename_video(res_idx, fps_val)

# API 端点
@app.get("/")
async def root():
    return {"message": "OBS Control API is running"}

@app.get("/status")
async def get_status():
    return recording_status

@app.post("/start")
async def start_recording(config: Optional[Dict] = None):
    if recording_status["is_recording"]:
        raise HTTPException(status_code=400, detail="录制已在进行中")
    
    def record_in_background():
        try:
            recording_status["is_recording"] = True
            add_log("开始录制任务...")
            
            total_res = config.get("total_resolutions", 10) if config else 10
            recording_status["total_resolutions"] = total_res
            
            for i in range(total_res):
                recording_status["progress"] = (i * 2) / (total_res * 2) * 100  # 总共2*total_res个任务
                
                # 先测60fps
                run_record_cycle(i, 60)
                recording_status["progress"] = (i * 2 + 1) / (total_res * 2) * 100
                
                # 再测30fps
                run_record_cycle(i, 30)
            
            add_log("任务全部完成！")
            recording_status["progress"] = 100
        except Exception as e:
            add_log(f"录制出错: {str(e)}")
        finally:
            recording_status["is_recording"] = False
            recording_status["current_task"] = ""
    
    # 在后台线程运行录制
    thread = threading.Thread(target=record_in_background)
    thread.daemon = True
    thread.start()
    
    return {"message": "录制任务已开始"}

@app.post("/stop")
async def stop_recording():
    if not recording_status["is_recording"]:
        raise HTTPException(status_code=400, detail="没有正在进行的录制")
    
    recording_status["is_recording"] = False
    add_log("用户停止录制")
    
    return {"message": "录制已停止"}

@app.post("/coords/update")
async def update_coords(coords: Dict[str, List[int]]):
    """更新坐标配置"""
    global COORDS
    try:
        for key, value in coords.items():
            if key in COORDS and len(value) == 2:
                COORDS[key] = tuple(value)
        add_log("坐标配置已更新")
        return {"message": "坐标已更新", "coords": COORDS}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"更新坐标失败: {str(e)}")

@app.get("/coords")
async def get_coords():
    """获取当前坐标配置"""
    return COORDS

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
