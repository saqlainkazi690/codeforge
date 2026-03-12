import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Target, Network } from 'lucide-react';

export default function SkillMap({ studentId }: { studentId: string }) {
  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-5xl font-black tracking-tighter">Skill Map</h1>
        <p className="text-white/40 text-lg">Visualizing your knowledge state across the curriculum.</p>
      </div>

      <div className="relative h-[600px] bg-[#111118] border border-white/5 rounded-[2.5rem] overflow-hidden flex items-center justify-center">
        {/* Placeholder for Force-Directed Graph */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#6EE7B7] blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-[#818CF8] blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-md">
          <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center">
            <Network className="w-12 h-12 text-white/40" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Knowledge Graph Initializing</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              We're mapping your interactions to build a force-directed visualization of your mastery. Complete 5 more challenges to unlock the full map.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6EE7B7]/10 border border-[#6EE7B7]/20 text-[#6EE7B7] text-xs font-bold">
              <div className="w-2 h-2 rounded-full bg-[#6EE7B7]" /> Mastered
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold">
              <div className="w-2 h-2 rounded-full bg-orange-500" /> Weak Spot
            </div>
          </div>
        </div>

        {/* Floating Topic Nodes (Mock) */}
        <TopicNode top="20%" left="30%" label="Virtual Memory" status="mastered" />
        <TopicNode top="40%" left="70%" label="File Systems" status="weak" />
        <TopicNode top="60%" left="20%" label="Process Scheduling" status="mastered" />
        <TopicNode top="15%" left="60%" label="I/O Management" status="neutral" />
        <TopicNode top="75%" left="55%" label="Deadlocks" status="neutral" />
      </div>
    </div>
  );
}

function TopicNode({ top, left, label, status }: { top: string; left: string; label: string; status: 'mastered' | 'weak' | 'neutral' }) {
  const color = status === 'mastered' ? 'bg-[#6EE7B7]' : status === 'weak' ? 'bg-orange-500' : 'bg-white/20';
  
  return (
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      style={{ top, left }}
      className="absolute flex flex-col items-center gap-2 group cursor-pointer"
    >
      <div className={`w-4 h-4 rounded-full ${color} shadow-lg transition-transform group-hover:scale-150`} />
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 whitespace-nowrap bg-[#111118] border border-white/10 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">
        {label}
      </div>
    </motion.div>
  );
}
