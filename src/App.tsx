import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  User, 
  MessageSquare, 
  Flame, 
  Zap,
  ChevronRight,
  Target,
  Award
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Components ---
import Dashboard from './components/Dashboard';
import Challenge from './components/Challenge';
import SkillMap from './components/SkillMap';
import Leaderboard from './components/Leaderboard';
import AITutor from './components/AITutor';
import Profile from './components/Profile';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [studentId, setStudentId] = useState<string | null>(localStorage.getItem('studentId'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  const handleLogin = (id: string, name: string) => {
    setStudentId(id);
    setUsername(name);
    localStorage.setItem('studentId', id);
    localStorage.setItem('username', name);
  };

  if (!studentId) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#09090F] text-white font-sans selection:bg-[#6EE7B7]/30">
        {/* Sidebar Navigation */}
        <nav className="fixed left-0 top-0 h-full w-20 md:w-64 bg-[#111118] border-r border-white/5 flex flex-col z-50">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6EE7B7] to-[#818CF8] flex items-center justify-center shadow-lg shadow-[#6EE7B7]/20">
              <Zap className="w-6 h-6 text-[#09090F] fill-current" />
            </div>
            <span className="hidden md:block font-display text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              DSA Forge
            </span>
          </div>

          <div className="flex-1 px-4 space-y-2 mt-8">
            <NavLink to="/" icon={<LayoutDashboard />} label="Dashboard" />
            <NavLink to="/challenge" icon={<Target />} label="Challenges" />
            <NavLink to="/skills" icon={<BookOpen />} label="Skill Map" />
            <NavLink to="/leaderboard" icon={<Trophy />} label="Leaderboard" />
            <NavLink to="/tutor" icon={<MessageSquare />} label="AI Tutor" />
            <NavLink to="/profile" icon={<User />} label="Profile" />
          </div>

          <div className="p-6 border-t border-white/5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#818CF8] flex items-center justify-center text-xs font-bold">
                {username?.[0]?.toUpperCase()}
              </div>
              <div className="hidden md:block overflow-hidden">
                <p className="text-sm font-medium truncate">{username}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Level 12</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pl-20 md:pl-64 min-h-screen">
          <div className="max-w-7xl mx-auto p-8">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard studentId={studentId} />} />
                <Route path="/challenge" element={<Challenge studentId={studentId} />} />
                <Route path="/skills" element={<SkillMap studentId={studentId} />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/tutor" element={<AITutor studentId={studentId} />} />
                <Route path="/profile" element={<Profile studentId={studentId} />} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </Router>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-4 p-3 rounded-xl text-white/60 hover:text-[#6EE7B7] hover:bg-[#6EE7B7]/5 transition-all group"
    >
      <div className="w-6 h-6 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span className="hidden md:block text-sm font-medium tracking-wide">
        {label}
      </span>
    </Link>
  );
}

function Login({ onLogin }: { onLogin: (id: string, name: string) => void }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username })
      });
      const user = await res.json();
      onLogin(user.student.id, user.username);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090F] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111118] border border-white/5 p-10 rounded-[2rem] shadow-2xl shadow-black/50"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6EE7B7] to-[#818CF8] flex items-center justify-center shadow-xl shadow-[#6EE7B7]/20">
            <Zap className="w-10 h-10 text-[#09090F] fill-current" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">Welcome to DSA Forge</h1>
        <p className="text-white/40 text-center mb-10 text-sm">The Adaptive DSA Mastery Engine</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-mono text-white/40 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-[#6EE7B7] transition-colors"
              placeholder="student@university.edu"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-mono text-white/40 ml-1">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-[#6EE7B7] transition-colors"
              placeholder="EduWarrior_42"
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-[#6EE7B7] text-[#09090F] font-bold py-4 rounded-xl hover:bg-[#5ED6A6] transition-all shadow-lg shadow-[#6EE7B7]/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Initializing Engine...' : 'Enter Forge'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
