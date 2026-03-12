import React from 'react';
import { motion } from 'motion/react';
import { Award } from 'lucide-react';

interface BadgeCardProps {
  badgeId: string;
  earnedAt?: string;
  citationText?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

const RARITY_STYLES = {
  common: 'from-slate-500/20 to-slate-500/5 border-slate-500/20 text-slate-400',
  rare: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400',
  epic: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400',
  legendary: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
};

export default function BadgeCard({ badgeId, earnedAt, citationText, rarity = 'common' }: BadgeCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className={`
        relative p-6 rounded-[2rem] border bg-gradient-to-br transition-all
        ${RARITY_STYLES[rarity]}
      `}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center`}>
          <Award className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">{badgeId}</h3>
          <p className="text-[10px] uppercase tracking-widest font-mono opacity-60 mb-3">{rarity}</p>
          {citationText && (
            <p className="text-xs italic text-white/60 leading-relaxed px-2">
              "{citationText}"
            </p>
          )}
        </div>
        {earnedAt && (
          <div className="text-[10px] font-mono opacity-40">
            EARNED {new Date(earnedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </motion.div>
  );
}
