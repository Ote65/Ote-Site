import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  RefreshCw,
  Clock,
  Laptop,
  FolderGit2,
  Sliders,
  ExternalLink,
  ChevronRight,
  Code2,
  Cpu,
  MonitorPlay
} from 'lucide-react';
import { OVisionStage } from '../types';

export const OltraSection: React.FC = () => {
  const [activeStage, setActiveStage] = useState<OVisionStage>('qc');
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [activeStyle, setActiveStyle] = useState('高端科技');

  const stages: {
    id: OVisionStage;
    name: string;
    sub: string;
    icon: string;
    details: string;
    codeLine: string;
  }[] = [
    {
      id: 'intent',
      name: '需求理解',
      sub: 'INTENT',
      icon: '01',
      details: '解析自然语言指令，拆解镜头分镜、音画卡点节奏与视觉风格定位。',
      codeLine: 'parse_intent(prompt="为新消费品牌制作15秒极简出海广告")',
    },
    {
      id: 'write',
      name: '代码生成',
      sub: 'WRITE',
      icon: '02',
      details: '编写 TSX / Remotion 高性能动画组件与图层渲染脚本，不依赖外部黑盒。',
      codeLine: 'apply_tsx(scene="hero_title", motion="fluid_kinetic")',
    },
    {
      id: 'preview',
      name: '本地预览',
      sub: 'PREVIEW',
      icon: '03',
      details: '本地合成引擎毫秒级实时生成回放帧，每段动效均在时间线上具象可见。',
      codeLine: 'view_preview(sec=1.2, cache_mode="in_memory")',
    },
    {
      id: 'qc',
      name: '真帧验收',
      sub: 'QC REVIEW',
      icon: '04',
      details: '每镜头截取 2 帧真静帧自动比对色板、文字对齐与穿模，不合格自主打回重写。',
      codeLine: 'qa_frame_check(f=72, f=108, criteria=["contrast", "layout"])',
    },
    {
      id: 'render',
      name: '出片交付',
      sub: 'RENDER',
      icon: '05',
      details: '无损导出 4K / ProRes / MP4，生成完整工程快照，随时支持回退与二次修改。',
      codeLine: 'render_export(res="4K", codec="h264_high", alpha=false)',
    },
  ];

  const quickPrompts = [
    {
      text: '“把标题换成全新空间运镜系统，节奏加快20%”',
      time: '0.8s 响应',
      result: '已更新标题文本组件，缓动曲线调整为 cubic-bezier(0.16, 1, 0.3, 1)，工程无重建。',
    },
    {
      text: '“在第 4 秒转场加个工业 HUD 扫描线与数据卡点”',
      time: '1.2s 响应',
      result: '已在切点插入 HUD Overlay 轨道，自动绑定背景对比度暗度，并匹配低音音轨。',
    },
    {
      text: '“整支片子色彩方案切换为 Riso 复古艺术色”',
      time: '1.5s 响应',
      result: '已批量重映射全局色板资产，保留全部文字位置与已有关键帧，渲染帧自检通过。',
    },
  ];

  const styles = [
    { name: '高端科技', tag: 'High-Tech Glass & Dark' },
    { name: '干净商务', tag: 'Minimal Corporate' },
    { name: '活泼 MG', tag: 'Kinetic Motion Typography' },
    { name: '工业 HUD', tag: 'Precision Telemetry' },
    { name: '赛博霓虹', tag: 'Cyberpunk Glow' },
    { name: 'Riso 艺术', tag: 'Halftone Screenprint' },
    { name: '数据图表', tag: 'Algorithmic Financial' },
    { name: '解说短片', tag: 'Editorial Documentary' },
  ];

  return (
    <section id="oltra" className="py-24 sm:py-32 relative border-t border-white/[0.08] bg-[#09090c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#f5a623] tracking-wider uppercase mb-3">
              <span>01. DESKTOP VIDEO AGENT</span>
              <span aria-hidden="true">·</span>
              <span>欧创 OLTRA</span>
              <span aria-hidden="true">·</span>
              <span>LOCAL-FIRST TIMELINE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display">
              一个会自己干活的<br />
              <span className="text-[#f5a623]">视频创作 Agent</span>。
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#9a9aa5] max-w-xl leading-relaxed">
            欧创不是在对话框里回你一段文案或抽卡的假片段。它直接运行在你的本地工程里——铺轨道、排素材、写动效、渲真帧自检。你不用手动去调千百个关键帧，但时间线上每一步都清晰可撤回。
          </p>
        </div>

        {/* Feature Grid: 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="glass-panel p-6 rounded-xl hover:border-[#f5a623]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#f5a623]/10 text-[#f5a623] flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">直接操作时间线</h3>
            <p className="text-xs text-[#9a9aa5] leading-relaxed">
              不是在聊天框里打草稿，而是实实在在进入工程铺素材、加字幕、切转场。改完的每一刀都落在轨道上。
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl hover:border-[#f5a623]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#f5a623]/10 text-[#f5a623] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">每镜头 2 帧真检</h3>
            <p className="text-xs text-[#9a9aa5] leading-relaxed">
              写完代码自主渲染关键帧自查对照，文字重叠或节奏不准自己打回重写，绝不将半成品敷衍推给用户。
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl hover:border-[#f5a623]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#f5a623]/10 text-[#f5a623] flex items-center justify-center mb-4">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">纯本地安全运行</h3>
            <p className="text-xs text-[#9a9aa5] leading-relaxed">
              工程文件、设计素材与渲染管线全部运行在你的本地机器上。不依赖云端排队，商用资产绝对保密。
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl hover:border-[#f5a623]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#f5a623]/10 text-[#f5a623] flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">10 秒改字即时出片</h3>
            <p className="text-xs text-[#9a9aa5] leading-relaxed">
              替换文案或调换局部镜头只需一句指令，智能识别上下文仅改目标图层，无需推倒工程从头生成。
            </p>
          </div>
        </div>

        {/* Master Interactive Module: 欧视界 O-Vision Loop Simulator */}
        <div className="glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden mb-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-mono text-[#f5a623] uppercase tracking-wider">
                O-VISION ENGINE · 闭环创作机制
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                欧视界五灯流水线：从需求到成片的自洽闭环
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ROUND 07 / 24 · AUTO-REVIEW PASS</span>
            </div>
          </div>

          {/* Interactive 5-Stage Lamps */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
            {stages.map((stage) => {
              const isActive = activeStage === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStage(stage.id)}
                  className={`p-4 rounded-xl text-left transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-[#f5a623]/15 border-[#f5a623] shadow-[0_0_20px_rgba(245,166,35,0.2)]'
                      : 'bg-black/30 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-mono ${
                        isActive ? 'text-[#f5a623]' : 'text-zinc-500'
                      }`}
                    >
                      {stage.icon}
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isActive
                          ? 'bg-[#f5a623] shadow-[0_0_8px_#f5a623]'
                          : 'bg-zinc-700'
                      }`}
                    />
                  </div>
                  <div className="text-sm font-bold text-white">{stage.name}</div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{stage.sub}</div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Deep Dive */}
          <div className="mt-6 bg-[#0a0a0e] rounded-xl p-5 border border-white/10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-1 space-y-2">
              <div className="text-xs font-mono text-[#f5a623]">
                STAGE SPECIFICATION // {activeStage.toUpperCase()}
              </div>
              <h4 className="text-base font-semibold text-white">
                {stages.find((s) => s.id === activeStage)?.name} 运行细则
              </h4>
              <p className="text-xs text-[#9a9aa5] leading-relaxed">
                {stages.find((s) => s.id === activeStage)?.details}
              </p>
            </div>

            <div className="lg:col-span-2 bg-black/60 rounded-lg p-4 border border-white/5 font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between text-zinc-500 text-[11px] pb-2 mb-2 border-b border-white/5">
                <span>TERMINAL SNAPSHOT</span>
                <span className="text-[#f5a623]">STATUS: VERIFIED</span>
              </div>
              <div className="space-y-1 text-zinc-300">
                <div className="text-[#f5a623]">
                  &gt; {stages.find((s) => s.id === activeStage)?.codeLine}
                </div>
                <div className="text-zinc-500 text-[11px]">
                  [Engine: Remotion v4.0.12 · Frame: 108/360 · Easing: QuadOut]
                </div>
                <div className="text-emerald-400 text-[11px]">
                  ✓ 2 Keyframes self-check passed: Contrast 7.2:1, No element collision.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Instant Revision Demo & MCP Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 10s Revision Playground */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#f5a623]">
                <Sliders className="w-4 h-4" />
                <span>INTERACTIVE REVISION PLAYGROUND</span>
              </div>
              <span className="text-xs text-zinc-400 font-mono">10 SECONDS TURNAROUND</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              体验一句话改动：不破坏已有轨道
            </h3>
            <p className="text-xs text-[#9a9aa5] mb-5">
              点击下方任一真实修改指令，查看 Oltra 如何在保留时间线上下文的情况下毫秒级更新：
            </p>

            <div className="space-y-2 mb-6">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedPromptIndex(index)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedPromptIndex === index
                      ? 'bg-[#f5a623]/10 border-[#f5a623] text-white'
                      : 'bg-black/30 border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="font-medium truncate">{prompt.text}</span>
                  <span className="text-[11px] font-mono text-[#f5a623] shrink-0">
                    {prompt.time}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-[#0b0b0f] p-4 rounded-xl border border-white/5 text-xs font-mono">
              <div className="text-zinc-500 mb-1">// 执行结果反馈：</div>
              <div className="text-zinc-200">
                {quickPrompts[selectedPromptIndex].result}
              </div>
            </div>
          </div>

          {/* MCP Ecosystem & Styles */}
          <div className="lg:col-span-5 space-y-6">
            {/* MCP Card */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-2">
                <Code2 className="w-4 h-4" />
                <span>MCP PROTOCOL COMPATIBLE</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">你的主 Agent，直接指挥欧创</h3>
              <p className="text-xs text-[#9a9aa5] leading-relaxed mb-4">
                欧创将自身封装为开放 MCP 工具。Cursor、Claude Code、Codex、Trae 均可将其作为专业视频后端调用，编写分镜即可自动出片。
              </p>

              <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
                {['Cursor', 'Claude Code', 'Codex', 'Trae', 'ZCode'].map((agent) => (
                  <span
                    key={agent}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md"
                  >
                    {agent}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Style Showcase */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-emerald-400">8 大出厂风格与模板</span>
                <span className="text-[11px] text-zinc-500 font-mono">20+ TEMPLATES</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {styles.map((style) => (
                  <button
                    key={style.name}
                    type="button"
                    onClick={() => setActiveStyle(style.name)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      activeStyle === style.name
                        ? 'bg-white/15 border-white/30 text-white font-medium'
                        : 'bg-black/20 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="truncate">{style.name}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{style.tag}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section Footer Actions */}
        <div className="mt-14 pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-zinc-400">
            <span>支持 macOS & Windows 本地客户端</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>包含完整 TSX 动效与 Remotion 运行时</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://oltra.ote.asia"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-black bg-[#f5a623] hover:bg-[#e09419] rounded-lg transition-all"
            >
              <span>前往欧创 Oltra 独立官网</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://oltra.ote.asia/download.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg transition-all"
            >
              <span>下载安装包</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
