
import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  HelpCircle, 
  CheckCircle2, 
  Star, 
  RefreshCw, 
  AlertCircle, 
  ChevronRight, 
  Zap, 
  Award,
  ArrowRight,
  TrendingUp,
  XCircle,
  PartyPopper,
  Coins
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface Props {
  onPass: (amount: number) => void;
}

const GamePage: React.FC<Props> = ({ onPass }) => {
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [showNotification, setShowNotification] = useState<{show: boolean, amount: number}>({show: false, amount: 0});

  useEffect(() => {
    // Load from JSON file (mocking fetch since it's a local constant/file structure)
    // In a real env: fetch('/data/quiz_data.json').then(...)
    // For this prototype, we'll embed some if file loading isn't straightforward, 
    // but the request asked for it to be a JSON file, so let's assume it's loaded.
    const loadQuestions = async () => {
      try {
        const response = await fetch('/data/quiz_data.json');
        const data = await response.json();
        setAllQuestions(data);
      } catch (e) {
        // Fallback internal data if fetch fails
        setAllQuestions([
          { "id": "q1", "question": "PET/CT诊断胰腺癌时，SUV最大值达到多少通常考虑为恶性？", "options": ["≥1.5", "≥2.5", "≥3.5", "≥4.5"], "answer": "≥2.5", "explanation": "典型早期胰腺癌SUV最大值≥2.5，而≤2.5则考虑良性病变可能大。" },
          { "id": "q2", "question": "胰腺在人体中最重要的消化功能是对哪种物质的消化？", "options": ["蛋白质", "糖类", "脂肪", "纤维素"], "answer": "脂肪", "explanation": "胰腺分泌的胰液中的消化酶在食物消化过程中起“主角”作用，特别是对脂肪的消化。" },
          { "id": "q3", "question": "关于MRI（核磁共振）检查，以下说法正确的是？", "options": ["具有严重的放射性辐射", "利用氢质子进行成像", "不能显示肿块增强情况", "价格比普通B超更便宜"], "answer": "利用氢质子进行成像", "explanation": "磁共振成像没有任何辐射，其原理是利用体内到处分布的氢质子进行成像。" },
          { "id": "q4", "question": "腹部CT增强扫描相对于平扫的主要优点是？", "options": ["扫描时间更长", "无须空腹", "能更清晰显示病变血供特点和边界", "完全没有过敏风险"], "answer": "能更清晰显示病变血供特点和边界", "explanation": "CT增强扫描通过注射对比剂，能更准确确诊胰腺癌并评估肿瘤分期。" },
          { "id": "q5", "question": "超声内镜（EUS）对于多大的肿瘤具有较高的检出率？", "options": ["5mm以上", "2cm以上", "5cm以上", "10cm以上"], "answer": "5mm以上", "explanation": "超声内镜对胰腺观察距离最近，对于5mm以上的肿瘤可以清晰显示。" }
        ]);
      }
    };
    loadQuestions();
  }, []);

  const startNewSession = () => {
    if (allQuestions.length === 0) return;
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setSessionQuestions(shuffled.slice(0, 5));
    setCurrentIndex(0);
    setScore(0);
    setGameStatus('playing');
    setSelected(null);
    setIsAnswered(false);
  };

  const handleSelect = (opt: string) => {
    if (isAnswered) return;
    setSelected(opt);
    setIsAnswered(true);
    if (opt === sessionQuestions[currentIndex].answer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < 4) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    const totalReward = score * 10;
    setGameStatus('finished');
    if (totalReward > 0) {
      onPass(totalReward);
      setShowNotification({ show: true, amount: totalReward });
      setTimeout(() => setShowNotification({ show: false, amount: 0 }), 5000);
    }
  };

  const currentQ = sessionQuestions[currentIndex];

  if (gameStatus === 'idle') {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-brand-light rounded-4xl flex items-center justify-center shadow-xl mascot-float">
          <Trophy className="w-12 h-12 text-brand-core" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">知识大闯关</h2>
          <p className="text-sm text-slate-400 font-bold px-8">每轮5道精选科普题，每对一题得+10配额奖励，最高可得50！</p>
        </div>
        <button 
          onClick={startNewSession}
          className="w-full max-w-xs py-5 bg-brand-dark text-white rounded-3xl font-black text-lg shadow-2xl shadow-brand-dark/20 active:scale-95 transition-all"
        >
          立即开启挑战
        </button>
      </div>
    );
  }

  if (gameStatus === 'finished') {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[70vh] space-y-6 animate-in zoom-in-95 duration-500">
        <div className={`w-28 h-28 rounded-5xl flex items-center justify-center relative ${score >= 3 ? 'bg-emerald-50' : 'bg-slate-100'}`}>
          {score >= 3 ? <PartyPopper className="w-16 h-16 text-emerald-500" /> : <TrendingUp className="w-16 h-16 text-slate-400" />}
          <div className="absolute -top-2 -right-2">
            <Award className={`w-10 h-10 ${score >= 3 ? 'text-brand-orange fill-brand-orange' : 'text-slate-300'}`} />
          </div>
        </div>
        
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-slate-800">{score >= 3 ? '恭喜挑战成功！' : '继续努力哦！'}</h2>
          <p className="text-slate-400 font-bold">本次正确回答 {score}/5 题</p>
        </div>

        <div className="bg-white rounded-4xl p-6 w-full card-shadow border border-brand-light flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-soft rounded-2xl flex items-center justify-center">
              <Coins className="w-6 h-6 text-brand-orange" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">奖励到账</p>
              <p className="text-lg font-black text-brand-dark">+{score * 10} AI配额</p>
            </div>
          </div>
          <div className="bg-emerald-50 px-3 py-1 rounded-full text-emerald-600 text-[10px] font-black border border-emerald-100">
            已存入奖励账户
          </div>
        </div>

        <button 
          onClick={startNewSession}
          className="w-full py-5 bg-brand-dark text-white rounded-3xl font-black text-base shadow-xl active:scale-95 transition-all"
        >
          再战一轮
        </button>
        <button 
          onClick={() => setGameStatus('idle')}
          className="text-slate-400 font-bold text-sm hover:text-brand-dark"
        >
          返回闯关首页
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#F2F9F6] min-h-full pb-32 relative">
      {/* Quiz Progress Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
           <h2 className="text-xl font-black text-brand-dark tracking-tight">挑战进行中</h2>
           <div className="flex items-center gap-1.5">
             {[...Array(5)].map((_, i) => (
               <div 
                 key={i} 
                 className={`h-1.5 rounded-full transition-all duration-300 ${
                   i < currentIndex ? 'bg-brand-core w-4' : i === currentIndex ? 'bg-brand-orange w-8' : 'bg-slate-200 w-4'
                 }`}
               />
             ))}
           </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Question</p>
          <p className="text-2xl font-black text-slate-800 leading-none">{currentIndex + 1}<span className="text-sm text-slate-300">/5</span></p>
        </div>
      </div>

      {/* Question Card */}
      <div className={`bg-white rounded-[2.5rem] p-8 card-shadow border border-brand-light space-y-8 relative overflow-hidden transition-all duration-300 ${isAnswered ? 'ring-4 ring-brand-core/5' : ''}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-brand-soft rounded-2xl flex items-center justify-center shrink-0 border border-brand-light">
            <HelpCircle className="w-6 h-6 text-brand-core" />
          </div>
          <h3 className="text-lg font-black text-slate-800 leading-tight">{currentQ.question}</h3>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((opt) => (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => handleSelect(opt)}
              className={`w-full p-5 rounded-2xl text-left text-[13px] font-black transition-all border-2 flex justify-between items-center ${
                isAnswered
                  ? opt === currentQ.answer
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : selected === opt
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-slate-50 border-transparent text-slate-300'
                  : 'bg-slate-50 border-transparent text-slate-500 hover:border-brand-light'
              } ${!isAnswered && selected === opt ? 'border-brand-core bg-brand-light' : ''}`}
            >
              <span>{opt}</span>
              {isAnswered && opt === currentQ.answer && <CheckCircle2 className="w-5 h-5" />}
              {isAnswered && selected === opt && opt !== currentQ.answer && <XCircle className="w-5 h-5" />}
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 animate-in fade-in slide-in-from-top-4 space-y-3">
            <div className="flex items-center gap-2">
               <AlertCircle className={`w-4 h-4 ${selected === currentQ.answer ? 'text-brand-core' : 'text-brand-orange'}`} />
               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">知识详解</span>
            </div>
            <p className="text-[13px] font-bold text-slate-600 leading-relaxed">{currentQ.explanation}</p>
            <button 
              onClick={nextQuestion}
              className="mt-4 w-full py-4 bg-brand-dark text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              {currentIndex < 4 ? '下一题' : '查看结算'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Rewards Toast/Notification Inside Boundaries */}
      {showNotification.show && (
        <div className="absolute top-2 left-6 right-6 z-50 bg-brand-dark text-white p-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-10 border-2 border-white/20">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-brand-core fill-brand-core" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black opacity-70 uppercase">系统到账通知</p>
            <p className="text-sm font-black">已为您增加 +{showNotification.amount} 永久配额</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
