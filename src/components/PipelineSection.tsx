import React, { useState } from 'react';
import { ArrowRight, Workflow, Check, Zap, Layers, Video, ShieldAlert, Cpu } from 'lucide-react';

export const PipelineSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: '01',
      title: 'O4D 空间三维运镜',
      subtitle: 'SPATIAL CHOREOGRAPHY',
      tool: 'O4D Studio',
      color: '#00d4ff',
      summary: '导入 3D CAD/GLTF 模型，选定「环绕审视 + 爆炸拆解」，3 秒输出带 Alpha 透明通道的电影级运镜序列。',
      techPill: 'WebGL 60FPS · 离线 Alpha 直出',
      output: 'assets/render_o4d_alpha.webm',
    },
    {
      num: '02',
      title: 'Oltra 视效包装与时间线编排',
      subtitle: 'AGENT COMPOSITION & TSX',
      tool: '欧创 Oltra',
      color: '#f5a623',
      summary: '告诉 Oltra「配合刚才的运镜做一支 10 秒硬核工业风发布片」。Agent 自动将 3D 素材排入轨道，写动效、配音效。',
      techPill: 'TSX Remotion 驱动 · 毫秒级重混',
      output: 'timeline_project.tsx',
    },
    {
      num: '03',
      title: '真帧自检与一键母带级出片',
      subtitle: 'QC VERIFICATION & MASTER RENDER',
      tool: '欧视界 (O-Vision)',
      color: '#2ed573',
      summary: 'Oltra 自动抽取第 72 帧与第 108 帧进行视觉排版校验，对比度与文字对齐 100% 确认无误后直接交付 4K 成片。',
      techPill: '2 帧严谨自查 · 0 猜不编假 UI',
      output: 'final_product_reveal_4k.mp4',
    },
  ];

  return (
    <section id="pipeline" className="py-24 sm:py-32 relative border-t border-white/[0.08] bg-[#08080b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 tracking-wider uppercase mb-3">
              <span>03. SYNERGISTIC PIPELINE</span>
              <span aria-hidden="true">·</span>
              <span>双引擎全链路协同</span>
              <span aria-hidden="true">·</span>
              <span>FROM ZERO TO MASTER</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display">
              从三维运镜到成片交付，<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#f5a623] to-[#2ed573]">
                一体化工业级创作流
              </span>。
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#9a9aa5] max-w-xl leading-relaxed">
            传统流程需要三维软件建模运镜、再导进合成软件手动打关键帧对齐音频，耗费数天。欧特科技将 O4D 的空间运镜与 Oltra 的时间线自主 Agent 无缝咬合，使创作耗时直接压缩至数分钟。
          </p>
        </div>

        {/* Step-by-Step Flow Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {steps.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`glass-panel p-6 sm:p-8 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-white/30 bg-white/[0.04] shadow-2xl'
                    : 'border-white/5 hover:border-white/15'
                }`}
              >
                {/* Step Index & Tool Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-2xl font-mono font-bold"
                    style={{ color: step.color }}
                  >
                    {step.num}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 text-zinc-300">
                    {step.tool}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                  {step.subtitle}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-xs text-[#9a9aa5] leading-relaxed mb-6">
                  {step.summary}
                </p>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">{step.techPill}</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: step.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pipeline Stage Deep Dive Box */}
        <div className="glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>STAGE {steps[activeStep].num} IN ACTION</span>
            </div>
            <h4 className="text-2xl font-bold text-white font-display">
              {steps[activeStep].title} 核心运作
            </h4>
            <p className="text-sm text-[#9a9aa5] leading-relaxed">
              {steps[activeStep].summary}
            </p>

            <div className="bg-[#0b0b0f] p-4 rounded-xl border border-white/5 font-mono text-xs space-y-1.5">
              <div className="text-zinc-500">// 流水线数据流契约：</div>
              <div className="text-zinc-200">
                Input: User Directed Intent &rarr; Engine: {steps[activeStep].tool}
              </div>
              <div className="text-emerald-400">
                Artifact Output: {steps[activeStep].output}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 text-white">
                <Check className="w-4 h-4 text-emerald-400" /> 零格式损失
              </span>
              <span className="flex items-center gap-1.5 text-white">
                <Check className="w-4 h-4 text-emerald-400" /> 全程无需手动打点
              </span>
              <span className="flex items-center gap-1.5 text-white">
                <Check className="w-4 h-4 text-emerald-400" /> 支持任意步骤重回
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3] group">
              <img
                src="/src/assets/images/studio_hardware_workspace_1790652245995.jpg"
                alt="欧特科技创作硬件工作站"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                <div className="text-xs font-mono text-zinc-300">
                  <div className="text-white font-semibold">OTE HARDWARE &amp; LOCAL WORKSPACE</div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">
                    从脚本到 4K 成片，全流程在本地芯片高能效比跑通
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
