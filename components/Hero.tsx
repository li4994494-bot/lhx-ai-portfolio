import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[95vh] w-full flex flex-col items-center justify-center overflow-hidden px-6">
      {/* 极简高级背景 */}
      <div className="absolute inset-0 -z-10 bg-[#FBFBFD]">
        <motion.div 
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#E5D5C6]/40 rounded-full blur-[140px]"
        />
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D6E4E5]/30 rounded-full blur-[120px]"
        />
      </div>

      {/* 文案卡片 - 极致留白与圆角 */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="max-w-4xl w-full glass ios-shadow p-10 md:p-20 rounded-[32px] md:rounded-[48px] border border-white/50 z-10 text-left"
      >
        <div className="space-y-10">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-2xl md:text-5xl font-medium leading-[1.45] text-[#1d1d1f] tracking-tight whitespace-pre-wrap"
          >
            Hi there，我是 lhx。很开心能和你分享我用 AI 做的小工具，希望可以帮助到你。
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-xl md:text-3xl font-light text-[#86868b] leading-[1.45] whitespace-pre-wrap"
          >
            Last but not least，希望你有美好的一天。
          </motion.p>
        </div>
      </motion.div>

      {/* 滚动提示 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-[#86868b]"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-medium opacity-60">Discover</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;