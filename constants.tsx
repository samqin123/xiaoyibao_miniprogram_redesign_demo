
import { IdentityTag, SourceLevel, Article, GameLevel, ForumPost, RoadmapGroup } from './types';

export const SYSTEM_INSTRUCTION = `你是 Pancrepal 小胰宝，您的“肿瘤科普 | 病友/家属科普与病情主动管理伙伴”。
回复规范：
1. 严禁使用 Markdown 格式（如 ##, **, [链接] 等），仅使用纯文本。
2. 文本结构必须按照：【结论-标题】 紧接着进行详细的 【解释说明】。
3. 语气温和、简洁、专业。
4. 每条回复末尾必须包含以下固定段落：
“内容生成风险提示：以上内容由 AI 自动生成，可能存在局限性。本回复仅供科普参考，不可作为医疗诊断建议，不能替代医生面诊。如有身体不适，请务必及时前往医院咨询专业医师。”
5. 严禁提供任何处方建议、用药剂量或具体诊疗方案。`;

export const DISCLAIMER = "⚠️ 重要声明：本平台所有内容仅供科普与参考，不能替代医生面诊。如有不适，请及时就医。";

export const ROADMAP_DATA: RoadmapGroup[] = [
  {
    id: 'clinical',
    title: '临床治疗',
    items: [
      { id: 'early', label: '早筛防范' },
      { id: 'first_visit', label: '首诊支持' },
      { id: 'post_op', label: '术后防复发' },
      { id: 'first_line', label: '基础治疗（一线治疗）' },
      { id: 'multi_line', label: '进阶治疗（二线和多线治疗）' },
      { id: 'late_line', label: '后线治疗（临床和后线治疗）' },
      {
        id: 'aux_mgmt',
        label: '治疗辅助管理',
        children: [
          { id: 'pain', label: '疼痛管理' },
          { id: 'comp', label: '并发症管理' },
          { id: 'infec', label: '感染管理' }
        ]
      }
    ]
  },
  {
    id: 'nutrition',
    title: '营养管理',
    items: [
      { id: 'nutri_eval', label: '营养评估' },
      { id: 'nutri_pres', label: '营养处方' },
      { id: 'energy_mgmt', label: '能量管理' }
    ]
  },
  {
    id: 'psycho',
    title: '心理支持',
    items: [
      { id: 'xinbao_companion', label: '小馨宝心理陪伴' },
      { id: 'palliative_care', label: '安宁疗护守护' }
    ]
  },
  {
    id: 'life_quality',
    title: '生活质量管理',
    items: [
      { id: 'quality_life', label: '品质生活' },
      { id: 'my_joy', label: '我的快乐' }
    ]
  }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: '胰腺癌早期筛查专家共识 (2025版)',
    summary: '详细解读最新胰腺癌高危人群筛查标准与影像学检查的必要性。',
    content: '胰腺癌是恶性程度极高的消化道肿瘤...',
    sourceLevel: SourceLevel.A,
    author: '国家卫健委',
    publishedAt: '2025-01-10',
    viewCount: 1250,
    shareCount: 45,
    category: 'screen'
  },
  {
    id: '2',
    title: '化疗期间的营养支持与副作用管理',
    summary: '如何在化疗期间通过科学饮食缓解恶心、乏力等常见副作用。',
    content: '合理的营养支持是保证治疗顺利进行的关键...',
    sourceLevel: SourceLevel.B,
    author: '三甲医院肿瘤中心',
    publishedAt: '2025-01-12',
    viewCount: 3400,
    shareCount: 88,
    category: 'treat'
  }
];

export const MOCK_GAMES: GameLevel[] = [
  {
    id: 'g1',
    title: '风险信号识别',
    difficulty: 2,
    question: '以下哪种情况属于需要立即急诊就医的“报警信号”？',
    options: ['轻微食欲下降', '体温持续超过38.5℃且伴有畏寒', '偶尔感到轻度疲劳', '皮肤略显干燥'],
    correctAnswer: '体温持续超过38.5℃且伴有畏寒',
    explanation: '【结论-紧急信号】体温持续超过38.5℃且伴有畏寒属于高危报警信号。对于正在接受治疗的肿瘤患者，这可能预示着严重的感染或中性粒细胞减少性发热，必须立即寻求专业医疗帮助。',
    rewardQuota: 10
  }
];

export const MOCK_POSTS: ForumPost[] = [
  {
    id: 'p1',
    userId: 'mock-123',
    username: '坚强的小王',
    userType: IdentityTag.PATIENT,
    title: '分享我的就诊心路历程，希望能帮助大家',
    content: '今天收到了病友的鼓励，心里暖暖的。在xx医院的就诊过程中，挂号流程其实有一些小技巧...',
    tags: ['就诊体验', '心理支持'],
    likes: 56,
    comments: 12,
    createdAt: '2025-01-14',
    images: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80']
  }
];
