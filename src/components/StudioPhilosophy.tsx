import React from 'react';
import { ShieldCheck, Eye, Terminal, Sparkles } from 'lucide-react';

export const StudioPhilosophy: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: '不编造假素材，尊重真实品牌',
      description:
        '丢给系统真实的设计稿、色号与产品模型，它就严格按照像素和空间尺度执行。我们拒绝生成四不像的虚假界面与扭曲乱码，真正交付可用的商用工程。',
    },
    {
      num: '02',
      title: '时间线可见，每一步都能撤回',
      description:
        '创作不是一键丢进黑盒祈祷奇迹。在欧特产品矩阵里，时间线上的每一切段、三维空间的每一个旋转度数都在你眼前。每动一步存一个快照，随时回到任意节点。',
    },
    {
      num: '03',
      title: '代码驱动的数学级优雅',
      description:
        '我们将复杂的动态视效与空间摄像机运动抽象为严密的数学缓动方程与 TSX 组件。不仅轻量高效，更能实现像素级严谨的帧率自洽与跨平台渲染。',
    },
    {
      num: '04',
      title: '主权在人：在本地机器自由掌控',
      description:
        '所有关键计算与工程资产始终扎根在创作者的本地工作站上。无需忍受公有云排队与带宽限制，创作成果永远属于创作者自己。',
    },
  ];

  return (
    <section className="py-24 sm:py-32 relative border-t border-white/[0.08] bg-[#07070a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-[#f5a623] tracking-wider uppercase mb-3">
            <span>05. DESIGN PHILOSOPHY</span>
            <span aria-hidden="true">·</span>
            <span>关于欧特的造物哲学</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display">
            把机械重复的苦力活，<br />
            交给懂检查的系统。
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#9a9aa5] leading-relaxed">
            我们不制造廉价的聊天玩具。我们为真正需要交付作品的剪辑师、动态设计师、出海团队与产品团队，打造值得信赖的工业级专业创作基座。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.num}
              className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="text-xs font-mono text-[#f5a623] mb-3">
                PRINCIPLE // {pillar.num}
              </div>
              <h3 className="text-xl font-bold text-white font-display mb-3">
                {pillar.title}
              </h3>
              <p className="text-sm text-[#9a9aa5] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
