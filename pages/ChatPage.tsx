
import React, { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, AlertCircle, Share2, Sparkles, Loader2, Bot, Heart, MessageSquarePlus, Mic } from 'lucide-react';
import { User } from '../types';
import { getGeminiResponse } from '../services/geminiService';

const MascotAvatar: React.FC<{ className?: string, isCareMode?: boolean }> = ({ className = "w-10 h-10", isCareMode }) => (
  <div className={`${isCareMode ? 'w-14 h-14' : className} bg-gradient-to-br from-brand-core to-brand-dark rounded-full flex items-center justify-center relative shadow-sm border-2 border-white mascot-float`}>
    <Bot className="w-1/2 h-1/2 text-white" />
    <div className="absolute -top-1 -right-1">
      <Heart className="w-3 h-3 text-brand-orange fill-brand-orange" />
    </div>
  </div>
);

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface Props {
  user: User;
  onMessageSent: () => boolean;
  onShare: () => void;
  onGoToVoice: () => void;
  isCareMode?: boolean;
}

const ChatPage: React.FC<Props> = ({ user, onMessageSent, onShare, onGoToVoice, isCareMode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const RECOMMENDED_QUESTIONS = [
    "胰腺癌早期有什么征兆？",
    "化疗期间怎么吃更有营养？",
    "术后多久需要复查一次？"
  ];

  const LOADING_EMOJIS = ['📚', '🔍', '💡', '🧪', '💬', '🧠'];
  const [currentEmoji, setCurrentEmoji] = useState(LOADING_EMOJIS[0]);

  useEffect(() => {
    if (loading) {
      setCurrentEmoji(LOADING_EMOJIS[Math.floor(Math.random() * LOADING_EMOJIS.length)]);
    }
  }, [loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    if (!onMessageSent()) {
      setError("配额不足，请休息后再试。");
      return;
    }

    const userMessage = textToSend.trim();
    if (!textOverride) setInput('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: userMessage }] }]);
    setLoading(true);

    try {
      const responseText = await getGeminiResponse(userMessage, messages);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: responseText }] }]);
    } catch (err) {
      setError("网络连接不稳定。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F9F6]">
      {/* Top Quota Area */}
      <div className="px-6 pt-4">
        <div className={`bg-white rounded-3xl p-4 card-shadow flex items-center justify-between border border-brand-light ${isCareMode ? 'care-p' : ''}`}>
          <div className="flex-1 border-r border-slate-50 flex flex-col items-center">
            <span className={`${isCareMode ? 'text-xs' : 'text-[9px]'} text-slate-400 font-black mb-1 uppercase tracking-wider`}>今日剩余</span>
            <div className={`${isCareMode ? 'text-2xl' : 'text-xl'} font-black text-brand-dark leading-none`}>{user.dailyQuota}/10</div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className={`${isCareMode ? 'text-xs' : 'text-[9px]'} text-slate-400 font-black mb-1 uppercase tracking-wider`}>永久奖励</span>
            <div className={`${isCareMode ? 'text-2xl' : 'text-xl'} font-black text-brand-dark leading-none`}>{user.accumulatedQuota}</div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-6">
            <div className="flex justify-center flex-col items-center gap-4">
               {/* Clickable Mascot - Triggers Voice Assistant */}
               <div 
                 onClick={onGoToVoice}
                 className={`group cursor-pointer ${isCareMode ? 'w-44 h-44' : 'w-36 h-36'} bg-white rounded-full flex items-center justify-center shadow-2xl relative p-4 mascot-float transition-all hover:scale-110 active:scale-95 hover:ring-8 hover:ring-brand-core/5`}
               >
                 <div className="w-full h-full bg-brand-core rounded-full flex items-center justify-center relative overflow-hidden">
                   <Bot className={isCareMode ? "w-22 h-22 text-white" : "w-18 h-18 text-white"} />
                   <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 </div>
                 {/* Voice Tag Decor */}
                 <div className="absolute -bottom-2 right-2 bg-brand-orange text-white p-2 rounded-xl shadow-lg border-2 border-white animate-bounce-subtle">
                   <Mic className="w-4 h-4" />
                 </div>
               </div>
               <p className={`${isCareMode ? 'text-sm' : 'text-[10px]'} font-black text-brand-core uppercase tracking-widest bg-brand-light px-4 py-1.5 rounded-full animate-pulse`}>
                 点击开启语音通话
               </p>
            </div>
            <div className="space-y-2 px-8">
              <h3 className={`${isCareMode ? 'text-2xl' : 'text-xl'} font-black text-brand-dark`}>我是小胰宝</h3>
              <p className={`${isCareMode ? 'text-lg' : 'text-xs'} text-slate-400 leading-relaxed font-bold`}>
                您可以问我：“胰腺癌有什么早期征兆？”或者“化疗后怎么补充营养？”
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'user' ? (
                <div className={`${isCareMode ? 'w-14 h-14' : 'w-10 h-10'} rounded-2xl bg-brand-dark flex items-center justify-center shrink-0 border-2 border-white shadow-sm`}>
                  <UserIcon className={isCareMode ? "w-7 h-7 text-white" : "w-5 h-5 text-white"} />
                </div>
              ) : (
                <MascotAvatar isCareMode={isCareMode} />
              )}
              <div className="space-y-2">
                <div className={`px-5 py-4 rounded-[2rem] leading-relaxed font-medium shadow-sm whitespace-pre-wrap ${
                  isCareMode ? 'text-lg' : 'text-sm'
                } ${
                  msg.role === 'user' 
                    ? 'bg-brand-dark text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-brand-light'
                }`}>
                  {msg.parts[0].text}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 animate-bounce shadow-sm border-2 border-brand-light">
                <Bot className="w-5 h-5 text-brand-core" />
              </div>
              <div className={`bg-white/60 border border-brand-light px-5 py-3 rounded-[2rem] rounded-tl-none text-slate-400 font-black flex items-center gap-2 ${isCareMode ? 'text-sm' : 'text-[11px]'}`}>
                <Loader2 className="w-3 h-3 animate-spin text-brand-core" /> 
                小胰宝正在努力查阅，稍等一下 {currentEmoji}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Reduced padding from p-6 to p-4 pt-2 */}
      <div className={`p-4 pt-2 bg-white border-t border-slate-50 rounded-t-[3rem] ${isCareMode ? 'care-p' : ''}`}>
        {/* Recommended Questions */}
        {!loading && (
          <div className="flex gap-2 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
            {RECOMMENDED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className={`flex items-center gap-2 whitespace-nowrap bg-brand-soft text-brand-dark border border-brand-light rounded-2xl font-black shadow-sm hover:bg-white hover:border-brand-core transition-all active:scale-95 ${
                  isCareMode ? 'px-6 py-4 text-base' : 'px-4 py-2.5 text-[11px]'
                }`}
              >
                <MessageSquarePlus className={isCareMode ? "w-5 h-5" : "w-3.5 h-3.5"} />
                {q}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-500 text-sm font-bold rounded-xl flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}
        <div className="flex gap-2 relative items-center">
          <div className="flex-1 relative flex items-center">
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="请在此输入您的问题..."
                className={`w-full bg-slate-50 rounded-2xl pl-6 pr-14 font-bold focus:ring-2 focus:ring-brand-core transition-all outline-none border border-slate-100 ${
                  isCareMode ? 'py-6 text-lg' : 'py-5 text-sm'
                }`}
              />
              {/* Internal Voice Trigger - Modern Circular Design */}
              <button
                onClick={onGoToVoice}
                className={`absolute right-2 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-brand-core hover:bg-brand-light transition-all shadow-sm ${
                  isCareMode ? 'w-12 h-12' : 'w-10 h-10'
                }`}
                title="开启语音"
              >
                <Mic className={isCareMode ? "w-6 h-6" : "w-5 h-5"} />
              </button>
          </div>
          <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className={`flex items-center justify-center rounded-2xl transition-all ${
                  isCareMode ? 'p-6 w-20' : 'p-3.5 w-14'
                } ${
                  input.trim() && !loading 
                    ? 'bg-brand-dark text-white shadow-xl shadow-brand-dark/20 active:scale-95' 
                    : 'bg-slate-100 text-slate-300'
                }`}
              >
                <Send className={isCareMode ? "w-8 h-8" : "w-5 h-5"} />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
