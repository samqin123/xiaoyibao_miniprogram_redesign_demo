
import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Users
} from 'lucide-react';
import { IdentityTag, User } from './types';
import RoadmapPage from './pages/RoadmapPage';
import ArticlesPage from './pages/ArticlesPage';
import GamePage from './pages/GamePage';
import ChatPage from './pages/ChatPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import StageDetailPage from './pages/StageDetailPage';
import LandingPage from './pages/LandingPage';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const mainContentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // 全局滚动置顶逻辑：每当标签切换或详情页ID变化，强制重置滚动位置
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [activeTab, selectedStageId]);

  const handleLogin = () => {
    const savedQuota = localStorage.getItem('accumulated_quota');
    const newUser: User = {
      id: 'mock-123',
      username: '莘花',
      identity: IdentityTag.PATIENT,
      dailyQuota: 10,
      accumulatedQuota: savedQuota ? parseInt(savedQuota) : 47,
      learningProgress: 75,
      badges: ['科普先锋', '持之以恒']
    };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('current_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('current_user');
  };

  const updateQuota = (amount: number) => {
    if (!user) return;
    const newAccumulated = user.accumulatedQuota + amount;
    const updatedUser = { ...user, accumulatedQuota: newAccumulated };
    setUser(updatedUser);
    localStorage.setItem('accumulated_quota', newAccumulated.toString());
    localStorage.setItem('current_user', JSON.stringify(updatedUser));
  };

  const useQuota = () => {
    if (!user) return false;
    let updatedUser: User | null = null;
    if (user.dailyQuota > 0) {
      updatedUser = { ...user, dailyQuota: user.dailyQuota - 1 };
    } else if (user.accumulatedQuota > 0) {
      updatedUser = { ...user, accumulatedQuota: user.accumulatedQuota - 1 };
    }

    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
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

  const navigateToCommunity = () => {
    setActiveTab('community');
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }

  if (!user) return <div className="h-screen flex items-center justify-center text-brand-dark font-bold">加载中...</div>;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-brand-bg shadow-2xl overflow-hidden relative border-x border-slate-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <MascotAvatar />
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">小胰宝</h1>
            <p className="text-[9px] text-brand-dark font-black mt-1 uppercase tracking-wider">肿瘤科普 | 病友/家属科普与病情主动管理伙伴</p>
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
      <main ref={mainContentRef} className="flex-1 overflow-y-auto pb-24 scroll-smooth relative">
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
            onGoToCommunity={navigateToCommunity}
          />
        )}
        {activeTab === 'game' && <GamePage onPass={updateQuota} />}
        {activeTab === 'community' && (
          <CommunityPage 
            onShare={() => updateQuota(5)} 
            autoOpenModal={shouldOpenCommunityModal}
            onCloseModal={() => setShouldOpenCommunityModal(false)}
            onBack={() => setActiveTab('articles')}
          />
        )}
        {activeTab === 'profile' && <ProfilePage user={user} initialTab={initialProfileTab} onLogout={handleLogout} />}
        
        {/* Global Footer Disclaimer */}
        <div className="py-2.5 px-6 bg-slate-50/80 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            {DISCLAIMER}
          </p>
        </div>
      </main>

      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md border-t border-slate-100 px-4 py-2 flex justify-between items-center sticky bottom-0 z-50">
        {[
          { id: 'roadmap', icon: Home, label: '路线' },
          { id: 'chat', icon: MessageCircle, label: '小胰宝' },
          { id: 'articles', icon: BookOpen, label: '科普' },
          { id: 'game', icon: Gamepad2, label: '闯关' },
          { id: 'profile', icon: UserCircle, label: '我的' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all ${
              activeTab === tab.id ? 'text-brand-core' : 'text-slate-400'
            }`}
          >
            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'fill-brand-core/10' : ''}`} />
            <span className="text-[9px] font-bold">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <PhoneCall className="w-4 h-4 text-red-500" />
                </div>
                <h3 className="text-lg font-black text-slate-800">紧急联系</h3>
              </div>
              <button onClick={() => setShowSOS(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                如果您当前感到剧烈疼痛、高热不退或呼吸困难，请立即拨打急救电话或前往就近医院。
              </p>
              <div className="grid grid-cols-1 gap-3">
                <a href="tel:120" className="bg-red-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-black shadow-lg shadow-red-200 active:scale-95 transition-all no-underline">
                  <PhoneCall className="w-5 h-5" /> 拨打 120 急救
                </a>
                <button className="bg-slate-50 text-slate-600 py-4 rounded-2xl flex items-center justify-center gap-2 font-black active:scale-95 transition-all">
                  联系我的主治医生
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Mascot */}
      {activeTab !== 'chat' && activeTab !== 'game' && <GlobalMascot onChat={() => handleTabChange('chat')} />}
    </div>
  );
};

export default App;
