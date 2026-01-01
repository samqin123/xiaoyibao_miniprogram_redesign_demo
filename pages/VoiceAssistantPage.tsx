import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Mic, Loader2, X, Volume2, Info, ChevronLeft, UserCheck, Heart, MicOff, Bot } from 'lucide-react';

// 吉祥物图片路径 - 使用 HTTPS 链接以确保跨域和安全加载
const MASCOT_IMG = "https://picgo-1302991947.cos.ap-guangzhou.myqcloud.com/images/logo_512_image.png";

// --- 实用工具函数 ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const VOICE_SYSTEM_INSTRUCTION = `你现在是“小胰宝”实时语音科普助手。
核心表达风格：
1. 友好、亲切、富有同理心，语气温润且富有鼓励性。
2. 回答必须完整但极其简洁，确保每次回复的播报时长在1分钟内。
3. 风险提示规范：回复末尾必须包含一句不超过15字的极简风险提示，例如：“AI回复仅供参考，不作医疗建议。”
4. 你具有实时打断能力。当你感知到用户正在说话，请立即停止当前的回复流。
5. 仅限科普，严禁提供任何诊疗方案。`;

interface Props {
  isCareMode?: boolean;
  onBack?: () => void;
}

const VOICE_OPTIONS = [
  { id: 'Kore', label: '成年女性', voice: 'Kore' },
  { id: 'Charon', label: '成年男性', voice: 'Charon' },
  { id: 'Puck', label: '年轻男性', voice: 'Puck' },
];

const VoiceAssistantPage: React.FC<Props> = ({ isCareMode, onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState(VOICE_OPTIONS[0]);
  
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  const clearAllSources = () => {
    for (const source of sourcesRef.current.values()) {
      try { source.stop(); } catch(e) {}
    }
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const stopSession = () => {
    setIsActive(false);
    setStatus('idle');
    if (sessionRef.current) sessionRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close().catch(() => {});
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close().catch(() => {});
      outputAudioContextRef.current = null;
    }
    clearAllSources();
  };

  const startSession = async () => {
    try {
      setStatus('connecting');
      setIsActive(true);
      setErrorMessage(null);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('listening');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(2048, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.interrupted) {
              clearAllSources();
              setStatus('listening');
              return;
            }
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setStatus('speaking');
              const ctx = outputAudioContextRef.current;
              if (!ctx) return;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onerror: (e) => {
            console.error(e);
            setStatus('error');
            setErrorMessage('连接异常');
          },
          onclose: () => {
            if (isActive) stopSession();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice.voice } },
          },
          systemInstruction: VOICE_SYSTEM_INSTRUCTION,
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('无法访问麦克风');
      stopSession();
    }
  };

  const handleToggle = () => isActive ? stopSession() : startSession();

  return (
    <div className={`flex flex-col h-full bg-[#F2F9F6] items-center p-8 space-y-8 animate-in fade-in duration-500 overflow-hidden relative ${isCareMode ? 'care-mode-root' : ''}`}>
      
      {/* 背景装饰 - 浅色风格 */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-light/30 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-core/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* 顶部返回 */}
      <div className="w-full flex justify-start z-20">
        <button 
          onClick={() => { stopSession(); if (onBack) onBack(); }}
          className="flex items-center gap-2 text-slate-400 font-black hover:text-brand-dark transition-colors"
        >
          <ChevronLeft className="w-6 h-6" /> 返回对话
        </button>
      </div>

      {/* 中心视觉区域 - 恢复圆形大按钮风格 */}
      <div className="relative py-8 flex flex-col items-center justify-center flex-1 w-full">
        {/* 呼吸灯光环 */}
        {(status === 'listening' || status === 'speaking' || status === 'connecting') && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`absolute w-72 h-72 bg-brand-core/10 rounded-full animate-pulse-subtle scale-110`}></div>
            <div className={`absolute w-80 h-80 bg-brand-core/5 rounded-full animate-pulse-subtle delay-700 scale-125`}></div>
          </div>
        )}

        {/* 核心圆形大按钮/头像 */}
        <div 
          onClick={handleToggle}
          className={`
            relative z-20 bg-white rounded-full flex items-center justify-center shadow-2xl p-5 mascot-float transition-all duration-500 cursor-pointer
            ${isCareMode ? 'w-64 h-64' : 'w-56 h-56'}
            ${status === 'speaking' ? 'scale-110 shadow-brand-core/20' : ''}
          `}
        >
          {/* 绿色圆形内饰 */}
          <div className={`w-full h-full bg-brand-core rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-500 shadow-inner`}>
             {/* 替换 Bot 为彩色 Logo */}
             <img 
               src={MASCOT_IMG} 
               alt="小胰宝" 
               className={`object-contain brightness-110 drop-shadow-md ${isCareMode ? 'w-44 h-44' : 'w-36 h-36'}`} 
             />
             
             {/* 说话时的音频能量条 */}
             {status === 'speaking' && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5 px-2">
                <div className="w-1.5 h-6 bg-white/60 rounded-full animate-[bounce_0.6s_ease-in-out_infinite] delay-75"></div>
                <div className="w-1.5 h-10 bg-white rounded-full animate-[bounce_0.8s_ease-in-out_infinite]"></div>
                <div className="w-1.5 h-8 bg-white/80 rounded-full animate-[bounce_0.5s_ease-in-out_infinite] delay-150"></div>
                <div className="w-1.5 h-10 bg-white rounded-full animate-[bounce_0.7s_ease-in-out_infinite] delay-300"></div>
              </div>
            )}
          </div>
          
          {/* 橙色麦克风角标 */}
          <div className={`absolute bottom-2 right-4 bg-brand-orange text-white rounded-2xl shadow-xl border-4 border-white transition-all ${isCareMode ? 'p-4' : 'p-3'}`}>
             <Mic className={isCareMode ? "w-7 h-7" : "w-6 h-6"} />
          </div>

          {/* 红心装饰 */}
          <div className="absolute top-4 right-8 bg-white p-1 rounded-full shadow-sm border border-brand-light">
             <Heart className="w-4 h-4 text-brand-orange fill-brand-orange" />
          </div>
        </div>
      </div>

      {/* 动态提示文字 */}
      <div className="text-center space-y-3 relative z-10 max-w-xs">
        <h2 className={`${isCareMode ? 'text-3xl' : 'text-2xl'} font-black text-slate-800 tracking-tight leading-none`}>
          {status === 'idle' ? '语音实时科普' : 
           status === 'connecting' ? '连接中...' :
           status === 'listening' ? '我在听，请说话' :
           status === 'speaking' ? '讲解中...' : 
           '连接异常'}
        </h2>
        <p className={`${isCareMode ? 'text-lg' : 'text-sm'} text-slate-400 font-bold leading-relaxed px-4`}>
          {status === 'idle' ? '选择一个声音风格开始交流' : 
           status === 'listening' ? '您可以问我任何科普问题' : 
           status === 'speaking' ? '您可以随时说话来打断我' :
           errorMessage || '请检查权限并重试'}
        </p>
      </div>

      {/* 声音选择面板 - 调整为单行并列 */}
      {status === 'idle' && (
        <div className="w-full px-2 animate-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-3 gap-2">
             {VOICE_OPTIONS.map((opt) => (
               <button
                 key={opt.id}
                 onClick={() => setSelectedVoice(opt)}
                 className={`flex flex-col items-center justify-center py-4 rounded-2xl transition-all border-2 ${
                   selectedVoice.id === opt.id 
                    ? 'bg-white border-brand-core text-brand-dark shadow-md' 
                    : 'bg-white/50 border-transparent text-slate-400 hover:bg-white'
                 }`}
               >
                 <div className={`p-2 rounded-xl mb-2 ${selectedVoice.id === opt.id ? 'bg-brand-light text-brand-core' : 'bg-slate-100 text-slate-300'}`}>
                    <Volume2 className="w-4 h-4" />
                 </div>
                 <p className={`${isCareMode ? 'text-sm' : 'text-[11px]'} font-black`}>{opt.label}</p>
                 {selectedVoice.id === opt.id && <div className="mt-1 w-1 h-1 bg-brand-core rounded-full"></div>}
               </button>
             ))}
           </div>
        </div>
      )}

      {/* 底部控制按钮 */}
      <div className="flex-1 flex flex-col justify-end pb-8">
        <button
          onClick={handleToggle}
          className={`group relative flex items-center justify-center rounded-full transition-all duration-500 shadow-2xl ${
            isCareMode ? 'w-24 h-24' : 'w-20 h-20'
          } ${
            isActive 
              ? 'bg-white text-red-500 border-2 border-red-100' 
              : 'bg-brand-dark text-white'
          }`}
        >
          {status === 'connecting' ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : isActive ? (
            <MicOff className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
          
          {/* 呼吸灯环形效果 (未激活时) */}
          {!isActive && (
             <div className="absolute inset-0 rounded-full border-4 border-brand-core/20 animate-ping"></div>
          )}
        </button>
      </div>

      {/* 底部风险提示 */}
      <div className="bg-white/40 backdrop-blur-xl border border-white p-3 rounded-2xl flex items-start gap-2 max-w-sm shadow-sm relative z-10">
        <Info className="w-4 h-4 text-brand-core shrink-0 mt-0.5" />
        <p className="text-[10px] font-bold text-slate-400 leading-normal">
          AI科普仅供参考，不作医疗建议。就医请遵医嘱。
        </p>
      </div>
    </div>
  );
};

export default VoiceAssistantPage;