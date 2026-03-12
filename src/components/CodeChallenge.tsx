import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, CheckCircle2, XCircle, Timer, Code, Terminal, Info } from 'lucide-react';
import { Question } from '../types/shared';
import { evaluateCode } from '../services/gemini';

interface CodeChallengeProps {
  question: Question;
  onAnswer: (correct: boolean, score: number) => void;
  loading: boolean;
}

export default function CodeChallenge({ question, onAnswer, loading: parentLoading }: CodeChallengeProps) {
  const [code, setCode] = useState(question.starter_code || '// Write your solution here\n');
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; feedback: string; score: number } | null>(null);

  const handleRun = async () => {
    setEvaluating(true);
    try {
      const evaluation = await evaluateCode(question, code);
      setResult(evaluation);
      setTimeout(() => {
        onAnswer(evaluation.correct, evaluation.score);
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[600px]">
        {/* Problem Description */}
        <div className="bg-[#111118] border border-white/5 rounded-[2rem] p-8 space-y-8 overflow-y-auto">
          <div className="flex justify-between items-center">
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

          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">{question.question}</h2>
            <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed">
              {question.explanation}
            </div>
          </div>

          {question.constraints && (
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest font-mono text-white/40">Constraints</p>
              <ul className="space-y-2">
                {question.constraints.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-white/60">
                    <div className="w-1 h-1 rounded-full bg-[#6EE7B7]" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {question.test_cases && (
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest font-mono text-white/40">Test Cases</p>
              <div className="space-y-2">
                {question.test_cases.slice(0, 2).map((tc, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-white/40">Input:</span>
                      <span className="text-white/80">{tc.input}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-white/40">Expected:</span>
                      <span className="text-[#6EE7B7]">{tc.expected}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="flex flex-col bg-[#111118] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs font-mono text-white/40">
              <Code className="w-4 h-4" /> solution.js
            </div>
            <button 
              onClick={handleRun}
              disabled={evaluating || parentLoading}
              className="flex items-center gap-2 bg-[#6EE7B7] text-[#09090F] px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-transform disabled:opacity-50"
            >
              {evaluating ? 'Evaluating...' : <><Play className="w-3 h-3 fill-current" /> Run Code</>}
            </button>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                roundedSelection: false,
                padding: { top: 20 },
              }}
            />
          </div>
          
          {/* Console / Output */}
          <div className="h-48 bg-[#09090F] border-t border-white/5 p-6 space-y-4 overflow-y-auto">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono text-white/40">
              <Terminal className="w-3 h-3" /> Console Output
            </div>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    {result.correct ? (
                      <CheckCircle2 className="w-4 h-4 text-[#6EE7B7]" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-bold ${result.correct ? 'text-[#6EE7B7]' : 'text-red-500'}`}>
                      {result.correct ? 'All Test Cases Passed!' : 'Evaluation Failed'}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-mono">
                    {result.feedback}
                  </p>
                </motion.div>
              ) : (
                <div className="text-xs text-white/20 font-mono italic">
                  Run your code to see the evaluation results...
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
