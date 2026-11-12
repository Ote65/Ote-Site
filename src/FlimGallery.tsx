import React, { useEffect, useRef, useState } from 'react';
import './flimgallery.css';

/* =========================================================================
   片边预设：数据与几何 1:1 移植自
   SpektrafilmSwift-ios/SpektraMobile/Sources/Design/FilmBorder.swift
   （MFilmBorderGauge / Perf / Base / Corner / Preset / Renderer）
   ========================================================================= */

type RGB = [number, number, number];

type GaugeId =
  | 'full135'
  | 'half135'
  | 'xpan'
  | 'roll645'
  | 'roll66'
  | 'roll67'
  | 'roll69'
  | 'sheet45'
  | 'cart110'
  | 'cine16'
  | 'cine35';

type PerfId = 'none' | 'ks' | 'bh' | 'single110' | 'single16';
type BaseId = 'colorNegative' | 'bw' | 'reversal' | 'graphite' | 'clear' | 'ivory';
type CornerId = 'square' | 'rounded' | 'chamfer' | 'ear';
type ToneId = 'auto' | 'orange' | 'green' | 'white' | 'black';

type GaugeSpec = {
  label: string;
  /** 画幅长边（mm），照片长边按此规格等比换算 */
  longMM: number;
  perf: PerfId;
  /** 画幅宽高比，预设缩略图按此取景 */
  aspect: number;
  /** 视觉比例下片边占长边的比例：齿孔侧 / 画幅两端 */
  visual: [number, number];
  suffix: string;
};

const GAUGES: Record<GaugeId, GaugeSpec> = {
  full135: { label: '135 全画幅', longMM: 36, perf: 'ks', aspect: 3 / 2, visual: [0.075, 0.012], suffix: '' },
  half135: { label: '135 半格', longMM: 24, perf: 'ks', aspect: 2 / 3, visual: [0.085, 0.035], suffix: 'HALF' },
  xpan: { label: 'XPan 宽幅', longMM: 65, perf: 'ks', aspect: 65 / 24, visual: [0.055, 0.01], suffix: 'XPAN' },
  roll645: { label: '120 645', longMM: 56, perf: 'none', aspect: 4 / 3, visual: [0.03, 0.014], suffix: '120' },
  roll66: { label: '120 6×6', longMM: 56, perf: 'none', aspect: 1, visual: [0.055, 0.022], suffix: '120' },
  roll67: { label: '120 6×7', longMM: 70, perf: 'none', aspect: 7 / 6, visual: [0.075, 0.028], suffix: '120' },
  roll69: { label: '120 6×9', longMM: 84, perf: 'none', aspect: 3 / 2, visual: [0.04, 0.035], suffix: '120' },
  sheet45: { label: '4×5 页片', longMM: 127, perf: 'none', aspect: 5 / 4, visual: [0.03, 0.03], suffix: '' },
  cart110: { label: '110 暗盒', longMM: 17, perf: 'single110', aspect: 17 / 13, visual: [0.09, 0.07], suffix: '110' },
  cine16: { label: '16mm 电影', longMM: 10.26, perf: 'single16', aspect: 4 / 3, visual: [0.075, 0.012], suffix: '16MM' },
  cine35: { label: '35mm 电影', longMM: 22, perf: 'bh', aspect: 16 / 9, visual: [0.115, 0.014], suffix: '35MM' },
};

type PerfSpec = {
  label: string;
  lengthMM: number;
  heightMM: number;
  pitchMM: number;
  single: boolean;
  oneEdge: boolean;
  barrel: boolean;
};

const PERFS: Record<PerfId, PerfSpec> = {
  none: { label: '—', lengthMM: 0, heightMM: 0, pitchMM: 0, single: false, oneEdge: false, barrel: false },
  ks: { label: 'KS-1870', lengthMM: 2.79, heightMM: 1.98, pitchMM: 4.75, single: false, oneEdge: false, barrel: false },
  bh: { label: 'BH-1866', lengthMM: 2.79, heightMM: 1.85, pitchMM: 4.75, single: false, oneEdge: false, barrel: true },
  single110: { label: '110 单孔', lengthMM: 3, heightMM: 2, pitchMM: 17, single: true, oneEdge: true, barrel: false },
  single16: { label: '16mm 单孔', lengthMM: 1.83, heightMM: 1.37, pitchMM: 7.62, single: true, oneEdge: true, barrel: false },
};

