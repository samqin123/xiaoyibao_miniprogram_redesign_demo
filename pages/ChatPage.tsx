
import React, { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, AlertCircle, Share2, Sparkles, Loader2, Bot, Heart } from 'lucide-react';
import { User } from '../types';
import { getGeminiResponse } from '../services/geminiService';

const MascotAvatar: React.FC<{ className?: string, isCareMode?: boolean }> = ({ className = "w-10 h-10", isCareMode }) => (
  <div className={`${isCareMode ? 'w-14 h-14' : className} bg-gradient-to-br from-brand-core to-brand-dark rounded-full flex items-center justify-center relative shadow-sm border-2 border-white`}>
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
  isCareMode?: boolean;
}

const ChatPage: React.FC<Props> = ({ user, onMessageSent, onShare, isCareMode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (!onMessageSent()) {
      setError("配额不足，请休息后再试。");
      return;
    }

    const userMessage = input.trim();
    setInput('');
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
            <div className="flex justify-center">
               <div className={`${isCareMode ? 'w-40 h-40' : 'w-32 h-32'} bg-white rounded-full flex items-center justify-center shadow-2xl relative p-4`}>
                 <div className="w-full h-full bg-brand-core rounded-full flex items-center justify-center">
                   <Bot className={isCareMode ? "w-20 h-20 text-white" : "w-16 h-16 text-white"} />
                 </div>
               </div>
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
                <Loader2 className="w-3 h-3 animate-spin" /> 小胰宝正在想...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-6 bg-white border-t border-slate-50 rounded-t-[3rem] ${isCareMode ? 'care-p' : ''}`}>
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-500 text-sm font-bold rounded-xl flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}
        <div className="flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="请在此输入您的问题..."
            className={`flex-1 bg-slate-50 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-brand-core transition-all outline-none border border-slate-100 ${
              isCareMode ? 'py-6 text-lg' : 'py-5 text-sm'
            }`}
          />
          <button
            onClick={handleSend}
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
  );
};

export default ChatPage;
