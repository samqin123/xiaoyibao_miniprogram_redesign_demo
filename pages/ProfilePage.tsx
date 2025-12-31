
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
  LogOut
} from 'lucide-react';

interface Props {
  user: User;
  initialTab?: 'stats' | 'posts';
  onLogout?: () => void;
}

const ProfilePage: React.FC<Props> = ({ user, initialTab = 'stats', onLogout }) => {
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
      <div className="p-8 pt-16 text-center space-y-6 bg-white rounded-b-[3rem] shadow-sm relative">
        <button 
          onClick={onLogout}
          className="absolute top-6 right-6 p-2 bg-slate-50 rounded-xl text-slate-400 active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>
        
        <div className="relative inline-block">
          <div className="w-28 h-28 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden bg-white mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80" 
              className="w-full h-full object-cover"
              alt="Avatar"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-orange rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg">
            <Award className="w-5 h-5 fill-current" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{user.username}</h3>
          <p className="text-xs text-slate-400 font-bold">加入科普助手已 342 天</p>
          <div className="flex gap-2 justify-center pt-2">
            <span className="text-[10px] px-3 py-1 bg-brand-dark text-white rounded-full font-black shadow-md uppercase tracking-widest">Lv.7 领航员</span>
            <span className="text-[10px] px-3 py-1 bg-brand-soft text-brand-dark rounded-full font-black border border-brand-light">患者身份</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6 flex gap-2">
        <button 
          onClick={() => setActiveSubTab('stats')}
          className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${
            activeSubTab === 'stats' ? 'bg-brand-dark text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'
          }`}
        >
          荣誉概览
        </button>
        <button 
          onClick={() => setActiveSubTab('posts')}
          className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'posts' ? 'bg-brand-dark text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'
          }`}
        >
          我的分享 {myPosts.length > 0 && <span className="bg-brand-orange text-white px-1.5 rounded-full text-[9px]">{myPosts.length}</span>}
        </button>
      </div>

      <div className="px-6 mt-6 animate-in fade-in duration-300">
        {activeSubTab === 'stats' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-3xl card-shadow border border-slate-50 text-center">
                <p className="text-[9px] text-slate-400 font-black mb-1">经验值</p>
                <p className="text-lg font-black text-slate-800">1,240</p>
              </div>
              <div className="bg-white p-4 rounded-3xl card-shadow border border-slate-50 text-center">
                <p className="text-[9px] text-slate-400 font-black mb-1">获赞</p>
                <p className="text-lg font-black text-brand-orange">456</p>
              </div>
              <div className="bg-white p-4 rounded-3xl card-shadow border border-slate-50 text-center">
                <p className="text-[9px] text-slate-400 font-black mb-1">AI 提问</p>
                <p className="text-lg font-black text-brand-dark">89</p>
              </div>
            </div>

            <div className="bg-brand-dark rounded-[2.5rem] p-6 shadow-2xl text-white space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-black uppercase tracking-widest">学习勋章 ({user.badges.length})</h4>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {user.badges.map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                      <Award className="w-8 h-8 text-brand-core" />
                    </div>
                    <span className="text-[9px] font-bold text-white/60">{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[2rem] overflow-hidden card-shadow border border-brand-light">
              {[
                { icon: BookMarked, label: '我的收藏与订阅', color: 'text-brand-core' },
                { icon: Clock, label: '诊疗提醒管理', color: 'text-slate-400' },
                { icon: ShieldCheck, label: '个人隐私安全', color: 'text-brand-dark' },
                { icon: Download, label: '数据导出与备份', color: 'text-slate-400' }
              ].map((item, idx) => (
                <button key={idx} className="w-full px-6 py-5 flex items-center justify-between border-b border-slate-50 last:border-none hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-slate-50 ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] font-black text-slate-700">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-200" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {myPosts.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center space-y-4 border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-500">暂无分享内容</p>
                  <p className="text-[10px] text-slate-400 mt-1">去社区分享你的抗癌经验，帮助更多人</p>
                </div>
              </div>
            ) : (
              myPosts.map(post => (
                <div key={post.id} className="bg-white rounded-3xl p-5 card-shadow border border-slate-50 space-y-4 relative">
                  {/* Audit Status Badge */}
                  <div className="flex justify-between items-center">
                    <div className={`px-2 py-1 rounded-lg text-[9px] font-black flex items-center gap-1.5 ${
                      post.isPending ? 'bg-orange-50 text-brand-orange border border-orange-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {post.isPending ? (
                        <><AlertCircle className="w-3 h-3" /> 审核队列中 (预计2小时内完成)</>
                      ) : (
                        <><CheckCircle className="w-3 h-3" /> 已发布至全平台</>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-300 font-bold">{post.createdAt}</span>
                  </div>

                  <div className="flex gap-4">
                    {post.images && post.images.length > 0 && (
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                        <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-black text-slate-800 line-clamp-1">{post.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{post.content}</p>
                    </div>
                  </div>

                  {!post.isPending && (
                    <div className="pt-3 border-t border-slate-50 flex items-center gap-6">
                      <div className="flex items-center gap-1 text-[10px] font-black text-slate-400">
                        <Heart className="w-3 h-3" /> {post.likes} 获赞
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-slate-400">
                        <MessageCircle className="w-3 h-3" /> {post.comments} 评论
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 ml-auto">
                        <Eye className="w-3 h-3" /> 浏览 128
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            <div className="bg-brand-soft p-6 rounded-[2rem] border border-brand-light flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Sparkles className="w-6 h-6 text-brand-dark" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-brand-dark">优质内容奖励</p>
                <p className="text-[10px] text-brand-dark/60 mt-0.5">你的分享每获得 10 个赞，额外奖励 5 次 AI 永久配额</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout etc */}
      <div className="px-6 mt-10">
        <button 
          onClick={onLogout}
          className="w-full py-4 bg-white border border-red-100 rounded-2xl text-[11px] font-black text-red-400 flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" /> 退出登录
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