/* 片基 sRGB 基色：与 iOS 渲染器同一组数值 */
const BASES: Record<BaseId, RGB> = {
  colorNegative: [0.046, 0.04, 0.033],
  bw: [0.036, 0.035, 0.032],
  reversal: [0.02, 0.019, 0.017],
  graphite: [0.2, 0.205, 0.215],
  clear: [0.6, 0.46, 0.29],
  ivory: [0.86, 0.82, 0.73],
};

type BorderPreset = {
  id: string;
  name: string;
  note: string;
  gauge: GaugeId;
  base: BaseId;
  corner: CornerId;
  tone: ToneId;
  dx: boolean;
  borderScale?: number;
  cornerScale?: number;
  perfScale?: number;
  perfPitch?: number;
  textScale?: number;
  frameNumbers?: boolean;
  edgeText?: boolean;
  notch?: boolean;
};

/** 与 MFilmBorderPreset.all 顺序、名称、备注一致 */
const PRESETS: BorderPreset[] = [
  { id: 'none', name: '无片边', note: '关闭片边，只看画面', gauge: 'full135', base: 'colorNegative', corner: 'square', tone: 'auto', dx: false, edgeText: false },
  { id: 'kodak135', name: '135 方格', note: 'KS 双排孔 · 琥珀边码', gauge: 'full135', base: 'colorNegative', corner: 'square', tone: 'auto', dx: true },
  { id: 'half135', name: '135 半格', note: '宽边 · 密孔 · 切角', gauge: 'half135', base: 'colorNegative', corner: 'chamfer', tone: 'white', dx: true, cornerScale: 0.7, perfScale: 1.2, perfPitch: 0.82, textScale: 1.05 },
  { id: 'xpan', name: 'XPan', note: '窄边 · 冷黑 · 疏孔', gauge: 'xpan', base: 'reversal', corner: 'square', tone: 'white', dx: true, perfScale: 0.82, perfPitch: 1.22, textScale: 0.86 },
  { id: 'roll645', name: '645', note: '120 薄边 · 圆角', gauge: 'roll645', base: 'colorNegative', corner: 'rounded', tone: 'auto', dx: false, borderScale: 0.85, cornerScale: 1.4, textScale: 0.9 },
  { id: 'roll66', name: '6×6', note: '120 中性黑 · 细字', gauge: 'roll66', base: 'bw', corner: 'square', tone: 'white', dx: false, textScale: 1.15 },
  { id: 'roll67', name: '6×7', note: '120 灰片基 · 切角', gauge: 'roll67', base: 'graphite', corner: 'chamfer', tone: 'auto', dx: false, borderScale: 1.1 },
  { id: 'roll69', name: '6×9', note: '120 琥珀片基 · 宽端边', gauge: 'roll69', base: 'clear', corner: 'square', tone: 'auto', dx: false, borderScale: 1.15, textScale: 1.05 },
  { id: 'sheet45', name: '4×5', note: '页片 · 缺口码', gauge: 'sheet45', base: 'bw', corner: 'square', tone: 'white', dx: false, edgeText: false, notch: true },
  { id: 'cine35', name: '35mm 电影', note: 'BH 桶孔 · 宽边 · 圆片门', gauge: 'cine35', base: 'reversal', corner: 'rounded', tone: 'white', dx: false, borderScale: 1.1, cornerScale: 1.8, textScale: 0.85 },
  { id: 'cine16', name: '16mm 电影', note: '单排小孔 · 窄边无编号', gauge: 'cine16', base: 'bw', corner: 'square', tone: 'white', dx: false, borderScale: 0.8, textScale: 0.75, frameNumbers: false },
  { id: 'cart110', name: '110', note: '暖白片基 · 单孔 · 圆角', gauge: 'cart110', base: 'ivory', corner: 'rounded', tone: 'black', dx: false, borderScale: 1.05, cornerScale: 0.8, textScale: 0.9 },
];

/* ------------------------------ 显影样张 ------------------------------ */

/** 样张目录：独立复用时只需改这一处（Demo 里改成相对路径） */
const MEDIA_BASE = '/media/preview';

type Photo = {
  id: string;
  src: string;
  title: string;
  en: string;
  ratio: string;
};

const PHOTOS: Photo[] = [
  { id: '01', src: `${MEDIA_BASE}/01-seaside.webp`, title: '海边枝叶', en: 'SEASIDE', ratio: '3 : 4' },
  { id: '02', src: `${MEDIA_BASE}/02-skyline.webp`, title: '黄昏天际线', en: 'SKYLINE', ratio: '4 : 3' },
  { id: '03', src: `${MEDIA_BASE}/03-plant-bw.webp`, title: '黑白绿植', en: 'MONO PLANT', ratio: '4 : 5' },
  { id: '04', src: `${MEDIA_BASE}/04-corridor.webp`, title: '午后长廊', en: 'CORRIDOR', ratio: '3 : 4' },
  { id: '05', src: `${MEDIA_BASE}/05-silhouette.webp`, title: '逆光剪影', en: 'SILHOUETTE', ratio: '7 : 10' },
  { id: '06', src: `${MEDIA_BASE}/06-window.webp`, title: '窗外树影', en: 'WINDOW', ratio: '3 : 4' },
];

