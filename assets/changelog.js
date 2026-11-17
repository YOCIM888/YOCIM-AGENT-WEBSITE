// Changelog：从 GitHub Releases 同步版本列表；失败时保留 HTML 中的静态兜底内容。
// 仅用 DOM API 写入远端文本，避免把发布说明当作 HTML 解析。
(() => {
  const REPO = 'YOCIM888/YOCIM-AGENT';
  const API = `https://api.github.com/repos/${REPO}/releases?per_page=20`;
  const CACHE_KEY = 'yocim-agent-releases-v1';
  const CACHE_TTL = 6 * 60 * 60 * 1000;
  const lang = document.documentElement.lang === 'en' ? 'en-US' : 'zh-CN';
  const label = lang === 'en' ? 'Full release notes ↗' : '查看完整发布说明 ↗';
  const fallbackNote = lang === 'en' ? 'No description in this release.' : '该版本暂无说明。';
  const fallbackTime = lang === 'en' ? 'Published' : '发布于';
  const list = document.getElementById('release-list');
  if (!list) return;

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(lang, { dateStyle: 'medium' }).format(date);
  };

  const createRelease = (release) => {
    const item = document.createElement('article');
    item.className = 'release';

    const head = document.createElement('div');
    head.className = 'release-head';

    const title = document.createElement('h2');
    const link = document.createElement('a');
    link.href = release.html_url || '#';
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = release.name || release.tag_name || 'Release';
    title.appendChild(link);

    const time = document.createElement('time');
    const published = release.published_at || '';
    time.dateTime = published;
    time.textContent = `${fallbackTime} ${formatDate(published)}`.trim();

    head.append(title, time);

    const body = document.createElement('p');
    body.className = 'release-body';
    body.textContent = (release.body || '').trim().slice(0, 800) || fallbackNote;

    const more = document.createElement('p');
    const moreLink = document.createElement('a');
    moreLink.href = release.html_url || '#';
    moreLink.target = '_blank';
    moreLink.rel = 'noopener';
    moreLink.textContent = label;
    more.appendChild(moreLink);

    item.append(head, body, more);
    return item;
  };

  const render = (releases) => {
    if (!Array.isArray(releases) || releases.length === 0) return;
    const fragment = document.createDocumentFragment();
    releases.forEach((release) => fragment.appendChild(createRelease(release)));
    list.replaceChildren(fragment);
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
      /* 隐私模式下忽略 */
    }
  };

  const cached = readCache();
  if (cached) render(cached);

  fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
    .then((releases) => {
      render(releases);
      writeCache(releases.map(({ name, tag_name, body, html_url, published_at }) => ({
        name,
        tag_name,
        body,
        html_url,
        published_at,
      })));
    })
    .catch(() => {
      /* 网络或限流失败时使用 HTML 兜底 */
    });
})();
