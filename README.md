# 欧视界官网 · ote-site

同一份构建同时发布两个域名：`ote.asia`（总站）与 `spektra.ote.asia`（欧胶片 OltraFilm）。
前端按 hostname 在 `src/main.tsx` 里决定渲染 `App` 还是 `OltraFlimPage`。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:3000/oltraflim/ 看欧胶片页
```

## 发布

```bash
npm run deploy          # 构建 + 推到 Cloudflare
npm run watch:deploy    # 常驻：保存文件后约 1 秒自动构建并发布
```

站点由 Cloudflare Workers Static Assets 托管，配置见 `wrangler.toml`。
`worker.js` 只处理 `/dl/*`，把 GitHub Release 包从站内转发，并限制在白名单内的文件名。

## 下载清单

版本号、体积、SHA-256、下载线路以及各平台的文案，全部集中在 `src/oltraflimRelease.ts`。
换版本或加平台，只改这一个文件。
