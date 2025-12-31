import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, ExternalLink, Globe, Bot, Loader2, Sparkles, ChevronRight } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  category: string;
  isMiniApp: boolean;
  externalUrl?: string;
}

const TOOLS: Tool[] = [
  { id: 'knows', name: 'KnowS', category: '医学知识库', isMiniApp: true },
  { id: 'csco_guide', name: '肿瘤治疗指南（CSCO）', category: '诊疗规范', isMiniApp: true },
  { id: 'clinical_recruit', name: '临床试验患者招募', category: '临床试验', isMiniApp: true },
  { id: 'ms_med', name: '摩熵医药', category: '临床试验', isMiniApp: true },
  { id: 'tx_yidian', name: '腾讯医典', category: '用药管理', isMiniApp: true },
  { id: 'bh_health', name: '薄荷健康', category: '营养管理', isMiniApp: true },
  { id: 'med_knows_mdt', name: 'KnowS AI-MDT', category: '医学知识库', externalUrl: 'https://www.medknows.com', isMiniApp: false },
  { id: 'national_med', name: '国家异地就医备案', category: '就医政策', isMiniApp: true },
];

interface Props {
  stageId: string;
  onBack: () => void;
  onGoToChat: () => void;
}

const StageDetailPage: React.FC<Props> = ({ stageId, onBack, onGoToChat }) => {
  const [jumpingId, setJumpingId] = useState<string | null>(null);

  /**
   * 方案 A：后端动态生成 URL Scheme
   * 模拟请求后端接口以获取最新生成的 weixin://dl/business/?t=...
   */
  const fetchFreshScheme = async (toolId: string): Promise<string> => {
    // 模拟网络延迟 1 秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 💡 开发者说明：此处应替换为实际的 API 请求
    // const res = await fetch(`/api/wechat/generate-scheme?toolId=${toolId}`);
    // const { scheme } = await res.json();
    // return scheme;

    // 仅用于演示：返回一个模拟的动态 Scheme 结构
    return `weixin://dl/business/?t=MOCK_TICKET_${toolId}_${Date.now()}`;
  };

  const handleToolClick = async (tool: Tool) => {
    if (!tool.isMiniApp) {
      if (tool.externalUrl) window.open(tool.externalUrl, '_blank');
      return;
    }

    try {
      setJumpingId(tool.id);
      // 调用动态生成逻辑
      const scheme = await fetchFreshScheme(tool.id);
      
      // 在移动端外部浏览器中，此操作会尝试唤起微信
      window.location.href = scheme;
    } catch (err) {
      console.error('Failed to generate scheme:', err);
      alert('无法唤起微信，请确保已安装微信并稍后重试。');
    } finally {
      // 保持 500ms 额外状态，提升视觉平滑度
      setTimeout(() => setJumpingId(null), 500);
    }
  };

  return (
    <div className="min-h-full bg-brand-bg animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 rounded-b-[3rem] shadow-sm border-b border-slate-50 relative">
        <button 
          onClick={onBack}
          className="p-3 bg-slate-50 rounded-2xl text-slate-400 active:scale-90 transition-all mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">阶段详情支持</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Support Tools</p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Recommendation Area */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-orange" />
              智能推荐工具
            </h3>
            <span className="text-[10px] text-brand-core font-bold bg-brand-light px-2 py-1 rounded-full border border-brand-core/10">微信一键直达</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                disabled={jumpingId !== null}
                onClick={() => handleToolClick(tool)}
                className={`bg-white rounded-[2rem] p-5 flex items-center justify-between border-2 transition-all duration-300 relative overflow-hidden group active:scale-[0.98] ${
                  jumpingId === tool.id 
                    ? 'border-brand-core ring-4 ring-brand-core/5' 
                    : 'border-transparent card-shadow hover:border-brand-core/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    jumpingId === tool.id ? 'bg-brand-core text-white' : 'bg-brand-soft text-brand-dark'
                  }`}>
                    {jumpingId === tool.id ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      tool.isMiniApp ? <MessageCircle className="w-6 h-6" /> : <Globe className="w-6 h-6" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{tool.category}</p>
                    <p className="text-sm font-black text-slate-800 group-hover:text-brand-dark transition-colors">{tool.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {jumpingId === tool.id ? (
                    <span className="text-[10px] font-black text-brand-core animate-pulse">请求令牌中...</span>
                  ) : (
                    <div className="text-slate-300 group-hover:text-brand-dark transition-colors">
                      {tool.isMiniApp ? <ChevronRight className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
                    </div>
                  )}
                </div>

                {/* Loading Overlay Bar */}
                {jumpingId === tool.id && (
                  <div className="absolute bottom-0 left-0 h-1 bg-brand-core w-full animate-in slide-in-from-left duration-1000"></div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* AI Call to Action */}
        <section 
          onClick={onGoToChat}
          className="bg-brand-dark rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">对此阶段有疑问？</h3>
              <p className="text-xs text-white/60 font-medium leading-relaxed">
                点击呼唤小胰宝，为您进行针对该阶段的深度科普解读。
              </p>
            </div>
          </div>
          <div className="absolute top-1/2 right-6 -translate-y-1/2 z-10 text-white/30 group-hover:text-white/100 transition-all group-hover:translate-x-1">
            <ChevronRight className="w-8 h-8" />
          </div>
          {/* Decor */}
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        </section>
      </div>

      {/* Footer Info */}
      <div className="px-8 pb-32 text-center space-y-2 opacity-40">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Medical Decision Support System</p>
        <p className="text-[9px] font-bold text-slate-400">所有链接均由医学顾问委员会审核确保公益安全性</p>
      </div>
    </div>
  );
};

export default StageDetailPage;