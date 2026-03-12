import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Users, Globe } from 'lucide-react';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [tab, setTab] = useState<'global' | 'cohort'>('global');

  useEffect(() => {
    fetch('/api/leaderboard/global')
      .then(res => res.json())
      .then(setLeaderboard);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter">Leaderboard</h1>
          <p className="text-white/40 text-lg">See how you rank against the best in the forge.</p>
        </div>
        
        <div className="flex bg-[#111118] p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setTab('global')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${tab === 'global' ? 'bg-[#6EE7B7] text-[#09090F]' : 'text-white/40 hover:text-white'}`}
          >
            <Globe className="w-4 h-4" /> Global
          </button>
          <button 
            onClick={() => setTab('cohort')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${tab === 'cohort' ? 'bg-[#6EE7B7] text-[#09090F]' : 'text-white/40 hover:text-white'}`}
          >
            <Users className="w-4 h-4" /> Cohort
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-4xl mx-auto">
        {leaderboard.slice(0, 3).map((student, i) => (
          <PodiumCard key={student.username} student={student} rank={i + 1} />
        ))}
      </div>

      {/* List */}
      <div className="bg-[#111118] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="p-8 text-[10px] uppercase tracking-widest font-mono text-white/40">Rank</th>
              <th className="p-8 text-[10px] uppercase tracking-widest font-mono text-white/40">Student</th>
              <th className="p-8 text-[10px] uppercase tracking-widest font-mono text-white/40">Level</th>
              <th className="p-8 text-[10px] uppercase tracking-widest font-mono text-white/40 text-right">Total XP</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.slice(3).map((student) => (
              <tr key={student.username} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                <td className="p-8 font-mono text-white/40">#{student.rank}</td>
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold group-hover:bg-[#6EE7B7]/10 group-hover:text-[#6EE7B7] transition-colors">
                      {student.username[0].toUpperCase()}
                    </div>
                    <span className="font-bold text-lg">{student.username}</span>
                  </div>
                </td>
                <td className="p-8">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold">LVL {student.level}</span>
                </td>
                <td className="p-8 text-right font-black text-[#6EE7B7] text-xl">{student.xp.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function PodiumCard({ student, rank }: { student: any; rank: number }) {
  const height = rank === 1 ? 'h-72' : rank === 2 ? 'h-60' : 'h-52';
  const color = rank === 1 ? 'text-[#6EE7B7]' : rank === 2 ? 'text-[#818CF8]' : 'text-orange-400';
  const order = rank === 1 ? 'md:order-2' : rank === 2 ? 'md:order-1' : 'md:order-3';

  return (
    <div className={`flex flex-col items-center gap-6 ${order}`}>
      <div className="relative">
        <div className={`w-20 h-20 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center text-2xl font-black ${color}`}>
          {student.username[0].toUpperCase()}
        </div>
        <div className={`absolute -top-4 -right-4 w-10 h-10 rounded-xl bg-[#111118] border border-white/10 flex items-center justify-center shadow-xl`}>
          {rank === 1 ? <Trophy className="w-6 h-6 text-amber-400" /> : <Medal className={`w-6 h-6 ${color}`} />}
        </div>
      </div>
      <div className={`w-full ${height} bg-[#111118] border border-white/5 rounded-t-[2rem] flex flex-col items-center justify-center p-6 text-center shadow-2xl relative overflow-hidden`}>
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${color.replace('text-[', '').replace(']', '')} to-transparent opacity-50`} />
        <p className="text-xl font-bold mb-1">{student.username}</p>
        <p className={`text-3xl font-black ${color}`}>{student.xp.toLocaleString()}</p>
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mt-4">Level {student.level}</p>
      </div>
    </div>
  );
}
