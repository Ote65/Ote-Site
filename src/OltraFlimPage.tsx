import React, { useEffect, useMemo, useState } from 'react';
import {
  FLIM_FAQS,
  FLIM_FEATURES,
  FLIM_FLOW,
  OLTRAFLIM_RELEASE,
  type FlimDownloadFormat,
  type FlimPlatform,
} from './oltraflimRelease';
import './oltraflim.css';

const R = OLTRAFLIM_RELEASE;

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function applySeo() {
  document.title = '欧胶片 OltraFlim — 原生 macOS 胶片模拟暗房';
  const desc =
    '欧胶片 OltraFlim 是欧视界旗下的原生 macOS 胶片模拟暗房：113 种 ACES 胶片外观、光线/色彩/曲线、颗粒与光晕，像访达一样的照片库，全本地离线运行。';
  setMeta('name', 'description', desc);
  setMeta('property', 'og:title', '欧胶片 OltraFlim — 原生 macOS 胶片模拟暗房');
  setMeta('property', 'og:description', desc);
  setMeta('property', 'og:url', 'https://oltraflim.ote.asia/');
  setMeta('property', 'og:image', 'https://oltraflim.ote.asia/media/og-oltraflim.jpg');
  setMeta('name', 'twitter:title', '欧胶片 OltraFlim — 原生 macOS 胶片模拟暗房');
  setMeta('name', 'twitter:description', desc);
  setMeta('name', 'twitter:image', 'https://oltraflim.ote.asia/media/og-oltraflim.jpg');

  let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = 'https://oltraflim.ote.asia/';
}

