/**
 * OTE 开场：移植 DhvanilPatel/swarm-cursors 的「Swarm Rebuild」编舞。
 *
 * 页面被擦成空白画布，一群 Figma 风格光标把首屏真实 UI 搭回来：
 *   · 18 个光标从画面两侧外飞入，绕中心 boids 环绕，触到目标后散开干活；
 *   · 盒子/图片：十字光标拖框（实时 W × H 徽标 + 灰色占位），切回箭头，真实填充淡入；
 *   · 文本：十字拖出文本框 → 工字形光标逐字打字 → 箭头 + 蓝色选框；
 *   · 选区 = 1px 蓝框 + 7×7 白手柄 + 底部 600 11px 徽标 + 20px 标尺虚线；标尺条随之滑入。
 * 全部建完整层淡出，露出真实页面。
 *
 * 逐条对齐源码：ARROW_D 路径、HOT 热点、COLORS 色板、cursorSVG 双描边、
 * press 缩放、angle 随速度、moveTo 的 bend 弧线、drawBox / drawText 的 yield 顺序。
 * 交互：点击 / 滚轮 / 任意按键跳过；prefers-reduced-motion 下不出现。
 */
import { useEffect, useRef, useState } from 'react';
import './swarm-intro.css';

/* ---------------------------------------------------------------- 常量（取自源码） */
/** 光标配色：统一黑白灰阶（不用源码的 Figma 彩盘），在深底上靠明度区分个体 */
const COLORS = ['#F4F2EE', '#E2DFDA', '#CFCBC5', '#B8B4AE', '#A09C97'];
const CURSOR_PX = 18; // 光标绘制尺寸（源码 28，这里收小）
const BLUE = '#0D99FF';
const RULER = 20;
const INTRO_AGENTS = 18;
const TASK_CAP = 24;
const MAX_MS = 6200;
const FADE_MS = 520;
/** 编舞节奏倍率：源码里 tempo 随滚动在 2.1~4.5，这里固定在偏快档，开场不拖沓 */
const TEMPO: number = 2.4;

const ARROW_D =
  'M4.6 3.9 C4.2 3.1 4.9 2.4 5.7 2.8 L20.6 9.4 C21.5 9.8 21.4 11.1 20.4 11.3 ' +
  'L13.9 12.9 C13.4 13 13 13.4 12.9 13.9 L11.3 20.4 C11.1 21.4 9.8 21.5 9.4 20.6 Z';
