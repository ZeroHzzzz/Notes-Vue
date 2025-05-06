# Notes - 在线笔记系统

~~一个很水的web前端课设~~

一个功能丰富、界面优雅的在线笔记系统，专注于提供流畅的笔记编写和管理体验。本项目采用 Vue 3 + TypeScript 技术栈，实现了一个完整的在线笔记应用。

## ✨ 功能特点

### 📝 笔记管理
- 支持创建、编辑、删除和组织笔记
- 笔记分类管理，支持自定义分类
- 拖拽排序和删除功能
- 笔记预览和全屏编辑模式

### 🎨 绘图功能
- 内置绘图工具，支持自由绘制
- 多种绘图工具：画笔、直线、矩形、圆形
- 支持文本添加和橡皮擦功能
- 颜色选择器和线条粗细调节

### 🌈 主题定制
- 支持浅色/深色主题切换
- 自定义主题色系统
- 现代化 UI 设计，视觉体验优秀

### 📊 数据统计
- 笔记数量统计和分类统计
- 使用时长和活跃度分析
- 成就系统，激励持续使用

### 🔍 搜索与过滤
- 实时搜索笔记内容
- 按分类筛选笔记
- 支持标题和内容搜索

### 📱 响应式设计
- 完美适配桌面和移动设备（也许？）
- 优化的触摸屏交互体验
- 自适应布局系统

## 🛠️ 技术栈

- **前端框架**：Vue 3 + Composition API
- **类型支持**：TypeScript
- **构建工具**：Vite
- **路由管理**：Vue Router
- **状态管理**：Vue 3 Reactivity API
- **样式方案**：CSS 变量 + 主题定制
- **组件设计**：自定义组件库

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 7+

### 安装和运行

```bash
# 克隆项目
git clone https://github.com/zerohzzzz/notes.git

# 进入项目目录
cd notes

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📁 项目结构

```
src/                  # 源代码目录
├── apis/            # API 接口相关
│   ├── auth.ts       # 认证相关接口
│   ├── notes.ts      # 笔记相关接口
│   └── user.ts       # 用户相关接口
├── assets/          # 静态资源
│   ├── images/       # 图片资源
│   ├── styles/       # 样式资源
│   └── icons/        # 图标资源
├── components/      # 公共组件
│   ├── DrawingCanvas.vue  # 绘图组件
│   ├── NavBar.vue         # 导航栏组件
│   ├── NoteCard.vue       # 笔记卡片组件
│   ├── NoteEditor.vue     # 笔记编辑器组件
│   └── ThemeSwitch.vue    # 主题切换组件
├── pages/          # 页面组件
│   ├── Home/       # 首页
│   │   └── index.vue
│   ├── Notes/      # 笔记列表页
│   │   └── index.vue
│   ├── Note/       # 笔记详情页
│   │   └── index.vue
│   ├── Profile/    # 个人中心
│   │   └── index.vue
│   ├── Login/      # 登录页面
│   │   └── index.vue
│   ├── Register/   # 注册页面
│   │   └── index.vue
│   └── Settings/   # 设置页面
│       └── index.vue
├── router/         # 路由配置
│   └── index.ts    # 路由定义
├── stores/         # 状态管理
│   ├── auth.ts     # 认证状态
│   ├── notes.ts    # 笔记状态
│   └── theme.ts    # 主题状态
├── types/          # 类型定义
│   ├── note.ts     # 笔记相关类型
│   └── user.ts     # 用户相关类型
├── utils/          # 工具函数
│   ├── request.ts  # 请求封装
│   └── storage.ts  # 存储工具
├── App.vue         # 根组件
└── main.ts         # 入口文件
```

## 📝 开发规范

- 使用 TypeScript 编写类型安全的代码
- 遵循 Vue 3 组合式 API 最佳实践
- 组件和函数采用统一的命名规范
- 保持代码整洁和可维护性

## 🤝 贡献

**不**欢迎提交 Issue 和 Pull Request 来帮助改进项目。

