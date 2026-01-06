
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 如果你的 GitHub 仓库名不是 <username>.github.io，
// 而是 <username>.github.io/my-portfolio/，请将 base 修改为 '/my-portfolio/'
export default defineConfig({
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
  },
  server: {
    port: 3000,
  }
});
