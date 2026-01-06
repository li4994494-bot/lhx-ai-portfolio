import React, { useState, useCallback, useEffect } from 'react';
import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';
import Toast from './components/Toast';
import Modal from './components/Modal';
import { projects as initialProjects } from './data/projects';
import { Project } from './types';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [items, setItems] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 模拟异步数据加载，营造 iOS 原生应用的启动感
  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(initialProjects);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (text === '#' || !text) {
        showToast('内容正在准备中...');
        return;
      }
      await navigator.clipboard.writeText(text);
      showToast('已复制到剪贴板');
    } catch (err) {
      showToast('复制失败，请重试');
    }
  }, []);

  const handleProjectAction = (project: Project) => {
    // 处理交互型项目（如在线 Demo）
    if (project.type === 'interactive') {
      if (project.demoUrl && project.demoUrl !== '#') {
        window.open(project.demoUrl, '_blank');
      } else {
        showToast('交互功能正在全力开发中');
      }
      return;
    }
    
    // 处理静态项目（展示分享链接）
    if (project.geminiShareUrl === '#' || !project.geminiShareUrl) {
      showToast('该项目暂未开放分享');
      return;
    }
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#FBFBFD] selection:bg-[#0071e3]/10 selection:text-[#0071e3]">
      {/* iOS 风格半透明导航栏 */}
      <nav className="fixed top-0 left-0 w-full glass z-40 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl ios-shadow overflow-hidden bg-white border border-white/50 p-0.5">
              <img 
                src="https://i.postimg.cc/c1Kt6vWX/BE89C50B-8C90-4F77-9240-A3A08DC69C1C.png" 
                alt="lhx Logo" 
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <span className="font-semibold text-lg tracking-tight text-[#1d1d1f]">lhx.AI</span>
          </motion.div>
          
          <div className="hidden sm:flex gap-8 items-center">
             <a href="#projects" className="text-sm text-[#86868b] hover:text-[#1d1d1f] transition-colors font-medium">我的作品</a>
             <div className="w-px h-4 bg-black/10"></div>
             <div className="text-[10px] font-bold text-[#0071e3] bg-[#0071e3]/5 px-2.5 py-1 rounded-full uppercase tracking-widest border border-[#0071e3]/10">
               V2.0 PRO
             </div>
          </div>
        </div>
      </nav>

      <Hero />

      {/* 作品网格展示区 */}
      <section id="projects" className="max-w-7xl mx-auto px-6 py-32">
        <div className="mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-6"
          >
            AI 项目集锦
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#86868b] text-xl font-light max-w-3xl leading-relaxed"
          >
            追求卓越的 AI 交互体验。
          </motion.p>
        </div>

        {/* 布局：每行 2 列 (md:grid-cols-2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[580px] rounded-[48px] bg-white/50 border border-black/5 animate-pulse" />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {items.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                >
                  <ProjectCard 
                    project={project}
                    onCopyPrompt={copyToClipboard}
                    onCopyGithub={copyToClipboard}
                    onOpenGemini={handleProjectAction}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* 极简页脚 */}
      <footer className="py-32 border-t border-black/5 bg-white/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
             <div className="text-2xl font-bold mb-3 tracking-tighter">lhx.AI</div>
             <p className="text-[#86868b] text-sm font-light">追求简洁，定义未来。用 AI 创造价值。</p>
          </div>
          <div className="flex gap-10 text-sm font-medium text-[#86868b]">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#0071e3] transition-colors">GitHub</a>
            <a href="#" className="hover:text-[#0071e3] transition-colors">Twitter</a>
            <a href="mailto:contact@lhx.ai" className="hover:text-[#0071e3] transition-colors">Contact</a>
          </div>
        </div>
        <div className="text-center mt-20 text-[10px] text-[#86868b]/40 uppercase tracking-[0.3em]">
          Design by lhx &bull; Built with Gemini 2.5
        </div>
      </footer>

      <Toast 
        message={toastMessage} 
        isVisible={isToastVisible} 
        onClose={() => setIsToastVisible(false)} 
      />
      
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="项目分享链接"
        content={selectedProject?.geminiShareUrl || ''}
        onCopy={() => {
          if (selectedProject) copyToClipboard(selectedProject.geminiShareUrl);
        }}
      />
    </div>
  );
};

export default App;