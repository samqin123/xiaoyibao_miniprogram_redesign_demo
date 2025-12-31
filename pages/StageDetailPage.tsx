import React, { useState } from 'react';
import { 
  ArrowLeft, MessageCircle, Bot, Loader2, Sparkles, ChevronRight, 
  BookOpen, Users, QrCode, Info, ShieldCheck, FileText, 
  Target, Heart, HelpCircle, ArrowRight, Star, FileJson, 
  Link as LinkIcon, File as FileIcon, ExternalLink, PlayCircle,
  FileSearch, CheckCircle2, MoreHorizontal, Share2
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

const TOOLS: Tool[] = [
  { id: 'knows', name: 'KnowS', category: '医学知识库', isMiniApp: true },
  { id: 'csco_guide', name: '肿瘤治疗指南（CSCO）', category: '诊疗规范', isMiniApp: true },
  { id: 'tx_yidian', name: '腾讯医典', category: '用药管理', isMiniApp: true },
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
      { 
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80', 
        title: '体检发现指标异常，我是如何在一周内确诊并手术的', 
        author: '阳光下的莘花', 
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
        likes: '2.8k' 
      },
      { 
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80', 
        title: '陪老爸抗癌这一年，早筛救了他的命', 
        author: '抗癌家属小李', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
        likes: '1.2k' 
      }
    ],
    groups: [{ id: 'g1', name: '早筛风险沟通群', theme: '指标解读与专家推荐' }]
  },
  'post_op': {
    consensusTitle: '术后康复与防复发管理',
    consensusPoints: [
      '引流管管理：严格记录每日引流量与颜色，预防胰漏等并发症。',
      '辅助化疗：建议在体力状况恢复后（通常4-8周）尽早开启辅助治疗。',
      '营养代偿：胰腺切除后需补充消化酶，少食多餐，关注血糖波动。'
    ],
    docs: [
      { type: 'pdf', title: '胰腺癌术后辅助化疗指南要点.pdf', url: '#' },
      { type: 'tencent', title: '【打卡表】术后每日症状监控清单', url: '#' },
      { type: 'link', title: '公众号：术后三个月饮食红黑榜', url: '#' }
    ],
    recommendations: [
      { title: '术后营养补充全策略', desc: '吃不下、拉肚子、血糖高？试试这些', type: '营养必备', level: SourceLevel.A },
      { title: '术后复查如何安排？', desc: '两年内复查时间表与必查项目清单', type: '随访指南', level: SourceLevel.B },
      { title: '胰漏的早期识别与预防', desc: '居家护理时这些信号必须第一时间联系医生', type: '风险预警', level: SourceLevel.A }
    ],
    experiences: [
      { 
        image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&q=80', 
        title: 'Whipple手术后的饮食记录，三个月增重5kg', 
        author: '暖暖康复日记', 
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
        likes: '1.9k' 
      },
      { 
        image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80', 
        title: '化疗第一周副作用管理经验分享，心态最重要', 
        author: '向阳而生', 
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&q=80',
        likes: '956' 
      }
    ],
    groups: [{ id: 'g2', name: '术后防复发战友群', theme: '康复随访与生活管理' }]
  },
  'nutri_eval': {
    consensusTitle: '科学营养筛查与干预',
    consensusPoints: [
      '动态监测：每周固定时间测量空腹体重，非预期下降>5%需立即干预。',
      '风险评估：使用PG-SGA量表进行专业评估，识别隐匿性营养不良。',
      '蛋白优先：胰腺癌患者需高蛋白饮食，必要时补充肠内营养制剂。'
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
      { 
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', 
        title: '从瘦骨嶙峋到体能恢复，分享我的营养管理方案', 
        author: '抗癌小厨神', 
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
        likes: '3.2k' 
      },
      { 
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80', 
        title: '营养粉真的难喝吗？我试了5个牌子后的总结', 
        author: '测评达人老王', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
        likes: '1.2k' 
      }
    ],
    groups: [{ id: 'g3', name: '营养互助交流群', theme: '食谱分享与指标追踪' }]
  },
  'xinbao_companion': {
    consensusTitle: '心理韧性与同伴支持',
    consensusPoints: [
      '正念干预：每日15分钟冥想，可显著改善焦虑水平和睡眠质量。',
      '沟通机制：建议家属与患者保持适度透明沟通，避免“保护性隐瞒”。',
      '危机识别：若出现持续的情绪低落或自我孤立，应寻求心理咨询干预。'
    ],
    docs: [
      { type: 'link', title: '冥想音频：15分钟深度抗压放松', url: '#' },
      { type: 'pdf', title: '肿瘤心理调适科普手册.pdf', url: '#' },
      { type: 'tencent', title: '【记录】情绪气象站日记模版', url: '#' }
    ],
    recommendations: [
      { title: '确诊后的心理五阶段', desc: '读懂自己的情绪反应，与恐惧共处', type: '心理急救', level: SourceLevel.A },
      { title: '如何对孩子谈论病情？', desc: '不同年龄段孩子的沟通技巧建议', type: '家庭沟通', level: SourceLevel.B },
      { title: '寻找生活中的“微光”', desc: '建立积极心理暗示的方法论', type: '能量补给', level: SourceLevel.C }
    ],
    experiences: [
      { 
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80', 
        title: '确诊的那晚我以为天塌了，现在我学会了享受当下', 
        author: '心如止水', 
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&q=80',
        likes: '5.1k' 
      },
      { 
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80', 
        title: '家属的心理疏导同样重要，分享我的陪护自愈之路', 
        author: '守护者老周', 
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?w=100&q=80',
        likes: '2.4k' 
      }
    ],
    groups: [{ id: 'g4', name: '心灵花园互助组', theme: '情绪倾诉与冥想打卡' }]
  },
  'palliative_care': {
    consensusTitle: '安宁疗护与症状管理',
    consensusPoints: [
      '止痛原则：严格执行三阶梯镇痛，按时服药而非按需服药，保障生活质量。',
      '症状舒缓：通过综合手段缓解呼吸困难、顽固性便秘等晚期症状。',
      '生命尊严：尊重个人意愿，优先维护生命末期的尊严与舒适感。'
    ],
    docs: [
      { type: 'pdf', title: '安宁疗护核心症状管理指南.pdf', url: '#' },
      { type: 'tencent', title: '【自查】疼痛程度VAS自测工具', url: '#' },
      { type: 'link', title: '视频：什么是真正的“善终”', url: '#' }
    ],
    recommendations: [
      { title: '止痛药会上瘾吗？', desc: '科学解读吗啡类药物的规范使用', type: '止痛必备', level: SourceLevel.A },
      { title: '安宁疗护不代表放弃', desc: '为什么说它是对生命更高维度的尊重', type: '理念科普', level: SourceLevel.B },
      { title: '居家舒缓护理小窍门', desc: '如何缓解水肿与压疮风险', type: '护理干货', level: SourceLevel.C }
    ],
    experiences: [
      { 
        image: 'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=400&q=80', 
        title: '陪母亲走完最后一段路，安宁疗护让我们没有遗憾', 
        author: '微光守护', 
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
        likes: '4.8k' 
      },
      { 
        image: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=400&q=80', 
        title: '止痛方案调整后，爸爸终于睡了一个安稳觉', 
        author: '小陈', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
        likes: '1.5k' 
      }
    ],
    groups: [{ id: 'g5', name: '安宁护航互助群', theme: '症状支持与人文关怀' }]
  }
};