/* ------------------------------ 基础工具 ------------------------------ */

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const css = (c: RGB, a = 1) =>
  `rgba(${Math.round(clamp(c[0], 0, 1) * 255)},${Math.round(clamp(c[1], 0, 1) * 255)},${Math.round(
    clamp(c[2], 0, 1) * 255
  )},${a})`;

/** FNV-1a + mulberry32：片边纹理可复现（对应 MFilmBorderRandom） */
function makeRandom(seed: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = (h + 0x6d2b79f5) >>> 0;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function baseSwatch(base: BaseId, brightness = 0): RGB {
  const gain = 1 + brightness * 0.45;
  const c = BASES[base];
  return [clamp(c[0] * gain, 0.008, 0.92), clamp(c[1] * gain, 0.008, 0.92), clamp(c[2] * gain, 0.008, 0.92)];
}

function luminance(c: RGB) {
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function textRGB(tone: ToneId, base: BaseId): RGB {
  let rgb: RGB;
  switch (tone) {
    case 'orange':
      rgb = [0.93, 0.66, 0.27];
      break;
    case 'green':
      rgb = [0.3, 0.66, 0.42];
      break;
    case 'white':
      rgb = [0.88, 0.85, 0.78];
      break;
    case 'black':
      rgb = [0.06, 0.06, 0.05];
      break;
    default:
      rgb = [0.92, 0.63, 0.24];
  }
  const lum = luminance(baseSwatch(base));
  // 深色片基上的深色字自动抬亮；浅色片基同理压暗。
  if (lum < 0.28 && rgb[0] < 0.25 && rgb[1] < 0.25 && rgb[2] < 0.25) rgb = [0.82, 0.79, 0.71];
  if (lum > 0.4 && rgb[0] > 0.7) rgb = [0.12, 0.1, 0.08];
  return rgb;
}

function perfRGB(base: BaseId): RGB {
  const darkBase = luminance(baseSwatch(base)) < 0.3;
  const value = darkBase ? 0.93 : 0.1;
  if (darkBase) return [value, Math.min(0.98, value * 0.985), Math.min(0.98, value * 0.94)];
  return [value, value, value * 0.96];
}

type Layout = {
  cw: number;
  ch: number;
  ax: number;
  ay: number;
  aw: number;
  ah: number;
  marginX: number;
  marginY: number;
  margin: number;
  pxPerMM: number;
  alongX: boolean;
  gauge: GaugeSpec;
};

function layoutFor(pw: number, ph: number, preset: BorderPreset): Layout {
  const gauge = GAUGES[preset.gauge];
  const longSide = Math.max(pw, ph);
  const shortSide = Math.min(pw, ph);
  const pxPerMM = longSide / gauge.longMM;
  const scale = preset.borderScale ?? 1;
  let marginPerf = longSide * gauge.visual[0] * scale;
  let marginEnd = longSide * gauge.visual[1] * scale;
  marginPerf = Math.min(marginPerf, shortSide * 0.3);
  marginEnd = Math.min(marginEnd, longSide * 0.12);
  const alongX = pw >= ph;
  const marginX = alongX ? marginEnd : marginPerf;
  const marginY = alongX ? marginPerf : marginEnd;
  return {
    cw: pw + marginX * 2,
    ch: ph + marginY * 2,
    ax: marginX,
    ay: marginY,
    aw: pw,
    ah: ph,
    marginX,
    marginY,
    margin: alongX ? marginY : marginX,
    pxPerMM,
    alongX,
    gauge,
  };
}

function frameLabel(photoId: string, gauge: GaugeId): string {
  const rand = makeRandom(`frame-${photoId}-${gauge}`);
  if (gauge === 'sheet45') return '4×5';
  let max = 36;
  if (gauge === 'roll645') max = 15;
  else if (gauge === 'roll66') max = 11;
  else if (gauge === 'roll67') max = 9;
  else if (gauge === 'roll69') max = 7;
  const n = 1 + Math.floor(rand() * max);
  if (gauge === 'full135' || gauge === 'half135' || gauge === 'cine35' || gauge === 'cine16') {
    return rand() > 0.5 ? `${n}` : `${n}A`;
  }
  return `${n}`;
}

/* ------------------------------ Canvas 路径 ------------------------------ */

function roundedPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function barrelPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const bulge = w * 0.16;
  ctx.beginPath();
  ctx.moveTo(x + bulge, y);
  ctx.lineTo(x + w - bulge, y);
  ctx.quadraticCurveTo(x + w + bulge * 0.35, y + h / 2, x + w - bulge, y + h);
  ctx.lineTo(x + bulge, y + h);
  ctx.quadraticCurveTo(x - bulge * 0.35, y + h / 2, x + bulge, y);
  ctx.closePath();
}

function perfPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, barrel: boolean) {
  if (barrel) barrelPath(ctx, x, y, w, h);
  else roundedPath(ctx, x, y, w, h, Math.min(w, h) * 0.22);
}

