import React from 'react';
import { ArrowUpRight, Mail, Compass } from 'lucide-react';

interface FooterProps {
  onOpenFeedback: () => void;
  onOpenShowcase: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenFeedback, onOpenShowcase }) => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#060608] py-16 sm:py-20 text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold font-display text-base tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f5a623]" />
              <span>OTE STUDIO</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              欧特科技旗下专业视觉与动态创作工具矩阵。以代码级精度与物理真实感重构视频剪辑与 3D 空间运镜，让每一次灵感都无损交付。
            </p>
            <div className="flex items-center gap-4 text-xs font-mono pt-2">
              <span className="text-[#f5a623]">LOCAL-FIRST ARCHITECTURE</span>
              <span className="text-zinc-700">·</span>
              <span>2026 EDITION</span>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-white font-semibold text-xs uppercase tracking-wider font-mono">
              旗舰产品矩阵
            </div>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://oltra.ote.asia"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>欧创 Oltra · 桌面视频 Agent</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://3d.ote.asia"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>O4D · 傻瓜式 3D 运镜工具</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600" />
                </a>
              </li>
              <li>
                <a
                  href="#pipeline"
                  className="hover:text-white transition-colors"
                >
                  双引擎协同工作流
                </a>
              </li>
              <li>
                <a
                  href="https://oltra.ote.asia/download.html"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#f5a623] transition-colors"
                >
                  下载客户端安装包
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-white font-semibold text-xs uppercase tracking-wider font-mono">
              资源与生态
            </div>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={onOpenShowcase}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  视觉实录展厅
                </button>
              </li>
              <li>
                <a
                  href="#specs"
                  className="hover:text-white transition-colors"
                >
                  技术规格对比
                </a>
              </li>
              <li>
                <a
                  href="https://resume.ote.asia"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>创作者履历</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://serak.ote.asia"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Serak 彩墨工具</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Feedback */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-white font-semibold text-xs uppercase tracking-wider font-mono">
              联络与支持
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              有商业合作需求、功能定制或技术疑问？欢迎直接与开发者沟通。
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenFeedback}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-[#f5a623]" />
                <span>在线反馈 / 商务咨询</span>
              </button>
            </div>
            <div className="font-mono text-[11px] text-zinc-500">
              邮箱: <a href="mailto:3206219621@qq.com" className="hover:text-zinc-300">3206219621@qq.com</a>
            </div>
          </div>
        </div>

        {/* Quiet Legal Baseline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            &copy; 2026 欧特科技 OTE Studio. 保留所有权利。
          </div>
          <div className="flex items-center gap-6">
            <span>Local-First Video &amp; 3D Engine</span>
            <span>·</span>
            <a href="mailto:3206219621@qq.com" className="hover:text-zinc-300">
              开发者：欧特 Otkvr
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
