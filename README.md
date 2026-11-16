# YOCIM AGENT 官网

YOCIM AGENT 产品官网，纯静态页面，无构建步骤。

- 线上地址：https://agent.yocim.top
- 主项目仓库：https://github.com/YOCIM888/YOCIM-AGENT

## 结构

| 路径 | 说明 |
| --- | --- |
| `index.html` | 首页 |
| `assets/styles.css` | 样式（含深色模式与响应式） |
| `assets/main.js` | 读取 GitHub Releases 最新版本，更新下载链接、版本号与大小 |
| `CNAME` | 自定义域名 `agent.yocim.top` |
| `.github/workflows/deploy.yml` | 推送到 `main` 后自动发布到 GitHub Pages |

## 本地预览

直接双击 `index.html`，或使用任意静态服务器：

```powershell
npx serve .
```

## 部署

推送到 `main` 分支即触发 GitHub Actions 部署到 Pages。首次部署需要在仓库
Settings → Pages 中将 Source 设为 **GitHub Actions**。

## 下载链接

页面默认指向主项目最新 Release 的安装包，运行时通过 GitHub API 获取。
API 不可用时回退到 Releases 页面链接。
