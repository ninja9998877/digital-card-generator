# 部署到 Vercel 指南

## 前置准备

1. **确保已安装 Git 和 Node.js**
2. **Vercel 账号**（免费）

## 部署步骤

### 步骤 1：登录 Vercel

在项目目录中运行：
```bash
vercel login
```

会提示你选择登录方式，推荐使用 GitHub 或 Google。

### 步骤 2：部署到 Vercel

运行以下命令：
```bash
cd digital-card-generator
vercel --yes
```

系统会询问：
- `Link to existing project?` → 选择 `No`
- `What's your project's name?` → 输入 `digital-card-generator` 或使用默认
- `In which directory is your code located?` → 使用默认（当前目录）

等待部署完成，Vercel 会提供一个 URL（如：https://digital-card-generator-xxx.vercel.app）

### 步骤 3：部署到生产环境

运行：
```bash
vercel --prod
```

### 步骤 4：获取部署 URL

部署成功后，你会得到一个稳定的 URL，如：
```
https://digital-card-generator.vercel.app
```

在手机浏览器中访问这个 URL 即可测试。

## 更新部署

当你修改代码后，只需运行：
```bash
vercel --prod
```

## 管理部署

- **查看部署日志**：访问 Vercel Dashboard
- **回滚版本**：在 Dashboard 中选择之前的版本
- **自定义域名**：在 Vercel 设置中添加自定义域名

## 故障排查

### 问题：部署失败
- 检查 `package.json` 中的依赖是否正确
- 确保所有文件已提交到 Git

### 问题：访问 404
- 确保 `vercel --prod` 已成功运行
- 检查 Vercel Dashboard 中的部署状态

---

**需要帮助？** 查看 Vercel 官方文档：https://vercel.com/docs
