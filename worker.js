/* ============================================================
   OTE 总官网 · Cloudflare Worker
   ------------------------------------------------------------
   静态页面由 Workers Static Assets 直接发（env.ASSETS）；
   这个文件只负责 /dl/<文件名>：把 OltraFlim 的 GitHub Release 包
   从 ote.asia 同源流式转发，给国内网络兜底。

   只放行白名单里的发布文件，避免成为开放代理：
     OltraFlim-<版本>.dmg / .zip（macOS 正式版）
     SpektraOltra-Setup-<版本>.exe（Windows 测试版）
     Spektrafilm-<版本>-ios.ipa（iOS 内测版）
   ============================================================ */

const DL_PREFIX = '/dl/';
const GITHUB_RELEASES = 'https://github.com/Ote65/OltraFlim/releases/download';
const WIN_GITHUB_RELEASES = 'https://github.com/Ote65/spektraFilmOltra/releases/download';
const FILE_RE = /^OltraFlim-(\d+(?:\.\d+){1,2})\.(dmg|zip)$/;
/* Windows 测试版：SpektraOltra-Setup-0.1.0.exe → v0.1.0-win */
const WIN_FILE_RE = /^SpektraOltra-Setup-(\d+(?:\.\d+){1,2})\.exe$/;
/* iOS 内测版：Spektrafilm-0.4.0-ios.ipa → v0.4.0-ios */
const IOS_FILE_RE = /^Spektrafilm-(\d+(?:\.\d+){1,2})-ios\.ipa$/;

/** 只放行单层文件名，挡掉 ../ 之类的路径穿越 */
function safeKey(pathname) {
  const raw = decodeURIComponent(pathname.slice(DL_PREFIX.length));
  if (!raw || raw.includes('/') || raw.includes('..') || raw.startsWith('.')) return null;
  return raw;
}

/** OltraFlim-1.3.dmg → v1.3/OltraFlim-1.3.dmg */
function upstreamFor(key) {
  const match = FILE_RE.exec(key);
  if (match) return `${GITHUB_RELEASES}/v${match[1]}/${key}`;

  const win = WIN_FILE_RE.exec(key);
  if (win) return `${WIN_GITHUB_RELEASES}/v${win[1]}-win/${key}`;

  const ios = IOS_FILE_RE.exec(key);
  if (ios) return `${WIN_GITHUB_RELEASES}/v${ios[1]}-ios/${key}`;

  return null;
}

function relay(upstream, key, isHead) {
  const h = new Headers();
  for (const name of [
    'content-type',
    'content-length',
    'content-range',
    'etag',
    'last-modified',
  ]) {
    const value = upstream.headers.get(name);
    if (value) h.set(name, value);
  }
  if (!h.has('content-type')) h.set('content-type', 'application/octet-stream');
  h.set('accept-ranges', 'bytes');
  h.set('content-disposition', `attachment; filename="${key}"`);
  h.set('cache-control', 'public, max-age=3600');
  return new Response(isHead ? null : upstream.body, {
    status: upstream.status === 206 ? 206 : 200,
    headers: h,
  });
}

async function download(request, key) {
  const target = upstreamFor(key);
  if (!target) return new Response('file not found', { status: 404 });

  const isHead = request.method === 'HEAD';
  const range = request.headers.get('range');
  const upstream = await fetch(target, {
    method: 'GET',
    headers: range ? { range } : undefined,
    redirect: 'follow',
  });

  if (isHead && upstream.body) await upstream.body.cancel().catch(() => {});
  if (upstream.status === 404) return new Response('file not found', { status: 404 });
  if (!upstream.ok && upstream.status !== 206) {
    return new Response(`upstream returned ${upstream.status}`, { status: 502 });
  }
  return relay(upstream, key, isHead);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith(DL_PREFIX)) {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response('method not allowed', {
          status: 405,
          headers: { allow: 'GET, HEAD' },
        });
      }
      const key = safeKey(url.pathname);
      if (!key) return new Response('bad request', { status: 400 });
      return download(request, key);
    }

    return env.ASSETS.fetch(request);
  },
};
