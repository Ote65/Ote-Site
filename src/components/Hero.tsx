import React, { useState } from 'react';
import { Play, Pause, ArrowRight, ShieldCheck, Zap, Sparkles, Terminal, Video } from 'lucide-react';

interface HeroProps {
  onWatchVideo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onWatchVideo }) => {
  const [activeTab, setActiveTab] = useState<'oltra' | 'o4d'>('oltra');
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrubPercent, setScrubPercent] = useState(42);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-grid-pattern">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#f5a623]/15 to-[#00d4ff]/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#f5a623]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Unboxed clean metadata kicker */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#f5a623] tracking-widest uppercase mb-4">
          <span>OTE CREATIVE SYSTEMS</span>
          <span aria-hidden="true">·</span>
          <span>NEXT-GEN VISUAL PRODUCTIVITY</span>
          <span aria-hidden="true">·</span>
          <span>LOCAL-FIRST ENGINES</span>
        </div>

        {/* Hero Title */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-display leading-[1.08] [text-wrap:balance]">
            让灵感在时间线与空间里，
            <br />
            以<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5a623] via-[#ffbe53] to-[#00d4ff]">代码级精度</span>成片。
          </h1>
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#9a9aa5] leading-relaxed max-w-3xl [text-wrap:balance]">
            告别耗时的关键帧调整与空洞的假生成。欧特科技融合桌面级视频自主创作 Agent「欧创 Oltra」与 3D 空间运镜系统「O4D」，让每一刀剪辑、每一个运镜轨迹都真实受控、本地自检、极速交付。
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#oltra"
            className="px-6 py-3.5 text-sm font-semibold text-black bg-[#f5a623] hover:bg-[#e09419] rounded-xl transition-all shadow-[0_0_30px_rgba(245,166,35,0.3)] hover:shadow-[0_0_40px_rgba(245,166,35,0.5)] flex items-center gap-2 whitespace-nowrap active:scale-[0.98]"
          >
            <span>探索 Oltra 视频创作 Agent</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#o4d"
            className="px-6 py-3.5 text-sm font-semibold text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap active:scale-[0.98]"
          >
            <span>了解 O4D 3D运镜系统</span>
            <ArrowRight className="w-4 h-4 text-white/70" />
          </a>

          <button
            onClick={onWatchVideo}
            className="px-5 py-3.5 text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#f5a623]">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </div>
            <span>观看实机演示 (Demo Reel)</span>
          </button>
        </div>

        {/* Real-time Proof Numbers Adjacent to Hero claims */}
        <div className="mt-12 pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">10s</div>
            <div className="text-xs text-[#9a9aa5] mt-1">改字换方向 · 即时出片</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">2 帧 / 镜头</div>
            <div className="text-xs text-[#9a9aa5] mt-1">真静帧全流程严谨自检</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">1P / 3P</div>
            <div className="text-xs text-[#9a9aa5] mt-1">双模三维空间运镜预设</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">100% 本地</div>
            <div className="text-xs text-[#9a9aa5] mt-1">工程离线可用 · 资产不泄露</div>
          </div>
        </div>

        {/* Master Interactive Visual Showcase */}
        <div className="mt-10 relative">
          <div className="glass-panel-elevated rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
            {/* Window chrome header */}
            <div className="px-4 py-3 bg-[#0d0d12] border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]/80 inline-block" />
                <span className="text-xs font-mono text-zinc-500 ml-2">OTE_STUDIO_SUITE_v2.6</span>
              </div>

              {/* Interactive Engine Switcher tabs */}
              <div className="flex items-center p-1 bg-black/40 rounded-lg border border-white/10 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('oltra')}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    activeTab === 'oltra'
                      ? 'bg-[#f5a623] text-black font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  欧创 Oltra (视频 Agent 引擎)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('o4d')}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    activeTab === 'o4d'
                      ? 'bg-[#00d4ff] text-black font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  O4D (3D 运镜与材质视口)
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ENGINE ACTIVE
                </span>
                <span className="text-zinc-600">|</span>
                <span>60 FPS</span>
              </div>
            </div>

            {/* Showcase Stage */}
            <div className="relative aspect-[16/9] w-full bg-[#0a0a0e] overflow-hidden group">
              <img
                src={
                  activeTab === 'oltra'
                    ? '/src/assets/images/oltra_interface_showcase_1790652224610.jpg'
                    : '/src/assets/images/o4d_camera_cinematic_1790652235109.jpg'
                }
                alt={activeTab === 'oltra' ? '欧创 Oltra 视频创作界面' : 'O4D 三维空间运镜视口'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              {/* Floating Live Telemetry HUD */}
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
                <div className="bg-black/75 backdrop-blur-md border border-white/10 px-3 py-2 rounded-lg text-xs font-mono">
                  {activeTab === 'oltra' ? (
                    <div className="space-y-1">
                      <div className="text-[#f5a623] font-semibold flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>O-Vision Loop: Round 07 / 24</span>
                      </div>
                      <div className="text-zinc-400 text-[11px]">
                        Remotion TSX &gt; apply_motion(&quot;kinetic_typography&quot;)
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-[#00d4ff] font-semibold flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5" />
                        <span>Camera Track: 3P Orbit 360°</span>
                      </div>
                      <div className="text-zinc-400 text-[11px]">
                        Focal 35mm · FOV 63.4° · Spline Smooth Ease
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-black/75 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300">
                  <span>RES: 3840×2160 UHD</span>
                </div>
              </div>

              {/* Bottom Interactive Transport Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
                      aria-label={isPlaying ? '暂停回放' : '播放'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <span className="text-white font-medium">
                      00:0{Math.floor((scrubPercent / 100) * 15)}:
                      {String(Math.floor(((scrubPercent / 100) * 15 * 60) % 60)).padStart(2, '0')}
                    </span>
                    <span className="text-zinc-600">/</span>
                    <span>00:00:15:00</span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="hidden sm:inline text-zinc-500">
                      {activeTab === 'oltra' ? '实时 TSX 渲染轨道' : '三维空间 Bezier 样条曲线'}
                    </span>
                    <a
                      href={activeTab === 'oltra' ? 'https://oltra.ote.asia' : 'https://3d.ote.asia'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#f5a623] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>打开完整软件</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>

                {/* Scrubber slider */}
                <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className={`h-full rounded-full transition-all duration-150 ${
                      activeTab === 'oltra' ? 'bg-[#f5a623]' : 'bg-[#00d4ff]'
                    }`}
                    style={{ width: `${scrubPercent}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scrubPercent}
                    onChange={(e) => setScrubPercent(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    aria-label="Timeline scrubber"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
