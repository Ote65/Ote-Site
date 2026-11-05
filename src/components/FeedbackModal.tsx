import React, { useState } from 'react';
import { X, Send, CheckCircle, Mail, MessageSquare } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('请输入有效的电子邮箱地址');
      return;
    }
    if (!message.trim()) {
      setError('请输入您的反馈或合作需求');
      return;
    }

    setError('');
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setEmail('');
    setSubject('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0e0e14] border border-white/15 rounded-2xl overflow-hidden shadow-2xl z-10">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#12121c]">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#f5a623]" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              联系欧特科技 · 问题反馈与商务合作
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-white font-display">
                感谢您的信息反馈！
              </h4>
              <p className="text-xs text-[#9a9aa5] max-w-xs mx-auto leading-relaxed">
                我们已收到您的诉求，欧特团队将尽快通过邮件与您联系。您也可以直接发送邮件至{' '}
                <span className="text-[#f5a623] font-mono">3206219621@qq.com</span>。
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-5 py-2.5 text-xs font-semibold text-black bg-[#f5a623] hover:bg-[#e09419] rounded-lg transition-all cursor-pointer"
              >
                完成
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  您的联系邮箱 <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#f5a623] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  咨询产品或议题
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#f5a623] transition-colors"
                >
                  <option value="oltra">欧创 Oltra · 视频 Agent 咨询与反馈</option>
                  <option value="o4d">O4D · 3D 空间运镜与功能建议</option>
                  <option value="pipeline">双引擎协同与企业工作流定制</option>
                  <option value="other">其他合作交流</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  反馈详情 / 需求描述 <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="请详细描述您遇到的问题、改进建议或业务需求..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#f5a623] transition-colors"
                  required
                />
              </div>

              {error && (
                <div className="text-xs text-red-400 font-mono">
                  {error}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <a
                  href="mailto:3206219621@qq.com"
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 font-mono underline"
                >
                  直连开发者: 3206219621@qq.com
                </a>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-black bg-[#f5a623] hover:bg-[#e09419] rounded-lg transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,166,35,0.2)] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>提交反馈</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
