// 从 GitHub Releases 读取最新版本，更新下载链接、版本号与文件大小。
// 拉取失败或不支持 localStorage 时，页面保持 HTML 中的兜底链接。
(() => {
  const REPO = 'YOCIM888/YOCIM-AGENT';
  const API = `https://api.github.com/repos/${REPO}/releases/latest`;
  const CACHE_KEY = 'yocim-agent-latest-release-v2';
  const CACHE_TTL = 6 * 60 * 60 * 1000;

  const formatSize = (bytes) => `${Math.round(bytes / 1024 / 1024)} MB`;

  const apply = (value) => {
    if (value.url) {
      document.querySelectorAll('.js-download').forEach((el) => {
        el.href = value.url;
      });
    }
    if (value.tag) {
      document.querySelectorAll('[data-version]').forEach((el) => {
        el.textContent = value.tag;
      });
    }
    if (value.size > 0) {
      document.querySelectorAll('[data-size]').forEach((el) => {
        el.textContent = `约 ${formatSize(value.size)}`;
      });
    }
    if (value.links) {
      Object.entries(value.links).forEach(([key, url]) => {
        document.querySelectorAll(`[data-asset="${key}"]`).forEach((el) => {
          el.href = url;
        });
      });
    }
  };

  const readCache = () => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const cached = JSON.parse(raw);
      return Date.now() - cached.time < CACHE_TTL ? cached.value : null;
    } catch {
      return null;
    }
  };

  const writeCache = (value) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), value }));
    } catch {
      /* 隐私模式下写入失败可忽略 */
    }
  };

  const cached = readCache();
  if (cached) apply(cached);

  fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
    .then((release) => {
      const assets = Array.isArray(release.assets) ? release.assets : [];
      const pick = (pattern) => assets.find((asset) => pattern.test(asset.name));

      const installer = pick(/-setup\.exe$/i);
      const links = {
        'mac-arm64': pick(/(^|[^a-z0-9])arm64\.dmg$/i)?.browser_download_url,
        'mac-x64': pick(/(^|[^a-z0-9])x64\.dmg$/i)?.browser_download_url,
        'linux-x64': pick(/\.appimage$/i)?.browser_download_url,
      };

      const value = {
        tag: release.tag_name || '',
        url: installer ? installer.browser_download_url : release.html_url,
        size: installer ? installer.size : 0,
        links: Object.fromEntries(Object.entries(links).filter(([, url]) => Boolean(url))),
      };
      apply(value);
      writeCache(value);
    })
    .catch(() => {
      /* 网络或限流失败时保留兜底链接 */
    });
})();
