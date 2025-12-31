
import React from 'react';
import { Zap, Infinity } from 'lucide-react';

interface Props {
  daily: number;
  accumulated: number;
}

const QuotaDisplay: React.FC<Props> = ({ daily, accumulated }) => {
  return (
    <div className="bg-white p-5 rounded-3xl card-shadow border border-slate-50">
      <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
        <Zap className="w-3.5 h-3.5 text-brand-core fill-brand-core" />
        智能配额状态
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-brand-light p-3 rounded-2xl border border-brand-core/10">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-brand-dark font-bold">今日免费</span>
            <span className="text-xs font-bold text-brand-dark">{daily}/10</span>
          </div>
          <div className="w-full bg-white h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-brand-core h-full transition-all duration-500" 
              style={{ width: `${(daily / 10) * 100}%` }}
            />
          </div>
          <p className="text-[9px] text-brand-dark/60 mt-1 font-medium italic">24:00 清零</p>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-slate-500 font-bold">累计奖励</span>
            <Infinity className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-lg font-black text-slate-800 flex items-baseline gap-0.5">
            {accumulated} <span className="text-[10px] font-bold text-slate-400">次</span>
          </div>
          <p className="text-[9px] text-slate-400 font-medium italic">永久有效</p>
        </div>
      </div>
    </div>
  );
};

export default QuotaDisplay;
