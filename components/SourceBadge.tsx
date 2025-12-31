
import React from 'react';
import { SourceLevel } from '../types';

interface Props {
  level: SourceLevel;
}

const SourceBadge: React.FC<Props> = ({ level }) => {
  const config = {
    [SourceLevel.A]: { color: 'bg-red-50 text-red-600 border-red-100', label: 'A级·权威指南' },
    [SourceLevel.B]: { color: 'bg-orange-50 text-orange-600 border-orange-100', label: 'B级·专家署名' },
    [SourceLevel.C]: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'C级·平台审核' },
  };

  const { color, label } = config[level];

  return (
    <span className={`${color} px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-tight border`}>
      {label}
    </span>
  );
};

export default SourceBadge;
