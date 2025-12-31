
import React, { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, AlertCircle, Share2, Sparkles, Loader2, Info, Bot, Heart } from 'lucide-react';
import { User } from '../types';
import { getGeminiResponse } from '../services/geminiService';

const MascotAvatar: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <div className={`${className} bg-gradient-to-br from-brand-core to-brand-dark rounded-full flex items-center justify-center relative shadow-sm border-2 border-white`}>
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
}

const ChatPage: React.FC<Props> = ({ user, onMessageSent, onShare }) => {
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
      setError("配额不足。您可以完成关卡或分享文章以免费赚取永久额度。");
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
      setError("网络连接不稳定，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F9F6]">
      {/* Top Quota Area */}
      <div className="px-6 pt-4">
        <div className="bg-white rounded-3xl p-4 card-shadow flex items-center justify-between border border-brand-light">
          <div className="flex-1 border-r border-slate-50 flex flex-col items-center">
            <span className="text-[9px] text-slate-400 font-black mb-1 uppercase tracking-wider">今日免费</span>
            <div className="text-xl font-black text-brand-dark leading-none">{user.dailyQuota}/10</div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[9px] text-slate-400 font-black mb-1 uppercase tracking-wider">永久奖励</span>
            <div className="text-xl font-black text-brand-dark leading-none">{user.accumulatedQuota}</div>
          </div>
          <div className="ml-2 pl-4 border-l border-slate-50">
             <div className="p-2 bg-brand-soft rounded-xl text-brand-dark">
               <Sparkles className="w-4 h-4" />
             </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-6">
            <div className="flex justify-center">
               <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl relative mascot-float p-4">
                 <div className="w-full h-full bg-brand-core rounded-full flex items-center justify-center">
                   <Bot className="w-16 h-16 text-white" />
                 </div>
                 <div className="absolute -top-2 -right-2">
                   <Sparkles className="w-10 h-10 text-brand-orange fill-brand-orange" />
                 </div>
               </div>
            </div>
            <div className="space-y-2 px-8">
              <h3 className="text-xl font-black text-brand-dark">小胰宝 AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-bold">你好，我是小胰宝。你可以询问我关于病情管理、营养调理或指标解读的科普知识。</p>
            </div>
            <div className="grid grid-cols-2 gap-3 px-4">
              {['胰腺癌早期症状', '化疗饮食禁忌', '指标CA199解读', '术后康复建议'].map(q => (
                <button 
                  key={q} 
                  onClick={() => setInput(q)}
                  className="bg-white px-4 py-3 rounded-2xl text-[10px] font-black text-brand-dark border border-brand-light card-shadow hover:bg-brand-light transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'user' ? (
                <div className="w-10 h-10 rounded-2xl bg-brand-dark flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <MascotAvatar />
              )}
              <div className="space-y-2">
                <div className={`px-5 py-4 rounded-[2rem] text-sm leading-relaxed font-medium shadow-sm whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-brand-dark text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-brand-light'
                }`}>
                  {msg.parts[0].text}
                </div>
                {msg.role === 'model' && (
                  <button 
                    onClick={onShare}
                    className="flex items-center gap-1.5 text-[9px] font-black text-brand-dark bg-white/80 px-4 py-2 rounded-full border border-brand-light hover:bg-brand-light transition-all active:scale-95"
                  >
                    <Share2 className="w-3 h-3" /> 分享回答 +10 额度
                  </button>
                )}
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
              <div className="bg-white/60 border border-brand-light px-5 py-3 rounded-[2rem] rounded-tl-none text-slate-400 text-[11px] font-black flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" /> 小胰宝正在查阅资料...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-50 rounded-t-[3rem]">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-[10px] font-bold rounded-xl flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
        <div className="flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="询问科普知识..."
            className="flex-1 bg-slate-50 rounded-2xl py-5 pl-6 pr-14 text-sm font-bold focus:ring-2 focus:ring-brand-core transition-all outline-none border border-slate-100"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-3.5 rounded-xl transition-all ${
              input.trim() && !loading 
                ? 'bg-brand-dark text-white shadow-xl shadow-brand-dark/20 active:scale-95' 
                : 'bg-slate-100 text-slate-300'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