function aperturePath(ctx: CanvasRenderingContext2D, l: Layout, corner: CornerId, scale: number) {
  const { ax, ay, aw, ah } = l;
  const short = Math.min(aw, ah);
  switch (corner) {
    case 'rounded':
      roundedPath(ctx, ax, ay, aw, ah, short * 0.02 * scale);
      break;
    case 'chamfer': {
      const cut = short * 0.045 * scale;
      ctx.beginPath();
      ctx.moveTo(ax + cut, ay);
      ctx.lineTo(ax + aw - cut, ay);
      ctx.lineTo(ax + aw, ay + cut);
      ctx.lineTo(ax + aw, ay + ah - cut);
      ctx.lineTo(ax + aw - cut, ay + ah);
      ctx.lineTo(ax + cut, ay + ah);
      ctx.lineTo(ax, ay + ah - cut);
      ctx.lineTo(ax, ay + cut);
      ctx.closePath();
      break;
    }
    case 'ear': {
      const bite = short * 0.055 * scale;
      const deep = bite * 1.3;
      ctx.beginPath();
      ctx.moveTo(ax + bite, ay);
      ctx.lineTo(ax + aw - bite, ay);
      ctx.quadraticCurveTo(ax + aw - deep, ay + deep, ax + aw, ay + bite);
      ctx.lineTo(ax + aw, ay + ah - bite);
      ctx.quadraticCurveTo(ax + aw - deep, ay + ah - deep, ax + aw - bite, ay + ah);
      ctx.lineTo(ax + bite, ay + ah);
      ctx.quadraticCurveTo(ax + deep, ay + ah - deep, ax, ay + ah - bite);
      ctx.lineTo(ax, ay + bite);
      ctx.quadraticCurveTo(ax + deep, ay + deep, ax + bite, ay);
      ctx.closePath();
      break;
    }
    default:
      ctx.beginPath();
      ctx.rect(ax, ay, aw, ah);
  }
}

/* ------------------------------ 文字 ------------------------------ */

const EDGE_FONT = "'HelveticaNeue-CondensedBold','Helvetica Neue Condensed Bold','Arial Narrow','Helvetica Neue',Arial,sans-serif";

function setEdgeFont(ctx: CanvasRenderingContext2D, size: number, tracking: number) {
  ctx.font = `700 ${size}px ${EDGE_FONT}`;
  try {
    (ctx as unknown as { letterSpacing: string }).letterSpacing = `${tracking}px`;
  } catch {
    /* 旧浏览器忽略字距 */
  }
}

function measure(ctx: CanvasRenderingContext2D, text: string, size: number, tracking: number) {
  setEdgeFont(ctx, size, tracking);
  return ctx.measureText(text).width;
}

function drawEdgeLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color: RGB,
  tracking: number,
  rotation = 0
) {
  if (!text) return;
  setEdgeFont(ctx, size, tracking);
  ctx.fillStyle = css(color, 0.94);
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  if (rotation === 0) {
    ctx.fillText(text, x, y);
    return;
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

/* ------------------------------ 渲染器 ------------------------------ */

type RenderOptions = {
  /** 照片长边渲染像素 */
  photoLong: number;
  /** 边码 / 画幅号的随机种子来源，同一张照片每次渲染结果一致 */
  photoId: string;
  /** 芯片预览：按画幅比例裁切照片，纹理更少 */
  cropToGauge?: boolean;
};

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const ir = iw / ih;
  const tr = dw / dh;
  let sx = 0;
  let sy = 0;
  let sw = iw;
  let sh = ih;
  if (ir > tr) {
    sw = ih * tr;
    sx = (iw - sw) / 2;
  } else {
    sh = iw / tr;
    sy = (ih - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function renderFilmFrame(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  preset: BorderPreset,
  options: RenderOptions
) {
  const ctx = canvas.getContext('2d');
  // 图片损坏 / 尚未解码时直接跳过，避免 0 尺寸参与几何计算产生 NaN
  if (!ctx || !img.naturalWidth || !img.naturalHeight) return;

  let pw: number;
  let ph: number;
  if (options.cropToGauge) {
    const aspect = GAUGES[preset.gauge].aspect;
    if (aspect >= 1) {
      pw = options.photoLong;
      ph = options.photoLong / aspect;
    } else {
      ph = options.photoLong;
      pw = options.photoLong * aspect;
    }
  } else {
    const scale = options.photoLong / Math.max(img.naturalWidth, img.naturalHeight);
    pw = img.naturalWidth * scale;
    ph = img.naturalHeight * scale;
  }

  const l = layoutFor(pw, ph, preset);
  canvas.width = Math.max(1, Math.round(l.cw));
  canvas.height = Math.max(1, Math.round(l.ch));

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (preset.id === 'none') {
    drawCover(ctx, img, 0, 0, canvas.width, canvas.height);
    return;
  }

  const base = baseSwatch(preset.base);

  /* 片基：细腻的竖向明暗，再叠极轻的颗粒起伏 */
  const grad = ctx.createLinearGradient(0, 0, 0, l.ch);
  grad.addColorStop(0, css([Math.min(1, base[0] * 1.1), Math.min(1, base[1] * 1.1), Math.min(1, base[2] * 1.1)]));
  grad.addColorStop(1, css([base[0] * 0.94, base[1] * 0.94, base[2] * 0.94]));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, l.cw, l.ch);

  const rand = makeRandom(`base-texture-${preset.gauge}-${preset.base}`);
  const specks = options.cropToGauge ? 70 : 240;
  for (let i = 0; i < specks; i++) {
    const x = rand() * l.cw;
    const y = rand() * l.ch;
    const r = Math.max(0.4, l.pxPerMM * (0.015 + rand() * 0.035));
    const light = rand() > 0.5;
    ctx.fillStyle = light ? `rgba(255,247,230,${0.015 + rand() * 0.03})` : `rgba(0,0,0,${0.015 + rand() * 0.03})`;
    ctx.fillRect(x, y, r, r);
  }

  /* 画幅：按角型裁切照片 */
  aperturePath(ctx, l, preset.corner, preset.cornerScale ?? 1);
  ctx.save();
  ctx.clip();
  drawCover(ctx, img, l.ax, l.ay, l.aw, l.ah);
  ctx.restore();

  /* 画幅边缘的密度线 */
  aperturePath(ctx, l, preset.corner, preset.cornerScale ?? 1);
  ctx.strokeStyle = 'rgba(5,4,3,0.65)';
  ctx.lineWidth = Math.max(0.6, l.pxPerMM * 0.12);
  ctx.stroke();

  /* 齿孔 */
  const perf = PERFS[l.gauge.perf];
  if (perf !== PERFS.none) {
    const margin = l.margin;
    const holeHeight = Math.min(margin * 0.42 * (preset.perfScale ?? 1), margin * 0.46);
    const holeLength = holeHeight * 1.3;
    const pitch = holeLength * 3.05 * (preset.perfPitch ?? 1);
    if (holeLength > 0.5 && holeHeight > 0.5) {
      const alongLength = l.alongX ? l.aw : l.ah;
      const photoLong = l.pxPerMM * l.gauge.longMM;
      const count = perf.single
        ? Math.max(1, Math.round(alongLength / Math.max(1, photoLong)))
        : Math.max(2, Math.round(alongLength / pitch));
      const step = Math.max(pitch, holeLength);
      const span = Math.max(0, count - 1) * step;
      const start = (l.alongX ? l.ax : l.ay) + (alongLength - span) / 2;
      const color = perfRGB(preset.base);
      ctx.fillStyle = css(color);

      const edges = perf.oneEdge
        ? [margin * 0.5]
        : [margin * 0.72, (l.alongX ? l.ch : l.cw) - margin * 0.72];

      for (const edge of edges) {
        for (let i = 0; i < count; i++) {
          const center = start + i * step + holeLength / 2;
          if (l.alongX) {
            perfPath(ctx, center - holeLength / 2, edge - holeHeight / 2, holeLength, holeHeight, perf.barrel);
          } else {
            perfPath(ctx, edge - holeHeight / 2, center - holeLength / 2, holeHeight, holeLength, perf.barrel);
          }
          ctx.fill();
        }
      }
    }
  }

  /* 边字 */
  const tone = textRGB(preset.tone, preset.base);
  const margin = l.margin;
  const textScale = preset.textScale ?? 1;
  const oneEdge = perf.oneEdge;
  let fontSize = Math.max(4, Math.min(260, margin * 0.46 * textScale));
  const label = `SPEKTRAFILM${l.gauge.suffix ? ` ${l.gauge.suffix}` : ''}`;
  const number = frameLabel(options.photoId, preset.gauge);
  const tracking = (size: number) => size * 0.14;

  if (l.alongX) {
    const numberSize = fontSize * 0.9;
    let numberWidth = preset.frameNumbers === false ? 0 : measure(ctx, number, numberSize, tracking(numberSize)) + fontSize * 1.1;
    const available = l.cw - l.marginX * 2 - numberWidth;
    if (preset.edgeText !== false && available > 0) {
      const width = measure(ctx, label, fontSize, tracking(fontSize));
      if (width > available) {
        fontSize = Math.max(4, (fontSize * available) / width);
        numberWidth =
          preset.frameNumbers === false
            ? 0
            : measure(ctx, number, fontSize * 0.9, tracking(fontSize * 0.9)) + fontSize * 1.1;
      }
    }
    const baseline = oneEdge ? l.ch - margin * 0.12 - fontSize * 0.72 : margin * 0.12 + fontSize * 0.72;
    if (preset.edgeText !== false) {
      drawEdgeLabel(ctx, label, l.ax, baseline, fontSize, tone, tracking(fontSize));
    }
    if (preset.frameNumbers !== false) {
      drawEdgeLabel(ctx, number, l.ax + l.aw - numberWidth + fontSize * 0.1, baseline, fontSize * 0.9, tone, tracking(fontSize * 0.9));
    }
  } else {
    if (preset.edgeText !== false) {
      const available = l.ah - fontSize * 0.5;
      const length = measure(ctx, label, fontSize, tracking(fontSize));
      if (length > available) fontSize = Math.max(4, (fontSize * available) / length);
      const lengthNow = measure(ctx, label, fontSize, tracking(fontSize));
      const baselineX = oneEdge ? l.cw - l.marginX * 0.12 - fontSize * 0.72 : l.marginX * 0.12 + fontSize * 0.72;
      drawEdgeLabel(
        ctx,
        label,
        baselineX,
        oneEdge ? l.ay : l.ay + lengthNow,
        fontSize,
        tone,
        tracking(fontSize),
        oneEdge ? Math.PI / 2 : -Math.PI / 2
      );
    }
    if (preset.frameNumbers !== false && !preset.dx) {
      const size = fontSize * 0.9;
      const numberX = oneEdge ? l.marginX * 0.12 + size * 0.72 : l.cw - l.marginX * 0.12 - size * 0.72;
      drawEdgeLabel(ctx, number, numberX, l.ay + size, size, tone, tracking(size), oneEdge ? -Math.PI / 2 : Math.PI / 2);
    }
  }

  /* 琥珀边码：真实负片片边的那条色带 */
  if (preset.dx) {
    const thickness = margin * 0.28;
    if (thickness > 0.5) {
      const length = l.alongX ? l.aw : l.ah;
      const codeRand = makeRandom(`edgecode-${options.photoId}-${preset.id}`);
      if (l.alongX) {
        const bandY = l.ch - margin * 0.4;
        ctx.fillStyle = css(tone, 0.92);
        ctx.fillRect(l.ax, bandY, l.aw, thickness);
        ctx.fillStyle = css(base);
        let cursor = 0;
        while (cursor < length) {
          cursor += length * (0.012 + codeRand() * 0.043);
          const w = length * (0.004 + codeRand() * 0.022);
          if (cursor + w >= length) break;
          ctx.fillRect(l.ax + cursor, bandY, w, thickness);
          cursor += w;
        }
        if (preset.frameNumbers !== false) {
          const size = Math.max(4, thickness * 0.82);
          const alternate = number.endsWith('A') ? number.slice(0, -1) : `${number}A`;
          drawEdgeLabel(ctx, number, l.ax + length * 0.05, bandY + thickness * 0.76, size, base, size * 0.1);
          drawEdgeLabel(ctx, alternate, l.ax + length * 0.52, bandY + thickness * 0.76, size, base, size * 0.1);
        }
      } else {
        const bandX = l.cw - margin * 0.4;
        ctx.fillStyle = css(tone, 0.92);
        ctx.fillRect(bandX, l.ay, thickness, l.ah);
        ctx.fillStyle = css(base);
        let cursor = 0;
        while (cursor < length) {
          cursor += length * (0.012 + codeRand() * 0.043);
          const w = length * (0.004 + codeRand() * 0.022);
          if (cursor + w >= length) break;
          ctx.fillRect(bandX, l.ay + cursor, thickness, w);
          cursor += w;
        }
        if (preset.frameNumbers !== false) {
          const size = Math.max(4, thickness * 0.82);
          drawEdgeLabel(
            ctx,
            number,
            bandX + thickness * 0.76,
            l.ay + length * 0.05 + size,
            size,
            base,
            size * 0.1,
            Math.PI / 2
          );
        }
      }
    }
  }

  /* 4×5 页片的缺口码 */
  if (preset.notch) {
    const color = perfRGB(preset.base);
    ctx.fillStyle = css(color, 0.92);
    const unit = l.pxPerMM * 1.6;
    const right = l.cw - l.marginX * 0.55;
    const top = l.marginY * 0.1;
    ctx.fillRect(right - unit * 3.6, top, unit, unit);
    ctx.beginPath();
    ctx.moveTo(right - unit * 2.1, top);
    ctx.lineTo(right - unit * 1.55, top + unit * 1.5);
    ctx.lineTo(right - unit, top);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(right - unit * 0.55 + unit * 0.45, top + unit * 0.45, unit * 0.45, unit * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
  }

}

/* ------------------------------ 组件 ------------------------------ */

function BorderChip({
  preset,
  photo,
  photoId,
  active,
  onSelect,
}: {
  preset: BorderPreset;
  photo?: HTMLImageElement;
  photoId: string;
  active: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !photo) return;
    renderFilmFrame(canvas, photo, preset, { photoLong: 210, photoId, cropToGauge: true });
  }, [photo, photoId, preset]);

  return (
    <button
      type="button"
      className={`flim-chip${active ? ' on' : ''}`}
      onClick={onSelect}
      aria-pressed={active}
      title={`${preset.name} · ${preset.note}`}
    >
      <span className="flim-chip-canvas">
        <canvas ref={ref} aria-hidden="true" />
      </span>
      <b>{preset.name}</b>
    </button>
  );
}

export default function FlimGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef(0);
  const [entered, setEntered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [images, setImages] = useState<Record<number, HTMLImageElement>>({});
  const [photoIndex, setPhotoIndex] = useState(0);
  const [borderCursor, setBorderCursor] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const active = playing && entered && visible;
  const borderIndex = (borderCursor + Math.floor(elapsed / 2000)) % PRESETS.length;
  const preset = PRESETS[borderIndex];
  const photo = PHOTOS[photoIndex];
  const image = images[photoIndex];
  const ready = Boolean(image);

  /* 进入视口再开始轮播；离开视口自动停表。
     隐藏标签页 / 零视口环境里 IntersectionObserver 可能一直不回调，
     用一次超时兜底，保证观看台仍能加载样张。 */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setEntered(true);
      setVisible(true);
      return;
    }
    let touched = false;
    const io = new IntersectionObserver(
      (entries) => {
        touched = true;
        const entry = entries[0];
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setEntered(true);
      },
      { threshold: 0.16 }
    );
    io.observe(el);
    const fallback = window.setTimeout(() => {
      if (!touched) {
        setEntered(true);
        setVisible(true);
      }
    }, 1600);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  /* 预加载显影样张 */
  useEffect(() => {
    if (!entered) return;
    let alive = true;
    PHOTOS.forEach((p, i) => {
      const img = new Image();
      img.src = p.src;
      const done = () => {
        if (!alive || !img.naturalWidth || !img.naturalHeight) return;
        setImages((prev) => (prev[i] ? prev : { ...prev, [i]: img }));
      };
      if (typeof img.decode === 'function') img.decode().then(done, done);
      else img.onload = done;
    });
    return () => {
      alive = false;
    };
  }, [entered]);

  /* 6 秒一张，2 秒换一片边；暂停时冻结进度 */
  useEffect(() => {
    if (!active) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      clockRef.current += now - last;
      last = now;
      if (clockRef.current >= 6000) {
        clockRef.current -= 6000;
        setPhotoIndex((i) => (i + 1) % PHOTOS.length);
        setBorderCursor((c) => (c + 3) % PRESETS.length);
      }
      setElapsed(clockRef.current);
    }, 80);
    return () => window.clearInterval(id);
  }, [active]);

  /* 主画面重绘 */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    renderFilmFrame(canvas, image, preset, { photoLong: 1500, photoId: photo.id });
  }, [image, preset, photo.id]);

  const freeze = () => {
    setPlaying(false);
    clockRef.current = 0;
    setElapsed(0);
  };

  const selectBorder = (index: number) => {
    freeze();
    setBorderCursor(index);
  };

  const selectPhoto = (index: number) => {
    freeze();
    setPhotoIndex(index);
  };

  const stepPhoto = (delta: number) => {
    freeze();
    setPhotoIndex((i) => (i + delta + PHOTOS.length) % PHOTOS.length);
  };

  const togglePlay = () => {
    setPlaying((p) => !p);
  };

  const progress = clamp(elapsed / 6000, 0, 1);

  return (
    <section className="of-section flim-gallery" id="preview" ref={sectionRef}>
      <div className="wrap">
        <div className="flim-head">
          <div className="flim-head-copy reveal">
            <div className="kicker amber">EFFECT PREVIEW · 显影样张</div>
            <h2>把照片，放回胶片上看。</h2>
            <p className="of-lead">
              下面这些照片都由欧胶片从 RAW 显影而来。让它自己轮播：每张停 6 秒，片边每 2 秒换一种；
              点任意片边，或换一张照片，就停下来慢慢看。
            </p>
          </div>
          <div className="flim-auto reveal d1">
            <div className={`flim-auto-state${active ? ' on' : ''}`}>
              <i />
              {playing ? '自动轮播中' : '已暂停'}
            </div>
            <div className="flim-auto-rule">
              <span>PHOTO 6s</span>
              <em />
              <span>BORDER 2s</span>
            </div>
          </div>
        </div>

        <div className="flim-stage reveal d1">
          <div className="flim-stage-bar">
            <div className="flim-counter">
              <b>{photo.id}</b>
              <span>/ {String(PHOTOS.length).padStart(2, '0')}</span>
              <em>{photo.en}</em>
            </div>
            <div className="flim-stage-actions">
              <span className="flim-hint">点击画面暂停</span>
              <button
                type="button"
                className="flim-play"
                onClick={togglePlay}
                aria-label={playing ? '暂停轮播' : '继续轮播'}
                aria-pressed={playing}
              >
                {playing ? (
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <rect x="4.5" y="3.5" width="2.4" height="9" rx="0.6" />
                    <rect x="9.1" y="3.5" width="2.4" height="9" rx="0.6" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M5.2 3.5 12.6 8l-7.4 4.5Z" />
                  </svg>
                )}
                <span>{playing ? '暂停轮播' : '继续轮播'}</span>
              </button>
            </div>
          </div>

          <div
            className="flim-screen"
            role="button"
            tabIndex={0}
            aria-label="点击暂停或继续自动轮播"
            onClick={togglePlay}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePlay();
              }
            }}
          >
            <canvas ref={canvasRef} className={`flim-canvas${ready ? ' on' : ''}`} aria-hidden="true" />
            {!ready && (
              <div className="flim-loading">
                <i />
                显影中
              </div>
            )}
          </div>

          <div className="flim-caption">
            <div className="flim-caption-item">
              <span>样张</span>
              <b>{photo.title}</b>
              <em>{photo.ratio}</em>
            </div>
            <div className="flim-caption-item">
              <span>片边</span>
              <b>{preset.name}</b>
              <em>{preset.note}</em>
            </div>
            <div className="flim-caption-item">
              <span>孔型</span>
              <b>{preset.id === 'none' ? '—' : PERFS[GAUGES[preset.gauge].perf].label}</b>
              <em>{preset.id === 'none' ? '无片边' : GAUGES[preset.gauge].label}</em>
            </div>
            <div className="flim-caption-nav">
              <button type="button" onClick={() => stepPhoto(-1)} aria-label="上一张">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M10 3.5 5.5 8 10 12.5" />
                </svg>
              </button>
              <button type="button" onClick={() => stepPhoto(1)} aria-label="下一张">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M6 3.5 10.5 8 6 12.5" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flim-timer" aria-hidden="true">
            <i style={{ transform: `scaleX(${progress})` }} />
          </div>
        </div>

        <div className="flim-reel reveal d1" role="tablist" aria-label="显影样张">
          {PHOTOS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === photoIndex}
              className={`flim-shot${i === photoIndex ? ' on' : ''}`}
              onClick={() => selectPhoto(i)}
            >
              <img src={p.src} alt={p.title} />
              <b>{p.id}</b>
            </button>
          ))}
        </div>

        <div className="flim-borders reveal d1">
          <div className="flim-borders-head">
            <span>BORDER · 片边预设</span>
            <em>点击任意片边暂停轮播 · 共 {PRESETS.length} 种</em>
          </div>
          <div className="flim-chips" role="group" aria-label="片边预设">
            {PRESETS.map((p, i) => (
              <BorderChip
                key={p.id}
                preset={p}
                photo={image}
                photoId={photo.id}
                active={i === borderIndex}
                onSelect={() => selectBorder(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
