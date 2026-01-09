import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'prompt-generator',
    name: 'Gemini Prompt 生成器',
    tagline: 'Senior AI 提效工具。上传产品录屏或截图，由 Gemini 自动识别核心逻辑、过滤干扰噪音并生成专业的系统提示词。',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=600',
    promptText: 'You are an expert AI Prompt Engineer specialized in UI-to-Code generation...',
    githubUrl: 'https://github.com/lhx/gemini-prompt-gen',
    geminiShareUrl: 'https://aistudio.google.com/app/prompts/example-1',
    type: 'interactive'
  },
  {
    id: '2',
    name: 'DocuGenius AI',
    tagline: '深度洞察。基于 Gemini 1.5 Pro 的长文档智能摘要工具，瞬间提取复杂 PDF 的核心逻辑。',
    coverImage: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=800&h=600',
    promptText: 'Summarize the following technical document into 3 key bullet points...',
    githubUrl: 'https://github.com/lhx/doc-summarizer',
    geminiShareUrl: 'https://aistudio.google.com/app/prompts/example-2',
    type: 'static'
  },
  {
    id: '3',
    name: 'Visionary Prompts',
    tagline: '创意增幅器。将模糊的念头转化为极具张力的绘图指令，让 AI 更好地理解你的想象。',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800&h=600',
    promptText: 'Expand the user input "cyberpunk cat" into a detailed prompt with lighting...',
    githubUrl: 'https://github.com/lhx/prompt-gen',
    geminiShareUrl: 'https://aistudio.google.com/app/prompts/example-3',
    type: 'static'
  },
  {
    id: '4',
    name: 'EchoFlow Voice',
    tagline: '实时共鸣。利用 Gemini Live API 打造的低延迟语音助手，探索最自然的交互边界。',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800&h=600',
    promptText: 'You are a friendly companion assistant. Keep responses short and conversational...',
    githubUrl: 'https://github.com/lhx/voice-comp',
    geminiShareUrl: 'https://aistudio.google.com/app/prompts/example-4',
    type: 'static'
  },
  {
    id: '5',
    name: 'CodeCraft Bot',
    tagline: '性能先锋。自动识别代码中的技术债与性能瓶颈，为你提供优雅的重构建议。',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=600',
    promptText: 'Review this React code for potential memory leaks and performance anti-patterns...',
    githubUrl: 'https://github.com/lhx/code-reviewer',
    geminiShareUrl: 'https://aistudio.google.com/app/prompts/example-5',
    type: 'static'
  },
  {
    id: '6',
    name: '未来实验室',
    tagline: '未定义即无限。这里将承载更多前沿的 AI 交互实验，敬请期待。',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=600',
    promptText: 'Future interactive app prompt...',
    githubUrl: '#',
    geminiShareUrl: '#',
    type: 'interactive'
  }
];