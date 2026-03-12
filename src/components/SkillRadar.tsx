import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface SkillRadarProps {
  skills: { topic: string; masteryProbability: number }[];
}

export default function SkillRadar({ skills }: SkillRadarProps) {
  const data = skills.map(s => ({
    subject: s.topic,
    A: s.masteryProbability * 100,
    fullMark: 100,
  }));

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-white/20 font-mono uppercase tracking-widest text-xs">
        No mastery data available
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 500 }} 
          />
          <Radar
            name="Mastery"
            dataKey="A"
            stroke="#6EE7B7"
            fill="#6EE7B7"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
