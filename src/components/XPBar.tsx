import React from 'react';
import { motion } from 'motion/react';

interface XPBarProps {
  currentXP: number;
  level: number;
}

export default function XPBar({ currentXP, level }: XPBarProps) {
  const nextLevelXP = Math.floor(100 * Math.pow(1.4, level));
  const progress = (currentXP / nextLevelXP) * 100;

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-end">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black tracking-tighter text-white">LVL {level}</span>
          <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Mastery Rank</span>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">Experience Points</p>
          <p className="text-sm font-bold text-[#6EE7B7]">{currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP</p>
        </div>
      </div>
      
      <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#6EE7B7] to-[#818CF8] rounded-full shadow-[0_0_20px_rgba(110,231,183,0.3)]"
        />
      </div>
    </div>
  );
}
