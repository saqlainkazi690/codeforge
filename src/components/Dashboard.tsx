import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, Flame, Target, Trophy, ArrowRight } from 'lucide-react';
import XPBar from './XPBar';
import SkillRadar from './SkillRadar';
import { useSocket } from '../services/socket';

export default function Dashboard({ studentId }: { studentId: string }) {
  const [profile, setProfile] = useState<any>(null);
  const { xpUpdate, levelUp } = useSocket(studentId);

  useEffect(() => {
    fetch(`/api/student/${studentId}/profile`)
      .then(res => res.json())
      .then(setProfile);
  }, [studentId, xpUpdate, levelUp]);

  if (!profile) return <div className="animate-pulse h-screen flex items-center justify-center text-white/20">Loading Dashboard...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter">Welcome back, {profile.user?.username}</h1>
          <p className="text-white/40 text-lg">Your adaptive learning engine is ready for today's challenge.</p>
        </div>
        <div className="flex gap-4">
          <StatCard icon={<Flame className="text-orange-500 fill-current" />} label="Streak" value={`${profile.streakCount} Days`} />
          <StatCard icon={<Zap className="text-[#6EE7B7] fill-current" />} label="ELO" value={profile.eloRating} />
        </div>
      </div>

      {/* XP & Level Section */}
      <div className="bg-[#111118] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
        <XPBar currentXP={profile.xp} level={profile.level} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Challenge CTA */}
        <div className="lg:col-span-2 relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-[#6EE7B7]/20 bg-gradient-to-br from-[#6EE7B7]/10 to-transparent p-12 transition-all hover:border-[#6EE7B7]/40">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#6EE7B7] flex items-center justify-center shadow-xl shadow-[#6EE7B7]/20">
                <Target className="w-6 h-6 text-[#09090F]" />
              </div>
              <span className="text-xs font-mono text-[#6EE7B7] uppercase tracking-widest font-bold">Daily Challenge</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight max-w-md leading-tight">Master Dynamic Programming & Graph Algorithms</h2>
            <p className="text-white/60 text-lg max-w-lg">Complete today's adaptive DSA session to earn 2x XP and protect your streak.</p>
            <button className="flex items-center gap-3 bg-[#6EE7B7] text-[#09090F] font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-transform">
              Start Session <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#6EE7B7]/10 rounded-full blur-[100px] group-hover:bg-[#6EE7B7]/20 transition-all" />
        </div>

        {/* Skill Radar */}
        <div className="bg-[#111118] border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center">
          <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-8">Mastery Radar</h3>
          <SkillRadar skills={profile.skillStates} />
          <p className="mt-8 text-xs text-white/40 text-center leading-relaxed">Your strongest topic is <span className="text-[#6EE7B7] font-bold">Arrays & Hashing</span>. Focus on <span className="text-[#818CF8] font-bold">Graph Theory</span> next.</p>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-[#111118] border border-white/5 rounded-2xl p-4 flex items-center gap-4 min-w-[140px]">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
