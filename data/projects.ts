
import { Project } from '../types';

export const projects: Project[] = [
  {
    id: '1',
    name: 'Gemini Chat UI',
    tagline: '一个极致简洁的 Gemini 聊天客户端界面，专注于沉浸式对话体验。',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800&h=600',
    promptText: 'Act as a minimalist UI designer and generate a React component for a chat application...',
    githubUrl: 'https://github.com/lhx/gemini-chat-ui',
    geminiShareUrl: 'https://aistudio.google.com/app/prompts/example-1',
    type: 'static'
  },
  {
    id: '2',
    name: 'Smart Document Summarizer',
    tagline: '基于 Gemini 1.5 Pro 的 long 文档智能摘要工具，支持 PDF 直接处理。',
    coverImage: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800&h=600',
    promptText: 'Summarize the following technical document into 3 key bullet points...',
    githubUrl: 'https://github.com/lhx/doc-summarizer',
    geminiShareUrl: 'https://aistudio.google.com/app/prompts/example-2',
    type: 'static'
  },
  {
    id: '3',
    name: 'AI Image Prompt Generator',
    tagline: '将模糊的文字描述转化为高质量的 Midjourney 绘图提示词。',
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800&h=600',
    promptText: 'Expand the user input "cyberpunk cat" into a detailed prompt with lighting, camera and style settings...',
    githubUrl: 'https://github.com/lhx/prompt-gen',
    geminiShareUrl: 'https://aistudio.google.com/app/prompts/example-3',
    type: 'static'
  },
  {
    id: '4',
    name: 'Voice Assistant Companion',
    tagline: '利用 Gemini Live API 构建的实时语音对话助手，支持极低延迟。',
    coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800&h=600',
    promptText: 'You are a friendly companion assistant. Keep responses short and conversational...',
    githubUrl: 'https://github.com/lhx/voice-comp',
    geminiShareUrl: 'https://aistudio.google.com/app/prompts/example-4',
    type: 'static'
  },
  {
    id: '5',
    name: 'Code Review Bot',
    tagline: '自动分析代码库中的性能瓶颈，并提供优化的代码建议。',
    coverImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800&h=600',
    promptText: 'Review this React code for potential memory leaks and performance anti-patterns...',
    githubUrl: 'https://github.com/lhx/code-reviewer',
    geminiShareUrl: 'https://aistudio.google.com/app/prompts/example-5',
    type: 'static'
  },
  {
    id: '6',
    name: '未来实验室 (Coming Soon)',
    tagline: '这里将放置我未来开发的交互式 AI 工具，支持在线直接体验。',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800&h=600',
    promptText: 'Future interactive app prompt...',
    githubUrl: '#',
    geminiShareUrl: '#',
    type: 'interactive'
  }
];
