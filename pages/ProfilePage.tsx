
import React, { useState, useEffect } from 'react';
import { User, ForumPost } from '../types';
import { 
  Settings, 
  ChevronRight, 
  Award, 
  Sparkles, 
  BookMarked, 
  Clock, 
  ShieldCheck, 
  Download, 
  Trash2,
  Bot,
  Heart,
  Grid,
  FileText,
  AlertCircle,
  CheckCircle,
  Eye,
  MessageCircle,
  LogOut,
  Accessibility
} from 'lucide-react';

interface Props {
  user: User;
  initialTab?: 'stats' | 'posts';
  onLogout?: () => void;
  isCareMode?: boolean;
  onToggleCareMode?: () => void;
}

const ProfilePage: React.FC<Props> = ({ user, initialTab = 'stats', onLogout, isCareMode, onToggleCareMode }) => {
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'posts'>(initialTab);
  const [myPosts, setMyPosts] = useState<ForumPost[]>([]);

  useEffect(() => {
    setActiveSubTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const localPosts = JSON.parse(localStorage.getItem('my_posts') || '[]');
    setMyPosts(localPosts);
  }, []);

  return (
    <div className="min-h-full bg-[#F2F9F6] pb-32">
      {/* Top Profile Header */}
      <div className={`p-8 pt-16 text-center space-y-6 bg-white rounded-b-[3rem] shadow-sm relative ${isCareMode ? 'care-p' : ''}`}>
        <button 
          onClick={onLogout}
          className="absolute top-6 right-6 p-2 bg-slate-50 rounded-xl text-slate-400 active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>
        
        <div className="relative inline-block">
          <div className={`${isCareMode ? 'w-32 h-32 rounded-[2.5rem]' : 'w-28 h-28 rounded-[2rem]'} border-4 border-white shadow-2xl overflow-hidden bg-white mx-auto`}>
            <img 
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80" 
              className="w-full h-full object-cover"
              alt="Avatar"
            />
          </div>
          <div className={`absolute -bottom-2 -right-2 ${isCareMode ? 'w-12 h-12' : 'w-10 h-10'} bg-brand-orange rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg`}>
            <Award className="w-5 h-5 fill-current" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className={`${isCareMode ? 'text-3xl' : 'text-2xl'} font-black text-slate-800 tracking-tight`}>{user.username}</h3>
          <p className={`${isCareMode ? 'text-sm' : 'text-xs'} text-slate-400 font-bold`}>加入科普助手已 342 天</p>
        </div>
      </div>

      {/* 关怀模式开关 - 醒目位置 */}
      <div className="px-6 mt-6">
        <button 
          onClick={onToggleCareMode}
          className={`w-full p-6 rounded-[2rem] flex items-center justify-between border-4 transition-all ${
            isCareMode 
              ? 'bg-brand-core border-brand-light text-white shadow-xl shadow-brand-core/20' 
              : 'bg-white border-brand-light text-brand-dark'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isCareMode ? 'bg-white/20' : 'bg-brand-soft'}`}>
              <Accessibility className={isCareMode ? "w-8 h-8" : "w-6 h-6"} />
            </div>
            <div className="text-left">
              <p className={`font-black ${isCareMode ? 'text-xl' : 'text-base'}`}>
                {isCareMode ? '关怀版：已开启' : '开启关怀模式'}
              </p>
              <p className={`${isCareMode ? 'text-xs opacity-80' : 'text-[10px] text-slate-400'} font-bold`}>
                更大文字，更简单的操作
              </p>
            </div>
          </div>
          <div className={`w-14 h-8 rounded-full relative transition-colors ${isCareMode ? 'bg-white' : 'bg-slate-200'}`}>
            <div className={`absolute top-1 w-6 h-6 rounded-full transition-all ${isCareMode ? 'right-1 bg-brand-core' : 'left-1 bg-white'}`}></div>
          </div>
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6 flex gap-2">
        <button 
          onClick={() => setActiveSubTab('stats')}
          className={`flex-1 py-4 rounded-2xl font-black transition-all ${
            activeSubTab === 'stats' ? 'bg-brand-dark text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'
          } ${isCareMode ? 'text-base' : 'text-xs'}`}
        >
          荣誉概览
        </button>
        <button 
          onClick={() => setActiveSubTab('posts')}
          className={`flex-1 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'posts' ? 'bg-brand-dark text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'
          } ${isCareMode ? 'text-base' : 'text-xs'}`}
        >
          我的分享
        </button>
      </div>

      <div className="px-6 mt-6 animate-in fade-in duration-300">
        {activeSubTab === 'stats' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-3xl card-shadow border border-slate-50 text-center">
                <p className="text-[10px] text-slate-400 font-black mb-1">经验值</p>
                <p className={`${isCareMode ? 'text-xl' : 'text-lg'} font-black text-slate-800`}>1,240</p>
              </div>
              <div className="bg-white p-4 rounded-3xl card-shadow border border-slate-50 text-center">
                <p className="text-[10px] text-slate-400 font-black mb-1">获赞</p>
                <p className={`${isCareMode ? 'text-xl' : 'text-lg'} font-black text-brand-orange`}>456</p>
              </div>
              <div className="bg-white p-4 rounded-3xl card-shadow border border-slate-50 text-center">
                <p className="text-[10px] text-slate-400 font-black mb-1">AI 提问</p>
                <p className={`${isCareMode ? 'text-xl' : 'text-lg'} font-black text-brand-dark`}>89</p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] overflow-hidden card-shadow border border-brand-light">
              {[
                { icon: BookMarked, label: '我的收藏与订阅', color: 'text-brand-core' },
                { icon: Clock, label: '诊疗提醒管理', color: 'text-slate-400' },
                { icon: ShieldCheck, label: '个人隐私安全', color: 'text-brand-dark' },
              ].map((item, idx) => (
                <button key={idx} className="w-full px-6 py-5 flex items-center justify-between border-b border-slate-50 last:border-none hover:bg-slate-50 care-btn-h">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-slate-50 ${item.color}`}>
                      <item.icon className={isCareMode ? "w-6 h-6" : "w-4 h-4"} />
                    </div>
                    <span className={`${isCareMode ? 'text-lg' : 'text-[13px]'} font-black text-slate-700`}>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-200" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
             {myPosts.map(post => (
                <div key={post.id} className="bg-white rounded-3xl p-5 card-shadow border border-slate-50 space-y-4 relative">
                  <div className="flex justify-between items-center">
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-black border ${
                      post.isPending ? 'bg-orange-50 text-brand-orange border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                       {post.isPending ? '审核中' : '已发布'}
                    </div>
                    <span className="text-[10px] text-slate-300 font-bold">{post.createdAt}</span>
                  </div>
                  <h4 className={`${isCareMode ? 'text-lg' : 'text-sm'} font-black text-slate-800`}>{post.title}</h4>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="px-6 mt-10">
        <button 
          onClick={onLogout}
          className="w-full py-5 bg-white border border-red-100 rounded-2xl font-black text-red-400 flex items-center justify-center gap-2 hover:bg-red-50 transition-all care-btn-h"
        >
          <LogOut className="w-5 h-5" /> 退出登录
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
