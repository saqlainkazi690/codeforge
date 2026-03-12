import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Timer, Zap } from 'lucide-react';
import { Question } from '../types/shared';

interface ChallengeCardProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  loading: boolean;
}

export default function ChallengeCard({ question, onAnswer, loading }: ChallengeCardProps) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [showResult, setShowResult] = React.useState(false);

  const handleSelect = (option: string) => {
    if (showResult || loading) return;
    setSelected(option);
    const correct = option === question.correct_answer;
    setShowResult(true);
    setTimeout(() => {
      onAnswer(correct);
      setSelected(null);
      setShowResult(false);
    }, 2000);
  };

  return (
    <motion.div 
      key={question.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="w-full max-w-2xl bg-[#111118] border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
    >
      {/* Header Info */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-[#6EE7B7]/10 border border-[#6EE7B7]/20 text-[#6EE7B7] text-[10px] font-bold uppercase tracking-widest">
            {question.topic}
          </div>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest">
            Difficulty {question.difficulty}
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/40">
          <Timer className="w-4 h-4" />
          <span className="text-xs font-mono">{question.estimated_seconds}s</span>
        </div>
      </div>

      {/* Question Text */}
      <h2 className="text-2xl md:text-3xl font-bold mb-12 leading-tight tracking-tight">
        {question.question}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 gap-4">
        {question.options?.map((option, idx) => {
          const isSelected = selected === option;
          const isCorrect = option === question.correct_answer;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <button
              key={idx}
              disabled={showResult || loading}
              onClick={() => handleSelect(option)}
              className={`
                group relative w-full p-6 text-left rounded-2xl border transition-all duration-300
                ${isSelected ? 'border-[#6EE7B7] bg-[#6EE7B7]/5' : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'}
                ${showCorrect ? 'border-[#6EE7B7] bg-[#6EE7B7]/10' : ''}
                ${showWrong ? 'border-red-500/50 bg-red-500/5' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <span className={`text-lg font-medium ${isSelected ? 'text-[#6EE7B7]' : 'text-white/80'}`}>
                  {option}
                </span>
                {showCorrect && <CheckCircle2 className="w-6 h-6 text-[#6EE7B7] animate-bounce" />}
                {showWrong && <XCircle className="w-6 h-6 text-red-500 animate-shake" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation Overlay */}
      <AnimatePresence>
        {showResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/5"
          >
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">Explanation</p>
            <p className="text-sm text-white/80 leading-relaxed">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP Preview */}
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-1 text-[#6EE7B7]">
          <Zap className="w-4 h-4 fill-current" />
          <span className="text-xs font-bold">+{10 * question.difficulty} XP</span>
        </div>
      </div>
    </motion.div>
  );
}
