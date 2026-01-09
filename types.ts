export interface Project {
  id: string;
  name: string;
  tagline: string;
  coverImage: string;
  promptText: string;
  githubUrl: string;
  geminiShareUrl: string;
  demoUrl?: string;
  type: 'static' | 'interactive';
}

export type ToastType = 'success' | 'info';
export type ViewMode = 'home' | 'prompt-generator';