function useReveal() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const hero = document.querySelectorAll('.of-hero .reveal');
    hero.forEach((el, i) => window.setTimeout(() => el.classList.add('in'), 80 + i * 60));

    if (!('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const FilmMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    <path d="M8 3.5v17M16 3.5v17" />
    <path d="M3.5 8h4.5M3.5 12h4.5M3.5 16h4.5M16 8h4.5M16 12h4.5M16 16h4.5" />
  </svg>
);

export default function OltraFlimPage() {
  const [platform, setPlatform] = useState<FlimPlatform>('mac');
  const [format, setFormat] = useState<FlimDownloadFormat>('dmg');
  const [copied, setCopied] = useState(false);

  const isWin = platform === 'win';
  const active = isWin ? R.windows : R;
  const current =
    platform === 'win' ? R.windows.downloads.exe : R.downloads[format === 'dmg' ? 'dmg' : 'zip'];

  useReveal();

  useEffect(() => {
    applySeo();
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const jsonLd = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: '欧胶片 OltraFlim',
        alternateName: 'OltraFlim',
        applicationCategory: 'PhotographyApplication',
        operatingSystem: 'macOS 14.0+ / Windows 10 · 11',
        softwareVersion: R.version,
        description:
          '原生 macOS 胶片模拟暗房：113 种 ACES 胶片外观、照片库与文件夹、光线/色彩/曲线、颗粒与光晕、全本地离线。',
        downloadUrl: current.github,
        url: 'https://oltraflim.ote.asia/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
        license: `${R.repo}/blob/main/LICENSE`,
      }),
    [current.github]
  );

  const copyHash = async () => {
    try {
      await navigator.clipboard.writeText(current.sha256);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="of-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <nav className="topbar of-topbar">
        <a className="brand" href="https://ote.asia/">
          <img className="brand-logo" src="/media/ote-logo.png" alt="欧视界" />
          <span className="brand-text">
            <b>欧视界</b>
            <i> / 欧胶片</i>
          </span>
        </a>
        <div className="nav">
          <a href="https://ote.asia/#products">产品</a>
          <a href="https://oltra.ote.asia">欧创 OLTRA</a>
          <a href="https://oltraflim.ote.asia/" className="active">
            欧胶片
          </a>
          <a href="https://3d.ote.asia">O4D</a>
          <a className="cta" href="#download">
            下载
          </a>
        </div>
      </nav>

      <section className="of-hero">
        <div className="wrap">
          <div className="of-hero-grid">
            <div className="of-hero-copy">
              <div className="kicker reveal">OLTRAFLIM · 胶片模拟暗房</div>
              <h1 className="reveal">
                让每一张照片，
                <br />
                有自己的<em>胶片</em>。
              </h1>
              <p className="of-sub reveal">
                113 种胶片外观，一整条从白平衡到光晕的显影链路。
                在你自己的 Mac 上，安静地把数码照片洗成胶片。
              </p>
              <div className="btn-row reveal">
                <a className="btn btn-primary lg" href="#download">
                  下载 macOS 版
                </a>
                <a
                  className="btn btn-ghost lg"
                  href={R.repo}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub 仓库
                </a>
              </div>
              <div className="of-hero-meta reveal">
                <div>
                  <span>VERSION</span>
                  <b>
                    {R.version} / {R.build}
                  </b>
                </div>
                <div>
                  <span>SYSTEM</span>
                  <b>macOS 14+</b>
                </div>
                <div>
                  <span>CHIP</span>
                  <b>Apple Silicon</b>
                </div>
                <div>
                  <span>LICENSE</span>
                  <b>非商业免费</b>
                </div>
              </div>
            </div>

            <div className="of-window-wrap reveal">
              <div className="of-window" aria-label="OltraFlim 界面预览">
                <div className="of-windowbar">
                  <div className="of-dots">
                    <i className="red" />
                    <i className="amber" />
                    <i className="green" />
                  </div>
                  <span className="of-win-title">OLTRAFLIM — 照片库</span>
                  <span className="of-win-ver">1.3</span>
                </div>
                <div className="of-window-body">
                  <aside className="of-lib">
                    <div className="of-lib-head">
                      <span>照片库</span>
                      <em>24</em>
                    </div>
                    <div className="of-lib-row active">
                      <span className="of-folder" />
                      <span>2026 秋</span>
                      <em>12</em>
                    </div>
                    <div className="of-lib-row">
                      <span className="of-folder" />
                      <span>产品静物</span>
                      <em>8</em>
                    </div>
                    <div className="of-lib-row">
                      <span className="of-folder" />
                      <span>人像</span>
                      <em>4</em>
                    </div>
                    <div className="of-lib-line" />
                    <div className="of-lib-thumb">
                      <img src="/media/oltraflim-sample.jpg" alt="" />
                      <span>Portra 400</span>
                    </div>
                    <div className="of-lib-thumb">
                      <img src="/media/oltraflim-sample.jpg" alt="" className="alt" />
                      <span>Gold 200</span>
                    </div>
                  </aside>

                  <div className="of-stage">
                    <div className="of-photo">
                      <img src="/media/oltraflim-sample.jpg" alt="OltraFlim 显影预览" />
                      <div className="of-photo-chip">
                        <FilmMark />
                        PORTRA 400 · ENDURA
                      </div>
                      <div className="of-compare">
                        <span>原图</span>
                        <span className="of-compare-line" />
                        <b>显影</b>
                      </div>
                    </div>
                    <div className="of-stagebar">
                      <span>IMG_6459.DNG</span>
                      <span>4032 × 3024</span>
                      <span className="ok">本地离线</span>
                    </div>
                  </div>

                  <aside className="of-inspector">
                    <div className="of-insp-head">
                      <span>显影</span>
                      <em>7</em>
                    </div>
                    <div className="of-look">
                      <b>Portra 400</b>
                      <span>KODAK · 胶片强度 100%</span>
                    </div>
                    <div className="of-tabs">
                      <b>光线</b>
                      <span>色彩</span>
                      <span>曲线</span>
                    </div>
                    {[
                      ['曝光', 58, '+0.3'],
                      ['对比', 50, '0'],
                      ['高光', 36, '-42'],
                      ['阴影', 68, '+31'],
                      ['白色', 50, '0'],
                    ].map(([name, pos, val]) => (
                      <div className="of-slider" key={String(name)}>
                        <span>{name}</span>
                        <div className="of-track">
                          <i style={{ left: `${pos}%` }} />
                        </div>
                        <em>{val}</em>
                      </div>
                    ))}
                    <div className="of-insp-foot">ACES 2.0 · SPEKTRAFILM</div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="of-facts">
        <div className="wrap of-facts-grid">
          <div className="reveal">
            <b>113</b>
            <span>FILM LOOKS</span>
            <em>45 个胶片 stock</em>
          </div>
          <div className="reveal d1">
            <b>33³</b>
            <span>ACES 2.0 LUT</span>
            <em>Rec.709 显示变换</em>
          </div>
          <div className="reveal d2">
            <b>100%</b>
            <span>LOCAL</span>
            <em>全本地离线运行</em>
          </div>
          <div className="reveal d3">
            <b>14+</b>
            <span>macOS</span>
            <em>Apple Silicon 原生</em>
          </div>
        </div>
      </section>

      <section className="of-section">
        <div className="wrap of-two">
          <div className="reveal">
            <div className="kicker">NOT A FILTER</div>
            <h2>
              不是滤镜。
              <br />
              是一条完整的显影链路。
            </h2>
            <p className="of-lead">
              先做白平衡、曝光、对数域明暗与局部对比，再叠加 ACES 2.0 / Rec.709
              胶片 LUT，最后用曲线、色彩分级、通透、颗粒与光晕收尾。
              高光和阴影都还在，层次不是压平的。
            </p>
            <ul className="of-list">
              <li>
                <b>光线</b>
                <span>曝光、对比、高光、阴影、白点、黑点</span>
              </li>
              <li>
                <b>色彩</b>
                <span>色温、色调、自然饱和度、肤色/绿色/蓝色、分离色调</span>
              </li>
              <li>
                <b>质感</b>
                <span>颗粒尺寸、彩噪、阴影颗粒、光晕、暗角、褪色</span>
              </li>
            </ul>
          </div>

          <div className="of-sheet reveal d1">
            <div className="of-sheet-bar">
              <span>NEGATIVE → PRINT</span>
              <em>ACES 2.0</em>
            </div>
            <div className="of-sheet-img">
              <img src="/media/oltraflim-sample.jpg" alt="胶片显影样张" />
              <span className="of-sheet-grain" />
            </div>
            <div className="of-sheet-foot">
              <span>PORTRA 400 · ENDURA</span>
              <b>显影 / DEVELOPED</b>
            </div>
          </div>
        </div>
      </section>

      <section className="of-section of-dark">
        <div className="wrap">
          <div className="of-section-head reveal">
            <div className="kicker">WHAT IT DOES</div>
            <h2>一间暗房，四件事。</h2>
            <p className="of-lead">
              选胶片、调光色、做质感、整理照片库。没有节点图，没有光谱参数，
              每一步都看得见。
            </p>
          </div>

          <div className="of-features">
            {FLIM_FEATURES.map((f, i) => (
              <article key={f.id} className={`of-card reveal ${i > 0 ? `d${i}` : ''}`}>
                <div className="of-card-top">
                  <span>{f.n}</span>
                  <em>{f.en}</em>
                </div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
                <div className="of-card-foot">{f.foot}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="of-section">
        <div className="wrap">
          <div className="of-section-head reveal">
            <div className="kicker">WORKFLOW</div>
            <h2>从一张原片，到一套胶片。</h2>
            <p className="of-lead">四步，全部留在你自己的 Mac 上。</p>
          </div>
          <div className="of-flow">
            {FLIM_FLOW.map((s, i) => (
              <div key={s.n} className={`of-step reveal ${i > 0 ? `d${i}` : ''}`}>
                <div className="of-step-n">{s.n}</div>
                <div className="of-step-en">{s.en}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="of-section of-dark">
        <div className="wrap of-two of-library">
          <div className="reveal">
            <div className="kicker">LIBRARY LIKE FINDER</div>
            <h2>
              照片库，
              <br />
              像一个安静的访达。
            </h2>
            <p className="of-lead">
              照片和文件夹一起放在主页。点文件夹进去，点照片开始显影。
              收藏、颜色标签、按胶片分组、搜索——但它们不碰你的原文件。
            </p>
            <div className="of-tags">
              <span>照片 / 文件夹</span>
              <span>收藏</span>
              <span>颜色标签</span>
              <span>网格 / 列表</span>
              <span>按胶片分组</span>
              <span>不复制原文件</span>
            </div>
          </div>

          <div className="of-lib-panel reveal d1">
            <div className="of-lib-panel-head">
              <span>照片库</span>
              <em>12 张照片 · 3 个文件夹</em>
            </div>
            <div className="of-lib-cards">
              <div className="of-lib-folder">
                <span className="of-folder" />
                <b>2026 秋</b>
                <em>12 张照片</em>
              </div>
              <div className="of-lib-folder">
                <span className="of-folder" />
                <b>产品静物</b>
                <em>8 张照片</em>
              </div>
              <div className="of-lib-folder">
                <span className="of-folder" />
                <b>人像</b>
                <em>4 张照片</em>
              </div>
            </div>
            <div className="of-lib-photo-row">
              <div className="of-lib-photo">
                <img src="/media/oltraflim-sample.jpg" alt="照片库缩略图" />
                <div>
                  <b>IMG_6459</b>
                  <span>Portra 400 · 12 项调整</span>
                </div>
                <i className="of-star">★</i>
              </div>
              <div className="of-lib-photo">
                <img src="/media/oltraflim-sample.jpg" alt="照片库缩略图" className="alt" />
                <div>
                  <b>IMG_6458</b>
                  <span>Gold 200 · 未调整</span>
                </div>
                <i className="of-dotlabel" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="of-section of-download" id="download">
        <div className="wrap">
          <div className="of-download-grid">
            <div className="reveal">
              <div className="kicker">DOWNLOAD · {active.version}</div>
              <h2>{isWin ? 'Windows 版，先来试试。' : '把暗房，装进你的 Mac。'}</h2>
              <p className="of-lead">
                {isWin
                  ? 'Windows 测试版已经可以安装：界面是 Electron，显影走本地 Python 引擎，照片不出你的电脑。'
                  : '下载即用。安装包里已经带好 113 种胶片外观，不需要再联网下载素材。'}
              </p>
              <ul className="of-req">
                {active.requirements.map(([k, v]) => (
                  <li key={k}>
                    <span>{k}</span>
                    <b>{v}</b>
                  </li>
                ))}
              </ul>
            </div>

            <div className="of-dl-panel reveal d1">
              <div className="of-platform" role="tablist" aria-label="下载平台">
                <button
                  type="button"
                  role="tab"
                  aria-selected={platform === 'mac'}
                  className={platform === 'mac' ? 'on' : ''}
                  onClick={() => {
                    setPlatform('mac');
                    setFormat('dmg');
                  }}
                >
                  macOS
                  <em>正式版 {R.version}</em>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={platform === 'win'}
                  className={platform === 'win' ? 'on' : ''}
                  onClick={() => {
                    setPlatform('win');
                    setFormat('exe');
                  }}
                >
                  Windows
                  <em>测试版 {R.windows.version}</em>
                </button>
              </div>

              <div className="of-dl-head">
                <div>
                  <b>{active.version}</b>
                  <span>BUILD {active.build}</span>
                </div>
                <em className="of-chip">{active.channel}</em>
              </div>

              {isWin ? (
                <div className="of-format single">
                  <button type="button" className="on">
                    EXE
                    <span>{R.windows.downloads.exe.size}</span>
                  </button>
                </div>
              ) : (
                <div className="of-format" role="tablist" aria-label="下载格式">
                  {(['dmg', 'zip'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      role="tab"
                      aria-selected={format === f}
                      className={format === f ? 'on' : ''}
                      onClick={() => setFormat(f)}
                    >
                      {f.toUpperCase()}
                      <span>{R.downloads[f].size}</span>
                    </button>
                  ))}
                </div>
              )}

              <a className="btn btn-primary of-dl-main" href={current.github}>
                <span>从 GitHub 下载 {current.label}</span>
                <em>{current.size}</em>
              </a>

              <div className="of-dl-alts">
                <a href={current.relay}>
                  <span>备用线路一 · 站内中转</span>
                  <b>ote.asia/dl</b>
                </a>
                <a href={current.mirror}>
                  <span>备用线路二 · 加速镜像</span>
                  <b>gh-proxy</b>
                </a>
              </div>

              <div className="of-hash">
                <span>SHA-256</span>
                <code>{current.sha256}</code>
                <button type="button" onClick={copyHash}>
                  {copied ? '已复制' : '复制'}
                </button>
              </div>

              {isWin ? (
                <ul className="of-dl-notices">
                  {R.windows.notices.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              ) : (
                <p className="of-dl-note">
                  主线路为 GitHub Releases；两条备用线路给国内网络兜底。
                  三条线路的文件完全一致，下载后请核对 SHA-256。
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="of-section">
        <div className="wrap">
          <div className="of-section-head reveal">
            <div className="kicker">SPECIFICATION</div>
            <h2>规格与边界。</h2>
          </div>
          <div className="of-specs reveal">
            {[
              ['VERSION', `v${R.version} / build ${R.build}（macOS）· v${R.windows.version}（Windows 测试版）`],
              ['SYSTEM', `${R.system} · ${R.windows.system}`],
              ['ARCH', `${R.arch} · ${R.windows.arch}`],
              ['PACKAGE', `DMG ${R.downloads.dmg.size} · ZIP ${R.downloads.zip.size} · EXE ${R.windows.downloads.exe.size}`],
              ['FILM PACK', '113 个 LUT · 45 个胶片 stock · 33³ ACES 2.0'],
              ['EXPORT', 'JPEG · PNG · TIFF · HEIC · 全分辨率'],
              ['LIBRARY', '照片 / 文件夹 / 收藏 / 颜色标签 / 搜索'],
              ['LICENSE', '应用代码 PolyForm Noncommercial 1.0.0'],
            ].map(([k, v]) => (
              <div key={k} className="of-spec-row">
                <span>{k}</span>
                <b>{v}</b>
              </div>
            ))}
          </div>
          <p className="of-license-note reveal">
            应用代码为非商业源码许可：个人与非商业用途免费，商业使用需单独授权。
            内置胶片 LUT 数据来自 spektrafilm，按上游 CC BY-SA 4.0 授权；
            完整边界见{' '}
            <a href={`${R.repo}/blob/main/THIRD_PARTY_NOTICES.md`} target="_blank" rel="noreferrer">
              THIRD_PARTY_NOTICES.md
            </a>
            。
          </p>
        </div>
      </section>

      <section className="of-section of-dark">
        <div className="wrap">
          <div className="of-section-head reveal">
            <div className="kicker">FAQ</div>
            <h2>常见问题。</h2>
          </div>
          <div className="of-faq reveal">
            {FLIM_FAQS.map((f) => (
              <details key={f.q}>
                <summary>
                  <span>{f.q}</span>
                  <i />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="of-footer">
        <div className="wrap">
          <div className="of-footer-grid">
            <div>
              <div className="of-footer-brand">
                <FilmMark />
                <b>欧视界</b>
              </div>
              <p>面向创作者与团队的专业创作工具，让想法直接成为作品。</p>
              <span className="of-footer-mono">LOCAL-FIRST · 2026</span>
            </div>
            <div>
              <h5>产品</h5>
              <a href="https://oltra.ote.asia">欧创 OLTRA</a>
              <a href="https://oltraflim.ote.asia/">欧胶片 OLTRAFLIM</a>
              <a href="https://3d.ote.asia">O4D CineMover</a>
            </div>
            <div>
              <h5>资源</h5>
              <a href={R.repo} target="_blank" rel="noreferrer">
                GitHub 仓库
              </a>
              <a href={R.releasePage} target="_blank" rel="noreferrer">
                Release 1.3
              </a>
              <a href={R.windows.releasePage} target="_blank" rel="noreferrer">
                Release 0.1.0 · Windows
              </a>
              <a href={`${R.repo}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
                License
              </a>
            </div>
            <div>
              <h5>联系</h5>
              <a href="mailto:3206219621@qq.com">3206219621@qq.com</a>
              <a href="https://ote.asia">ote.asia</a>
            </div>
          </div>
          <div className="of-copy">
            <span>© 2026 Otegraph. All rights reserved.</span>
            <span>欧胶片 OLTRAFLIM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
