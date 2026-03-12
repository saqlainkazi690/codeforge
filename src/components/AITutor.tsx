import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, FileUp, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { tutorChatStream } from '../services/tutor';

export default function AITutor({ studentId }: { studentId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('Operating Systems: Process Management, Memory, File Systems, and I/O.');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, parts: m.parts }));
      const stream = tutorChatStream(input, context, history);
      
      let botMessage = { role: 'model', parts: [{ text: '' }] };
      setMessages(prev => [...prev, botMessage]);

      for await (const chunk of stream) {
        botMessage.parts[0].text += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...botMessage };
          return newMessages;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter">Socratic Tutor</h1>
          <p className="text-white/40 text-sm">AI-powered guidance, never just the answers.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 px-4 py-2 rounded-xl hover:text-white transition-all text-sm">
          <FileUp className="w-4 h-4" /> Upload Notes
        </button>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#111118] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
                <div className="w-20 h-20 rounded-[2rem] bg-[#818CF8]/10 flex items-center justify-center border border-[#818CF8]/20">
                  <Sparkles className="w-10 h-10 text-[#818CF8]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">How can I help you learn today?</h3>
                  <p className="text-white/40 text-sm leading-relaxed">Ask me about complex concepts, or upload your course materials for a personalized deep dive.</p>
                </div>
                <div className="grid grid-cols-1 gap-3 w-full">
                  <SuggestionButton text="Explain Virtual Memory using an analogy" onClick={() => setInput("Explain Virtual Memory using an analogy")} />
                  <SuggestionButton text="How do semaphores prevent race conditions?" onClick={() => setInput("How do semaphores prevent race conditions?")} />
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-[#6EE7B7]/10' : 'bg-[#818CF8]/10'}`}>
                  {m.role === 'user' ? <User className="w-5 h-5 text-[#6EE7B7]" /> : <Bot className="w-5 h-5 text-[#818CF8]" />}
                </div>
                <div className={`max-w-[80%] p-6 rounded-[2rem] ${m.role === 'user' ? 'bg-[#6EE7B7]/10 rounded-tr-none' : 'bg-white/5 rounded-tl-none'}`}>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{m.parts[0].text}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-6 bg-white/5 border-t border-white/5">
            <div className="relative flex items-center">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your tutor anything..."
                className="w-full bg-[#09090F] border border-white/10 rounded-2xl p-4 pr-16 focus:outline-none focus:border-[#818CF8] transition-all"
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 p-3 bg-[#818CF8] text-[#09090F] rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Context */}
        <div className="hidden lg:block w-80 space-y-6">
          <div className="bg-[#111118] border border-white/5 rounded-[2rem] p-6 space-y-4">
            <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono uppercase tracking-widest">
              <Info className="w-3 h-3" /> Active Context
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Currently referencing: <span className="text-[#818CF8] font-bold">OS_Lecture_Notes.pdf</span>
            </p>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-[#818CF8]" />
            </div>
            <p className="text-[10px] text-white/40">75% of content indexed</p>
          </div>

          <div className="bg-gradient-to-br from-[#818CF8]/20 to-transparent border border-[#818CF8]/20 rounded-[2rem] p-6 space-y-4">
            <h4 className="text-sm font-bold">Tutor Tip</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Try asking "Why?" after an explanation to trigger a deeper Socratic dialogue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestionButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-xs text-white/60"
    >
      {text}
    </button>
  );
}
