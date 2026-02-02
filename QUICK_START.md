# 快速开始指南

Boss，回到电脑后，请按以下步骤快速部署：

## 一键部署（推荐）

### 方式 1：使用 Vercel CLI

```bash
cd digital-card-generator
vercel login
vercel --yes
vercel --prod
```

完成！你会得到一个 URL，用手机浏览器访问即可。

### 方式 2：使用 Vercel 网页界面

1. 访问：https://vercel.com/new
2. 导入 Git 仓库（需要先 push 到 GitHub）
3. 点击 "Deploy"

## 测试你的应用

1. **复制部署 URL**
2. **在手机浏览器中打开**
3. **测试功能**：
   - 选择模板
   - 添加元素
   - 拖拽移动
   - 修改样式
   - 导出功能（即将上线）

## 常见问题

**Q: 忘记 URL 怎么办？**
A: 运行 `vercel ls` 查看所有项目

**Q: 如何更新部署？**
A: 修改代码后运行 `vercel --prod`

**Q: 手机无法访问？**
A: 检查 Vercel Dashboard 中的部署状态，确保是 "Ready"

---

**部署成功后，告诉我 URL，我帮你测试！**
