
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, MessageCircle, Bot, Loader2, Sparkles, ChevronRight, 
  BookOpen, Users, QrCode, Info, ShieldCheck, FileText, 
  Target, Heart, HelpCircle, ArrowRight, Star, FileJson, 
  Link as LinkIcon, File as FileIcon, ExternalLink, PlayCircle,
  FileSearch, CheckCircle2, MoreHorizontal, Share2, Briefcase, 
  Activity, Users2, Flower2, Baby
} from 'lucide-react';
import SourceBadge from '../components/SourceBadge';
import { SourceLevel } from '../types';

// 吉祥物图片路径 - 使用新的 HTTPS 链接
const MASCOT_IMG = "https://picgo-1302991947.cos.ap-guangzhou.myqcloud.com/images/logo_512_image.png";

interface Tool {
  id: string;
  name: string;
  category: string;
  isMiniApp: boolean;
  externalUrl?: string;
}

interface DocItem {
  type: 'pdf' | 'doc' | 'link' | 'tencent';
  title: string;
  url: string;
}

interface ExperienceCard {
  image: string;
  title: string;
  author: string;
  avatar: string;
  likes: string;
}

interface StageContent {
  consensusTitle: string;
  consensusPoints: string[];
  docs: DocItem[];
  recommendations: { title: string; desc: string; type: string; level: SourceLevel }[];
  experiences: ExperienceCard[];
  groups: { name: string; theme: string; id: string }[];
}

interface Props {
  stageId: string;
  onBack: () => void;
  onGoToChat: () => void;
  isCareMode?: boolean;
}

const TOOLS: Tool[] = [
  { id: 'knows', name: 'KnowS 医学百科', category: '医学知识库', isMiniApp: true },
  { id: 'csco_guide', name: 'CSCO 诊疗指南', category: '诊疗规范', isMiniApp: true },
  { id: 'tx_yidian', name: '腾讯医典', category: '科普库', isMiniApp: true },
  { id: 'nutri_pal', name: '营养伴侣', category: '营养评估', isMiniApp: true },
  { id: 'psy_guardian', name: '心理守护', category: '心理评测', isMiniApp: true },
  { id: 'follow_up', name: '随访助手', category: '随访管理', isMiniApp: true },
  { id: 'pain_log', name: '疼痛日记', category: '症状监测', isMiniApp: true },
  { id: 'life_rebuild', name: '生活重建', category: '生活质量', isMiniApp: true },
  { id: 'doc_connect', name: '名医直连', category: '专家预约', isMiniApp: true },
  { id: 'community_hub', name: '战友互助中心', category: '社群交流', isMiniApp: true },
];

