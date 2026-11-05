import React, { useEffect, useRef, useState } from 'react';

/**
 * 显影链路动画：按引擎真实管线分八道工序演示
 * RAW 解码 → 密度曲线 → 光谱感光 → 成色剂 → 扩散/光晕 → 颗粒 → 相纸 → ACES 显示
 * 进入视口自动逐格播放，可点击任意工序跳转。
 */

type Stage = {
  no: string;
  en: string;
  tag: string;
  title: string;
  body: string;
};

const STAGES: Stage[] = [
  {
    no: '01',
    en: 'RAW DECODE',
    tag: 'LINEAR RGB',
    title: 'RAW 解码',
    body: '相机的原始数据先解码成线性 RGB——一张"数码底片"。此时它只有亮度信息，还没有任何胶片味道。',
  },
  {
    no: '02',
    en: 'DENSITY CURVE',
    tag: 'H&D CURVE',
    title: '密度曲线',
    body: '线性亮度被压进胶片的 H&D 密度曲线：高光上肩部、阴影下趾部，过渡变缓，这是胶片"容得下高光"的秘密。',
  },
  {
    no: '03',
    en: 'SPECTRAL',
    tag: 'SPECTRAL RESPONSE',
    title: '光谱感光',
    body: '乳剂层对光谱的敏感度和人眼不同。引擎按每支胶片的光谱响应重新分配 RGB——Windows 测试版逐张实时光谱计算，macOS 正式版使用预生成 LUT。',
  },
  {
    no: '04',
    en: 'COUPLERS',
    tag: 'DYE COUPLING',
    title: '彩色显影 · 成色剂',
    body: '显影剂在曝光处氧化，与成色剂耦合成染料，把银影"翻译"成颜色。负像转正像，胶片的色彩性格在这一步长出来。',
  },
  {
    no: '05',
    en: 'DIFFUSION',
    tag: 'LAYER DIFFUSION',
    title: '扩散与光晕',
    body: '强光穿透乳剂层，在片基上反射回来再次曝光——高光周围泛起橙红色的 halation 光晕，胶片最感性的瑕疵。',
  },
  {
    no: '06',
    en: 'GRAIN',
    tag: 'SILVER GRAIN',
    title: '颗粒',
    body: '按胶片型号的颗粒尺寸与分布叠上卤化银颗粒，阴影处更明显。数码的"干净"在这里变成胶片的"呼吸"。',
  },
  {
    no: '07',
    en: 'PRINT',
    tag: 'PRINT STOCK',
    title: '相纸打印',
    body: '负片要印到相纸上才是照片。按 print stock（如 Endura、2383）确定最终反差与色调，画面在此定型。',
  },
  {
    no: '08',
    en: 'DISPLAY',
    tag: 'ACES 2.0 · DISPLAY',
    title: '显示变换',
    body: '最后经 ACES 2.0 显示变换，把胶片密度映射到你的屏幕。预览与导出走同一条管线，所见即所得。',
  },
];

export default function DevelopChain() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  /* 进入视口后开始自动播放；偏好减弱动效则直接呈现终态 */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setActive(STAGES.length - 1);
          } else {
            setPlaying(true);
          }
          io.disconnect();
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* 自动步进：每 2.4s 前进一道工序，走完即停 */
  useEffect(() => {
    if (!playing) return;
    if (active >= STAGES.length - 1) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setActive(active + 1), 2400);
    return () => window.clearTimeout(t);
  }, [playing, active]);

  const done = active >= STAGES.length - 1;
  const stage = STAGES[active];
  const dev = 0.08 + (active / (STAGES.length - 1)) * 0.92;

  return (
    <section className="of-section of-dark of-chain" ref={rootRef}>
      <div className="wrap">
        <div className="of-section-head reveal">
          <div className="kicker amber">THE DEVELOP CHAIN</div>
          <h2>一条显影链路，八道工序。</h2>
          <p className="of-lead">
            数码照片进去，胶片出来。中间发生的事和暗房里的药水一样，一道都不能省——
            下面是引擎真实的处理顺序。
          </p>
        </div>

        <div className="dc-grid">
          <div className="dc-visual reveal">
            <div className="dc-frame">
              <div className="dc-holes" aria-hidden="true" />
              <div className="dc-img">
                <img className="dc-raw" src="/media/oltraflim-sample.jpg" alt="" />
                <img
                  className="dc-dev"
                  src="/media/oltraflim-sample.jpg"
                  alt="显影进度预览"
                  style={{ opacity: dev }}
                />
                <div className={`dc-scan${active === 2 ? ' on' : ''}`} aria-hidden="true" />
                <div className={`dc-bloom${active === 3 ? ' on' : ''}`} aria-hidden="true" />
                <div className={`dc-halation${active >= 4 ? ' on' : ''}`} aria-hidden="true" />
                <div className={`dc-grain${active >= 5 ? ' on' : ''}`} aria-hidden="true" />
                <div className={`dc-paper${active >= 6 ? ' on' : ''}`} aria-hidden="true" />
                <div className="dc-lamp" aria-hidden="true" />
              </div>
              <div className="dc-readout">
                <span>STAGE {String(active + 1).padStart(2, '0')} / {STAGES.length}</span>
                <b>{stage.en}</b>
                <em>{stage.tag}</em>
                {done && (
                  <button
                    type="button"
                    onClick={() => {
                      setActive(0);
                      setPlaying(true);
                    }}
                  >
                    ↻ 重新显影
                  </button>
                )}
              </div>
            </div>

            <div className="dc-detail" key={stage.no}>
              <span>{stage.no} · {stage.tag}</span>
              <h3>{stage.title}</h3>
              <p>{stage.body}</p>
            </div>
          </div>

          <ol className="dc-stages reveal d1">
            {STAGES.map((s, i) => (
              <li key={s.no}>
                <button
                  type="button"
                  className={i === active ? 'on' : ''}
                  aria-current={i === active}
                  onClick={() => {
                    setActive(i);
                    setPlaying(false);
                  }}
                >
                  <span className="dc-s-n">{s.no}</span>
                  <span className="dc-s-en">{s.en}</span>
                  <span className="dc-s-title">{s.title}</span>
                  <i className="dc-s-rail" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
