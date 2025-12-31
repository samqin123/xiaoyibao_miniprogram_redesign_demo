
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MessageCircle, 
  BookOpen, 
  Gamepad2, 
  UserCircle,
  PhoneCall,
  X,
  Bot,
  Heart,
  Sparkles
} from 'lucide-react';
import { IdentityTag, User } from './types';
import RoadmapPage from './pages/RoadmapPage';
import ArticlesPage from './pages/ArticlesPage';
import GamePage from './pages/GamePage';
import ChatPage from './pages/ChatPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import StageDetailPage from './pages/StageDetailPage';
import { DISCLAIMER } from './constants';

const MascotAvatar: React.FC<{ size?: string, className?: string }> = ({ size = "w-10 h-10", className = "" }) => (
  <div className={`${size} bg-gradient-to-br from-brand-core to-brand-dark rounded-full flex items-center justify-center relative shadow-sm border-2 border-white ${className}`}>
    <Bot className="w-1/2 h-1/2 text-white" />
    <div className="absolute -top-1 -right-1">
      <Heart className="w-3 h-3 text-brand-orange fill-brand-orange" />
    </div>
  </div>
);

const GlobalMascot: React.FC<{ onChat: () => void }> = ({ onChat }) => (
  <div className="absolute bottom-24 right-6 z-[60] flex flex-col items-end gap-2 group pointer-events-none transition-transform duration-300">
    <div className="bg-white px-3 py-1.5 rounded-xl shadow-xl border border-brand-light mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="text-[10px] font-black text-brand-dark whitespace-nowrap">有问题问我哦！</p>
    </div>
    <div 
      onClick={onChat}
      className="pointer-events-auto bg-gradient-to-br from-brand-core to-brand-dark w-14 h-14 rounded-2xl flex items-center justify-center relative shadow-2xl border-4 border-white cursor-pointer hover:scale-110 active:scale-95 transition-all mascot-float"
    >
      <Bot className="w-8 h-8 text-white" />
      <div className="absolute -top-2 -right-2">
        <Sparkles className="w-5 h-5 text-brand-orange fill-brand-orange" />
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('roadmap');
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showSOS, setShowSOS] = useState(false);
  const [initialProfileTab, setInitialProfileTab] = useState<'stats' | 'posts'>('stats');
  const [shouldOpenCommunityModal, setShouldOpenCommunityModal] = useState(false);

  useEffect(() => {
    const savedQuota = localStorage.getItem('accumulated_quota');
    setUser({
      id: 'mock-123',
      username: '莘花',
      identity: IdentityTag.PATIENT,
      dailyQuota: 10,
      accumulatedQuota: savedQuota ? parseInt(savedQuota) : 47,
      learningProgress: 75,
      badges: ['科普先锋', '持之以恒']
    });
  }, []);

  const updateQuota = (amount: number) => {
    if (!user) return;
    const newAccumulated = user.accumulatedQuota + amount;
    setUser({ ...user, accumulatedQuota: newAccumulated });
    localStorage.setItem('accumulated_quota', newAccumulated.toString());
  };

  const useQuota = () => {
    if (!user) return false;
    if (user.dailyQuota > 0) {
      setUser({ ...user, dailyQuota: user.dailyQuota - 1 });
      return true;
    } else if (user.accumulatedQuota > 0) {
      setUser({ ...user, accumulatedQuota: user.accumulatedQuota - 1 });
      return true;
    }
    return false;
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId !== 'roadmap') {
      setSelectedStageId(null);
    }
    if (tabId !== 'profile') {
      setInitialProfileTab('stats');
    }
    if (tabId !== 'community') {
      setShouldOpenCommunityModal(false);
    }
  };

  const navigateToMyPosts = () => {
    setInitialProfileTab('posts');
    setActiveTab('profile');
  };

  const navigateToCreatePost = () => {
    setShouldOpenCommunityModal(true);
    setActiveTab('community');
  };

  if (!user) return <div className="h-screen flex items-center justify-center text-brand-dark font-bold">加载中...</div>;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-brand-bg shadow-2xl overflow-hidden relative border-x border-slate-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <MascotAvatar />
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">小胰宝</h1>
            <p className="text-[10px] text-brand-dark font-black mt-1 uppercase tracking-wider">患者病情管理AI伙伴</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSOS(true)}
            className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 transition-all hover:scale-105 border border-red-100"
          >
            <PhoneCall className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth relative">
        {activeTab === 'roadmap' && (
          selectedStageId ? (
            <StageDetailPage 
              stageId={selectedStageId} 
              onBack={() => setSelectedStageId(null)} 
              onGoToChat={() => handleTabChange('chat')}
            />
          ) : (
            <RoadmapPage onSelectStage={setSelectedStageId} />
          )
        )}
        {activeTab === 'chat' && <ChatPage user={user} onMessageSent={useQuota} onShare={() => updateQuota(10)} />}
        {activeTab === 'articles' && (
          <ArticlesPage 
            onGoToMyPosts={navigateToMyPosts} 
            onGoToCreatePost={navigateToCreatePost} 
          />
        )}
        {activeTab === 'game' && <GamePage onPass={updateQuota} />}
        {activeTab === 'community' && (
          <CommunityPage 
            onShare={() => updateQuota(5)} 
            autoOpenModal={shouldOpenCommunityModal}
            onCloseModal={() => setShouldOpenCommunityModal(false)}
          />
        )}
        {activeTab === 'profile' && <ProfilePage user={user} initialTab={initialProfileTab} />}
        
        {/* Global Footer Disclaimer */}
        <div className="py-2.5 px-6 bg-slate-50/80 text-center border-t border-slate-100/50">
          <p className="text-[9px] text-slate-400 font-bold leading-tight uppercase tracking-tighter">{DISCLAIMER}</p>
          <div className="mt-1 flex justify-center opacity-10 grayscale">
            <Bot className="w-3 h-3" />
          </div>
        </div>
      </main>

      {/* Global Mascot Icon */}
      {activeTab !== 'chat' && <GlobalMascot onChat={() => handleTabChange('chat')} />}

      {/* Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 glass-nav px-4 py-3 flex justify-around items-center z-[70]">
        {[
          { id: 'roadmap', icon: Home, label: '首页' },
          { id: 'chat', icon: MessageCircle, label: 'AI助手' },
          { id: 'articles', icon: BookOpen, label: '资讯' },
          { id: 'game', icon: Gamepad2, label: '闯关' },
          { id: 'profile', icon: UserCircle, label: '我的' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex flex-col items-center px-4 py-2 rounded-2xl transition-all duration-300 ${
              activeTab === tab.id 
                ? 'text-brand-dark bg-brand-light/40'
                : 'text-slate-400'
            }`}
          >
            <tab.icon className={`w-5 h-5 mb-1 ${activeTab === tab.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className={`text-[9px] ${activeTab === tab.id ? 'font-black' : 'font-bold'}`}>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-4xl w-full max-w-xs p-8 shadow-2xl text-center relative overflow-hidden border-2 border-white">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
            <button onClick={() => setShowSOS(false)} className="absolute top-4 right-4 p-2 rounded-xl bg-slate-50 text-slate-400">
              <X className="w-4 h-4" />
            </button>
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-100 rotate-3">
              <PhoneCall className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">发现异常信号？</h2>
            <p className="text-slate-500 text-[13px] leading-relaxed mb-8 px-2 font-medium">如果您正处于呼吸困难、持续高热或剧烈疼痛中，请立即寻求专业医疗帮助。</p>
            <div className="space-y-3">
              <a href="tel:120" className="block w-full bg-red-500 text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-red-500/20 active:scale-95 transition-all">
                紧急呼叫 120
              </a>
              <button onClick={() => setShowSOS(false)} className="block w-full py-2 text-slate-400 font-bold text-sm">
                暂不需要，返回页面
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
