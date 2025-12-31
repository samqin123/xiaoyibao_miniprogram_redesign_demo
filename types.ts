
export enum IdentityTag {
  PATIENT = 'patient',
  FAMILY = 'family'
}

export enum SourceLevel {
  A = 'A', // Authority
  B = 'B', // Expert
  C = 'C'  // Platform
}

export interface User {
  id: string;
  username: string;
  identity: IdentityTag;
  cancerType?: string;
  dailyQuota: number;
  accumulatedQuota: number;
  learningProgress: number;
  badges: string[];
}

export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  sourceLevel: SourceLevel;
  author: string;
  publishedAt: string;
  viewCount: number;
  shareCount: number;
  category: string;
}

export interface GameLevel {
  id: string;
  title: string;
  difficulty: number; // 1-5
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  rewardQuota: number;
}

export interface ForumPost {
  id: string;
  userId: string;
  username: string;
  userType: IdentityTag;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
  images?: string[]; 
  isPending?: boolean; 
}

export interface RoadmapItem {
  id: string;
  label: string;
  icon?: string;
  children?: RoadmapItem[];
}

export interface RoadmapGroup {
  id: string;
  title: string;
  items: RoadmapItem[];
}
