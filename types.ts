
export interface Project {
  id: string;
  name: string;
  tagline: string;
  coverImage: string;
  promptText: string;
  githubUrl: string;
  geminiShareUrl: string;
  demoUrl?: string; // 新增：在线体验链接
  type: 'static' | 'interactive';
}

export type ToastType = 'success' | 'info';