const STAGE_LANDING_DATA: Record<string, StageContent> = {
  'early': {
    consensusTitle: '早筛与早诊临床路径',
    consensusPoints: [
      '高危预警：年龄>50岁，伴有突发糖尿病或慢性胰腺炎病史者需高度警惕。',
      '检查标准：首选薄层增强CT成像，CA199肿瘤标志物作为辅助评估指标。',
      '随访策略：高危人群建议每6个月进行一次多模态影像学监测。'
    ],
    docs: [
      { type: 'pdf', title: '胰腺癌早诊早治专家共识(2024版).pdf', url: '#' },
      { type: 'tencent', title: '【在线文档】胰腺癌风险自测评表', url: '#' },
      { type: 'link', title: '卫健委：解读早期胰腺癌的10个信号', url: '#' }
    ],
    recommendations: [
      { title: 'CA199升高一定是胰腺癌吗？', desc: '深度解读指标波动的5种常见原因', type: '热门科普', level: SourceLevel.A },
      { title: 'CT与核磁该选哪一个？', desc: '看懂检查报告的关键参数', type: '检查指南', level: SourceLevel.B },
      { title: '防癌体检中的常见陷阱', desc: '为什么普通B超容易漏诊', type: '避坑指南', level: SourceLevel.C }
    ],
    experiences: [
      { image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80', title: '体检发现指标异常，我是如何在一周内确诊并手术的', author: '阳光下的莘花', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', likes: '2.8k' },
      { image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80', title: '陪老爸抗癌这一年，早筛救了他的命', author: '抗癌家属小李', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', likes: '1.2k' }
    ],
    groups: [{ id: 'g1', name: '早筛风险沟通群', theme: '指标解读与专家推荐' }]
  },
  'quality_life': {
    consensusTitle: '生活质量与社会功能重建',
    consensusPoints: [
      '工作平衡：化疗期间可根据体力选择弹性工作方式，有助于维持心理价值感。',
      '亲密关系：化疗药物不会通过日常接触传播，合理的性生活有助于缓解焦虑，但需采取安全措施。',
      '生育保护：育龄患者应在治疗前咨询冷冻卵子/精子方案，保留未来生育可能。'
    ],
    docs: [
      { type: 'pdf', title: '肿瘤患者回归社会生活指南.pdf', url: '#' },
      { type: 'link', title: '专题：化疗期间如何保持职场竞争力', url: '#' },
      { type: 'tencent', title: '【攻略】假发与化妆：身体形象重建手册', url: '#' }
    ],
    recommendations: [
      { title: '化疗期间能有性生活吗？', desc: '医生不敢说、你不敢问的私密建议', type: '亲密关系', level: SourceLevel.A },
      { title: '肿瘤患者的运动处方', desc: '什么时候能跑？什么时候只能散步？', type: '体能重建', level: SourceLevel.B },
      { title: '疤痕与脱发的心里调适', desc: '找回那个“不再完美但依然爱自己”的你', type: '身体形象', level: SourceLevel.C }
    ],
    experiences: [
      { image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80', title: '带着假发回公司上班的第一天，同事们的反应让我哭了', author: '勇敢的职场妈', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', likes: '5.2k' },
      { image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&q=80', title: '确诊前我刚准备要孩子，分享我的冻卵心路历程', author: '向阳小花', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', likes: '3.9k' }
    ],
    groups: [{ id: 'g_life', name: '生活品质管理群', theme: '职业规划与两性沟通' }]
  },
  'nutri_eval': {
    consensusTitle: '科学营养筛查与干预',
    consensusPoints: [
      '动态监测：每周固定时间测量空腹体重，非预期下降>5%需立即干预。',
      '风险评估：使用PG-SGA量表进行专业评估，识别隐匿性营养不良。',
      '补充原则：高蛋白、高能量、少食多餐，必要时补充肠内营养制剂。'
    ],
    docs: [
      { type: 'pdf', title: '肿瘤患者营养支持治疗指南 2024.pdf', url: '#' },
      { type: 'tencent', title: '【工具】PG-SGA 营养自测小程序', url: '#' },
      { type: 'doc', title: '肿瘤居家饮食红黑榜.doc', url: '#' }
    ],
    recommendations: [
      { title: '肿瘤患者能吃“发物”吗？', desc: '基于现代营养学的迷思拆解', type: '避坑指南', level: SourceLevel.A },
      { title: '如何通过家常菜补足蛋白？', desc: '适合术后/化疗期的食谱推荐', type: '营养实操', level: SourceLevel.C },
      { title: '肠内营养制剂怎么选？', desc: '口感、成分、适用人群深度测评', type: '产品解析', level: SourceLevel.B }
    ],
    experiences: [
      { image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', title: '从体重暴跌到恢复正常，我的增重食谱分享', author: '抗癌小厨神', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', likes: '3.1k' },
      { image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80', title: '化疗期的饮食红黑榜，这些真的很有用', author: '营养师老刘', avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?w=100&q=80', likes: '1.5k' }
    ],
    groups: [{ id: 'g_nutri', name: '营养互助打卡群', theme: '食谱分享与指标监督' }]
  }
};

