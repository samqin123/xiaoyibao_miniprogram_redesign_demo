
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Mic, Bot, Loader2, Sparkles, X, Volume2, Info, ChevronLeft, UserCheck, Heart, MicOff } from 'lucide-react';

// 吉祥物图片路径 - 使用 HTTPS 链接以确保跨域和安全加载
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
4. 你具有实时打断能力。当你感知到用户正在说话或用户输入了新内容，请立即停止当前的回复流，转为倾听模式。
5. 仅限科普，严禁提供任何诊疗方案。`;

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

      // Always use process.env.API_KEY directly in the initialization of the GoogleGenAI instance.
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
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              // CRITICAL: Solely rely on sessionPromise resolves and then call `session.sendRealtimeInput`
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

            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            
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
            console.error('Gemini Live error:', e);
            setStatus('error');
            setErrorMessage('连接异常，请检查网络或重试。');
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
          systemInstruction: VOICE_SYSTEM_INSTRUCTION + `\n当前用户声音偏好：${selectedVoice.label}`,
        },
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error('Voice Assistant start failed:', err);
      setStatus('error');
      setErrorMessage('无法开启麦克风权限。');
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

  // Fixed: Added JSX return for the component
  return (
    <div className={`flex flex-col h-full bg-slate-900 text-white relative overflow-hidden ${isCareMode ? 'care-mode-root' : ''}`}>
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-core rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-orange rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between relative z-10">
        <button 
          onClick={onBack}
          className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-90"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className={`font-black tracking-tight ${isCareMode ? 'text-2xl' : 'text-lg'}`}>实时语音助手</h2>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Voice Service</p>
        </div>
        <button className="p-3 bg-white/10 rounded-2xl opacity-0 cursor-default">
          <Info className="w-6 h-6" />
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <div className="relative mb-12">
          <div className={`
            relative z-20 w-48 h-48 rounded-[3rem] bg-white flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden
            ${status === 'listening' ? 'scale-110 ring-8 ring-brand-core/20' : ''}
            ${status === 'speaking' ? 'scale-110 ring-8 ring-brand-orange/20' : ''}
          `}>
            <div className={`absolute inset-0 bg-brand-soft flex items-center justify-center`}>
              <img src={MASCOT_IMG} alt="小胰宝" className={`w-[85%] h-[85%] object-contain ${isActive ? 'mascot-float' : ''}`} />
            </div>
            
            {status === 'connecting' && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
            )}
          </div>

          {isActive && (
            <div className="absolute inset-0 z-10 -m-8 flex items-center justify-center pointer-events-none">
              <div className={`absolute w-full h-full rounded-full border-2 border-brand-core/30 animate-ping`}></div>
              <div className={`absolute w-full h-full rounded-full border-2 border-brand-orange/20 animate-pulse delay-700`}></div>
            </div>
          )}
        </div>

        <div className="text-center space-y-3 mb-12">
          {status === 'idle' && (
            <>
              <h3 className={`${isCareMode ? 'text-2xl' : 'text-xl'} font-black`}>点击开始通话</h3>
              <p className="text-white/40 font-bold px-4">“您可以问我任何关于胰腺癌科普的问题”</p>
            </>
          )}
          {status === 'connecting' && (
            <h3 className={`${isCareMode ? 'text-2xl' : 'text-xl'} font-black animate-pulse`}>正在建立加密连接...</h3>
          )}
          {status === 'listening' && (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-brand-core/20 text-brand-core px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-brand-core/30">倾听中...</div>
              <h3 className={`${isCareMode ? 'text-2xl' : 'text-xl'} font-black`}>请对我说话</h3>
            </div>
          )}
          {status === 'speaking' && (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-brand-orange/20 text-brand-orange px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-brand-orange/30">回答中...</div>
              <h3 className={`${isCareMode ? 'text-2xl' : 'text-xl'} font-black`}>小胰宝正在回答您</h3>
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-center gap-2 text-red-400">
              <h3 className={`${isCareMode ? 'text-2xl' : 'text-xl'} font-black`}>连接失败</h3>
              <p className="text-sm font-bold">{errorMessage}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleToggle}
          className={`
            w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 border-8 border-slate-800
            ${isActive ? 'bg-red-500 text-white' : 'bg-brand-core text-white'}
          `}
        >
          {isActive ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
        </button>
      </main>

      <footer className="p-8 pb-12 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Volume2 className="w-4 h-4 text-brand-core" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">选择语音偏好</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {VOICE_OPTIONS.map((v) => (
              <button
                key={v.id}
                disabled={isActive}
                onClick={() => setSelectedVoice(v)}
                className={`
                  p-4 rounded-2xl flex flex-col items-center gap-1 transition-all border-2
                  ${selectedVoice.id === v.id 
                    ? 'bg-brand-core border-brand-core text-white shadow-lg' 
                    : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}
                  ${isActive ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                `}
              >
                <span className="text-[11px] font-black">{v.label}</span>
                <span className="text-[8px] font-bold opacity-60 line-clamp-1">{v.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

// Fixed: Export the component as default to match App.tsx imports
export default VoiceAssistantPage;
