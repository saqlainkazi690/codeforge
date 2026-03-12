import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateQuestions } from '../services/gemini';
import ChallengeCard from './ChallengeCard';
import CodeChallenge from './CodeChallenge';
import { Question } from '../types/shared';
import { Trophy, Zap, ArrowRight, RotateCcw, Code, List } from 'lucide-react';

export default function Challenge({ studentId }: { studentId: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0, xp: 0 });

  const startSession = async () => {
    setLoading(true);
    setSessionComplete(false);
    setStats({ correct: 0, total: 0, xp: 0 });
    setCurrentIndex(0);
    
    // DSA topics
    const topics = ["Arrays", "Linked Lists", "Trees", "Graphs", "Dynamic Programming", "Sorting"];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const newQuestions = await generateQuestions(randomTopic, 3);
    setQuestions(newQuestions);
    setLoading(false);
  };

  useEffect(() => {
    startSession();
  }, []);

  const handleAnswer = async (correct: boolean, score: number = 1.0) => {
    const q = questions[currentIndex];
    
    // Update backend
    const res = await fetch('/api/challenge/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        topic: q.topic,
        correct,
        difficulty: q.difficulty,
        timeTaken: 15 // Mock time
      })
    });
    const data = await res.json();

    setStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
      xp: prev.xp + data.xpEarned
    }));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-[#6EE7B7]/20 border-t-[#6EE7B7] rounded-full animate-spin" />
        <p className="text-white/40 font-mono text-sm uppercase tracking-widest animate-pulse">Forging DSA Challenges...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="flex flex-col items-center gap-12 py-10 min-h-screen">
      <div className="w-full max-w-4xl flex justify-between items-center bg-[#111118] p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {currentQuestion.type === 'code' ? <Code className="w-5 h-5 text-[#818CF8]" /> : <List className="w-5 h-5 text-[#6EE7B7]" />}
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">{currentQuestion.type === 'code' ? 'Coding' : 'MCQ'}</span>
          </div>
          <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#6EE7B7] to-[#818CF8]"
            />
          </div>
          <span className="text-xs font-mono text-white/40">{currentIndex + 1}/{questions.length}</span>
        </div>
        <div className="flex items-center gap-2 text-[#6EE7B7]">
          <Zap className="w-5 h-5 fill-current" />
          <span className="text-lg font-black tracking-tighter">{stats.xp} XP</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {sessionComplete ? (
          <motion.div 
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center space-y-12 py-20"
          >
            <div className="w-24 h-24 bg-[#6EE7B7]/10 rounded-[2rem] flex items-center justify-center mx-auto border border-[#6EE7B7]/20">
              <Trophy className="w-12 h-12 text-[#6EE7B7]" />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tighter">Session Complete!</h2>
              <p className="text-white/40 text-xl">You've successfully navigated the DSA forge.</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <ResultStat label="Accuracy" value={`${Math.round((stats.correct / stats.total) * 100)}%`} />
              <ResultStat label="XP Earned" value={`+${stats.xp}`} />
              <ResultStat label="Mastery" value="↑ 4.2%" />
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={startSession}
                className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all"
              >
                <RotateCcw className="w-5 h-5" /> Try Another Topic
              </button>
              <button className="flex items-center justify-center gap-3 bg-[#6EE7B7] text-[#09090F] font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-transform">
                Continue to Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-6xl"
          >
            {currentQuestion.type === 'code' ? (
              <CodeChallenge 
                question={currentQuestion} 
                onAnswer={(correct, score) => handleAnswer(correct, score)}
                loading={false}
              />
            ) : (
              <div className="flex justify-center">
                <ChallengeCard 
                  question={currentQuestion} 
                  onAnswer={(correct) => handleAnswer(correct)}
                  loading={false}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#111118] border border-white/5 p-6 rounded-2xl">
      <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-2">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