const HOT: Record<string, [number, number]> = {
  arrow: [5, 3.5], cross: [12, 12], ibeam: [12, 12],
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const f1 = (n: number) => Math.round(n * 10) / 10;

/** 光标外形：与源码 cursorSVG 一致的 SVG 片段（24×24） */
function cursorSVG(shape: string, c: string): string {
  const st = 'stroke="#fff" stroke-width="1.5" stroke-linejoin="round"';
  switch (shape) {
    case 'cross':
      return (
        '<g stroke-linecap="round">' +
        `<path d="M12 3.5 V20.5 M3.5 12 H20.5" stroke="#fff" stroke-width="3.6"/>` +
        `<path d="M12 3.5 V20.5 M3.5 12 H20.5" stroke="${c}" stroke-width="1.5"/></g>`
      );
    case 'ibeam': {
      const d =
        'M8.5 4.5 H10.5 Q12 4.5 12 6 Q12 4.5 13.5 4.5 H15.5 M12 6 V18 ' +
        'M8.5 19.5 H10.5 Q12 19.5 12 18 Q12 19.5 13.5 19.5 H15.5';
      return (
        '<g fill="none" stroke-linecap="round">' +
        `<path d="${d}" stroke="#fff" stroke-width="3.6"/>` +
        `<path d="${d}" stroke="${c}" stroke-width="1.5"/></g>`
      );
    }
    default:
      return `<path d="${ARROW_D}" fill="${c}" ${st}/>`;
  }
}

/* ---------------------------------------------------------------- 数据模型 */
type Box = { x: number; y: number; w: number; h: number };

type Item = {
  x: number; y: number; w: number; h: number;
  kind: 'rect' | 'text' | 'image';
  pad: { t: number; l: number }; // 文本绘制起点相对元素框的偏移
  font: { family: string; size: number; weight: string; style: string; color: string; lh: number; align: string };
  bg: string;
  bgImage?: string;
  border?: string;
  shadow?: string;
  radius: number;
  src: string;
  fit?: string; // 媒体的 object-fit（cover / contain），照搬真实元素
  mediaEl?: HTMLVideoElement; // 视频：首帧可能还没解码，留引用后面补抓
  text: string;
  wrapW?: number; // 文本换行宽度（按元素实际宽度，而不是文字并集宽度）
  ws?: string; // 原元素的 white-space（nowrap 的标题必须照搬，否则会被拆成一字一行）
  clone?: HTMLElement; // 文本：克隆的真实节点（保留 em/strong 等结构）
  segs?: { node: Text; full: string }[]; // 克隆里的文本节点，打字时逐个回填
  /* 运行期 */
  node: HTMLElement | null;
  vis: boolean;
  styled: boolean;
  done: boolean;
  shown: number;
  draw: { w: number; h: number } | null;
  dirty: boolean;
};

type Ov =
  | { t: 'box'; b: Box; handles?: boolean; badge?: string; rulerLines?: boolean; underline?: { x: number; y: number; w: number } }
  | { t: 'measure'; a: { x: number; y: number }; b: { x: number; y: number }; label: string };

type Cur = {
  id: number; x: number; y: number; vx: number; vy: number; angle: number;
  shape: string; press: number; color: string;
  orbit: number; spin: number; curl: number; speed: number; force: number;
  follow: boolean; task: Item | null; taskStart: number;
  gen: Generator<number | undefined, void, number> | null;
  ov: (() => Ov[]) | null;
  /* DOM */
  el: HTMLElement | null; svg: SVGElement | null; shapeCache: string; hx: number; hy: number;
};

/** 克隆一个文本元素：保留内部结构（em/strong/span），把排版相关样式逐节点内联，
 *  这样即使父级选择器失效也不会走形。文本节点全部清空，交给打字逐步回填。 */
function cloneTextTree(el: HTMLElement, box: Box): { root: HTMLElement; segs: { node: Text; full: string }[] } {
  const root = el.cloneNode(true) as HTMLElement;
  root.removeAttribute('id');
  root.removeAttribute('data-swarm');
  const src = [el, ...Array.from(el.querySelectorAll<HTMLElement>('*'))];
  const dst = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];
  for (let i = 0; i < src.length && i < dst.length; i++) {
    const cs = getComputedStyle(src[i]);
    const d = dst[i];
    d.style.setProperty('color', cs.color, 'important');
    d.style.setProperty('font-family', cs.fontFamily, 'important');
    d.style.setProperty('font-size', cs.fontSize, 'important');
    d.style.setProperty('font-weight', cs.fontWeight, 'important');
    d.style.setProperty('font-style', cs.fontStyle, 'important');
    d.style.setProperty('letter-spacing', cs.letterSpacing, 'important');
    d.style.setProperty('line-height', cs.lineHeight, 'important');
    d.style.setProperty('text-transform', cs.textTransform, 'important');
    d.style.setProperty('text-decoration', cs.textDecorationLine, 'important');
    d.style.setProperty('white-space', cs.whiteSpace, 'important');
    d.style.setProperty('background', 'transparent', 'important');
    d.style.setProperty('border', '0', 'important');
  }
  Object.assign(root.style, {
    position: 'static',
    display: 'block',
    margin: '0',
    padding: '0',
    width: '100%',
    maxWidth: 'none',
    transform: 'none',
    opacity: '1',
    left: 'auto',
    top: 'auto',
  });
  /* 内联元素要保持 inline，否则 a/span 里的文字会变成块级 */
  const rootCs = getComputedStyle(el);
  if (rootCs.display.startsWith('inline')) root.style.display = rootCs.display;

  const segs: { node: Text; full: string }[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n = walker.nextNode();
  while (n) {
    const t = n as Text;
    const full = t.data;
    if (full.trim()) segs.push({ node: t, full });
    t.data = '';
    n = walker.nextNode();
  }
  void box;
  return { root, segs };
}

/** 抓视频当前帧为 dataURL；还没解码或跨域污染时返回空串 */
function grabVideoFrame(v: HTMLVideoElement): string {
  if (!v.videoWidth) return '';
  try {
    const c = document.createElement('canvas');
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext('2d')?.drawImage(v, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.72);
  } catch {
    return '';
  }
}

/** 扫描首屏组件，做成任务清单（自上而下）。
 *  文本按元素自身的布局框克隆真实 DOM，媒体抓当前帧，盒子照搬背景/边框/阴影。 */
function collectItems(vh: number): Item[] {
  const out: Item[] = [];
  const used = new Set<Element>();
  const vw = window.innerWidth;

  const baseFont = {
    family: '', size: 14, weight: '400', style: 'normal', color: '#000', lh: 16, align: 'left',
  };
  const push = (it: Omit<Item, 'node' | 'vis' | 'styled' | 'done' | 'shown' | 'draw' | 'dirty'>) => {
    out.push({
      ...it,
      node: null, vis: false, styled: false, done: false, shown: 0, draw: null, dirty: true,
    });
  };

  /* ---- A. 有可见涂装（底色/渐变/阴影）的块面：按钮、卡片、logo ---- */
  const boxSel = 'a,button,div[class*="card"],div[class*="logo"]';
  let boxes = 0;
  for (const el of Array.from(document.querySelectorAll<HTMLElement>(boxSel))) {
    if (boxes >= 8) break;
    if (el.closest('.swarm-intro') || used.has(el)) continue;
    if (el.querySelector('video,img,canvas')) continue; // 里面有媒体，交给媒体任务
    const r = el.getBoundingClientRect();
    if (r.width < 40 || r.height < 24 || r.bottom <= 0 || r.top > vh - 8) continue;
    if (r.width * r.height > vw * vh * 0.28) continue;
    const cs = getComputedStyle(el);
    /* 只要有其中一种涂装就算一块面；纯透明（文字链接）跳过 */
    const painted =
      cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
      cs.backgroundImage !== 'none' ||
      cs.boxShadow !== 'none';
    if (!painted) continue;
    used.add(el);
    el.setAttribute('data-swarm', '');
    push({
      x: r.left, y: r.top, w: r.width, h: r.height, kind: 'rect', pad: { t: 0, l: 0 },
      font: baseFont, bg: cs.backgroundColor,
      bgImage: cs.backgroundImage === 'none' ? undefined : cs.backgroundImage,
      border: cs.borderTopWidth !== '0px' ? cs.border : undefined,
      shadow: cs.boxShadow === 'none' ? undefined : cs.boxShadow,
      radius: parseFloat(cs.borderTopLeftRadius) || 0, src: '', text: '',
    });
    boxes++;
  }

  /* ---- B. 文本：用元素自身的布局框 + 克隆 DOM ---- */
  let texts = 0;
  const seenText: { y: number; s: string }[] = [];
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('body *'))) {
    if (texts >= 13) break;
    if (el.closest('.swarm-intro')) continue;
    /* 祖先已经被采集（同一段文字）就跳过，否则 h1 里的 em 会被再采一遍 */
    if (el.parentElement?.closest('[data-swarm]')) continue;
    const tag = el.tagName.toLowerCase();
    if (['img', 'video', 'canvas', 'svg', 'script', 'style', 'br', 'path', 'g'].includes(tag)) continue;
    const own = Array.from(el.childNodes).filter((n) => n.nodeType === 3 && (n.textContent || '').trim());
    if (!own.length) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 12 || r.height < 9 || r.bottom <= 0 || r.top > vh - 8) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.15) continue;
    const fs = parseFloat(cs.fontSize) || 14;
    const lh = parseFloat(cs.lineHeight) || fs * 1.2;
    const full = own.map((n) => (n.textContent || '').replace(/\s+/g, ' ').trim()).join('').trim();
    /* 父子元素常带同一段文案，只保留靠上的那条 */
    if (seenText.some((s) => s.s === full && Math.abs(s.y - r.top) < 34)) continue;
    seenText.push({ y: r.top, s: full });
    used.add(el);
    el.setAttribute('data-swarm', '');
    const box: Box = { x: r.left, y: r.top, w: r.width, h: r.height };
    const { root, segs } = cloneTextTree(el, box);
    push({
      x: box.x, y: box.y, w: box.w, h: box.h, kind: 'text',
      pad: { t: 0, l: 0 },
      font: {
        family: cs.fontFamily, size: fs, weight: cs.fontWeight, style: cs.fontStyle,
        color: cs.color, lh, align: cs.textAlign,
      },
      bg: 'rgba(0, 0, 0, 0)', radius: 0, src: '',
      text: full, ws: cs.whiteSpace,
      clone: root, segs,
    });
    texts++;
  }

  /* ---- C. 媒体：图片取 src，视频抓当前帧（跨域抓不到就退回 poster） ---- */
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('img,video'))) {
    if (out.length >= TASK_CAP) break;
    if (el.closest('.swarm-intro') || used.has(el)) continue;
    let r = el.getBoundingClientRect();
    /* 视频还没解码时自身可能没有尺寸：退到父容器的框 */
    if (r.width < 24 && el.parentElement) r = el.parentElement.getBoundingClientRect();
    if (r.width < 24 || r.height < 16 || r.bottom <= 0 || r.top > vh - 8) continue;
    let src = '';
    let mediaEl: HTMLVideoElement | undefined;
    if (el.tagName.toLowerCase() === 'video') {
      const v = el as HTMLVideoElement;
      src = grabVideoFrame(v);
      if (!src) src = v.getAttribute('poster') || '';
      if (!src) {
        mediaEl = v;
        /* 真实页面的视频常常是 preload=metadata 且没在播，
           这里催一下解码，画面才抓得到 */
        try {
          v.muted = true;
          if (v.preload !== 'auto') {
            v.preload = 'auto';
            v.load();
          }
          void v.play().catch(() => {});
        } catch { /* 播放被拦时保持灰块 */ }
      }
    } else {
      const im = el as HTMLImageElement;
      src = im.currentSrc || im.src || '';
      /* 空 src 会被解析成当前页面地址、没加载成功的图也不画 */
      if (!src || src === location.href || im.naturalWidth === 0) continue;
    }
    const mcs = getComputedStyle(el);
    used.add(el);
    el.setAttribute('data-swarm', '');
    push({
      x: r.left, y: r.top, w: r.width, h: r.height, kind: 'image', pad: { t: 0, l: 0 },
      font: baseFont, bg: 'rgba(0, 0, 0, 0)', radius: parseFloat(mcs.borderTopLeftRadius) || 0,
      src, fit: mcs.objectFit, mediaEl, text: '',
    });
  }

  return out.sort((a, b) => a.y - b.y).slice(0, TASK_CAP);
}

