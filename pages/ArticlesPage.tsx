
import React, { useState } from 'react';
import { MOCK_ARTICLES } from '../constants';
import SourceBadge from '../components/SourceBadge';
import { Search, Share2, Bookmark, Eye, Clock, FileText, PlusCircle, Sparkles, Camera, Plus, Users, ChevronRight } from 'lucide-react';

interface Props {
  onGoToMyPosts: () => void;
  onGoToCreatePost: () => void;
  onGoToCommunity: () => void;
  isCareMode?: boolean;
}

const ArticlesPage: React.FC<Props> = ({ onGoToMyPosts, onGoToCreatePost, onGoToCommunity, isCareMode }) => {
  const [filter, setFilter] = useState('全部');

  return (
    <div className={`p-5 space-y-6 bg-[#F2F9F6] min-h-full ${isCareMode ? 'care-p' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <h2 className={`${isCareMode ? 'text-3xl' : 'text-2xl'} font-black text-brand-dark tracking-tight`}>科普资讯</h2>
        <div className="flex gap-2">
          <button 
            onClick={onGoToMyPosts}
            className={`${isCareMode ? 'w-14 h-14' : 'w-10 h-10'} bg-white rounded-xl flex items-center justify-center card-shadow border border-slate-50 relative group active:scale-95 transition-all`}
          >
            <FileText className={isCareMode ? "w-7 h-7 text-brand-dark" : "w-5 h-5 text-brand-dark"} />
            <span className={`absolute -top-1 -right-1 bg-brand-orange text-white rounded-full flex items-center justify-center font-black border-2 border-white animate-bounce-subtle ${isCareMode ? 'w-5 h-5 text-[10px]' : 'w-4 h-4 text-[8px]'}`}>
              !
            </span>
          </button>
          <div className={`${isCareMode ? 'w-14 h-14' : 'w-10 h-10'} bg-white rounded-xl flex items-center justify-center card-shadow border border-slate-50 active:scale-95 transition-all`}>
            <Search className={isCareMode ? "w-7 h-7 text-slate-400" : "w-5 h-5 text-slate-400"} />
          </div>
        </div>
      </div>

      {/* Community Entrance */}
      <section 
        onClick={onGoToCommunity}
        className={`bg-white rounded-3xl card-shadow border border-brand-light flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all overflow-hidden relative ${isCareMode ? 'p-6' : 'p-5'}`}
      >
        <div className="flex items-center gap-4 relative z-10">
          <div className={`${isCareMode ? 'w-16 h-16 rounded-[1.5rem]' : 'w-12 h-12 rounded-2xl'} bg-brand-soft rounded-2xl flex items-center justify-center text-brand-core group-hover:bg-brand-core group-hover:text-white transition-all`}>
            <Users className={isCareMode ? "w-8 h-8" : "w-6 h-6"} />
          </div>
          <div className="space-y-0.5">
            <h3 className={`${isCareMode ? 'text-xl' : 'text-sm'} font-black text-slate-800`}>互助社区</h3>
            <p className={`${isCareMode ? 'text-xs' : 'text-[10px]'} font-bold text-slate-400`}>分享真实经验，传递暖心力量</p>
          </div>
        </div>
        <div className="bg-slate-50 p-2 rounded-xl text-slate-300 group-hover:text-brand-dark transition-all relative z-10">
          <ChevronRight className={isCareMode ? "w-6 h-6" : "w-4 h-4"} />
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-core/5 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
      </section>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
        {['全部', '推荐', '最新', '热门'].map(tag => (
          <button 
            key={tag}
            onClick={() => setFilter(tag)}
            className={`whitespace-nowrap rounded-2xl font-black transition-all border ${isCareMode ? 'px-8 py-4 text-sm' : 'px-6 py-2.5 text-[11px]'} ${
              filter === tag 
                ? 'bg-brand-dark text-white border-brand-dark shadow-lg shadow-brand-dark/10' 
                : 'bg-white text-slate-400 border-slate-100'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Xiaohongshu Style Grid Feed */}
      <div className={`columns-2 gap-4 space-y-4 ${isCareMode ? 'columns-1' : ''}`}>
        
        {/* Create Post Card */}
        <div 
          onClick={onGoToCreatePost}
          className="break-inside-avoid bg-white rounded-3xl overflow-hidden card-shadow border-2 border-dashed border-brand-core/30 flex flex-col p-6 items-center justify-center space-y-3 cursor-pointer hover:border-brand-core transition-all active:scale-[0.97]"
        >
          <div className={`${isCareMode ? 'w-20 h-20' : 'w-14 h-14'} bg-brand-light rounded-full flex items-center justify-center`}>
            <Plus className={isCareMode ? "w-10 h-10 text-brand-core" : "w-8 h-8 text-brand-core"} />
          </div>
          <div className="text-center">
            <p className={`${isCareMode ? 'text-xl' : 'text-sm'} font-black text-brand-dark`}>发布我的动态</p>
            <p className={`${isCareMode ? 'text-xs' : 'text-[10px]'} text-slate-400 font-bold mt-1`}>分享康复经验<br/>赢 AI 永久配额</p>
          </div>
        </div>

        {/* Article Cards in Feed */}
        {MOCK_ARTICLES.map(article => (
          <div key={article.id} className="break-inside-avoid bg-white rounded-3xl overflow-hidden card-shadow border border-slate-50 flex flex-col relative group cursor-pointer hover:translate-y-[-2px] transition-all">
            <div className="relative aspect-[3/4] overflow-hidden bg-brand-light/30">
               <img 
                 src={`https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80`} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 alt=""
               />
               <div className="absolute top-2 left-2">
                 <div className={`bg-brand-core text-white font-black px-2 py-1 rounded shadow-sm ${isCareMode ? 'text-xs' : 'text-[9px]'}`}>
                   {article.sourceLevel} 级科普
                 </div>
               </div>
            </div>

            <div className={`space-y-2 ${isCareMode ? 'p-6' : 'p-3.5'}`}>
              <h3 className={`font-black text-slate-800 leading-tight line-clamp-2 ${isCareMode ? 'text-xl' : 'text-xs'}`}>{article.title}</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className={`${isCareMode ? 'w-6 h-6 text-xs' : 'w-4 h-4 text-[7px]'} rounded-full bg-brand-soft flex items-center justify-center font-black text-brand-dark border border-brand-light`}>
                    {article.author[0]}
                  </div>
                  <span className={`${isCareMode ? 'text-sm' : 'text-[9px]'} font-bold text-slate-400 truncate max-w-[80px]`}>{article.author}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Eye className={isCareMode ? "w-4 h-4" : "w-3 h-3"} />
                  <span className={`${isCareMode ? 'text-sm' : 'text-[9px]'} font-bold`}>{article.viewCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;
