# Background Remover

一个基于 Next.js 和 Remove.bg API 的图片背景移除工具。

## 功能

- 上传图片
- 自动移除背景
- 下载透明背景 PNG

## 部署到 Cloudflare Pages

1. 获取 Remove.bg API Key: https://www.remove.bg/api

2. 安装依赖:
```bash
npm install
```

3. 本地开发:
```bash
npm run dev
```

4. 部署到 Cloudflare Pages:
   - 连接 GitHub 仓库
   - 构建命令: `npm run build`
   - 输出目录: `.next`
   - 环境变量: `REMOVEBG_API_KEY`

## 环境变量

在 `.env.local` 或 Cloudflare Pages 设置:
```
REMOVEBG_API_KEY=your_api_key_here
```
