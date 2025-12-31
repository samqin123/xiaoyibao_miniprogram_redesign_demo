
import React, { useState } from 'react';
import { ROADMAP_DATA } from '../constants';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { RoadmapItem } from '../types';

interface Props {
  onSelectStage: (id: string) => void;
  isCareMode?: boolean;
}

const RoadmapCard: React.FC<{ 
  item: RoadmapItem; 
  onSelect: (id: string) => void;
  isNested?: boolean;
  isCareMode?: boolean;
}> = ({ item, onSelect, isNested = false, isCareMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className={`space-y-2 ${isNested ? (isCareMode ? 'ml-6' : 'ml-4') : ''}`}>
      <div 
        onClick={() => {
          if (hasChildren) {
            setIsOpen(!isOpen);
          } else {
            onSelect(item.id);
          }
        }}
        className={`bg-white rounded-[1.8rem] flex items-center justify-between border-2 transition-all duration-300 cursor-pointer active:scale-[0.98] 
          border-transparent shadow-sm hover:border-brand-core hover:shadow-lg hover:shadow-brand-core/10 hover:ring-4 hover:ring-brand-core/5 group ${isCareMode ? 'p-6' : 'p-5'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`${isCareMode ? 'w-12 h-12' : 'w-10 h-10'} rounded-xl bg-slate-50 group-hover:bg-brand-light flex items-center justify-center transition-colors`}>
            <div className={`rounded-full ${isNested ? 'bg-brand-core/40' : 'bg-brand-core'} ${isCareMode ? 'w-3 h-3' : 'w-2 h-2'}`}></div>
          </div>
          <span className={`font-black transition-colors ${isCareMode ? 'text-lg' : 'text-[13px]'} ${isOpen ? 'text-brand-dark' : 'text-slate-700 group-hover:text-brand-dark'}`}>
            {item.label}
          </span>
        </div>
        <div className="text-slate-300 group-hover:text-brand-dark transition-colors">
          {hasChildren ? (
            isOpen ? <ChevronUp className={isCareMode ? "w-7 h-7" : "w-5 h-5"} /> : <ChevronDown className={isCareMode ? "w-7 h-7" : "w-5 h-5"} />
          ) : (
            <ChevronRight className={isCareMode ? "w-7 h-7" : "w-5 h-5"} />
          )}
        </div>
      </div>

      {hasChildren && isOpen && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
          {item.children?.map(child => (
            <RoadmapCard key={child.id} item={child} onSelect={onSelect} isNested isCareMode={isCareMode} />
          ))}
        </div>
      )}
    </div>
  );
};

const RoadmapPage: React.FC<Props> = ({ onSelectStage, isCareMode }) => {
  return (
    <div className="relative min-h-full pb-32 bg-[#F2F9F6]">
      {/* Header Section */}
      <div className={`px-8 pt-12 pb-8 ${isCareMode ? 'space-y-4' : ''}`}>
        <h2 className={`${isCareMode ? 'text-4xl' : 'text-3xl'} font-black text-brand-dark tracking-tight`}>管理路线图</h2>
        <p className={`${isCareMode ? 'text-sm' : 'text-xs'} text-slate-400 font-bold mt-2 uppercase tracking-widest`}>Active Health Management</p>
      </div>

      <div className="px-6 space-y-10">
        {ROADMAP_DATA.map((group) => (
          <section key={group.id} className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className={`bg-brand-core rounded-full ${isCareMode ? 'h-8 w-2' : 'h-6 w-1.5'}`}></div>
              <h3 className={`${isCareMode ? 'text-xl' : 'text-base'} font-black text-slate-800 tracking-tight`}>{group.title}</h3>
            </div>
            
            <div className="space-y-3">
              {group.items.map((item) => (
                <RoadmapCard key={item.id} item={item} onSelect={onSelectStage} isCareMode={isCareMode} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Branding Decor */}
      <div className="mt-20 px-8 opacity-20 flex flex-col items-start gap-1">
         <p className={`${isCareMode ? 'text-xs' : 'text-[10px]'} font-black text-brand-dark uppercase tracking-[0.3em]`}>Patient Empowerment System</p>
         <div className={`bg-brand-core rounded-full ${isCareMode ? 'h-1.5 w-32' : 'h-1 w-24'}`}></div>
      </div>
    </div>
  );
};

export default RoadmapPage;
