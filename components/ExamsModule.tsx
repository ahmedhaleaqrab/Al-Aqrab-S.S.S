
import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, CheckCircle, Clock, Image as ImageIcon, 
  HelpCircle, ChevronRight, ChevronLeft, Save, Play, X, 
  Layout, Circle, Square, Sparkles, Wand2, RefreshCw, Send, AlertCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { QuestionType, Question, Exam, AnnouncementStatus } from '../types';
import { generateSmartExam } from '../services/geminiService';

interface ExamsModuleProps {
  mode: 'create' | 'take' | 'generate';
  examId?: string;
  onFinished?: () => void;
}

const ExamsModule: React.FC<ExamsModuleProps> = ({ mode: initialMode, onFinished }) => {
  const { t, lang, theme } = useAppContext();
  const isRtl = lang === 'ar';
  
  const [mode, setMode] = useState(initialMode);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [newExam, setNewExam] = useState<Exam>({
    id: Date.now().toString(),
    title: '',
    description: '',
    teacherId: 'teacher-demo',
    status: AnnouncementStatus.PENDING,
    durationMinutes: 30,
    questions: [],
    createdAt: new Date().toISOString()
  });

  const [examsList, setExamsList] = useState<Exam[]>([]);

  const handleAiGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await generateSmartExam(prompt);
      setNewExam({
        ...newExam,
        title: generated.title,
        description: generated.description,
        questions: generated.questions.map((q: any, i: number) => ({
          ...q,
          id: `ai-${Date.now()}-${i}`,
          points: q.points || 1
        }))
      });
      setMode('create');
    } catch (error) {
      alert(isRtl ? 'فشل التوليد، حاول مجدداً.' : 'Generation failed, try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!newExam.title) {
       alert(isRtl ? 'يرجى كتابة عنوان للاختبار' : 'Please write an exam title');
       return;
    }
    setExamsList([...examsList, { ...newExam, status: AnnouncementStatus.PENDING }]);
    alert(isRtl ? 'تم حفظ الاختبار في المسودات' : 'Exam saved to drafts');
    if (onFinished) onFinished();
  };

  const handlePublish = (examId: string) => {
    alert(isRtl ? 'تم إرسال الاختبار للمراجعة والقبول' : 'Exam sent for review');
  };

  if (mode === 'generate') {
    return (
      <div className="space-y-10 animate-in zoom-in-95 duration-500">
        <div className={`p-10 md:p-16 rounded-[4rem] border-2 backdrop-blur-3xl shadow-2xl relative overflow-hidden flex flex-col items-center text-center ${
          theme === 'dark' ? 'bg-slate-900/80 border-amber-500/20 shadow-amber-500/5' : 'bg-white/80 border-amber-500/10'
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          
          <div className="p-6 bg-amber-500 text-slate-950 rounded-[2.5rem] shadow-2xl mb-8 animate-bounce">
            <Wand2 size={48} />
          </div>
          
          <h2 className="text-4xl font-black mb-4 text-amber-500">{t('smart_exam_btn')}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg max-w-xl mb-12">
            {isRtl ? 'حوّل أفكارك إلى اختبارات مهنية في ثوانٍ. فقط أخبر العقرب عن موضوعك.' : 'Transform your ideas into professional exams in seconds.'}
          </p>

          <div className="w-full max-w-2xl space-y-6 relative z-10">
             <textarea 
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               placeholder={t('exam_prompt_label')}
               className="w-full p-8 bg-slate-100/50 dark:bg-slate-800/50 rounded-[2.5rem] border-2 border-transparent focus:border-amber-500 outline-none font-bold text-lg min-h-[200px] transition-all resize-none shadow-inner"
             />
             
             <div className="flex gap-4 justify-center">
               <button 
                 disabled={isGenerating || !prompt.trim()}
                 onClick={handleAiGenerate}
                 className="flex-1 py-6 bg-amber-500 text-slate-950 rounded-[2rem] font-black text-xl shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
               >
                 {isGenerating ? (
                   <>
                     <RefreshCw size={24} className="animate-spin" />
                     {t('ai_generating')}
                   </>
                 ) : (
                   <>
                     <Sparkles size={24} />
                     {t('generate_btn')}
                   </>
                 )}
               </button>
               <button 
                 onClick={() => setMode('create')}
                 className="px-10 py-6 bg-slate-950 text-white dark:bg-slate-800 rounded-[2rem] font-black"
               >
                 {isRtl ? 'إنشاء يدوي' : 'Manual Create'}
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="space-y-10 animate-in fade-in duration-700 pb-20">
        <div className={`p-8 md:p-12 rounded-[3.5rem] border backdrop-blur-2xl shadow-2xl ${theme === 'dark' ? 'bg-slate-900/80 border-white/5' : 'bg-white/80 border-slate-100'}`}>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-amber-500 text-slate-950 rounded-2xl">
                <Layout size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-amber-500">{isRtl ? 'تحرير الاختبار' : 'Edit Exam'}</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{isRtl ? 'نمط البناء الذكي نشط' : 'Smart Builder Mode Active'}</p>
              </div>
            </div>
            <button onClick={() => setMode('generate')} className="text-amber-500 font-black flex items-center gap-2 hover:underline">
               <RefreshCw size={16} /> {isRtl ? 'إعادة توليد ذكي' : 'AI Regenerate'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{isRtl ? 'عنوان الاختبار' : 'Exam Title'}</label>
              <input 
                type="text" 
                value={newExam.title}
                onChange={e => setNewExam({...newExam, title: e.target.value})}
                className="w-full p-6 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl outline-none border-2 border-transparent focus:border-amber-500 font-bold text-lg shadow-inner" 
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{isRtl ? 'المدة (بالدقائق)' : 'Duration (Mins)'}</label>
              <input 
                type="number" 
                value={newExam.durationMinutes}
                onChange={e => setNewExam({...newExam, durationMinutes: parseInt(e.target.value)})}
                className="w-full p-6 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl outline-none font-bold text-lg" 
              />
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-black flex items-center gap-3">
               <Sparkles size={20} className="text-amber-500" />
               {isRtl ? 'الأسئلة المقترحة' : 'Suggested Questions'}
            </h3>

            <div className="space-y-6">
              {newExam.questions.map((q, idx) => (
                <div key={q.id} className={`p-8 rounded-[2.5rem] border group relative transition-all hover:bg-amber-500/[0.02] ${theme === 'dark' ? 'bg-slate-800/30 border-white/5' : 'bg-slate-50/50'}`}>
                  <button 
                    onClick={() => setNewExam(prev => ({...prev, questions: prev.questions.filter(x => x.id !== q.id)}))}
                    className="absolute top-8 left-8 p-3 text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="flex items-start gap-8">
                    <span className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-500 flex items-center justify-center font-black text-xl shadow-lg">{idx + 1}</span>
                    <div className="flex-1 space-y-6">
                      <div className="flex gap-4">
                        <textarea 
                          value={q.text}
                          onChange={e => {
                            const updated = [...newExam.questions];
                            updated[idx].text = e.target.value;
                            setNewExam({...newExam, questions: updated});
                          }}
                          className="flex-1 p-5 bg-white dark:bg-slate-900 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-amber-500 shadow-sm resize-none"
                        />
                      </div>

                      {q.options && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {q.options.map((opt, oIdx) => (
                             <div key={opt.id} className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 ${q.correctAnswer === opt.id ? 'bg-amber-500 border-amber-500' : 'border-slate-300'}`}></div>
                                <input 
                                  value={opt.text}
                                  onChange={(e) => {
                                    const updated = [...newExam.questions];
                                    updated[idx].options![oIdx].text = e.target.value;
                                    setNewExam({...newExam, questions: updated});
                                  }}
                                  className="flex-1 p-3 bg-white dark:bg-slate-900 rounded-xl text-sm font-bold outline-none"
                                />
                             </div>
                           ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 pt-12 border-t dark:border-white/5 flex flex-wrap justify-end gap-5">
             <button onClick={() => { if(onFinished) onFinished(); }} className="px-10 py-5 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-lg text-slate-500">
               {isRtl ? 'إلغاء' : 'Cancel'}
             </button>
             <button 
               onClick={handleSave}
               className="px-12 py-5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 rounded-2xl font-black text-lg shadow-xl"
             >
                {isRtl ? 'حفظ كمسودة' : 'Save as Draft'}
             </button>
             <button 
               onClick={() => { handleSave(); handlePublish('demo'); }}
               className="px-16 py-5 bg-amber-500 text-slate-950 rounded-2xl font-black text-xl shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all flex items-center gap-3"
             >
                <Send size={24} className={isRtl ? 'rotate-180' : ''} />
                {isRtl ? 'حفظ ونشر للمراجعة' : 'Save & Publish'}
             </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ExamsModule;
