# lhx.AI - 个人 AI 作品集网站

这是一个基于 iOS 风格设计的极简个人作品集网站，采用 Apple 官网般的质感展示 AI 项目。

## ✨ 特性
- **Apple 官网级视觉**：留白、圆角、1:1 响应式栅格布局。
- **iOS 交互体验**：磨砂玻璃质感（Glassmorphism）、细腻的浮入动效。
- **数据驱动**：通过修改 `data/projects.ts` 即可轻松更新项目。
- **纯净代码**：无冗余配置，适合直接作为 GitHub 仓库展示。

## 🛠️ 本地运行与开发
如果你在本地电脑上安装了 Node.js，可以按照以下步骤运行：

1. **安装依赖**：
   ```bash
   npm install
   ```

2. **启动开发服务器**：
   ```bash
   npm run dev
   ```

3. **构建静态生产文件**：
   ```bash
   npm run build
   ```
   构建后的文件将生成在 `dist` 文件夹中。

## 📁 目录结构说明
- `components/`：核心 UI 组件（Hero、卡片、模态框等）。
- `data/`：项目数据存放处，修改此处即可更新作品。
- `types.ts`：数据类型定义。

## 📄 许可证
MIT License
