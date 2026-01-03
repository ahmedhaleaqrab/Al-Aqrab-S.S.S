
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, Lock } from 'lucide-react';
import { getSmartTutorResponse } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SmartTutor: React.FC = () => {
  const { t, lang, theme, useAiQuestion, user } = useAppContext();
  const isRtl = lang === 'ar';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const questionsLeft = user?.aiQuestionsCount || 0;

  useEffect(() => {
    setMessages([
      { 
        role: 'assistant', 
        content: isRtl 
          ? `أهلاً يا ${user?.firstName}. أنا مساعدك الذكي، متبقي لك اليوم ${questionsLeft} استفسارات.` 
          : `Hello ${user?.firstName}. I am your smart tutor, you have ${questionsLeft} questions left today.`
      }
    ]);
  }, [lang, user?.firstName]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    if (questionsLeft <= 0) {
      alert(t('ai_limit_reached'));
      return;
    }

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const success = useAiQuestion();
    if (success) {
      const response = await getSmartTutorResponse(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] rounded-3xl border dark:border-white/5 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
      <div className="p-6 border-b dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-amber-500 text-slate-950 rounded-xl">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-black text-base">{t('ai_tutor_title')}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{questionsLeft} {t('ai_remaining')}</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-slate-50/30 dark:bg-slate-950/20">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`p-4 rounded-2xl max-w-[85%] text-sm font-bold shadow-sm ${
              msg.role === 'user' 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tr-none' 
              : 'bg-amber-500 text-slate-950 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && <div className="flex justify-end"><Loader2 size={20} className="animate-spin text-amber-500" /></div>}
      </div>

      <div className="p-6 border-t dark:border-white/5">
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
          <input
            type="text"
            disabled={questionsLeft <= 0}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={questionsLeft > 0 ? (isRtl ? 'اسألني أي شيء...' : 'Ask me anything...') : t('ai_limit_reached')}
            className="flex-1 bg-transparent border-none outline-none p-3 text-sm font-bold"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping || questionsLeft <= 0}
            className="p-3 bg-amber-500 text-slate-950 rounded-xl hover:scale-105 transition-all disabled:opacity-50"
          >
            {questionsLeft > 0 ? <Send size={20} className={isRtl ? 'rotate-180' : ''} /> : <Lock size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartTutor;
