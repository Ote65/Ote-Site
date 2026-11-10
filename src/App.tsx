import React, { useEffect, useState } from 'react';

export default function App() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedTag, setSelectedTag] = useState<string>('环绕 360°');
  const [activeSection, setActiveSection] = useState<string>('');

  // 品牌工作流：理解 → 执行 → 自检 → 交付，依次点亮
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  // IntersectionObserver for .reveal elements + scroll spy
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');

    // 首屏兜底：hero 内容挂载后立即依次入场，不依赖观察器时序，杜绝首屏白屏
    const heroReveals = document.querySelectorAll('.hero .reveal');
    heroReveals.forEach((el, i) => {
      window.setTimeout(() => el.classList.add('in'), 90 + i * 70);
    });

    if (!('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      reveals.forEach((el) => io.observe(el));

      const handleScroll = () => {
        const sections = ['products', 'oltra', 'o4d', 'oltraflim', 'craft', 'start'];
        const scrollPos = window.scrollY + 100;
        for (const s of sections) {
          const el = document.getElementById(s);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
              setActiveSection(s);
              break;
            }
          }
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        io.disconnect();
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <>
      {/* 顶栏 */}
      <nav className="topbar">
        <div
          className="brand"
          id="brand"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img className="brand-logo" src="/media/ote-logo.png" alt="Otegraph 欧视界" />
          <span className="brand-text">
            <b>欧视界</b>
          </span>
        </div>
        <div className="nav">
          <a href="#products" className={activeSection === 'products' ? 'active' : ''}>
            产品
          </a>
          <a href="#oltra" className={activeSection === 'oltra' ? 'active' : ''}>
            欧创 OLTRA
          </a>
          <a href="#o4d" className={activeSection === 'o4d' ? 'active' : ''}>
            O4D
          </a>
          <a href="#oltraflim" className={activeSection === 'oltraflim' ? 'active' : ''}>
            欧胶片
          </a>
          <a href="#craft" className={activeSection === 'craft' ? 'active' : ''}>
            理念
          </a>
          <a href="#start" className="cta">
            开始使用
          </a>
        </div>
      </nav>

      {/* HERO · 品牌主张，单一焦点 */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <div className="kicker reveal">欧视界 Otegraph</div>
              <h1 className="reveal">
                让想法，更快成为<em>作品</em>。
              </h1>
              <p className="sub reveal">
                欧视界为创作者与团队打造专业创作工具。把繁琐的工序交给它，你只管给出想法——每一步都看得见，却不必亲手去碰。
              </p>
              <div className="btn-row reveal">
                <a href="#products" className="btn btn-primary">
                  了解产品
                </a>
                <a href="#craft" className="btn btn-ghost">
                  了解欧视界
                </a>
              </div>
            </div>

            <div className="media-card reveal">
              <div className="tagline">AI · ON YOUR TERMS</div>
              <div className="media-frame media-square">
                <video
                  src="/media/ai-mastery.mp4"
                  poster="/media/og-cover.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
              <div className="media-caption">
                <b>掌握 AI，然后掌握自己。</b>工具不断进化，而驾驭它的人，始终是你。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 产品流开场 */}
      <section id="products">
        <div className="wrap">
          <div className="kicker reveal">Products · 产品</div>
          <h2 className="reveal">为每一种创作，准备一件趁手的工具。</h2>
          <p className="lead reveal">
            欧视界旗下产品各自独立，为不同的创作而设计。从一支会自己完成的视频，
            到一段自动运镜的三维影像，再到一张照片的胶片显影——选择你需要的那一件。
          </p>
        </div>
      </section>

      {/* OLTRA 产品块（独立成章） */}
      <section id="oltra" className="sec-dark">
        <div className="wrap">
          <div className="two-col">
            <div className="reveal">
              <div className="kicker">欧创 OLTRA</div>
              <h2>
                会自己干活的<br />
                视频创作 Agent。
              </h2>
              <p className="lead">
                它运行在你自己的工程里，而不是在聊天框里回你一段文字。给个方向，它铺轨道、排素材、写动效，渲出真帧自己检查，不合格就返工，直到把片子做完导出。
              </p>
              <ul className="tight">
                <li>说「开头给个产品特写」，它在轨道上排好</li>
                <li>说「这段太干，加个转场」，它在切点上加上</li>
                <li>说「标题换成 XX」，十秒改完，不重建工程</li>
              </ul>
              <div className="btn-row" style={{ marginTop: '26px' }}>
                <a
                  className="btn btn-primary"
                  href="https://oltra.ote.asia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  进入 OLTRA
                </a>
              </div>
            </div>

            <div className="media-card reveal d1">
              <div className="tagline">FROM BLANK TO FRAME</div>
              <div className="media-frame">
                <video src="/media/oltra-wireframe.mp4" autoPlay muted loop playsInline />
              </div>
              <div className="media-caption">
                <b>从空白线框到版面</b>一帧帧把片子长出来，每一步都看得见。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O4D 产品块（独立成章，交替） */}
      <section id="o4d">
        <div className="wrap">
          <div className="two-col r">
            <div className="media-card amber reveal">
              <div className="tagline">3D · CINEMOVER</div>
              <div className="media-frame">
                <img src="/media/o4d-showcase.jpg" alt="O4D 三维运镜与产品爆炸" />
              </div>
              <div className="media-caption">
                <b>产品爆炸，一镜到底</b>每个部件的运动与运镜，都由关键帧驱动。
              </div>
            </div>

            <div className="reveal d1">
              <div className="kicker amber">O4D · CineMover</div>
              <h2>
                傻瓜式 3D<br />
                运镜动画工具。
              </h2>
              <p className="lead">
                拖入 GLB、GLTF 或 FBX 模型，像 KeyShot 一样打关键帧。第一人称穿行、第三人称环绕、产品爆炸与合并，调好材质与灯光，一键导出高清 MP4。
              </p>
              <div className="tags">
                {[
                  '环绕 360°',
                  '推近 · 拉远',
                  '飞越',
                  '英雄镜头',
                  '螺旋上升',
                  '产品爆炸',
                  '2.5K / 60fps',
                ].map((tag) => (
                  <span
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`tag cursor-pointer ${
                      selectedTag === tag || tag === '环绕 360°' ? 'hot' : ''
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="btn-row" style={{ marginTop: '26px' }}>
                <a
                  className="btn btn-primary"
                  href="https://3d.ote.asia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  进入 O4D
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OLTRAFILM 产品块（第三件产品） */}
      <section id="oltraflim">
        <div className="wrap">
          <div className="two-col">
            <div className="reveal">
              <div className="kicker">欧胶片 OLTRAFILM</div>
              <h2>
                让数码照片，
                <br />
                有自己的<em>胶片</em>。
              </h2>
              <p className="lead">
                113 种 ACES 2.0 胶片外观。光线、色彩、曲线、颗粒与光晕，全部在一间安静的
                macOS 暗房里完成。照片和文件夹像访达一样管理，原文件留在原位置。
              </p>
              <ul className="tight">
                <li>113 个胶片 LUT / 45 个 classic stock</li>
                <li>明暗曲线 + R/G/B 曲线，颗粒与光晕可调</li>
                <li>照片库 / 文件夹 / 收藏 / 颜色标签，全本地离线</li>
              </ul>
              <div className="btn-row" style={{ marginTop: '26px' }}>
                <a className="btn btn-primary" href="https://spektra.ote.asia">
                  查看欧胶片
                </a>
                <a
                  className="btn btn-ghost"
                  href="https://github.com/Ote65/OltraFlim"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub 仓库
                </a>
              </div>
            </div>

            <div className="media-card reveal d1">
              <div className="tagline">FILM, NOT FILTER</div>
              <div className="media-frame">
                <img
                  src="/media/oltraflim-sample.jpg"
                  alt="OltraFilm 胶片显影样张"
                  loading="lazy"
                />
              </div>
              <div className="media-caption">
                <b>把数码的干净，洗成胶片的呼吸。</b>
                从一张原片到 113 种胶片外观，只要选定、调光、导出。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 品牌理念 · 工作方式 + 品牌价值 */}
      <section id="craft" className="sec-dark">
        <div className="wrap">
          <div className="kicker reveal">欧视界 · 理念</div>
          <h2 className="reveal">
            把复杂留给自己，<br />
            把简单交给你。
          </h2>
          <p className="lead reveal">好工具应该安静、可靠、不抢戏。你只管想法，剩下的粗活交给它。</p>

          {/* 品牌工作流（通用方法论，非产品拼盘） */}
          <div className="method">
            {[
              {
                n: '01',
                name: '理解',
                en: 'INTENT',
                d: '听懂你的想法，拆解成可执行的镜头与动作。',
              },
              {
                n: '02',
                name: '执行',
                en: 'EXECUTE',
                d: '铺轨道、排素材、打关键帧，自动完成粗活。',
              },
              {
                n: '03',
                name: '自检',
                en: 'CHECK',
                d: '渲出真帧自己看，不合格就返工。',
              },
              {
                n: '04',
                name: '交付',
                en: 'DELIVER',
                d: '导出成片或高清影像，直接成为作品。',
              },
            ].map((s, i) => (
              <div key={s.n} className={`mstep reveal ${activeStep === i ? 'on' : ''}`}>
                <div className="mnum">
                  {s.n} · {s.en}
                </div>
                <div className="mname">{s.name}</div>
                <div className="mdesc">{s.d}</div>
              </div>
            ))}
          </div>

          {/* 品牌价值 */}
          <div className="cards n4" style={{ marginTop: '46px' }}>
            <div className="fcard reveal">
              <div className="lampmini">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6l-7-3Z" />
                </svg>
              </div>
              <h3>本地优先</h3>
              <div className="en">LOCAL-FIRST</div>
              <p>素材、工程、渲染都在你自己电脑上，不上云，也不丢进度。</p>
            </div>

            <div className="fcard reveal d1">
              <div className="lampmini">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5v14" />
                </svg>
              </div>
              <h3>克制设计</h3>
              <div className="en">RESTRAINT</div>
              <p>不堆功能、不抢戏，让工具安静地把事情做好。</p>
            </div>

            <div className="fcard reveal d2">
              <div className="lampmini">
                <svg viewBox="0 0 24 24">
                  <path d="m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5" />
                </svg>
              </div>
              <h3>真实不编造</h3>
              <div className="en">REAL, NOT MADE-UP</div>
              <p>照你的真实素材做，不虚构假界面，也不糊弄一帧。</p>
            </div>

            <div className="fcard reveal d3">
              <div className="lampmini">
                <svg viewBox="0 0 24 24">
                  <path d="M9 3v6m0 6v6M6 6.5h4.5a3 3 0 0 1 3 3V9m1.5 12v-6m0 0h-4.5a3 3 0 0 1-3-3V15" />
                </svg>
              </div>
              <h3>开放连接</h3>
              <div className="en">OPEN VIA MCP</div>
              <p>通过 MCP 接入 Codex、Cursor、Claude 等你已有的工作流。</p>
            </div>
          </div>

          <div className="hosts reveal" style={{ justifyContent: 'center' }}>
            <span className="host">Codex</span>
            <span className="host">Cursor</span>
            <span className="host">Claude</span>
            <span className="host">Trae</span>
            <span className="host">ZCode</span>
          </div>
        </div>
      </section>

      {/* 最终 CTA · 品牌邀请，选择你的工具 */}
      <section className="cta-final" id="start">
        <div className="kicker reveal" style={{ justifyContent: 'center' }}>
          欧视界 Otegraph
        </div>
        <h2 className="reveal">
          你的下一件作品，<br />
          从这里开始。
        </h2>
        <p className="lead reveal">三款产品均已上线。现在开始，让想法直接成为作品。</p>
        <div className="btn-row reveal" style={{ justifyContent: 'center' }}>
          <a
            className="btn btn-primary lg"
            href="https://oltra.ote.asia"
            target="_blank"
            rel="noopener noreferrer"
          >
            进入 OLTRA
          </a>
          <a
            className="btn btn-primary lg"
            href="https://3d.ote.asia"
            target="_blank"
            rel="noopener noreferrer"
          >
            进入 O4D
          </a>
          <a className="btn btn-primary lg" href="https://spektra.ote.asia">
            进入欧胶片
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="foot">
          <div className="fbrand">
            <div className="fbrand-row">
              <img className="foot-logo" src="/media/ote-logo.png" alt="Otegraph 欧视界" />
              <b>欧视界</b>
            </div>
            <p>面向创作者与团队的专业创作工具，让想法直接成为作品。</p>
          </div>
          <div>
            <h5>产品</h5>
            <ul>
              <li>
                <a href="https://oltra.ote.asia" target="_blank" rel="noopener noreferrer">
                  欧创 OLTRA
                </a>
              </li>
              <li>
                <a href="https://3d.ote.asia" target="_blank" rel="noopener noreferrer">
                  O4D · CineMover
                </a>
              </li>
              <li>
                <a href="https://spektra.ote.asia">欧胶片 OLTRAFILM</a>
              </li>
            </ul>
          </div>
          <div>
            <h5>了解</h5>
            <ul>
              <li>
                <a href="#products">产品</a>
              </li>
              <li>
                <a href="#craft">品牌理念</a>
              </li>
            </ul>
          </div>
          <div>
            <h5>联系</h5>
            <ul>
              <li>
                <a href="mailto:3206219621@qq.com">3206219621@qq.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="copy">
          <span>© 2026 Otegraph. All rights reserved.</span>
          <span>ote.asia</span>
        </div>
      </footer>
    </>
  );
}
