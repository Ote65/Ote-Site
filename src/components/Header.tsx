import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Compass, Film, Box, Cpu } from 'lucide-react';

interface HeaderProps {
  onOpenFeedback: () => void;
  onOpenShowcase: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFeedback, onOpenShowcase }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#08080a]/90 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-black/50 py-3.5'
            : 'bg-transparent border-b border-white/[0.05] py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Zone 1: Single text element wordmark */}
            <a
              href="#"
              className="text-lg font-bold tracking-tight text-white font-display hover:text-[#f5a623] transition-colors shrink-0 flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#f5a623] inline-block shadow-[0_0_10px_#f5a623]" />
              <span>OTE STUDIO</span>
            </a>

            {/* Zone 2: 4-6 clean text navigation links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#9a9aa5]">
              <a
                href="#oltra"
                className="hover:text-white transition-colors duration-200"
              >
                欧创 Oltra
              </a>
              <a
                href="#o4d"
                className="hover:text-white transition-colors duration-200"
              >
                O4D 运镜
              </a>
              <a
                href="#pipeline"
                className="hover:text-white transition-colors duration-200"
              >
                双引擎工作流
              </a>
              <a
                href="#specs"
                className="hover:text-white transition-colors duration-200"
              >
                性能对比
              </a>
              <button
                onClick={onOpenShowcase}
                className="hover:text-white transition-colors duration-200 cursor-pointer text-left"
              >
                视觉展厅
              </button>
            </nav>

            {/* Zone 3: 1-2 primary actions */}
            <div className="flex items-center gap-3">
              <a
                href="https://oltra.ote.asia"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg transition-all whitespace-nowrap active:scale-[0.98]"
              >
                <span>前往 Oltra</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/70" />
              </a>

              <a
                href="https://3d.ote.asia"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-black bg-[#f5a623] hover:bg-[#e09419] rounded-lg transition-all shadow-[0_0_20px_rgba(245,166,35,0.25)] hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] whitespace-nowrap active:scale-[0.98]"
              >
                <span>打开 O4D</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#08080a]/95 backdrop-blur-2xl md:hidden pt-24 px-6 flex flex-col justify-between pb-10 animate-in fade-in duration-200">
          <nav className="flex flex-col gap-5 text-base font-medium">
            <a
              href="#oltra"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-[#f5a623] flex items-center justify-between py-2 border-b border-white/5"
            >
              <span className="flex items-center gap-3">
                <Film className="w-5 h-5 text-[#f5a623]" />
                欧创 Oltra · 视频 Agent
              </span>
              <span className="text-xs text-zinc-500 font-mono">01</span>
            </a>
            <a
              href="#o4d"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-[#00d4ff] flex items-center justify-between py-2 border-b border-white/5"
            >
              <span className="flex items-center gap-3">
                <Box className="w-5 h-5 text-[#00d4ff]" />
                O4D · 3D运镜动画系统
              </span>
              <span className="text-xs text-zinc-500 font-mono">02</span>
            </a>
            <a
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-white flex items-center justify-between py-2 border-b border-white/5"
            >
              <span className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-emerald-400" />
                双引擎工作流
              </span>
              <span className="text-xs text-zinc-500 font-mono">03</span>
            </a>
            <a
              href="#specs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-white flex items-center justify-between py-2 border-b border-white/5"
            >
              <span className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-purple-400" />
                性能对比 & 技术规格
              </span>
              <span className="text-xs text-zinc-500 font-mono">04</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenShowcase();
              }}
              className="text-left text-zinc-200 hover:text-white flex items-center justify-between py-2 border-b border-white/5 cursor-pointer"
            >
              <span>精选作品与视频实录</span>
              <span className="text-xs text-zinc-500 font-mono">05</span>
            </button>
          </nav>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://oltra.ote.asia"
                target="_blank"
                rel="noreferrer"
                className="py-3 text-center text-sm font-semibold text-white bg-white/10 rounded-xl border border-white/10"
              >
                前往 Oltra 官网
              </a>
              <a
                href="https://3d.ote.asia"
                target="_blank"
                rel="noreferrer"
                className="py-3 text-center text-sm font-semibold text-black bg-[#f5a623] rounded-xl"
              >
                启动 O4D 工具
              </a>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFeedback();
              }}
              className="py-3 text-center text-xs text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
            >
              联系开发者 / 问题反馈
            </button>
          </div>
        </div>
      )}
    </>
  );
};
