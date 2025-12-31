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
    // 尝试加载完整题库
    const loadQuestions = async () => {
      try {
        const response = await fetch('./data/quiz_data.json');
        if (response.ok) {
          const data = await response.json();
          setAllQuestions(data);
        } else {
          throw new Error('Fallback to static data');
        }
      } catch (err) {
        const fallbackData = [
          { "id": "q1", "question": "PET/CT诊断胰腺癌时，SUV最大值达到多少通常考虑为恶性？", "options": ["≥1.5", "≥2.5", "≥3.5", "≥4.5"], "answer": "≥2.5", "explanation": "典型早期胰腺癌SUV最大值≥2.5，而≤2.5则考虑良性病变可能大。" },
          { "id": "q2", "question": "胰腺在人体中最重要的消化功能是对哪种物质的消化？", "options": ["蛋白质", "糖类", "脂肪", "纤维素"], "answer": "脂肪", "explanation": "胰腺分泌的胰液中的消化酶在食物消化过程中起“主角”作用，特别是对脂肪的消化。" }
        ];
        setAllQuestions(fallbackData);
      }
    };
    loadQuestions();
  }, []);

  const startNewSession = () => {
    if (allQuestions.length === 0) return;
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    // 每组 10 题
    setSessionQuestions(shuffled.slice(0, 10));
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
          <p className={`${isCareMode ? 'text-lg' : 'text-sm'} text-slate-400 font-bold px-8`}>每对一题得 +10 AI 奖励配额！</p>
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
      <div className={`p-8 flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in zoom-in duration-300 ${isCareMode ? 'care-mode-root' : ''}`}>
         <div className="relative">
           <PartyPopper className={`${isCareMode ? 'w-24 h-24' : 'w-16 h-16'} text-brand-orange`} />
           <div className="absolute -top-4 -right-4 bg-brand-core text-white rounded-full w-10 h-10 flex items-center justify-center font-black animate-bounce shadow-lg">
             +{score * 10}
           </div>
         </div>
         <div className="text-center space-y-2">
           <h2 className={`${isCareMode ? 'text-4xl' : 'text-3xl'} font-black text-slate-800`}>挑战结束</h2>
           <p className={`${isCareMode ? 'text-xl' : 'text-lg'} font-bold text-slate-500`}>最终得分：{score} / {sessionQuestions.length}</p>
           <p className="text-sm font-black text-brand-core flex items-center justify-center gap-1 bg-brand-light px-4 py-2 rounded-full">
             <Coins className="w-4 h-4" /> 获得 {score * 10} 次 AI 奖励配额
           </p>
         </div>
         <button onClick={() => setGameStatus('idle')} className={`w-full bg-brand-dark text-white rounded-3xl font-black shadow-xl active:scale-95 transition-all ${isCareMode ? 'py-7 text-xl' : 'py-5 text-lg'}`}>返回首页</button>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 bg-[#F2F9F6] min-h-full pb-32 relative ${isCareMode ? 'care-mode-root' : ''}`}>
      {/* 进度显示 */}
      <div className="flex items-center gap-3 px-2">
        <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-brand-core h-full transition-all duration-500" 
            style={{ width: `${((currentIndex + 1) / sessionQuestions.length) * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
          题 {currentIndex + 1} / {sessionQuestions.length}
        </span>
      </div>

      <div className={`bg-white rounded-[2.5rem] card-shadow border border-brand-light space-y-8 ${isCareMode ? 'p-10' : 'p-8'}`}>
        <h3 className={`${isCareMode ? 'text-2xl' : 'text-lg'} font-black text-slate-800 leading-tight`}>{currentQ?.question}</h3>
        
        <div className="space-y-3">
          {currentQ?.options.map((opt) => {
            const isCorrect = opt === currentQ.answer;
            const isChosen = selected === opt;
            
            return (
              <button
                key={opt}
                disabled={isAnswered}
                onClick={() => handleSelect(opt)}
                className={`w-full rounded-2xl text-left font-black transition-all border-2 flex justify-between items-center group ${isCareMode ? 'p-7 text-lg' : 'p-5 text-[13px]'} ${
                  isAnswered
                    ? isCorrect 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : isChosen 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'bg-slate-50 border-transparent text-slate-300'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:border-brand-core/30 hover:bg-white active:scale-[0.98]'
                }`}
              >
                <span>{opt}</span>
                {isAnswered && (
                  isCorrect ? <CheckCircle2 className="w-5 h-5" /> : (isChosen ? <XCircle className="w-5 h-5" /> : null)
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* 解析与正确答案提示 */}
            <div className={`p-5 rounded-2xl border-2 ${
              selected === currentQ.answer 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                : 'bg-red-50 border-red-100 text-red-800'
            }`}>
              <div className="flex items-center gap-2 mb-3 font-black">
                {selected === currentQ.answer ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={isCareMode ? 'text-lg' : 'text-sm'}>
                  {selected === currentQ.answer ? '回答正确！' : `回答错误，正确答案是：${currentQ.answer}`}
                </span>
              </div>
              <div className={`bg-white/50 p-4 rounded-xl space-y-1 ${isCareMode ? 'text-base' : 'text-xs'}`}>
                <p className="font-black text-slate-800">【知识解析】</p>
                <p className="font-medium text-slate-600 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            </div>

            <button 
              onClick={nextQuestion} 
              className={`w-full bg-brand-dark text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-brand-dark/20 active:scale-95 transition-all ${isCareMode ? 'py-6 text-lg' : 'py-4 text-sm'}`}
            >
              {currentIndex < sessionQuestions.length - 1 ? '继续下一题' : '完成挑战并领奖'} 
              <ArrowRight className={isCareMode ? "w-6 h-6" : "w-4 h-4"} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;