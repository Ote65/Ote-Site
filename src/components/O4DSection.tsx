import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Box,
  Eye,
  Camera,
  Layers,
  Sun,
  Maximize2,
  Download,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Move
} from 'lucide-react';
import { CameraPreset } from '../types';

export const O4DSection: React.FC = () => {
  const [activePreset, setActivePreset] = useState<string>('orbit');
  const [cameraMode, setCameraMode] = useState<'1P' | '3P'>('3P');
  const [materialMode, setMaterialMode] = useState<'pbr' | 'clay' | 'metallic'>('pbr');
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const presets: CameraPreset[] = [
    {
      id: 'orbit',
      name: '环绕审视 (Orbit 360°)',
      duration: '4.0s',
      desc: '围绕焦点目标 360 度匀速旋转巡航，极佳展现产品整体轮廓与工业细节。',
      iconName: 'RotateCcw',
      pathType: 'orbit',
    },
    {
      id: 'dolly',
      name: '希区柯克变焦 (Dolly Zoom)',
      duration: '3.5s',
      desc: '相机推进同时动态反向拉伸视野 FOV，制造强烈的空间透视畸变戏剧张力。',
      iconName: 'Maximize2',
      pathType: 'dolly',
    },
    {
      id: 'spiral',
      name: '螺旋俯冲 (Spiral Dive)',
      duration: '5.0s',
      desc: '高角度盘旋下降至主体表面，由宏观场景一气呵成直切微观质感细节。',
      iconName: 'Compass',
      pathType: 'spiral',
    },
    {
      id: 'crane',
      name: '摇臂升降 (Crane & Push)',
      duration: '4.2s',
      desc: '模拟重型机械摇臂由下至上抬升并缓推，赋予产品恢弘的登场气魄。',
      iconName: 'Move',
      pathType: 'crane',
    },
    {
      id: 'hero',
      name: '特写聚焦 (Hero Reveal)',
      duration: '3.0s',
      desc: '浅景深超近距离扫掠核心组件，随后快速拉远定格全局亮相。',
      iconName: 'Camera',
      pathType: 'hero',
    },
  ];

  // Dynamic 3D Camera Wireframe Simulation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const render = () => {
      frame += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw perspective grid plane
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridCount = 14;
      const spacing = 28;

      ctx.beginPath();
      for (let i = -gridCount; i <= gridCount; i++) {
        // Vertical lines with perspective
        ctx.moveTo(cx + i * spacing * 0.4, cy + 30);
        ctx.lineTo(cx + i * spacing * 1.6, cy + 180);
      }
      for (let j = 0; j <= 8; j++) {
        // Horizontal lines with perspective depth
        const y = cy + 30 + j * 18;
        const scale = 0.4 + j * 0.15;
        ctx.moveTo(cx - gridCount * spacing * scale, y);
        ctx.lineTo(cx + gridCount * spacing * scale, y);
      }
      ctx.stroke();

      // Camera motion path calculation based on active preset
      let camX = 0;
      let camY = 0;
      let camZ = 0;
      let fovScale = 1;

      if (activePreset === 'orbit') {
        const angle = frame * 1.2;
        camX = Math.cos(angle) * 120;
        camY = Math.sin(angle * 0.4) * 25 - 20;
        camZ = Math.sin(angle) * 80;
      } else if (activePreset === 'dolly') {
        const t = Math.sin(frame * 1.5);
        camX = 0;
        camY = -15;
        camZ = t * 90;
        fovScale = 1 + t * 0.35;
      } else if (activePreset === 'spiral') {
        const spiralAngle = frame * 1.8;
        const radius = Math.max(30, 130 - ((frame * 25) % 110));
        camX = Math.cos(spiralAngle) * radius;
        camY = -80 + ((frame * 18) % 90);
        camZ = Math.sin(spiralAngle) * radius;
      } else if (activePreset === 'crane') {
        const t = Math.sin(frame * 1.2);
        camX = Math.cos(frame * 0.6) * 40;
        camY = 40 - t * 70;
        camZ = 100 - t * 30;
      } else {
        // Hero reveal
        const t = (Math.sin(frame * 2) + 1) / 2;
        camX = (1 - t) * 60;
        camY = (1 - t) * 30 - 20;
        camZ = 40 + t * 90;
      }

      // Draw 3D Object Box / Product representation
      const boxSize = 50 * fovScale;
      const explodeOffset = isExploded ? 24 : 0;

      // Color scheme based on material
      let objStroke = '#00d4ff';
      let objFill = 'rgba(0, 212, 255, 0.08)';
      if (materialMode === 'clay') {
        objStroke = '#e8e6e3';
        objFill = 'rgba(232, 230, 227, 0.12)';
      } else if (materialMode === 'metallic') {
        objStroke = '#f5a623';
        objFill = 'rgba(245, 166, 35, 0.15)';
      }

      // Draw Center Focal Object (Geometric Cyber Engine)
      ctx.save();
      ctx.translate(cx, cy);

      // Core cube / exploded panels
      const vertices = [
        [-boxSize, -boxSize - explodeOffset],
        [boxSize, -boxSize - explodeOffset],
        [boxSize + explodeOffset, boxSize],
        [-boxSize + explodeOffset, boxSize],
      ];

      ctx.strokeStyle = objStroke;
      ctx.lineWidth = 1.5;
      ctx.fillStyle = objFill;

      // Front Face
      ctx.beginPath();
      ctx.moveTo(vertices[0][0], vertices[0][1]);
      ctx.lineTo(vertices[1][0], vertices[1][1]);
      ctx.lineTo(vertices[2][0], vertices[2][1]);
      ctx.lineTo(vertices[3][0], vertices[3][1]);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner details / wireframe rings
      ctx.beginPath();
      ctx.arc(0, 0, (boxSize / 2) * fovScale, 0, Math.PI * 2);
      ctx.strokeStyle = objStroke;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Exploded satellite panels
      if (isExploded) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-boxSize - 30, -boxSize - 30);
        ctx.moveTo(0, 0);
        ctx.lineTo(boxSize + 30, -boxSize - 30);
        ctx.moveTo(0, 0);
        ctx.lineTo(boxSize + 30, boxSize + 30);
        ctx.moveTo(0, 0);
        ctx.lineTo(-boxSize - 30, boxSize + 30);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();

      // Draw 3D Camera Rig Position and Frustum Ray
      const camScreenX = cx + camX;
      const camScreenY = cy + camY;

      // Frustum rays from camera to object center
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(camScreenX, camScreenY);
      ctx.lineTo(cx - 20, cy - 20);
      ctx.moveTo(camScreenX, camScreenY);
      ctx.lineTo(cx + 20, cy + 20);
      ctx.stroke();

      // Camera Icon body
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(camScreenX, camScreenY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Camera lens glow
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(camScreenX, camScreenY, 12, 0, Math.PI * 2);
      ctx.stroke();

      // Orbit guide ring
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 130, 60, 0, 0, Math.PI * 2);
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [activePreset, materialMode, isExploded]);

  return (
    <section id="o4d" className="py-24 sm:py-32 relative border-t border-white/[0.08] bg-[#07070a]">
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-10 w-[550px] h-[550px] bg-[#00d4ff]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00d4ff] tracking-wider uppercase mb-3">
              <span>02. SPATIAL CINEMATOGRAPHY</span>
              <span aria-hidden="true">·</span>
              <span>O4D STUDIO</span>
              <span aria-hidden="true">·</span>
              <span>REAL-TIME 3D VIEWPORT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display">
              傻瓜式 3D 运镜动画工具，<br />
              <span className="text-[#00d4ff]">离线可用</span>。
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#9a9aa5] max-w-xl leading-relaxed">
            将传统 Blender / C4D 里复杂的摄像机约束与空间贝塞尔手调工作流，收缩为一键预设、双模运镜与交互式时间线。随手导入三维模型，数秒排定大师级摄影机轨迹。
          </p>
        </div>

        {/* Master Interactive 3D Cinematography Studio */}
        <div className="glass-panel-elevated rounded-2xl overflow-hidden border border-white/10 mb-16 shadow-2xl">
          {/* Top Bar of O4D UI */}
          <div className="px-5 py-3.5 bg-[#0e0e14] border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#00d4ff] to-[#0099bb] flex items-center justify-center text-black font-mono font-bold text-xs">
                4D
              </div>
              <span className="font-mono text-xs font-semibold text-white tracking-wider">
                O4D_CINEMA_ENGINE · LIVE PREVIEW
              </span>
            </div>

            {/* Mode Switches */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <div className="flex p-0.5 bg-black/50 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setCameraMode('1P')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    cameraMode === '1P' ? 'bg-[#00d4ff] text-black font-semibold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  1P 第一人称
                </button>
                <button
                  type="button"
                  onClick={() => setCameraMode('3P')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    cameraMode === '3P' ? 'bg-[#00d4ff] text-black font-semibold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  3P 第三人称
                </button>
              </div>

              {/* Material mode */}
              <div className="hidden sm:flex p-0.5 bg-black/50 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setMaterialMode('pbr')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    materialMode === 'pbr' ? 'bg-white/20 text-white font-medium' : 'text-zinc-400'
                  }`}
                >
                  PBR 原材质
                </button>
                <button
                  type="button"
                  onClick={() => setMaterialMode('clay')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    materialMode === 'clay' ? 'bg-white/20 text-white font-medium' : 'text-zinc-400'
                  }`}
                >
                  白模 Clay
                </button>
                <button
                  type="button"
                  onClick={() => setMaterialMode('metallic')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    materialMode === 'metallic' ? 'bg-white/20 text-white font-medium' : 'text-zinc-400'
                  }`}
                >
                  高反金属性
                </button>
              </div>

              {/* Explode View Toggle */}
              <button
                type="button"
                onClick={() => setIsExploded(!isExploded)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  isExploded
                    ? 'bg-[#f5a623]/20 border-[#f5a623] text-[#f5a623]'
                    : 'bg-white/5 border-white/10 text-zinc-300 hover:border-white/25'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>{isExploded ? '合并复原' : '一键爆炸拆解'}</span>
              </button>
            </div>
          </div>

          {/* Central Interactive Viewport + Presets Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* Real Canvas 3D Space Viewport */}
            <div className="lg:col-span-8 bg-[#08080c] relative flex items-center justify-center p-4 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
              <canvas
                ref={canvasRef}
                width={720}
                height={460}
                className="w-full h-full max-h-[460px] object-contain"
              />

              {/* Real-time Viewport Telemetry HUD */}
              <div className="absolute top-4 left-4 font-mono text-[11px] text-zinc-400 space-y-1 pointer-events-none bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/5">
                <div className="text-[#00d4ff] font-semibold flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  <span>PRESET: {presets.find((p) => p.id === activePreset)?.name}</span>
                </div>
                <div>FOCAL: 50mm · FOV: 39.6°</div>
                <div>RIG TYPE: {cameraMode === '3P' ? 'Target Spherical Orbit' : 'Free Roam Flycam'}</div>
                <div className="text-emerald-400">FPS: 60 (WebGL / Offscreen)</div>
              </div>

              {/* Watermark notice */}
              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-500 bg-black/70 px-2.5 py-1 rounded border border-white/5 pointer-events-none">
                3D.OTE.ASIA ENGINE CORE
              </div>
            </div>

            {/* Presets Sidebar Drawer */}
            <div className="lg:col-span-4 bg-[#0a0a0f] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                  <span className="text-xs font-mono text-[#00d4ff] font-semibold">
                    大师运镜预设库 (CINEMATIC PRESETS)
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">5 CURATED</span>
                </div>

                <div className="space-y-2">
                  {presets.map((preset) => {
                    const isSelected = activePreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setActivePreset(preset.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#00d4ff]/10 border-[#00d4ff] text-white shadow-[0_0_15px_rgba(0,212,255,0.15)]'
                            : 'bg-black/25 border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isSelected ? 'bg-[#00d4ff]' : 'bg-zinc-600'
                              }`}
                            />
                            {preset.name}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-400">
                            {preset.duration}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#9a9aa5] leading-relaxed line-clamp-2">
                          {preset.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Launch in Preset Drawer */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <a
                  href="https://3d.ote.asia"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-[#00d4ff] hover:bg-[#00b8dd] text-black font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)] active:scale-[0.98]"
                >
                  <span>在 O4D 工作台加载你自己的模型</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Timeline Bar of O4D */}
          <div className="p-4 bg-[#0c0c12] border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold">TRACK 01:</span>
              <span className="text-[#00d4ff]">[Camera 3P Orbit Track]</span>
              <span className="text-zinc-600">|</span>
              <span>Spline EaseInEaseOut</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <Download className="w-3.5 h-3.5" />
                <span>离线透明通道 WebM / 4K MP4 直出</span>
              </span>
            </div>
          </div>
        </div>

        {/* 3 Core Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff] flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">1P 漫游与 3P 环绕双模</h3>
            <p className="text-xs text-[#9a9aa5] leading-relaxed">
              支持自由空间第一人称穿行，或第三人称以指定部件为基点进行球形坐标锁定。无论是建筑空间漫游还是精密硬件展示，皆可一键切换。
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff] flex items-center justify-center mb-4">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">专业多光源影棚系统</h3>
            <p className="text-xs text-[#9a9aa5] leading-relaxed">
              内建高精度泛光、聚光、三点布光与环境反射。支持实时调整色温、阴影衰减和软阴影模糊半径，在网页端直接输出影棚级光影质感。
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff] flex items-center justify-center mb-4">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">纯本地离线无损输出</h3>
            <p className="text-xs text-[#9a9aa5] leading-relaxed">
              无需任何昂贵的工作站或云渲染集群。借助 WebGL 与本地渲染管线，支持带透明 Alpha 通道的视频流导出，直接无缝拼入 Oltra 时间线。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