const StageDetailPage: React.FC<Props> = ({ stageId, onBack, onGoToChat, isCareMode }) => {
  const [jumpingId, setJumpingId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const content = STAGE_LANDING_DATA[stageId] || STAGE_LANDING_DATA['early'];

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [stageId]);

  const handleToolClick = async (tool: Tool) => {
    try {
      setJumpingId(tool.id);
      await new Promise(resolve => setTimeout(resolve, 800));
      window.location.href = `weixin://dl/business/?t=MOCK_${tool.id}`;
    } catch (err) {
      console.error(err);
    } finally {
      setJumpingId(null);
    }
  };

  const getDocIcon = (type: string) => {
    const size = isCareMode ? "w-7 h-7" : "w-5 h-5";
    switch (type) {
      case 'pdf': return <FileIcon className={`${size} text-red-500`} />;
      case 'doc': return <FileText className={`${size} text-blue-500`} />;
      case 'tencent': return <FileJson className={`${size} text-brand-core`} />;
      default: return <LinkIcon className={`${size} text-slate-400`} />;
    }
  };

  return (
    <div className={`min-h-full bg-slate-50 flex flex-col relative animate-in fade-in duration-500 ${isCareMode ? 'care-mode-root' : ''}`}>
      {/* Header */}
      <div className={`bg-white/95 backdrop-blur-xl px-6 sticky top-0 z-50 border-b border-slate-100/50 shrink-0 ${isCareMode ? 'pt-14 pb-8' : 'pt-12 pb-6'}`}>
        <div className="flex items-center justify-between mb-5">
          <button onClick={onBack} className={`${isCareMode ? 'p-3.5' : 'p-2.5'} bg-slate-100 rounded-2xl text-slate-500 active:scale-90 transition-all`}>
            <ArrowLeft className={isCareMode ? "w-7 h-7" : "w-5 h-5"} />
          </button>
          <div className="flex items-center gap-3">
             <button className={`${isCareMode ? 'p-3.5' : 'p-2.5'} bg-slate-100 rounded-2xl text-slate-500`}><Heart className={isCareMode ? "w-7 h-7" : "w-5 h-5"} /></button>
             <button className={`${isCareMode ? 'p-3.5' : 'p-2.5'} bg-slate-100 rounded-2xl text-slate-500`}><Share2 className={isCareMode ? "w-7 h-7" : "w-5 h-5"} /></button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`${isCareMode ? 'w-20 h-20 rounded-4xl' : 'w-16 h-16 rounded-[1.8rem]'} bg-brand-soft flex items-center justify-center border-4 border-white shadow-sm shrink-0`}>
            <Target className={isCareMode ? "w-10 h-10 text-brand-core" : "w-8 h-8 text-brand-core"} />
          </div>
          <div className="space-y-1">
            <h2 className={`${isCareMode ? 'text-3xl' : 'text-2xl'} font-black text-slate-800 tracking-tight leading-none`}>病情管理一页通</h2>
            <div className="flex items-center gap-2">
              <SourceBadge level={SourceLevel.A} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto px-5 pt-5 pb-48 space-y-10 ${isCareMode ? 'care-p' : ''}`}
      >
        {/* 1. 指南共识精要 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className={isCareMode ? "w-7 h-7 text-brand-core" : "w-5 h-5 text-brand-core"} />
            <h3 className={`${isCareMode ? 'text-2xl' : 'text-base'} font-black text-slate-800`}>《指南共识》精要</h3>
          </div>
          
          <div className={`bg-white rounded-[2.8rem] card-shadow border border-slate-100 space-y-8 relative overflow-hidden ${isCareMode ? 'p-10' : 'p-7'}`}>
            <div className="space-y-5 relative z-10">
              <h4 className={`${isCareMode ? 'text-lg' : 'text-sm'} font-black text-brand-dark flex items-center gap-2`}>
                <CheckCircle2 className={isCareMode ? "w-6 h-6" : "w-4 h-4"} /> {content.consensusTitle}
              </h4>
              <div className="space-y-4">
                {content.consensusPoints.map((point, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`${isCareMode ? 'w-8 h-8 text-sm' : 'w-6 h-6 text-xs'} rounded-xl bg-brand-soft text-brand-core flex items-center justify-center font-black shrink-0 mt-0.5`}>{i+1}</div>
                    <p className={`font-bold text-slate-600 leading-relaxed ${isCareMode ? 'text-lg' : 'text-[13px]'}`}>{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 relative z-10">
              <div className="flex items-center justify-between mb-4 px-1">
                <p className={`${isCareMode ? 'text-sm' : 'text-[11px]'} font-black text-slate-400 uppercase tracking-widest`}>附件资源清单</p>
                <FileSearch className={isCareMode ? "w-6 h-6 text-slate-300" : "w-4 h-4 text-slate-300"} />
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {content.docs.map((doc, i) => (
                  <div key={i} className={`flex items-center justify-between bg-slate-50 rounded-2xl group active:scale-[0.98] transition-all cursor-pointer border border-transparent hover:border-brand-light hover:bg-white ${isCareMode ? 'p-6' : 'p-4'}`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      {getDocIcon(doc.type)}
                      <span className={`font-black text-slate-700 truncate ${isCareMode ? 'text-base' : 'text-xs'}`}>{doc.title}</span>
                    </div>
                    <ChevronRight className={isCareMode ? "w-6 h-6 text-slate-300 group-hover:text-brand-core" : "w-4 h-4 text-slate-300 group-hover:text-brand-core"} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. 推荐阅读 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <BookOpen className={isCareMode ? "w-7 h-7 text-brand-orange" : "w-5 h-5 text-brand-orange"} />
            <h3 className={`${isCareMode ? 'text-2xl' : 'text-base'} font-black text-slate-800`}>推荐阅读</h3>
          </div>
          <div className="grid grid-cols-1 gap-3.5">
            {content.recommendations.map((rec, i) => (
              <div key={i} className={`bg-white rounded-[2.2rem] card-shadow border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer ${isCareMode ? 'p-8' : 'p-5'}`}>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <SourceBadge level={rec.level} />
                  </div>
                  <h4 className={`font-black text-slate-800 group-hover:text-brand-dark leading-snug ${isCareMode ? 'text-xl' : 'text-[14px]'}`}>{rec.title}</h4>
                  <p className={`${isCareMode ? 'text-sm' : 'text-[11px]'} text-slate-400 font-bold line-clamp-1`}>{rec.desc}</p>
                </div>
                <div className={`${isCareMode ? 'w-14 h-14 rounded-3xl' : 'w-10 h-10 rounded-2xl'} ml-4 bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-soft group-hover:text-brand-core transition-all`}>
                  <ExternalLink className={isCareMode ? "w-6 h-6" : "w-4 h-4"} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. 推荐工具 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className={isCareMode ? "w-7 h-7 text-brand-orange" : "w-5 h-5 text-brand-orange"} />
            <h3 className={`${isCareMode ? 'text-2xl' : 'text-base'} font-black text-slate-800`}>推荐工具清单</h3>
          </div>
          <div className="grid grid-cols-1 gap-3.5">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                disabled={jumpingId !== null}
                onClick={() => handleToolClick(tool)}
                className={`bg-white rounded-[2.2rem] flex items-center justify-between border-2 transition-all relative overflow-hidden group active:scale-[0.98] ${
                  jumpingId === tool.id ? 'border-brand-core ring-4 ring-brand-core/5' : 'border-transparent card-shadow hover:border-brand-light'
                } ${isCareMode ? 'p-8' : 'p-6'}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`${isCareMode ? 'w-16 h-16 rounded-[1.5rem]' : 'w-12 h-12 rounded-[1.5rem]'} flex items-center justify-center transition-colors shadow-inner ${
                    jumpingId === tool.id ? 'bg-brand-core text-white' : 'bg-slate-50 text-brand-dark'
                  }`}>
                    {jumpingId === tool.id ? <Loader2 className={isCareMode ? "w-8 h-8 animate-spin" : "w-6 h-6 animate-spin"} /> : <MessageCircle className={isCareMode ? "w-8 h-8" : "w-6 h-6"} />}
                  </div>
                  <div className="text-left">
                    <p className={`${isCareMode ? 'text-xs' : 'text-[10px]'} font-black text-slate-300 uppercase tracking-widest mb-0.5`}>{tool.category}</p>
                    <p className={`${isCareMode ? 'text-lg' : 'text-[14px]'} font-black text-slate-800`}>{tool.name}</p>
                  </div>
                </div>
                <ChevronRight className={isCareMode ? "w-7 h-7 text-slate-200 group-hover:text-brand-dark" : "w-5 h-5 text-slate-200 group-hover:text-brand-dark"} />
              </button>
            ))}
          </div>
        </section>

        {/* 底部版权 */}
        <div className="px-10 py-10 text-center space-y-3 opacity-30">
          <p className={`${isCareMode ? 'text-xs' : 'text-[10px]'} font-black text-slate-500 uppercase tracking-[0.2em]`}>Medical Support Ecosystem V3.0</p>
          <p className={`${isCareMode ? 'text-xs' : 'text-[10px]'} font-bold text-slate-400 leading-relaxed`}>所有信源均经由平台医学顾问委员会认证</p>
        </div>
      </div>

      {/* AI Entrance */}
      <div className={`absolute left-6 right-6 z-[60] flex justify-center pointer-events-none ${isCareMode ? 'bottom-28' : 'bottom-24'}`}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onGoToChat();
          }}
          className={`w-full bg-gradient-to-r from-brand-core to-brand-dark text-white rounded-[2.5rem] shadow-2xl shadow-brand-core/30 border-4 border-white flex items-center justify-center gap-3 active:scale-[0.97] transition-all group pointer-events-auto ${isCareMode ? 'py-6' : 'py-4.5'}`}
        >
          <div className={`${isCareMode ? 'w-10 h-10 rounded-xl' : 'w-8 h-8 rounded-lg'} bg-white flex items-center justify-center group-hover:rotate-12 transition-transform overflow-hidden p-0.5 shadow-inner`}>
            <img src={MASCOT_IMG} alt="" className="w-full h-full object-contain" />
          </div>
          <span className={`${isCareMode ? 'text-xl' : 'text-[15px]'} font-black tracking-tight`}>针对此阶段向 AI 提问</span>
        </button>
      </div>
    </div>
  );
};

export default StageDetailPage;