interface Props {
  stageId: string;
  onBack: () => void;
  onGoToChat: () => void;
}

const StageDetailPage: React.FC<Props> = ({ stageId, onBack, onGoToChat }) => {
  const [jumpingId, setJumpingId] = useState<string | null>(null);
  const content = STAGE_LANDING_DATA[stageId] || STAGE_LANDING_DATA['early'];

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
    <div className="min-h-full bg-slate-50 animate-in fade-in duration-500 flex flex-col relative">
      {/* 顶部导航 */}
      <div className="bg-white/90 backdrop-blur-xl px-6 pt-12 pb-6 sticky top-0 z-50 border-b border-slate-100/50 shrink-0">
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

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-48 space-y-10">
        {/* 1. 指南共识 */}
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
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-soft/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
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

        {/* 4. 挑战任务 */}
        <section className="space-y-4">
          <div className="bg-gradient-to-br from-brand-core to-brand-dark rounded-[3.2rem] p-9 text-white flex items-center justify-between shadow-2xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all border-4 border-white">
            <div className="space-y-3.5 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                   <Star className="w-5 h-5 text-brand-orange fill-brand-orange animate-bounce-subtle" />
                </div>
                <h4 className="text-xl font-black">科普达人挑战</h4>
              </div>
              <p className="text-xs text-white/70 font-bold leading-relaxed">
                完成本阶段指南考核<br/>奖励 +10 AI 永久配额
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="bg-white text-brand-dark px-5 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-2 shadow-lg group-hover:bg-brand-soft">
                  开始答题 <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="w-28 h-28 bg-white/10 rounded-[2.5rem] flex items-center justify-center backdrop-blur-md border border-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <HelpCircle className="w-14 h-14 text-white/40" />
            </div>
            <div className="absolute top-[-40%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
          </div>
        </section>

        {/* 5. 智能工具推荐 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-5 h-5 text-brand-orange" />
            <h3 className="text-base font-black text-slate-800">推荐工具</h3>
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

        {/* 底部声明 */}
        <div className="px-10 py-10 text-center space-y-3 opacity-30">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Medical Support Ecosystem V2.5</p>
          <p className="text-[10px] font-bold text-slate-400 leading-relaxed">所有信源均经由平台医学顾问委员会多重审核与认证</p>
        </div>
      </div>

      {/* 悬浮 AI 对话入口 - 修正比例与美感，采用品牌渐变色并限制在容器内 */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[calc(28rem-48px)] z-50">
        <button 
          onClick={onGoToChat}
          className="w-full bg-gradient-to-r from-brand-core to-brand-dark text-white py-4.5 rounded-[2.5rem] shadow-2xl shadow-brand-core/30 border-4 border-white flex items-center justify-center gap-3 active:scale-[0.97] transition-all group"
        >
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-[14px] font-black tracking-tight">针对该阶段向 AI 提问</span>
        </button>
      </div>
    </div>
  );
};

export default StageDetailPage;