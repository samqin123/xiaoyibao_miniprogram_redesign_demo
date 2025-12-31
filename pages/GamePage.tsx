
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
  isCareMode?: boolean;
}

const GamePage: React.FC<Props> = ({ onPass, isCareMode }) => {
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');

  useEffect(() => {
    const fallbackData = [
      { "id": "q1", "question": "PET/CT诊断胰腺癌时，SUV最大值达到多少通常考虑为恶性？", "options": ["≥1.5", "≥2.5", "≥3.5", "≥4.5"], "answer": "≥2.5", "explanation": "典型早期胰腺癌SUV最大值≥2.5，而≤2.5则考虑良性病变可能大。" },
      { "id": "q2", "question": "胰腺在人体中最重要的消化功能是对哪种物质的消化？", "options": ["蛋白质", "糖类", "脂肪", "纤维素"], "answer": "脂肪", "explanation": "胰腺分泌的胰液中的消化酶在食物消化过程中起“主角”作用，特别是对脂肪的消化。" }
    ];
    setAllQuestions(fallbackData);
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
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      setGameStatus('finished');
      onPass(score * 10);
    }
  };

  const currentQ = sessionQuestions[currentIndex];

  if (gameStatus === 'idle') {
    return (
      <div className={`p-8 flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in fade-in duration-500 ${isCareMode ? 'care-mode-root' : ''}`}>
        <div className={`${isCareMode ? 'w-32 h-32 rounded-5xl' : 'w-24 h-24 rounded-4xl'} bg-brand-light flex items-center justify-center shadow-xl mascot-float`}>
          <Trophy className={isCareMode ? "w-16 h-16 text-brand-core" : "w-12 h-12 text-brand-core"} />
        </div>
        <div className="text-center space-y-2">
          <h2 className={`${isCareMode ? 'text-3xl' : 'text-2xl'} font-black text-slate-800 tracking-tight`}>知识大闯关</h2>
          <p className={`${isCareMode ? 'text-lg' : 'text-sm'} text-slate-400 font-bold px-8`}>每对一题得+10配额奖励！</p>
        </div>
        <button 
          onClick={startNewSession}
          className={`w-full max-w-xs bg-brand-dark text-white rounded-3xl font-black shadow-2xl shadow-brand-dark/20 active:scale-95 transition-all ${isCareMode ? 'py-7 text-xl' : 'py-5 text-lg'}`}
        >
          立即开启挑战
        </button>
      </div>
    );
  }

  if (gameStatus === 'finished') {
    return (
      <div className={`p-8 flex flex-col items-center justify-center min-h-[70vh] space-y-6 ${isCareMode ? 'care-mode-root' : ''}`}>
         <h2 className={`${isCareMode ? 'text-4xl' : 'text-3xl'} font-black text-slate-800`}>挑战结束</h2>
         <p className={`${isCareMode ? 'text-xl' : 'text-lg'} font-bold text-slate-500`}>得分：{score}</p>
         <button onClick={() => setGameStatus('idle')} className={`w-full bg-brand-dark text-white rounded-3xl font-black ${isCareMode ? 'py-7 text-xl' : 'py-5 text-lg'}`}>返回首页</button>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 bg-[#F2F9F6] min-h-full pb-32 relative ${isCareMode ? 'care-mode-root' : ''}`}>
      <div className={`bg-white rounded-[2.5rem] card-shadow border border-brand-light space-y-8 ${isCareMode ? 'p-10' : 'p-8'}`}>
        <h3 className={`${isCareMode ? 'text-2xl' : 'text-lg'} font-black text-slate-800 leading-tight`}>{currentQ?.question}</h3>
        <div className="space-y-3">
          {currentQ?.options.map((opt) => (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => handleSelect(opt)}
              className={`w-full rounded-2xl text-left font-black transition-all border-2 flex justify-between items-center ${isCareMode ? 'p-7 text-lg' : 'p-5 text-[13px]'} ${
                isAnswered
                  ? opt === currentQ.answer ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : selected === opt ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-transparent text-slate-300'
                  : 'bg-slate-50 border-transparent text-slate-500'
              }`}
            >
              <span>{opt}</span>
            </button>
          ))}
        </div>
        {isAnswered && (
          <button onClick={nextQuestion} className={`w-full bg-brand-dark text-white rounded-2xl font-black flex items-center justify-center gap-2 ${isCareMode ? 'py-6 text-lg' : 'py-4 text-sm'}`}>
            下一题 <ArrowRight className={isCareMode ? "w-6 h-6" : "w-4 h-4"} />
          </button>
        )}
      </div>
    </div>
  );
};

export default GamePage;
