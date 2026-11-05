import React, { useState } from 'react';
import { X, Play, Pause, Maximize2, ExternalLink, Sparkles, Film, Box, Check } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({ isOpen, onClose }) => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1.0x' | '1.5x' | '2.0x'>('1.0x');

  if (!isOpen) return null;

  const mediaItems: MediaItem[] = [
    {
      id: 'oltra-demo',
      title: '欧创 Oltra · 从一句指令到成片实录',
      product: 'Oltra',
      category: '视频 Agent 实操',
      thumbnail: '/src/assets/images/oltra_interface_showcase_1790652224610.jpg',
      duration: '00:15',
      description:
        '实录展示：用户输入「制作一支科技感极简发布片」，Oltra 在本地工程中自动排布素材、编写 Remotion TSX 动效、自检 2 帧，最终导出完整视频。',
    },
    {
      id: 'o4d-camera-demo',
      title: 'O4D · 3D 工业部件环绕与一键拆解',
      product: 'O4D',
      category: '3D 运镜与材质',
      thumbnail: '/src/assets/images/o4d_camera_cinematic_1790652235109.jpg',
      duration: '00:20',
      description:
        '实录展示：在 O4D 视口中实时切换 1P/3P 运镜模式，应用 360° 环绕预设与一键模型爆炸拆分，并实时观察阴影与 PBR 材质高光变化。',
    },
    {
      id: 'suite-workflow-demo',
      title: '双引擎管线 · 空间运镜与时间线合成',
      product: 'Suite',
      category: '全案协同流程',
      thumbnail: '/src/assets/images/hero_ote_suite_1790652213504.jpg',
      duration: '00:35',
      description:
        '实录展示：O4D 生成带 Alpha 通道的 3D 运镜序列，直传给 Oltra 自动进行声音卡点、文字贴合与自检，全流程耗时不足 3 分钟。',
    },
  ];

  const current = mediaItems[activeItemIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-[#0c0c12] border border-white/15 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#12121a]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f5a623]" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              OTE STUDIO · 视觉展厅 &amp; 实录演示
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
              ESC 键退出
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="关闭窗口"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Main Visual Player Viewport */}
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black border border-white/10 group">
            <img
              src={current.thumbnail}
              alt={current.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

            {/* Simulated Live Scanline */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.03] to-transparent h-16 animate-scanline" />

            {/* Telemetry Tags */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-[#f5a623]">
                {current.product}
              </span>
              <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-300">
                {current.category}
              </span>
            </div>

            {/* Center Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all transform hover:scale-110 pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,0.8)] cursor-pointer"
                aria-label={isPlaying ? '暂停' : '播放'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1 text-[#f5a623]" />}
              </button>
            </div>

            {/* Bottom Player Transport Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="flex items-center justify-between text-xs text-zinc-300 font-mono mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-[#f5a623] font-semibold">{current.title}</span>
                  <span className="text-zinc-600">|</span>
                  <span>{current.duration}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPlaybackSpeed(
                        playbackSpeed === '1.0x'
                          ? '1.5x'
                          : playbackSpeed === '1.5x'
                          ? '2.0x'
                          : '1.0x'
                      )
                    }
                    className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] cursor-pointer"
                  >
                    {playbackSpeed}
                  </button>
                  <span className="text-emerald-400">● 60 FPS UHD</span>
                </div>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#f5a623] w-2/3 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Description & Action Links */}
          <div className="bg-[#101017] rounded-xl p-5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">{current.title}</h4>
              <p className="text-xs text-[#9a9aa5] leading-relaxed max-w-2xl">
                {current.description}
              </p>
            </div>

            <a
              href={
                current.product === 'O4D'
                  ? 'https://3d.ote.asia'
                  : 'https://oltra.ote.asia'
              }
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#f5a623] text-black hover:bg-[#e09419] transition-all shrink-0 cursor-pointer"
            >
              <span>体验此产品功能</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Selector Thumbnails */}
          <div>
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
              选择实录演示案例 (SELECT REEL)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {mediaItems.map((item, idx) => {
                const isSelected = activeItemIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveItemIndex(idx)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#f5a623]/10 border-[#f5a623]'
                        : 'bg-black/30 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10 relative">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        {item.category}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
