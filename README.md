# YOCIM AGENT 官网

YOCIM AGENT 产品官网，纯静态页面，无构建步骤。

- 线上地址：https://agent.yocim.top
- 英文版：https://agent.yocim.top/en/
- 主项目仓库：https://github.com/YOCIM888/YOCIM-AGENT

## 结构

| 路径 | 说明 |
| --- | --- |
| `index.html` | 中文首页（功能、YOCIM vs Cursor / Cline 对比、下载与安装方式） |
| `en/index.html` | 英文首页 |
| `install.html` / `en/install.html` | winget / Homebrew Cask / Scoop 与直接下载说明；清单文件在主仓库 `packaging/` |
| `changelog.html` / `en/changelog.html` | 更新日志，运行时同步 GitHub Releases，网络失败时保留静态兜底 |
| `faq.html` / `en/faq.html` | 常见问题（SmartScreen、API Key、离线、与 Cursor 的关系等） |
| `privacy.html` / `en/privacy.html` | 隐私政策 |
| `assets/styles.css` | 样式（含深色模式与响应式） |
| `assets/main.js` | 读取 GitHub Releases 更新下载链接/版本/大小；安装命令复制 |
| `assets/changelog.js` | 读取 GitHub Releases 渲染更新日志 |
| `sitemap.xml` / `robots.txt` | 站点地图（含中英文 hreflang）与抓取引导 |
| `CNAME` | 自定义域名 `agent.yocim.top` |
| `.github/workflows/deploy.yml` | 推送到 `main` 后自动发布到 GitHub Pages |

每页都带 canonical、hreflang、Open Graph、Twitter Card 与 JSON-LD；页脚统一包含隐私政策、安装方式、更新日志、常见问题、GitHub Issues 和联系邮箱 `yocim666@outlook.com`。

## 本地预览

因为中英文链接使用站点根路径，请从仓库根目录启动静态服务器：

```powershell
npx serve .
```

然后访问 `http://localhost:3000/` 与 `http://localhost:3000/en/`。

## 部署

推送到 `main` 分支即触发 GitHub Actions 部署到 Pages。首次部署需要在仓库
Settings → Pages 中将 Source 设为 **GitHub Actions**。

## 下载链接与清单

页面默认指向主项目最新 Release 的安装包，运行时通过 GitHub API 获取；
API 不可用时回退到 Releases 页面链接。包管理器清单随主仓库 `packaging/` 目录发布，
第三方官方源（winget-pkgs / homebrew-cask / scoop bucket）收录仍需各自提交审核。