export default function SwarmIntro() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [leaving, setLeaving] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!visible) return;
    const host = hostRef.current;
    if (!host) { setVisible(false); return; }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    /* 空白画布颜色 = 页面本体底色，揭开时无跳变 */
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    const pageBg = bodyBg === 'rgba(0, 0, 0, 0)' ? '#121214' : bodyBg;
    host.style.background = pageBg;
    /* 占位灰按底色明暗切换（源码默认 #D9D9D9 是给白底页面用的） */
    const ch = pageBg.match(/[\d.]+/g) || [];
    const lum = ch.length >= 3
      ? (0.2126 * Number(ch[0] ?? 0) + 0.7152 * Number(ch[1] ?? 0) + 0.0722 * Number(ch[2] ?? 0)) / 255
      : 0;
    host.style.setProperty('--sw-ph', lum > 0.5 ? '#D9D9D9' : '#3A3A3F');

    const stage = document.createElement('div');
    stage.className = 'sw-stage';
    const ovSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ovSvg.setAttribute('class', 'sw-ov');
    const badgeBox = document.createElement('div');
    badgeBox.className = 'sw-badges';
    const curBox = document.createElement('div');
    curBox.className = 'sw-cursors';
    const rulerTop = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    rulerTop.setAttribute('class', 'sw-ruler sw-ruler--top');
    const rulerLeft = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    rulerLeft.setAttribute('class', 'sw-ruler sw-ruler--left');
    host.append(stage, rulerTop, rulerLeft, ovSvg, badgeBox, curBox);

    let items: Item[] = [];
    const cursors: Cur[] = [];
    let started = false;
    let ready = false;
    let startedAt = 0;
    let last = performance.now();
    let time = 0;
    let raf = 0;
    let done = false;
    let holdAt = 0; // 建完后的停留起点，让观众看清重建结果再揭幕
    let unmountTimer = 0;
    let rulersT = 0;
    let rulersNeed = false;

    /* --------------------------------------------------------------- 光标工厂 */
    const makeCursor = (x: number, y: number): Cur => {
      const id = cursors.length;
      const fast = Math.random() < 0.25;
      const el = document.createElement('div');
      el.className = 'sw-cur';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 28 28');
      svg.setAttribute('width', String(CURSOR_PX));
      svg.setAttribute('height', String(CURSOR_PX));
      el.appendChild(svg);
      curBox.appendChild(el);
      return {
        id, x, y, vx: 0, vy: 0, angle: 0,
        shape: 'arrow', press: 0, color: COLORS[id % COLORS.length],
        orbit: rand(70, 170), spin: fast ? rand(2.2, 3.4) : rand(0.8, 1.8),
        curl: rand(-1, 1), speed: fast ? rand(1000, 1500) : rand(300, 750),
        force: fast ? rand(3500, 6000) : rand(700, 1800),
        follow: true, task: null, taskStart: 0, gen: null, ov: null,
        el, svg, shapeCache: '', hx: 5, hy: 3.5,
      };
    };

    /* 开场：两侧外飞入，绕中心 boids 环绕 */
    for (let n = 0; n < INTRO_AGENTS; n++) {
      const side = n % 2 === 0;
      const x = side ? -40 - rand(0, 200) : vw + 40 + rand(0, 200);
      const c = makeCursor(x, rand(0.05, 0.95) * vh);
      c.follow = true;
      cursors.push(c);
    }

    /* ------------------------------------------------------------------ boids（照搬源码 follow） */
    const follow = (dt: number, list: Cur[], target?: Box, scale = 1) => {
      const o = target ? { x: target.x, y: target.y } : { x: vw / 2, y: vh * 0.45 };
      const R = 135 * scale * (1 + 0.18 * Math.sin(time * 0.55));
      const swirl = Math.tanh(Math.cos(time * 0.11) * 3);
      const want: [number, number][] = [];
      for (const c of list) {
        const vx = c.x - o.x;
        const vy = c.y - o.y;
        const d = Math.hypot(vx, vy) || 0.01;
        const nx = vx / d;
        const ny = vy / d;
        const ang = Math.atan2(vy, vx);
        const off = (c.orbit - 120) * 0.55 * scale;
        const rr = R * (1 + 0.3 * Math.sin(3 * ang + time * 0.7)) + off;
        const tang = 300 * (0.7 + c.spin * 0.2) * swirl;
        const rad = clamp((rr - d) * 4, -2600, 1400);
        const far = Math.min(1, Math.max(0, (d - rr) / 600));
        want.push([-ny * tang + nx * rad - ny * c.curl * 400 * far,
          nx * tang + ny * rad + nx * c.curl * 400 * far]);
      }
      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        let ax = 0; let ay = 0; let wsum = 0;
        for (let j = 0; j < list.length; j++) {
          if (j === i) continue;
          const q = list[j];
          const d = Math.hypot(q.x - c.x, q.y - c.y);
          if (d > 90) continue;
          const w = 1 - d / 90;
          ax += q.vx * w; ay += q.vy * w; wsum += w;
        }
        let [fx, fy] = want[i];
        if (wsum > 0) { fx = fx * 0.7 + (ax / wsum) * 0.3; fy = fy * 0.7 + (ay / wsum) * 0.3; }
        const dist = Math.max(0, Math.hypot(c.x - o.x, c.y - o.y) - 180 * scale);
        const maxV = c.speed * (1.3 + Math.min(3.2, dist / 90));
        const L = Math.hypot(fx, fy);
        if (L > maxV) { fx *= maxV / L; fy *= maxV / L; }
        let gx = (fx - c.vx) * 6;
        let gy = (fy - c.vy) * 6;
        const maxF = c.force * (1.4 + Math.min(5, dist / 50));
        const G = Math.hypot(gx, gy);
        if (G > maxF) { gx *= maxF / G; gy *= maxF / G; }
        c.vx += gx * dt; c.vy += gy * dt;
        c.x += c.vx * dt; c.y += c.vy * dt;
      }
      /* 碰到目标圈 → 报告"该开演了" */
      let touched = false;
      for (const c of list) {
        const d = Math.hypot(c.x - o.x, c.y - o.y);
        if (d < (target ? 42 : 96)) touched = true;
        if (Math.hypot(c.vx, c.vy) < 30) continue;
        const a = (Math.atan2(c.vy, c.vx) * 180) / Math.PI + 128;
        const dd = ((((a - c.angle + 540) % 360) + 360) % 360) - 180;
        c.angle += dd * Math.min(1, dt * 8);
        c.press = Math.max(0, c.press - dt * 6);
      }
      return touched;
    };

    /* --------------------------------------------------- 编舞原语（yield 一帧的 dt） */
    function* wait(t: number): Generator<number | undefined, void, number> {
      let n = 0;
      while (n < t) n += Number(yield) * TEMPO;
    }

    function* moveTo(c: Cur, target: { x: number; y: number } | (() => { x: number; y: number }),
      o: { speed?: number; bend?: number; drag?: boolean; onStep?: () => void } = {}): Generator<number | undefined, void, number> {
      const get = typeof target === 'function' ? target : () => target;
      const x0 = c.x; const y0 = c.y;
      const p0 = get();
      const dist = Math.hypot(p0.x - x0, p0.y - y0);
      if (dist < 0.5) { c.x = p0.x; c.y = p0.y; if (o.onStep) o.onStep(); return; }
      const dur = clamp(0.12 + Math.sqrt(dist) * 0.021, 0.14, 0.9) / (o.speed || 1);
      const bend = (o.bend != null ? o.bend : (Math.random() < 0.5 ? -1 : 1) * rand(0.04, 0.14))
        * Math.min(dist, 600);
      let t = 0;
      while (t < dur) {
        t += Number(yield) * TEMPO;
        const k = Math.min(1, t / dur);
        const e = o.drag || k < 0.15 ? easeInOut(k) : easeOut(k);
        const p = get();
        const dx = p.x - x0; const dy = p.y - y0;
        const L = Math.hypot(dx, dy) || 1;
        const off = Math.sin(Math.PI * e) * bend;
        c.x = x0 + dx * e + (-dy / L) * off;
        c.y = y0 + dy * e + (dx / L) * off;
        if (o.onStep) o.onStep();
      }
      const p = get();
      c.x = p.x; c.y = p.y;
      if (o.onStep) o.onStep();
    }

    function* click(c: Cur): Generator<number | undefined, void, number> {
      c.press = 1;
      yield* wait(0.07);
    }

    /** 克隆文本的总字数（em/strong 会把文本拆成多个节点，不能只看 it.text） */
    const totalChars = (it: Item) =>
      it.segs ? it.segs.reduce((a, b) => a + b.full.length, 0) : it.text.length;

    function* typeIt(it: Item, c: Cur): Generator<number | undefined, void, number> {
      const N = totalChars(it);
      const k = clamp(70 / Math.max(1, N), 0.06, 1);
      let budget = 0;
      let i = it.shown;
      while (i < N) {
        budget += Number(yield) * TEMPO;
        while (i < N && budget > 0) {
          const ch = it.text[i];
          let d = rand(0.012, 0.04);
          if (ch === ' ') d += rand(0, 0.03);
          if (Math.random() < 0.025) d += rand(0.08, 0.2);
          budget -= d * k;
          i++;
        }
        it.shown = i;
        it.dirty = true;
        c.press = Math.max(0, c.press - 0.12);
      }
    }

    /* --------------------------------------------------------------- 选区描述 */
    const bounds = (it: Item): Box =>
      it.draw ? { x: it.x, y: it.y, w: it.draw.w, h: it.draw.h } : { x: it.x, y: it.y, w: it.w, h: it.h };

    const selection = (it: Item): Ov => {
      const b = bounds(it);
      return {
        t: 'box', b,
        handles: true,
        badge: `${Math.round(b.w)} × ${Math.round(b.h)}`,
        rulerLines: true,
        underline: it.kind === 'text'
          ? { x: b.x, y: b.y + (it.font.lh * 0.5 + it.font.size * 0.42), w: Math.min(b.w, it.w) }
          : undefined,
      };
    };

    /* ------------------------------------------------------------- 单项 DOM 同步 */
    const ensureNode = (it: Item) => {
      if (it.node) return it.node;
      const d = document.createElement('div');
      d.className = 'sw-item';
      if (it.kind === 'text') {
        /* 文本层：直接挂克隆的真实节点，内部结构与样式都保留 */
        d.classList.add('sw-item--text');
        const t = document.createElement('div');
        t.className = 'sw-text';
        if (it.clone) t.appendChild(it.clone);
        else t.textContent = '';
        d.appendChild(t);
      } else if (it.kind === 'image') {
        /* 媒体：优先用抓到的帧图；抓不到就克隆一个同源 video 直接播，
           保证它一定不是一块空白灰 */
        d.classList.add('sw-item--rect');
        if (it.src) {
          const im = document.createElement('img');
          im.className = 'sw-media';
          im.src = it.src;
          im.alt = '';
          if (it.fit) im.style.objectFit = it.fit;
          if (it.radius) im.style.borderRadius = `${it.radius}px`;
          d.appendChild(im);
        } else if (it.mediaEl) {
          const v = document.createElement('video');
          v.className = 'sw-media';
          v.src = it.mediaEl.currentSrc || it.mediaEl.src;
          v.muted = true;
          v.autoplay = true;
          v.loop = true;
          v.playsInline = true;
          if (it.fit) v.style.objectFit = it.fit;
          if (it.radius) v.style.borderRadius = `${it.radius}px`;
          d.appendChild(v);
          void v.play().catch(() => {});
        }
        const f = document.createElement('div');
        f.className = 'sw-fill';
        d.appendChild(f);
      } else {
        /* 盒子：外层是灰色占位（.sw-item 自带），内层 .sw-fill 装真实外观，随 is-styled 淡入 */
        d.classList.add('sw-item--rect');
        const f = document.createElement('div');
        f.className = 'sw-fill';
        if (it.bg !== 'rgba(0, 0, 0, 0)') f.style.backgroundColor = it.bg;
        if (it.bgImage) f.style.backgroundImage = it.bgImage;
        if (it.border) f.style.border = it.border;
        if (it.shadow) f.style.boxShadow = it.shadow;
        f.style.borderRadius = `${it.radius}px`;
        d.appendChild(f);
      }
      it.node = d;
      stage.appendChild(d);
      return d;
    };

    /** 按已打字数回填克隆里的文本节点 */
    const retype = (it: Item) => {
      if (!it.segs) return;
      let left = it.shown;
      for (const sg of it.segs) {
        const k = left <= 0 ? 0 : Math.min(left, sg.full.length);
        const want = sg.full.slice(0, k);
        if (sg.node.data !== want) sg.node.data = want;
        left -= k;
      }
    };

    const syncItem = (it: Item) => {
      if (!it.dirty) return;
      it.dirty = false;
      const d = ensureNode(it);
      const b = bounds(it);
      d.style.transform = `translate(${f1(b.x)}px,${f1(b.y)}px)`;
      if (it.draw) {
        /* 拖框阶段：跟着笔尖长，灰色占位 */
        d.style.width = `${f1(b.w)}px`;
        d.style.height = `${f1(b.h)}px`;
        d.classList.add('is-drawing');
        d.classList.remove('is-styled');
        return;
      }
      d.style.width = `${f1(it.w)}px`;
      d.style.height = `${f1(it.h)}px`;
      d.classList.remove('is-drawing');
      d.classList.toggle('is-styled', it.styled);
      d.classList.toggle('is-vis', it.vis);
      if (it.kind === 'text') retype(it);
      if (it.kind === 'image' && it.src) {
        const im = d.querySelector('img');
        if (im && !im.getAttribute('src')) im.src = it.src;
      }
    };

    /* ---------------------------------------------------------------- 拖到屏幕边界的收敛点 */
    const dragEnd = (it: Item) => {
      const x = it.x + it.w > vw - 16 ? Math.max(it.x + Math.min(it.w, 40), vw - 30) : it.x + it.w;
      const y = it.y + it.h > vh - 16 ? Math.max(it.y + Math.min(it.h, 40), vh - 40) : it.y + it.h;
      return { x: Math.min(x, it.x + it.w), y: Math.min(y, it.y + it.h) };
    };

    /* ---------------------------------------------------- drawBox（对齐源码 drawBox） */
    function* drawBox(c: Cur, it: Item): Generator<number | undefined, void, number> {
      c.shape = 'cross';
      yield* moveTo(c, { x: it.x, y: it.y });
      c.press = 1;
      it.vis = true;
      it.draw = { w: 0, h: 0 };
      it.dirty = true;
      c.ov = () => [selection(it)];
      yield* moveTo(c, dragEnd(it), {
        speed: 0.75, drag: true, bend: 0,
        onStep: () => {
          it.draw = { w: Math.max(0, c.x - it.x), h: Math.max(0, c.y - it.y) };
          it.dirty = true;
        },
      });
      const end = dragEnd(it);
      if (end.x < it.x + it.w - 0.5 || end.y < it.y + it.h - 0.5) {
        const w0 = it.draw!.w; const h0 = it.draw!.h;
        let k = 0;
        while (k < 1) {
          k = Math.min(1, k + (Number(yield) * TEMPO) / 0.5);
          const e = easeOut(k);
          it.draw = { w: w0 + (it.w - w0) * e, h: h0 + (it.h - h0) * e };
          it.dirty = true;
        }
      }
      it.draw = null;
      it.dirty = true;
      c.shape = 'arrow';
      yield* wait(rand(0.18, 0.3));
      /* 媒体只要有帧图或能播的 video 就显形，都没有则保持灰块 */
      it.styled = it.kind !== 'image' || !!it.src || !!it.mediaEl;
      it.dirty = true;
      yield* wait(it.kind === 'image' ? 0.5 : 0.35);
      c.ov = null;
      it.done = true;
    }

    /* --------------------------------------------------- drawText（对齐源码 drawText） */
    function* drawText(c: Cur, it: Item): Generator<number | undefined, void, number> {
      const b0 = bounds(it);
      c.shape = 'cross';
      yield* moveTo(c, { x: b0.x, y: b0.y });
      const lineH = Math.min(b0.h, it.font.lh);
      if (b0.w < 140 && it.h < it.font.lh * 1.6) {
        yield* click(c);
      } else {
        c.press = 1;
        const ghost: Box = { x: b0.x, y: b0.y, w: 0, h: 0 };
        c.ov = () => [{
          t: 'box', b: ghost, handles: true,
          badge: `${Math.round(ghost.w)} × ${Math.round(ghost.h)}`, rulerLines: true,
        }];
        yield* moveTo(c, { x: b0.x + b0.w, y: b0.y + lineH }, {
          speed: 0.9, drag: true, bend: 0,
          onStep: () => {
            ghost.w = Math.max(0, c.x - b0.x);
            ghost.h = Math.max(0, c.y - b0.y);
          },
        });
      }
      it.vis = true;
      it.shown = 0;
      it.dirty = true;
      c.shape = 'ibeam';
      c.ov = () => [{ t: 'box', b: bounds(it) }];
      yield* moveTo(c, { x: c.x + rand(-30, 10), y: c.y + rand(10, 30) }, { speed: 1.5 });
      yield* typeIt(it, c);
      yield* wait(0.12);
      c.shape = 'arrow';
      c.ov = () => [selection(it)];
      yield* wait(0.24);
      c.ov = null;
      it.done = true;
    }

    /* ------------------------------------------------------------------ 渲染 */
    const renderCursors = () => {
      for (const c of cursors) {
        const el = c.el;
        if (!el) continue;
        el.style.transform = `translate(${f1(c.x)}px,${f1(c.y)}px)`;
        const svg = c.svg;
        if (!svg) continue;
        if (c.shapeCache !== c.shape) {
          svg.innerHTML = cursorSVG(c.shape, c.color);
          c.shapeCache = c.shape;
          const [hx = 5, hy = 3.5] = HOT[c.shape] ?? [];
          c.hx = hx; c.hy = hy;
          svg.style.transformOrigin = `${hx}px ${hy}px`;
        }
        const s = 1 - c.press * 0.12;
        svg.style.transform = `translate(${-c.hx}px,${-c.hy}px) rotate(${f1(c.angle)}deg) scale(${s})`;
      }
    };

    const renderOverlay = () => {
      let s = '';
      let b = '';
      let needRuler = false;
      for (const c of cursors) {
        if (!c.ov) continue;
        for (const v of c.ov()) {
          if (v.t === 'box') {
            const { x, y, w, h } = v.b;
            s += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="none" stroke="${BLUE}" stroke-width="1"/>`;
            if (v.underline && v.underline.w > 0)
              s += `<line x1="${f1(v.underline.x)}" x2="${f1(v.underline.x + v.underline.w)}" y1="${f1(v.underline.y)}" y2="${f1(v.underline.y)}" stroke="${BLUE}" stroke-width="1.5"/>`;
            if (v.rulerLines) {
              needRuler = true;
              s += `<g stroke="${BLUE}" stroke-width="1" stroke-dasharray="2 2" opacity="${f1(rulersT)}">` +
                `<line x1="${RULER}" x2="${f1(x)}" y1="${f1(y + h / 2)}" y2="${f1(y + h / 2)}"/>` +
                `<line x1="${f1(x + w / 2)}" x2="${f1(x + w / 2)}" y1="${RULER}" y2="${f1(y)}"/></g>`;
            }
            if (v.handles)
              for (const [hx, hy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]])
                s += `<rect x="${f1(hx - 3.5)}" y="${f1(hy - 3.5)}" width="7" height="7" fill="#fff" stroke="${BLUE}" stroke-width="1"/>`;
            if (v.badge && w > 0)
              b += `<div class="sw-badge" style="left:${f1(x + w / 2)}px;top:${f1(y + h + 8)}px;background:${BLUE}">${v.badge}</div>`;
          } else {
            s += `<line x1="${f1(v.a.x)}" y1="${f1(v.a.y)}" x2="${f1(v.b.x)}" y2="${f1(v.b.y)}" stroke="#F24822" stroke-width="1"/>`;
            const horiz = v.a.y === v.b.y;
            b += `<div class="sw-badge" style="left:${f1(horiz ? (v.a.x + v.b.x) / 2 : v.a.x + 18)}px;` +
              `top:${f1(horiz ? v.a.y + 8 : (v.a.y + v.b.y) / 2 - 9)}px;background:#F24822">${v.label}</div>`;
          }
        }
      }
      if (ovSvg.innerHTML !== s) ovSvg.innerHTML = s;
      if (badgeBox.innerHTML !== b) badgeBox.innerHTML = b;
      return needRuler;
    };

    /** 标尺条：静态刻度（无滚动），选中时滑入 */
    const buildRulers = () => {
      let top = '';
      for (let x = 0; x <= vw; x += 50) {
        const major = x % 100 === 0;
        top += `<line x1="${x}" x2="${x}" y1="${major ? 13 : 16}" y2="${RULER}" stroke="#5E5E5E"/>`;
        if (major) top += `<text x="${x + 3}" y="11" class="sw-rtext">${x}</text>`;
      }
      rulerTop.innerHTML = top;
      let left = '';
      for (let y = 0; y <= vh; y += 50) {
        const major = y % 100 === 0;
        left += `<line y1="${y}" y2="${y}" x1="${major ? 13 : 16}" x2="${RULER}" stroke="#5E5E5E"/>`;
        if (major) left += `<text x="11" y="${y - 3}" class="sw-rtext" transform="rotate(-90 11 ${y - 3})">${y}</text>`;
      }
      rulerLeft.innerHTML = left;
    };

    /* ------------------------------------------------------------------ 主循环 */
    const step = (dt: number, now: number) => {
      time += dt;
      const center: Box = { x: vw / 2, y: vh * 0.45, w: 0, h: 0 };

      if (!started) {
        follow(dt, cursors, center, 0.7);
        /* 扫描完再停留一小拍，让环绕先看清，然后散开干活 */
        if (ready && performance.now() - startedAt > 1320) {
          started = true;
          for (const c of cursors) {
            c.follow = false;
            c.angle = ((((c.angle + 180) % 360) + 360) % 360) - 180;
          }
        }
        return;
      }

      /* 空闲光标领任务（自上而下） */
      const avail = items.filter((t) => !t.done && !t.vis);
      for (const c of cursors) {
        if (c.task || c.follow || !avail.length) continue;
        const t = avail.shift()!;
        c.task = t;
        c.taskStart = performance.now();
        c.gen = t.kind === 'text' ? drawText(c, t) : drawBox(c, t);
      }

      for (const c of cursors) {
        c.press = Math.max(0, c.press - dt * 6);
        /* 兜底：单个任务超时就直接收成成品，避免某一只光标把整场拖长 */
        if (c.task && now - c.taskStart > 1400) {
          const t = c.task;
          t.vis = true;
          t.draw = null;
          if (t.kind === 'text') t.shown = totalChars(t);
          else t.styled = true;
          t.done = true;
          t.dirty = true;
          c.task = null; c.gen = null; c.ov = null; c.shape = 'arrow';
          continue;
        }
        if (c.angle !== 0 && !c.gen) c.angle = Math.abs(c.angle) < 0.5 ? 0 : c.angle * (1 - Math.min(1, dt * 10));
        if (!c.gen) continue;
        if (c.gen.next(dt).done) {
          c.gen = null;
          if (c.task) { c.task = null; c.ov = null; c.shape = 'arrow'; }
        }
      }

      /* 干完活 / 没领到活的光标回到中心小圈继续环绕，别僵在原地；
         收尾时全员归巢，也让揭幕前画面保持活着的感觉 */
      const idle = cursors.filter((c) => !c.gen && !c.task);
      if (idle.length) follow(dt, idle, center, 0.42);
    };

    const finish = () => {
      if (done) return;
      done = true;
      setLeaving(true);
      unmountTimer = window.setTimeout(() => setVisible(false), FADE_MS + 80);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!done && now - startedAt > MAX_MS) { finish(); return; }

      step(dt, now);

      /* 标尺：有选区需要时淡入 */
      const need = started && cursors.some((c) => c.ov && c.ov().some((v) => v.t === 'box' && v.rulerLines));
      if (need) rulersNeed = true;
      rulersT += ((need || rulersNeed ? 1 : 0) - rulersT) * Math.min(1, dt * 10);
      if (Math.abs(rulersT) < 0.002) rulersT = 0;
      rulerTop.style.opacity = `${f1(rulersT)}`;
      rulerLeft.style.opacity = `${f1(rulersT)}`;

      for (const it of items) syncItem(it);
      renderCursors();
      const stillNeed = renderOverlay();
      if (!stillNeed && !need) rulersNeed = false;

      if (started && items.every((t) => t.done)) {
        if (!holdAt) holdAt = now;
        if (now - holdAt > 900) {
          finish();
          return;
        }
      }
      raf = requestAnimationFrame(frame);
    };

    /* 先量好首屏，再开跑 */
    /* 光标立刻入场环绕；等页面自己的 reveal 动效（0.8s + 最多 0.36s 延迟）落定后再扫描，
       否则标题/段落还在 opacity 0、translateY(22px) 的初始态，会漏采或位置偏 22px */
    const t0 = performance.now();
    last = t0;
    startedAt = t0;
    raf = requestAnimationFrame(frame);
    const boot = window.setTimeout(() => {
      items = collectItems(vh);
      buildRulers();
      ready = true;
    }, 900);

    /* 补帧：视频首帧常常晚于扫描才解码好，隔一段时间再抓一次 */
    const refill = window.setInterval(() => {
      if (done) return;
      for (const it of items) {
        if (it.kind !== 'image' || it.src || !it.mediaEl) continue;
        const f = grabVideoFrame(it.mediaEl);
        if (!f) continue;
        it.src = f;
        it.styled = true;
        it.dirty = true;
      }
    }, 350);

    const onSkip = () => finish();
    window.addEventListener('pointerdown', onSkip);
    window.addEventListener('wheel', onSkip, { passive: true });
    window.addEventListener('keydown', onSkip);

    return () => {
      window.clearTimeout(boot);
      window.clearInterval(refill);
      window.clearTimeout(unmountTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', onSkip);
      window.removeEventListener('wheel', onSkip);
      window.removeEventListener('keydown', onSkip);
      document.querySelectorAll('[data-swarm]').forEach((el) => el.removeAttribute('data-swarm'));
      host.replaceChildren();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`swarm-intro${leaving ? ' is-leaving' : ''}`} role="presentation">
      <div className="swarm-intro__host" ref={hostRef} aria-hidden="true" />
      <span className="swarm-intro__skip">跳过</span>
    </div>
  );
}
