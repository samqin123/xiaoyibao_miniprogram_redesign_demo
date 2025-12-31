
import React from 'react';
// Added Bot to the import list to fix "Cannot find name 'Bot'" error
import { ArrowLeft, MessageCircle, ExternalLink, Users, BookMarked, Globe, Bot } from 'lucide-react';
import { ROADMAP_DATA } from '../constants';

interface Tool {
  name: string;
  category: string;
  link: string;
  isMiniApp: boolean;
}

const TOOLS: Tool[] = [
  { name: 'KnowS', category: '医学知识库', link: '#', isMiniApp: true },
  { name: '肿瘤治疗指南', category: '诊疗规范', link: '#', isMiniApp: true },
  { name: '临床试验招募', category: '临床试验', link: '#', isMiniApp: true },
  { name: '腾讯医典', category: '用药管理', link: '#', isMiniApp: true },
];

interface Props {
  stageId: string;
  onBack: () => void;
  onGoToChat: () => void;
}

const StageDetailPage: React.FC<Props> = ({ stageId, onBack, onGoToChat }) => {
  // Find the label from ROADMAP_DATA
  const getAllItems = () => {
    let all: any[] = [];
    ROADMAP_DATA.forEach(g => {
      g.items.forEach(i => {
        all.push(i);
        if (i.children) all.push(...i.children);
      });
    });
    return all;
  };
  
  const item = getAllItems().find(i => i.id === stageId);
  const label = item ? item.label : '详情';

  return (
    <div className="relative min-h-full pb-20 bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-800">{label}</h2>
          <p className="text-[10px] text-slate-400 font-medium">主动管理专项指南</p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Intro */}
        <div className="p-6 bg-brand-soft rounded-3xl border border-brand-light">
          <h3 className="text-sm font-black text-brand-dark mb-2">管理要点</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            针对 {label}，建议定期监测相关指标，并结合 AI 助手进行深度科普了解。
          </p>
        </div>

        {/* Section C: Community */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-base font-bold text-slate-800">专家经验 & 社区</h3>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex gap-4">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center">
              <Bot className="w-10 h-10 text-slate-300" />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm font-bold text-slate-800">加入专属交流群</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">识别二维码加入，获取同伴支持与专业科普。</p>
            </div>
          </div>
        </section>

        {/* Section T: Tools */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <BookMarked className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-800">推荐科普工具</h3>
          </div>
          
          <div className="space-y-3">
            {TOOLS.map((tool, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    {tool.isMiniApp ? <MessageCircle className="w-5 h-5 text-emerald-500" /> : <Globe className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{tool.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{tool.category}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full hover:bg-brand-dark hover:text-white transition-all">
                  <span className="text-[10px] font-bold">前往</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StageDetailPage;
