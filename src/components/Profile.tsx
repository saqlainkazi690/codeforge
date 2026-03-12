import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Target, Book, Zap, Calendar } from 'lucide-react';
import BadgeCard from './BadgeCard';

export default function Profile({ studentId }: { studentId: string }) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/student/${studentId}/profile`)
      .then(res => res.json())
      .then(setProfile);
  }, [studentId]);

  if (!profile) return <div className="animate-pulse h-screen flex items-center justify-center text-white/20">Loading Profile...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
        <div className="relative">
          <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-[#6EE7B7] to-[#818CF8] p-1 shadow-2xl">
            <div className="w-full h-full rounded-[2.8rem] bg-[#09090F] flex items-center justify-center text-5xl font-black">
              {profile.user?.username[0].toUpperCase()}
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 bg-[#111118] border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-xl">
            <Zap className="w-4 h-4 text-[#6EE7B7] fill-current" />
            <span className="font-bold">{profile.eloRating}</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter">{profile.user?.username}</h1>
            <p className="text-white/40 text-lg">Member since {new Date(profile.user?.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <ProfileStat icon={<Target />} label="Challenges" value={profile.attempts?.length || 0} />
            <ProfileStat icon={<Award />} label="Badges" value={profile.achievements?.length || 0} />
            <ProfileStat icon={<Book />} label="Topics" value={profile.skillStates?.length || 0} />
          </div>
        </div>
      </div>

      {/* Badge Wall */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Badge Wall</h2>
            <p className="text-white/40 text-sm">Your earned achievements and citations.</p>
          </div>
          <button className="text-xs font-mono text-[#6EE7B7] uppercase tracking-widest hover:underline">View All 42 Badges</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profile.achievements?.length > 0 ? (
            profile.achievements.map((a: any) => (
              <BadgeCard 
                key={a.id} 
                badgeId={a.badgeId} 
                earnedAt={a.earnedAt} 
                citationText={a.citationText}
                rarity={a.badgeId.includes('Master') ? 'epic' : 'rare'}
              />
            ))
          ) : (
            <div className="col-span-full p-20 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center gap-4">
              <Award className="w-12 h-12 text-white/10" />
              <p className="text-white/20 font-mono text-sm uppercase tracking-widest">No badges earned yet. Start a challenge to begin your collection.</p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Graph Placeholder */}
      <div className="bg-[#111118] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-white/40" />
          <h3 className="text-xl font-bold">Learning Consistency</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 52 * 7 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-sm ${Math.random() > 0.7 ? 'bg-[#6EE7B7]' : Math.random() > 0.9 ? 'bg-[#6EE7B7]/40' : 'bg-white/5'}`} 
            />
          ))}
        </div>
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Last 365 Days of Activity</p>
      </div>
    </motion.div>
  );
}

function ProfileStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl px-6 py-3 flex items-center gap-3">
      <div className="text-white/40">{icon}</div>
      <div>
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono leading-none mb-1">{label}</p>
        <p className="text-lg font-bold leading-none">{value}</p>
      </div>
    </div>
  );
}
