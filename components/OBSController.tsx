import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecordingStatus {
  is_recording: boolean;
  current_resolution: number;
  current_fps: number;
  total_resolutions: number;
  progress: number;
  current_task: string;
  logs: string[];
}

interface Coords {
  source_item: [number, number];
  res_dropdown: [number, number];
  fps_dropdown: [number, number];
  ok_button: [number, number];
  record_button: [number, number];
}

const OBSController: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<RecordingStatus>({
    is_recording: false,
    current_resolution: 0,
    current_fps: 0,
    total_resolutions: 10,
    progress: 0,
    current_task: '',
    logs: []
  });
  
  const [coords, setCoords] = useState<Coords>({
    source_item: [487, 667],
    res_dropdown: [514, 518],
    fps_dropdown: [290, 589],
    ok_button: [1411, 797],
    record_button: [1345, 723],
  });
  
  const [config, setConfig] = useState({
    total_resolutions: 10,
    record_duration: 5,
  });
  
  const [activeTab, setActiveTab] = useState<'control' | 'coords'>('control');
  const [isApiConnected, setIsApiConnected] = useState(false);

  const API_BASE = 'http://localhost:8000';

  // 检查API连接
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${API_BASE}/`);
        setIsApiConnected(response.ok);
      } catch {
        setIsApiConnected(false);
      }
    };
    
    if (isOpen) {
      checkConnection();
      const interval = setInterval(checkConnection, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // 获取状态
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_BASE}/status`);
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        }
      } catch (error) {
        console.error('获取状态失败:', error);
      }
    };

    if (isOpen && isApiConnected) {
      fetchStatus();
      const interval = setInterval(fetchStatus, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, isApiConnected]);

  // 获取坐标
  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const response = await fetch(`${API_BASE}/coords`);
        if (response.ok) {
          const data = await response.json();
          setCoords(data);
        }
      } catch (error) {
        console.error('获取坐标失败:', error);
      }
    };

    if (isOpen && isApiConnected) {
      fetchCoords();
    }
  }, [isOpen, isApiConnected]);

  const startRecording = async () => {
    try {
      const response = await fetch(`${API_BASE}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('录制开始:', data.message);
      }
    } catch (error) {
      console.error('开始录制失败:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const response = await fetch(`${API_BASE}/stop`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('录制停止:', data.message);
      }
    } catch (error) {
      console.error('停止录制失败:', error);
    }
  };

  const updateCoords = async () => {
    try {
      const response = await fetch(`${API_BASE}/coords/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coords),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('坐标更新:', data.message);
      }
    } catch (error) {
      console.error('更新坐标失败:', error);
    }
  };

  const handleCoordChange = (key: keyof Coords, axis: 0 | 1, value: string) => {
    const numValue = parseInt(value) || 0;
    setCoords(prev => ({
      ...prev,
      [key]: [axis === 0 ? numValue : prev[key][0], axis === 1 ? numValue : prev[key][1]] as [number, number]
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-apple-blue to-apple-purple p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">OBS 录制控制器</h2>
                <p className="text-white/80 text-sm">
                  自动化录制不同分辨率和帧率的视频
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            
            {/* API Status */}
            <div className="mt-4 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isApiConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
              <span className="text-sm">
                {isApiConnected ? 'API 已连接' : 'API 未连接 - 请运行 python obs_api.py'}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('control')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'control'
                  ? 'text-apple-blue border-b-2 border-apple-blue bg-apple-blue/5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              控制面板
            </button>
            <button
              onClick={() => setActiveTab('coords')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'coords'
                  ? 'text-apple-blue border-b-2 border-apple-blue bg-apple-blue/5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              坐标配置
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === 'control' ? (
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4">录制状态</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">状态</p>
                      <p className={`font-medium ${status.is_recording ? 'text-red-600' : 'text-green-600'}`}>
                        {status.is_recording ? '正在录制' : '空闲'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">当前任务</p>
                      <p className="font-medium">{status.current_task || '无'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">当前分辨率</p>
                      <p className="font-medium">格式 {status.current_resolution + 1}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">当前帧率</p>
                      <p className="font-medium">{status.current_fps} fps</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>进度</span>
                      <span>{Math.round(status.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-apple-blue to-apple-purple h-2 rounded-full transition-all duration-300"
                        style={{ width: `${status.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Config */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4">录制配置</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        分辨率格式数量
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={config.total_resolutions}
                        onChange={(e) => setConfig(prev => ({ ...prev, total_resolutions: parseInt(e.target.value) || 1 }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                        disabled={status.is_recording}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        单次录制时长 (秒)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={config.record_duration}
                        onChange={(e) => setConfig(prev => ({ ...prev, record_duration: parseInt(e.target.value) || 5 }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                        disabled={status.is_recording}
                      />
                    </div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={startRecording}
                    disabled={status.is_recording || !isApiConnected}
                    className="flex-1 bg-gradient-to-r from-apple-blue to-apple-purple text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    开始录制
                  </button>
                  <button
                    onClick={stopRecording}
                    disabled={!status.is_recording}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    停止录制
                  </button>
                </div>

                {/* Logs */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4">操作日志</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-48 overflow-y-auto font-mono text-sm">
                    {status.logs.length > 0 ? (
                      status.logs.map((log, index) => (
                        <div key={index} className="mb-1">{log}</div>
                      ))
                    ) : (
                      <div className="text-gray-500">暂无日志</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4">坐标配置</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    调整OBS界面中各个控件的位置坐标。使用 Command+Shift+4 查看屏幕坐标。
                  </p>
                  
                  <div className="space-y-4">
                    {Object.entries(coords).map(([key, [x, y]]) => (
                      <div key={key} className="grid grid-cols-3 gap-4 items-center">
                        <label className="text-sm font-medium text-gray-700">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <input
                          type="number"
                          value={x}
                          onChange={(e) => handleCoordChange(key as keyof Coords, 0, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                          placeholder="X"
                        />
                        <input
                          type="number"
                          value={y}
                          onChange={(e) => handleCoordChange(key as keyof Coords, 1, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                          placeholder="Y"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={updateCoords}
                    disabled={!isApiConnected}
                    className="w-full mt-6 bg-gradient-to-r from-apple-blue to-apple-purple text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    保存坐标配置
                  </button>
                </div>

                {/* Coordinate Preview */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4">坐标预览</h3>
                  <div className="relative bg-white rounded-lg border-2 border-gray-200 h-96 overflow-hidden">
                    {/* 简单的坐标可视化 */}
                    <div className="absolute inset-0 bg-gray-50">
                      <div className="relative w-full h-full">
                        {Object.entries(coords).map(([key, [x, y]]) => (
                          <div
                            key={key}
                            className="absolute w-3 h-3 bg-apple-blue rounded-full transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                              left: `${(x / 1920) * 100}%`, // 假设屏幕宽度1920
                              top: `${(y / 1080) * 100}%`,  // 假设屏幕高度1080
                            }}
                            title={`${key}: (${x}, ${y})`}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-black/75 text-white px-2 py-1 rounded whitespace-nowrap">
                              {key}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    蓝色圆点表示各个控件在屏幕上的相对位置
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OBSController;
