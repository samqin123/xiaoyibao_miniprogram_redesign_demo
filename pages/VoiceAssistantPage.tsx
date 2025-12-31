
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Mic, Bot, Loader2, Sparkles, X, Volume2, Info, ChevronLeft, UserCheck, Heart } from 'lucide-react';

// 吉祥物图片路径 - 使用新的 HTTPS 链接
const MASCOT_IMG = "https://picgo-1302991947.cos.ap-guangzhou.myqcloud.com/images/logo_512_image.png";

// --- Manual Implementation of required functions as per instructions ---
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
4. 仅限科普，严禁提供任何诊疗方案。`;

interface Props {
  isCareMode?: boolean;
  onBack?: () => void;
}

const VOICE_OPTIONS = [
  { id: 'Kore', label: '成年女性', desc: '稳重、专业', voice: 'Kore' },
  { id: 'Charon', label: '成年男性', desc: '磁性、专业', voice: 'Charon' },
  { id: 'Puck', label: '年轻男性', desc: '热情、快节奏', voice: 'Puck' },
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
    
    if (sessionRef.current) {
      sessionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }

    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
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
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
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

            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            
            if (base64EncodedAudioString) {
              setStatus('speaking');
              const currentOutputCtx = outputAudioContextRef.current;
              if (!currentOutputCtx) return;

              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, currentOutputCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64EncodedAudioString),
                currentOutputCtx,
                24000,
                1,
              );
              
              const source = currentOutputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(currentOutputCtx.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) {
                  setStatus('listening');
                }
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onerror: (e: any) => {
            setStatus('error');
            setErrorMessage('连接异常，请检查网络或麦克风。');
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
          systemInstruction: VOICE_SYSTEM_INSTRUCTION + `\n当前用户偏好：${selectedVoice.label}，风格：${selectedVoice.desc}`,
        },
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      setStatus('error');
      setErrorMessage('无法访问麦克风。');
      stopSession();
    }
  };

  const handleToggle = () => {
    if (isActive) {
      stopSession();
    } else {
      startSession();
    }
  };

  const handleMascotClick = () => {
    if (status === 'speaking') {
      clearAllSources();
      setStatus('listening');
    }
  };

  return (
    <div className={`flex flex-col h-full bg-[#F2F9F6] items-center p-8 space-y-8 animate-in fade-in duration-500 overflow-hidden relative ${isCareMode ? 'care-mode-root' : ''}`}>
      
      {/* Header */}
      <div className="w-full flex justify-start z-20">
        <button 
          onClick={() => {
            stopSession();
            if (onBack) onBack();
          }}
          className="flex items-center gap-2 text-slate-400 font-black hover:text-brand-dark transition-colors"
        >
          <ChevronLeft className="w-6 h-6" /> 返回对话
        </button>
      </div>

      {/* Visual Indicator */}
      <div className="relative py-8 flex flex-col items-center justify-center">
        {/* Breathing Light Layers */}
        {(status === 'listening' || status === 'speaking' || status === 'connecting') && (
          <>
            <div className={`absolute w-64 h-64 bg-brand-core/10 rounded-full animate-pulse-subtle scale-110`}></div>
            <div className={`absolute w-80 h-80 bg-brand-core/5 rounded-full animate-pulse-subtle delay-700 scale-125`}></div>
            {status === 'speaking' && (
               <div className={`absolute w-96 h-96 bg-brand-core/5 rounded-full animate-pulse scale-150 opacity-20`}></div>
            )}
          </>
        )}

        {/* Square Mascot Container */}
        <div 
          onClick={handleMascotClick}
          className={`group cursor-pointer ${isCareMode ? 'w-52 h-52' : 'w-44 h-44'} bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl relative p-4 mascot-float transition-all hover:scale-105 active:scale-95 hover:ring-8 hover:ring-brand-core/5`}
        >
          <div className={`w-full h-full bg-brand-soft rounded-[2rem] flex items-center justify-center relative overflow-hidden transition-all duration-500 ${status === 'speaking' ? 'scale-110 shadow-lg shadow-brand-core/20' : ''}`}>
            <img src={MASCOT_IMG} alt="小胰宝" className="w-full h-full object-contain" />
            <div className={`absolute inset-0 bg-brand-core/5 opacity-0 group-hover:opacity-100 transition-opacity ${status === 'speaking' ? 'opacity-20' : ''}`}></div>
            
            {/* Pulsing Audio Lines */}
            {status === 'speaking' && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 px-2">
                <div className="w-1 h-6 bg-brand-core/60 rounded-full animate-[bounce_0.6s_ease-in-out_infinite] delay-75"></div>
                <div className="w-1 h-10 bg-brand-core rounded-full animate-[bounce_0.8s_ease-in-out_infinite]"></div>
                <div className="w-1 h-8 bg-brand-core/80 rounded-full animate-[bounce_0.5s_ease-in-out_infinite] delay-150"></div>
                <div className="w-1 h-10 bg-brand-core rounded-full animate-[bounce_0.7s_ease-in-out_infinite] delay-300"></div>
                <div className="w-1 h-6 bg-brand-core/60 rounded-full animate-[bounce_0.6s_ease-in-out_infinite] delay-450"></div>
              </div>
            )}
          </div>
          
          {/* Badge Decor */}
          <div className="absolute -top-1 -right-1 bg-white p-2 rounded-2xl shadow-xl border-2 border-brand-light">
             <Heart className="w-5 h-5 text-brand-orange fill-brand-orange" />
          </div>
        </div>
      </div>

      {/* Dynamic Text */}
      <div className="text-center space-y-3 relative z-10 max-w-xs">
        <h2 className={`${isCareMode ? 'text-3xl' : 'text-2xl'} font-black text-slate-800 tracking-tight leading-none`}>
          {status === 'idle' ? '语音实时科普' : 
           status === 'connecting' ? '正在连接...' :
           status === 'listening' ? '我在听，请提问' :
           status === 'speaking' ? '为您讲解中' : 
           '连接异常'}
        </h2>
        <p className={`${isCareMode ? 'text-lg' : 'text-sm'} text-slate-400 font-bold leading-relaxed px-4`}>
          {status === 'idle' ? '选择一个声音风格开始交流' : 
           status === 'listening' ? '您可以问我任何关于胰腺癌的问题' : 
           status === 'speaking' ? '您可以随时说话来打断我' :
           errorMessage || '请检查麦克风权限后重试'}
        </p>
      </div>

      {/* Voice Selection Panel */}
      {status === 'idle' && (
        <div className="w-full flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-500">
           <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center mb-1">定制您的专属声音</div>
           <div className="grid grid-cols-1 gap-2">
             {VOICE_OPTIONS.map((opt) => (
               <button
                 key={opt.id}
                 onClick={() => setSelectedVoice(opt)}
                 className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all border-2 ${
                   selectedVoice.id === opt.id 
                    ? 'bg-white border-brand-core text-brand-dark shadow-md' 
                    : 'bg-white/50 border-transparent text-slate-400 hover:bg-white'
                 }`}
               >
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${selectedVoice.id === opt.id ? 'bg-brand-light text-brand-core' : 'bg-slate-100 text-slate-300'}`}>
                       <Volume2 className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                       <p className="text-sm font-black">{opt.label}</p>
                       <p className="text-[10px] opacity-60 font-medium">{opt.desc}</p>
                    </div>
                 </div>
                 {selectedVoice.id === opt.id && <UserCheck className="w-5 h-5 text-brand-core" />}
               </button>
             ))}
           </div>
        </div>
      )}

      {/* Main Switch */}
      <div className="flex-1 flex flex-col justify-end pb-8">
        <button
          onClick={handleToggle}
          className={`group relative flex items-center justify-center rounded-full transition-all duration-500 shadow-2xl ${
            isCareMode ? 'w-24 h-24' : 'w-20 h-20'
          } ${
            isActive 
              ? 'bg-white text-red-500 border-2 border-red-100 hover:scale-110 active:scale-90' 
              : 'bg-brand-dark text-white hover:scale-110 active:scale-90 shadow-brand-dark/30'
          }`}
        >
          {status === 'connecting' ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : isActive ? (
            <X className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
          
          {!isActive && (
             <div className="absolute inset-0 rounded-full border-4 border-brand-core/20 animate-ping"></div>
          )}
        </button>
      </div>

      {/* Risk Notice */}
      <div className="bg-white/40 backdrop-blur-xl border border-white p-3 rounded-2xl flex items-start gap-2 max-w-sm shadow-sm">
        <Info className="w-3.5 h-3.5 text-brand-core shrink-0 mt-0.5" />
        <p className="text-[9px] font-bold text-slate-400 leading-normal">
          AI科普仅供参考，不作医疗建议。紧急情况请拨打120。
        </p>
      </div>
    </div>
  );
};

export default VoiceAssistantPage;
