
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

const StageDetailPage: React.FC<Props> = ({ stageId, onBack, onGoToChat }) => {
  const [jumpingId, setJumpingId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const content = STAGE_LANDING_DATA[stageId] || STAGE_LANDING_DATA['early'];

  // 强化跳转自动置顶逻辑：详情页内部的滚动容器也必须归零
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
    switch (type) {
      case 'pdf': return <FileIcon className="w-5 h-5 text-red-500" />;
      case 'doc': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'tencent': return <FileJson className="w-5 h-5 text-brand-core" />;
      default: return <LinkIcon className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-full bg-slate-50 flex flex-col relative animate-in fade-in duration-500">
      {/* 顶部导航 - 吸顶设计 */}
      <div className="bg-white/95 backdrop-blur-xl px-6 pt-12 pb-6 sticky top-0 z-50 border-b border-slate-100/50 shrink-0">
        <div className="flex items-center justify-between mb-5">
          <button onClick={onBack} className="p-2.5 bg-slate-100 rounded-2xl text-slate-500 active:scale-90 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
             <button className="p-2.5 bg-slate-100 rounded-2xl text-slate-500"><Heart className="w-5 h-5" /></button>
             <button className="p-2.5 bg-slate-100 rounded-2xl text-slate-500"><Share2 className="w-5 h-5" /></button>
             <button className="p-2 bg-brand-soft rounded-2xl text-brand-core border border-brand-light">
               <MoreHorizontal className="w-5 h-5" />
             </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-brand-soft rounded-[1.8rem] flex items-center justify-center border-4 border-white shadow-sm shrink-0">
            <Target className="w-8 h-8 text-brand-core" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">病情管理一页通</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-brand-dark text-white px-2 py-0.5 rounded-full font-black tracking-widest uppercase">Expert Verified</span>
              <SourceBadge level={SourceLevel.A} />
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 - 内部滚动重置 */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-5 pt-5 pb-48 space-y-10"
      >
        {/* 1. 指南共识精要 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="w-5 h-5 text-brand-core" />
            <h3 className="text-base font-black text-slate-800">《指南共识》精要</h3>
          </div>
          
          <div className="bg-white rounded-[2.8rem] p-7 card-shadow border border-slate-100 space-y-8 relative overflow-hidden">
            <div className="space-y-5 relative z-10">
              <h4 className="text-sm font-black text-brand-dark flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {content.consensusTitle}
              </h4>
              <div className="space-y-4">
                {content.consensusPoints.map((point, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-xl bg-brand-soft text-brand-core flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{i+1}</div>
                    <p className="text-[13px] font-bold text-slate-600 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 relative z-10">
              <div className="flex items-center justify-between mb-4 px-1">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">附件资源清单</p>
                <FileSearch className="w-4 h-4 text-slate-300" />
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {content.docs.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group active:scale-[0.98] transition-all cursor-pointer border border-transparent hover:border-brand-light hover:bg-white">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {getDocIcon(doc.type)}
                      <span className="text-xs font-black text-slate-700 truncate">{doc.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-core" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. 推荐阅读 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <BookOpen className="w-5 h-5 text-brand-orange" />
            <h3 className="text-base font-black text-slate-800">推荐阅读</h3>
          </div>
          <div className="grid grid-cols-1 gap-3.5">
            {content.recommendations.map((rec, i) => (
              <div key={i} className="bg-white p-5 rounded-[2.2rem] card-shadow border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-brand-light text-brand-dark px-2 py-0.5 rounded-lg font-black">{rec.type}</span>
                    <SourceBadge level={rec.level} />
                  </div>
                  <h4 className="text-[14px] font-black text-slate-800 group-hover:text-brand-dark leading-snug">{rec.title}</h4>
                  <p className="text-[11px] text-slate-400 font-bold line-clamp-1">{rec.desc}</p>
                </div>
                <div className="ml-4 w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-soft group-hover:text-brand-core transition-all">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 病友经验 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              <h3 className="text-base font-black text-slate-800">病友经验</h3>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
            {content.experiences.map((exp, i) => (
              <div key={i} className="w-[11.5rem] shrink-0 bg-white rounded-[2.5rem] overflow-hidden card-shadow border border-slate-100 flex flex-col group active:scale-[0.98] transition-all">
                <div className="h-[12.5rem] overflow-hidden relative">
                  <img src={exp.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                    <Heart className="w-2.5 h-2.5 text-white fill-white" />
                    <span className="text-[10px] text-white font-black">{exp.likes}</span>
                  </div>
                </div>
                <div className="p-4.5 space-y-3.5">
                  <h4 className="text-[13px] font-black text-slate-800 line-clamp-2 leading-tight h-[2.4rem]">{exp.title}</h4>
                  <div className="flex items-center gap-2">
                    <img src={exp.avatar} className="w-5 h-5 rounded-full border border-slate-100" alt="" />
                    <span className="text-[10px] font-bold text-slate-500 truncate">{exp.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 生活管理专题 */}
        {stageId === 'quality_life' && (
          <section className="space-y-4">
             <div className="flex items-center gap-2 px-1">
              <Sparkles className="w-5 h-5 text-brand-core" />
              <h3 className="text-base font-black text-slate-800">生活管理专题</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Briefcase, label: '职场与工作', color: 'bg-blue-50 text-blue-500' },
                { icon: Activity, label: '运动处方', color: 'bg-emerald-50 text-emerald-500' },
                { icon: Users2, label: '亲密关系', color: 'bg-pink-50 text-pink-500' },
                { icon: Flower2, label: '身体形象', color: 'bg-purple-50 text-purple-500' },
                { icon: Baby, label: '生育规划', color: 'bg-orange-50 text-orange-500' },
                { icon: PlayCircle, label: '回归路线图', color: 'bg-slate-50 text-slate-500' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-3xl card-shadow border border-slate-50 flex flex-col items-center gap-2 hover:border-brand-core transition-all cursor-pointer">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-black text-slate-700">{item.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. 推荐工具 (完整的 10 项清单) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-5 h-5 text-brand-orange" />
            <h3 className="text-base font-black text-slate-800">推荐工具清单</h3>
          </div>
          <div className="grid grid-cols-1 gap-3.5">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                disabled={jumpingId !== null}
                onClick={() => handleToolClick(tool)}
                className={`bg-white rounded-[2.2rem] p-6 flex items-center justify-between border-2 transition-all relative overflow-hidden group active:scale-[0.98] ${
                  jumpingId === tool.id ? 'border-brand-core ring-4 ring-brand-core/5' : 'border-transparent card-shadow hover:border-brand-light'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-[1.5rem] flex items-center justify-center transition-colors shadow-inner ${
                    jumpingId === tool.id ? 'bg-brand-core text-white' : 'bg-slate-50 text-brand-dark'
                  }`}>
                    {jumpingId === tool.id ? <Loader2 className="w-6 h-6 animate-spin" /> : <MessageCircle className="w-6 h-6" />}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{tool.category}</p>
                    <p className="text-[14px] font-black text-slate-800">{tool.name}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-brand-dark" />
              </button>
            ))}
          </div>
        </section>

        {/* 底部版权 */}
        <div className="px-10 py-10 text-center space-y-3 opacity-30">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Medical Support Ecosystem V2.2</p>
          <p className="text-[10px] font-bold text-slate-400 leading-relaxed">所有信源均经由平台医学顾问委员会多重审核与认证</p>
        </div>
      </div>

      {/* 悬浮 AI 对话入口 */}
      <div className="absolute bottom-24 left-6 right-6 z-[60] flex justify-center pointer-events-none">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onGoToChat();
          }}
          className="w-full bg-gradient-to-r from-brand-core to-brand-dark text-white py-4.5 rounded-[2.5rem] shadow-2xl shadow-brand-core/30 border-4 border-white flex items-center justify-center gap-3 active:scale-[0.97] transition-all group pointer-events-auto"
        >
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-[15px] font-black tracking-tight">针对此阶段向 AI 提问</span>
        </button>
      </div>
    </div>
  );
};

export default StageDetailPage;
