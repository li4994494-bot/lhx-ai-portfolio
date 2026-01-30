import obswebsocket
import time

class OBSController:
    def __init__(self, password="obs123456"):
        self.ws = obswebsocket.obsws("127.0.0.1", 4455, password)
        self.connected = False
    
    def connect(self):
        try:
            self.ws.connect()
            self.connected = True
            print("✅ 已连接到 OBS")
            return True
        except Exception as e:
            print(f"❌ 连接失败: {e}")
            return False
    
    def start_recording(self):
        if not self.connected:
            print("❌ 未连接到 OBS")
            return False
        
        try:
            self.ws.call(obswebsocket.requests.StartRecording())
            print("🔴 开始录制")
            return True
        except Exception as e:
            print(f"❌ 开始录制失败: {e}")
            return False
    
    def stop_recording(self):
        if not self.connected:
            print("❌ 未连接到 OBS")
            return False
        
        try:
            self.ws.call(obswebsocket.requests.StopRecording())
            print("⏹️ 停止录制")
            return True
        except Exception as e:
            print(f"❌ 停止录制失败: {e}")
            return False
    
    def disconnect(self):
        if self.connected:
            self.ws.disconnect()
            self.connected = False
            print("🔌 已断开连接")

def test_recording():
    controller = OBSController()
    
    if not controller.connect():
        return
    
    print("测试录制功能...")
    print("3秒后开始录制")
    time.sleep(3)
    
    controller.start_recording()
    
    print("录制5秒...")
    time.sleep(5)
    
    controller.stop_recording()
    controller.disconnect()
    print("测试完成！")

if __name__ == "__main__":
    test_recording()
