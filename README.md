# 电子名片生成器 | Digital Card Generator

一个现代化的电子名片生成工具，支持拖拽式设计器、多种模板和自定义样式。

## 功能特性

### 核心功能
- ✅ 拖拽式设计器
- ✅ 50+ 预设模板（商务、创意、极简、个人、艺术）
- ✅ 自定义设计（颜色、字体、布局、背景）
- ✅ 多种元素类型（文本、图片、按钮、图标、分隔符、社交媒体）
- ✅ PNG/PDF/SVG 导出

### 即将推出
- 🔄 自定义域名
- 🔄 二维码生成
- 🔄 A/B 测试
- 🔄 数据分析
- 🔄 用户系统和订阅管理

## 技术栈

- **前端框架**: Next.js 14 + React 18
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **拖拽库**: @dnd-kit
- **导出**: html2canvas, jspdf
- **状态管理**: Zustand

## 快速开始

### 安装依赖

```bash
cd digital-card-generator
npm install
```

### 开发模式

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
digital-card-generator/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx   # 根布局
│   │   ├── page.tsx     # 主页面
│   │   └── globals.css  # 全局样式
│   ├── components/      # 组件
│   │   ├── Common/      # 通用组件
│   │   ├── Editor/      # 编辑器组件
│   │   ├── Elements/    # 元素组件
│   │   ├── Export/      # 导出组件
│   │   ├── Layout/      # 布局组件
│   │   ├── Templates/   # 模板组件
│   │   └── User/        # 用户组件
│   ├── hooks/           # 自定义 Hooks
│   ├── lib/             # 工具函数
│   ├── store/           # 状态管理
│   └── types/           # TypeScript 类型定义
├── public/              # 静态资源
└── ...                  # 配置文件
```

## 使用指南

### 1. 选择模板
- 从左侧模板面板选择一个预设模板
- 支持按分类筛选（商务、创意、极简等）

### 2. 自定义设计
- 使用左侧元素面板添加新元素
- 点击元素进行拖拽移动
- 使用画布样式面板调整背景颜色和图片

### 3. 导出名片
- 选择导出格式（PNG/PDF/SVG）
- 点击导出按钮保存名片

## 开发计划

### Phase 1: 核心功能 (进行中)
- [x] 拖拽式设计器
- [x] 50+ 模板
- [x] 基础元素（文本、图片、按钮等）
- [x] PNG/PDF 导出
- [ ] SVG 导出
- [ ] 元素属性编辑
- [ ] 元素对齐和分布

### Phase 2: 扩展功能
- [ ] 100+ 模板
- [ ] 高级自定义（自定义CSS、动画）
- [ ] 二维码生成
- [ ] 多格式导出（SVG、WebP、AVIF）

### Phase 3: 高级功能
- [ ] 自定义域名
- [ ] 用户系统（注册、登录、资料）
- [ ] 支付系统（Stripe 集成）
- [ ] 数据分析（浏览、点击、转化）
- [ ] A/B 测试

## 许可证

MIT License

## 联系方式

项目地址: [GitHub](https://github.com/yourusername/digital-card-generator)
