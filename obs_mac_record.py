import pyautogui
import time
import os
import glob

'''# ================= 使用脚本前必读 =================
1. 坐标配置：测试时obs全屏！！！！！！！！！！如果为了适应屏幕command+shift+4查看坐标修改一下就行，具体含义写在坐标后面了
2. Mac自动化录制obs视频的脚本，录制时长可以自己定义，可遍历60fps和30fps，如果需要其他帧率可自行修改封装的函数。
3. 录制后会自动重命名，如果是不支持60fps的视频格式录制后30fps会被命名为60fps,25fps会被命名为30fps.
4. 如果不需要重命名的可以自行删除rename_vide的函数逻辑，item对应视频格式的顺序从上到下第一个，第二个，第三个.......
'''


COORDS = {
    "source_item": (487,667), #视频源
    "res_dropdown": (514,518),#修改格式
    "fps_dropdown": (290,589),#帧率选择
    "ok_button": (1411, 797),#确认按钮
    "record_button": (1345, 723),  # 开始/停止录制
}

# 2. 路径配置 (请填写你 OBS 设置的视频保存路径)
VIDEO_PATH = "/Users/yunxi/Movies"

# 3. 设置
TOTAL_RESOLUTIONS = 10#要测的格式分辨率个数
RECORD_DURATION = 5#录制时间，单位s
WAIT_UI = 2.0  # Mac 动画较慢，建议延迟稍大

# ===========================================

pyautogui.PAUSE = 1.0


def get_latest_file(path):
    """获取文件夹中最新生成的视频文件，支持更多格式"""
    valid_extensions = ('.mp4', '.mkv', '.mov', '.ts', '.flv')
    files = [os.path.join(path, f) for f in os.listdir(path) if f.lower().endswith(valid_extensions)]
    if not files:
        return None
    # 按创建时间排序获取最新文件
    return max(files, key=os.path.getctime)


def rename_video(res_index, fps_val):
    """带重试机制的重命名，确保 OBS 已释放文件"""
    print("等待 OBS 释放文件...")

    # 循环尝试多次，防止 OBS 还没写完文件
    max_retries = 10
    for i in range(max_retries):
        time.sleep(3)  # 每次等3秒
        old_file = get_latest_file(VIDEO_PATH)

        if not old_file:
            print(f"警告：在 {VIDEO_PATH} 中没找到任何视频文件")
            continue

        # 检查文件大小是否还在增长（如果还在增长，说明 OBS 还没写完）
        size_before = os.path.getsize(old_file)
        time.sleep(1)
        size_after = os.path.getsize(old_file)

        if size_before == size_after and size_after > 0:
            # 文件大小不再变化，可以重命名
            ext = os.path.splitext(old_file)[1]
            # 加入时间戳防止重名覆盖
            timestamp = time.strftime("%H%M%S")
            new_filename = f"Item_{res_index + 1}_{fps_val}fps_{timestamp}{ext}"
            new_path = os.path.join(VIDEO_PATH, new_filename)

            try:
                os.rename(old_file, new_path)
                print(f"✅ 成功重命名为: {new_filename}")
                return  # 成功后退出函数
            except Exception as e:
                print(f"重命名失败 (第{i + 1}次尝试): {e}")
        else:
            print("文件正忙，等待中...")

    print("错误：达到最大重试次数，重命名失败。")


def click_source_properties():
    pyautogui.doubleClick(COORDS["source_item"])
    time.sleep(WAIT_UI)


def set_resolution(index):
    print(f"正在切换到第 {index + 1} 个分辨率格式...")
    pyautogui.click(COORDS["res_dropdown"])
    time.sleep(0.5)
    pyautogui.press('home')
    time.sleep(0.5)
    for _ in range(index):
        pyautogui.press('down')
    pyautogui.press('enter')
    time.sleep(0.5)


def set_fps(fps_val):
    """
    修改后的帧率逻辑：
    假设列表顺序：[60, 59.94, 50, 30, 25, ...]
    """
    print(f"尝试设置帧率: {fps_val}...")
    pyautogui.click(COORDS["fps_dropdown"])
    time.sleep(0.5)
    pyautogui.press('home')

    if fps_val == 60:
        # 假设 60 在第一行
        pyautogui.press('down')
        pass
    elif fps_val == 30:
        # 根据你的 OBS 列表，按几次 down 能到 30？这里假设是 3 次
        # 你需要根据实际情况修改这个循环次数
        for _ in range(3):
            pyautogui.press('down')

    pyautogui.press('enter')
    time.sleep(0.5)


def run_record_cycle(res_idx, fps_val):
    """执行单次录制流程"""
    click_source_properties()
    set_resolution(res_idx)
    set_fps(fps_val)

    pyautogui.click(COORDS["ok_button"])
    time.sleep(WAIT_UI)

    # 开始录制
    pyautogui.click(COORDS["record_button"])
    print(f"正在录制 {fps_val}fps，等待 {RECORD_DURATION} 秒...")
    time.sleep(RECORD_DURATION)

    # 停止录制
    pyautogui.click(COORDS["record_button"])
    rename_video(res_idx, fps_val)


def main():
    print("请在 5 秒内切换到 OBS 窗口...")
    time.sleep(5)

    for i in range(TOTAL_RESOLUTIONS):
        # 流程：先测 60，再测 30
        run_record_cycle(i, 60)
        run_record_cycle(i, 30)

    print("任务全部完成！")


if __name__ == "__main__":
    main()