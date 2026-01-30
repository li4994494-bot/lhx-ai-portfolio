import obswebsocket

def test_connection():
    try:
        ws = obswebsocket.obsws("127.0.0.1", 4455, "obs123456")
        ws.connect()
        print("✅ OBS WebSocket 连接成功！")
        ws.disconnect()
    except Exception as e:
        print(f"❌ 连接失败: {e}")

if __name__ == "__main__":
    test_connection()
