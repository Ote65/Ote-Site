import React, { useState } from 'react';
import { Check, X, Shield, Cpu, Zap, Sliders, ExternalLink } from 'lucide-react';

export const SpecsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'oltra' | 'o4d'>('all');

  const comparisons = [
    {
      dimension: '镜头与动效精确修改',
      traditional: '需在 AE/C4D 手动寻找关键帧并重新打断曲线，耗时数小时',
      chatAi: '文字生成盲抽，无法定位特定帧单独替换，一改全推倒',
      oteSuite: '直接在工程时间线修改目标图层，10 秒内即时出片',
      advantage: '秒级响应 · 上下文完整保留',
    },
    {
      dimension: '3D 运镜与透视轨迹',
      traditional: '手动调节三轴旋转、贝塞尔手柄与相机约束，门槛极高',
      chatAi: '仅有泛化随机镜头推拉，不可自定义精确轨道或 FOV 畸变',
      oteSuite: '1P/3P 双模切换，5 大预设运镜一键套用，支持样条实时拟合',
      advantage: '傻瓜化预设 · 电影级流动',
    },
    {
      dimension: '品牌与素材保真度',
      traditional: '手工精准导入，但大量机械排版消耗创作精力',
      chatAi: 'AI 频繁编造假 UI、畸变 Logo 和不存在的虚构界面',
      oteSuite: '坚持 0 猜原则，读取真实色板与像素尺寸，每镜头 2 帧自检',
      advantage: '真素材优先 · 绝对保真',
    },
    {
      dimension: '资产与商业数据安全',
      traditional: '本地工程但文件分散，易发生素材断链',
      chatAi: '未发布商业广告素材需全部上传公有云，存在泄密风险',
      oteSuite: '架构 Local-First，代码、3D 模型与渲染帧全部封存在本地机器',
      advantage: '100% 私有安全 · 离线可用',
    },
    {
      dimension: '开发生态与 Agent 联动',
      traditional: '各厂商私有插件封闭体系，无法被大模型直接调度',
      chatAi: '孤立的 Web 生成器，与本地代码库和 IDE 完全脱节',
      oteSuite: '原生支持 MCP 协议，Cursor、Claude Code 可直接指挥欧创出片',
      advantage: '开放标准 · IDE 无缝集成',
    },
  ];

  return (
    <section id="specs" className="py-24 sm:py-32 relative border-t border-white/[0.08] bg-[#09090c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 tracking-wider uppercase mb-3">
              <span>04. BENCHMARKS &amp; SPECS</span>
              <span aria-hidden="true">·</span>
              <span>技术架构与效能对比</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display">
              为什么不是传统工作流，<br />
              也不是抽卡式 AI？
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#9a9aa5] max-w-xl leading-relaxed">
            创作者需要的是可靠的确定性，而非无法交差的半成品。欧特科技构建的是面向专业交付的生产力工具，兼具 Agent 的高度自动化与代码级工程的绝对掌控力。
          </p>
        </div>

        {/* Matrix Table */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-xs font-mono text-zinc-400">
                  <th className="py-4 px-6 font-semibold w-1/4">对比维度</th>
                  <th className="py-4 px-6 font-semibold w-1/4">传统手动 (AE / C4D)</th>
                  <th className="py-4 px-6 font-semibold w-1/4">对话式云端生成 AI</th>
                  <th className="py-4 px-6 font-semibold w-1/4 text-[#f5a623] bg-[#f5a623]/5">
                    欧特软件矩阵 (OTE Suite)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {comparisons.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 px-6 font-semibold text-white">
                      <div>{row.dimension}</div>
                      <div className="text-[10px] font-mono text-[#f5a623] mt-1">
                        {row.advantage}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-zinc-400 leading-relaxed">
                      {row.traditional}
                    </td>
                    <td className="py-5 px-6 text-zinc-400 leading-relaxed">
                      {row.chatAi}
                    </td>
                    <td className="py-5 px-6 text-white font-medium bg-[#f5a623]/5 leading-relaxed">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{row.oteSuite}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Specification Bento */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="text-xs font-mono text-zinc-400 mb-2">ENGINE SPEC 01</div>
            <h3 className="text-base font-bold text-white mb-2">Remotion TSX 视频编译层</h3>
            <p className="text-xs text-[#9a9aa5] leading-relaxed">
              基于 React 组件模型定义视频帧率、镜头切换与视觉遮罩。支持像素级精准重绘与即时热重载。
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="text-xs font-mono text-zinc-400 mb-2">ENGINE SPEC 02</div>
            <h3 className="text-base font-bold text-white mb-2">WebGL 3D 空间数学矩阵</h3>
            <p className="text-xs text-[#9a9aa5] leading-relaxed">
              采用四元数摄像机插值与样条轨迹优化，实时计算 60FPS 运动模糊与多光源实时阴影投射。
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="text-xs font-mono text-zinc-400 mb-2">ENGINE SPEC 03</div>
            <h3 className="text-base font-bold text-white mb-2">Model Context Protocol (MCP)</h3>
            <p className="text-xs text-[#9a9aa5] leading-relaxed">
              遵循标准 JSON-RPC 规范，支持多 Agent 并发任务下发、进度订阅与离线视频文件管道直传。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
