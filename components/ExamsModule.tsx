
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, CheckCircle, Clock, AlertTriangle, Image as ImageIcon, 
  HelpCircle, ChevronRight, ChevronLeft, Save, Play, X, 
  CheckCircle2, Square, Circle, Layout, Move, Info
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
// Add AnnouncementStatus to imports
import { QuestionType, Question, Exam, UserRole, AnnouncementStatus } from '../types';

interface ExamsModuleProps {
  mode: 'create' | 'take';
  examId?: string;
  onFinished?: () => void;
}

const ExamsModule: React.FC<ExamsModuleProps> = ({ mode, examId, onFinished }) => {
  const { t, lang, theme } = useAppContext();
  const isRtl = lang === 'ar';
  
  // Fix: Add missing teacherId and status properties to satisfy Exam interface
  const [newExam, setNewExam] = useState<Exam>({
    id: Date.now().toString(),
    title: '',
    description: '',
    teacherId: 'teacher-demo-id',
    status: AnnouncementStatus.PENDING,
    durationMinutes: 30,
    questions: [],
    createdAt: new Date().toISOString()
  });

  // Taking States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExamStarted, setIsExamStarted] = useState(false);

  useEffect(() => {
    if (mode === 'take' && isExamStarted) {
      setTimeLeft(newExam.durationMinutes * 60);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isExamStarted, mode]);

  const addQuestion = (type: QuestionType) => {
    const question: Question = {
      id: Date.now().toString(),
      type,
      text: '',
      points: 1,
      options: type === QuestionType.SINGLE_CHOICE || type === QuestionType.MULTIPLE_CHOICE 
        ? [{ id: '1', text: '' }, { id: '2', text: '' }] 
        : undefined,
      imageUrl: type === QuestionType.IMAGE_HOTSPOT ? 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800' : undefined
    };
    setNewExam(prev => ({ ...prev, questions: [...prev.questions, question] }));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setNewExam(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === id ? { ...q, ...updates } : q)
    }));
  };

  const removeQuestion = (id: string) => {
    setNewExam(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const handleFinishExam = () => {
    alert(isRtl ? 'تم تسليم الاختبار بنجاح!' : 'Exam submitted successfully!');
    if (onFinished) onFinished();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // UI for Creator
  if (mode === 'create') {
    return (
      <div className="space-y-10 animate-in fade-in duration-500 pb-20">
        <div className={`p-8 rounded-[3rem] border shadow-2xl ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 bg-amber-500 text-slate-900 rounded-2xl">
              <Plus size={32} />
            </div>
            <h2 className="text-3xl font-black">{t('create_exam')}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest">{t('exam_title')}</label>
              <input 
                type="text" 
                value={newExam.title}
                onChange={e => setNewExam({...newExam, title: e.target.value})}
                placeholder={isRtl ? 'مثلاً: اختبار الفيزياء - الفصل الأول' : 'e.g. Physics Exam - Chapter 1'}
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-amber-500 font-bold transition-all" 
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest">{t('exam_duration')}</label>
              <input 
                type="number" 
                value={newExam.durationMinutes}
                onChange={e => setNewExam({...newExam, durationMinutes: parseInt(e.target.value)})}
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold" 
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between border-b dark:border-white/5 pb-4">
              <h3 className="text-xl font-black">{isRtl ? 'بناء الأسئلة' : 'Question Builder'}</h3>
              <div className="flex flex-wrap gap-2">
                <TypeButton icon={<Layout />} label={t('question_tf')} onClick={() => addQuestion(QuestionType.TRUE_FALSE)} />
                <TypeButton icon={<Circle />} label={t('question_sc')} onClick={() => addQuestion(QuestionType.SINGLE_CHOICE)} />
                <TypeButton icon={<Square />} label={t('question_mc')} onClick={() => addQuestion(QuestionType.MULTIPLE_CHOICE)} />
                <TypeButton icon={<FileText />} label={t('question_essay')} onClick={() => addQuestion(QuestionType.SHORT_ESSAY)} />
                <TypeButton icon={<ImageIcon />} label={t('question_hotspot')} onClick={() => addQuestion(QuestionType.IMAGE_HOTSPOT)} />
              </div>
            </div>

            <div className="space-y-6">
              {newExam.questions.map((q, idx) => (
                <div key={q.id} className={`p-8 rounded-[2.5rem] border group relative transition-all ${theme === 'dark' ? 'bg-slate-800/50 border-white/5' : 'bg-gray-50'}`}>
                  <button 
                    onClick={() => removeQuestion(q.id)}
                    className="absolute top-6 left-6 p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="flex items-start gap-6">
                    <span className="w-10 h-10 rounded-full bg-slate-900 text-amber-500 flex items-center justify-center font-black text-lg">{idx + 1}</span>
                    <div className="flex-1 space-y-6">
                      <div className="flex gap-4">
                        <input 
                          type="text" 
                          value={q.text}
                          onChange={e => updateQuestion(q.id, { text: e.target.value })}
                          placeholder={isRtl ? 'اكتب نص السؤال هنا...' : 'Type question text here...'}
                          className="flex-1 p-4 bg-white dark:bg-slate-900 rounded-xl font-bold outline-none"
                        />
                        <div className="w-24">
                          <input 
                            type="number" 
                            value={q.points}
                            onChange={e => updateQuestion(q.id, { points: parseInt(e.target.value) })}
                            className="w-full p-4 bg-white dark:bg-slate-900 rounded-xl font-bold text-center"
                          />
                          <p className="text-[10px] text-center font-black mt-1 uppercase text-gray-400">{t('points')}</p>
                        </div>
                      </div>

                      {/* Options Builder based on type */}
                      {q.type === QuestionType.TRUE_FALSE && (
                        <div className="flex gap-4">
                          <button 
                            className={`px-6 py-3 rounded-xl font-black ${q.correctAnswer === 'true' ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-900'}`}
                            onClick={() => updateQuestion(q.id, { correctAnswer: 'true' })}
                          >
                            {t('true_val')}
                          </button>
                          <button 
                            className={`px-6 py-3 rounded-xl font-black ${q.correctAnswer === 'false' ? 'bg-red-500 text-white' : 'bg-white dark:bg-slate-900'}`}
                            onClick={() => updateQuestion(q.id, { correctAnswer: 'false' })}
                          >
                            {t('false_val')}
                          </button>
                        </div>
                      )}

                      {(q.type === QuestionType.SINGLE_CHOICE || q.type === QuestionType.MULTIPLE_CHOICE) && (
                        <div className="space-y-3">
                          {q.options?.map((opt, oIdx) => (
                            <div key={opt.id} className="flex items-center gap-3">
                               <input 
                                 type="text" 
                                 value={opt.text}
                                 onChange={e => {
                                   const newOpts = [...(q.options || [])];
                                   newOpts[oIdx].text = e.target.value;
                                   updateQuestion(q.id, { options: newOpts });
                                 }}
                                 placeholder={`${isRtl ? 'خيار' : 'Option'} ${oIdx + 1}`}
                                 className="flex-1 p-3 bg-white dark:bg-slate-900 rounded-xl text-sm font-bold outline-none" 
                               />
                               <button 
                                 onClick={() => {
                                   if (q.type === QuestionType.SINGLE_CHOICE) {
                                     updateQuestion(q.id, { correctAnswer: opt.id });
                                   } else {
                                     const current = (q.correctAnswer as string[]) || [];
                                     const next = current.includes(opt.id) ? current.filter(i => i !== opt.id) : [...current, opt.id];
                                     updateQuestion(q.id, { correctAnswer: next });
                                   }
                                 }}
                                 className={`p-3 rounded-xl transition-all ${
                                   (q.type === QuestionType.SINGLE_CHOICE && q.correctAnswer === opt.id) ||
                                   (q.type === QuestionType.MULTIPLE_CHOICE && (q.correctAnswer as string[])?.includes(opt.id))
                                   ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-400'
                                 }`}
                               >
                                 <CheckCircle size={18} />
                               </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const newOpts = [...(q.options || []), { id: Date.now().toString(), text: '' }];
                              updateQuestion(q.id, { options: newOpts });
                            }}
                            className="text-xs font-black text-amber-500 hover:underline"
                          >
                            + {isRtl ? 'إضافة خيار' : 'Add Option'}
                          </button>
                        </div>
                      )}

                      {q.type === QuestionType.IMAGE_HOTSPOT && (
                        <div className="space-y-4">
                          <p className="text-xs font-black text-gray-400 italic">{isRtl ? 'انقر على الصورة لتحديد النقطة الصحيحة' : 'Click on the image to set the correct hotspot'}</p>
                          <div className="relative inline-block group cursor-crosshair">
                            <img src={q.imageUrl} className="max-w-md rounded-2xl shadow-xl border-4 border-white dark:border-slate-700" alt="Hotspot" 
                              onClick={(e) => {
                                const rect = (e.target as HTMLImageElement).getBoundingClientRect();
                                const x = ((e.clientX - rect.left) / rect.width) * 100;
                                const y = ((e.clientY - rect.top) / rect.height) * 100;
                                updateQuestion(q.id, { correctPoint: { x, y } });
                              }}
                            />
                            {q.correctPoint && (
                              <div 
                                className="absolute w-8 h-8 border-4 border-amber-500 bg-amber-500/20 rounded-full animate-ping pointer-events-none"
                                style={{ left: `${q.correctPoint.x}%`, top: `${q.correctPoint.y}%`, transform: 'translate(-50%, -50%)' }}
                              ></div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-12 border-t dark:border-white/5 flex justify-end gap-4">
             <button className="px-10 py-5 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-lg">{isRtl ? 'مسودة' : 'Save Draft'}</button>
             <button 
               onClick={() => alert(isRtl ? 'تم نشر الاختبار بنجاح!' : 'Exam published!')}
               className="px-14 py-5 bg-amber-500 text-slate-900 rounded-2xl font-black text-xl shadow-xl shadow-amber-500/20 hover:scale-105 transition-all"
             >
                {isRtl ? 'نشر الاختبار' : 'Publish Exam'}
             </button>
          </div>
        </div>
      </div>
    );
  }

  // UI for Taking Exam
  if (mode === 'take') {
    if (!isExamStarted) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className={`p-16 rounded-[4rem] text-center max-w-2xl shadow-2xl border ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white'}`}>
            <div className="w-24 h-24 bg-amber-500 text-slate-900 rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-10 shadow-xl shadow-amber-500/30">
              <Play fill="currentColor" size={48} className={isRtl ? 'rotate-180' : ''} />
            </div>
            <h2 className="text-5xl font-black mb-6">{newExam.title || (isRtl ? 'اختبار تجريبي' : 'Demo Exam')}</h2>
            <p className="text-xl text-gray-500 font-bold mb-12">هذا الاختبار مدته {newExam.durationMinutes} دقيقة. تأكد من ثبات الاتصال بالإنترنت.</p>
            <button 
              onClick={() => setIsExamStarted(true)}
              className="px-16 py-8 bg-amber-500 text-slate-900 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-amber-500/20 hover:scale-110 transition-all"
            >
              {t('start_exam')}
            </button>
          </div>
        </div>
      );
    }

    const currentQ = newExam.questions[currentQuestionIndex] || {
      id: 'demo',
      type: QuestionType.TRUE_FALSE,
      text: isRtl ? 'هل نظام العقرب هو الأقوى في مصر؟' : 'Is Al-Aqrab the strongest system in Egypt?',
      points: 5
    };

    return (
      <div className="flex flex-col lg:flex-row gap-10 pb-20 animate-in slide-in-from-bottom-10 duration-700">
        <div className="lg:w-3/4 space-y-8">
           <div className={`p-10 rounded-[3rem] border shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-10">
                 <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black">
                   <HelpCircle size={16} />
                   {isRtl ? 'سؤال' : 'Question'} {currentQuestionIndex + 1} {isRtl ? 'من' : 'of'} {newExam.questions.length || 1}
                 </div>
                 <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-black text-xl shadow-inner ${timeLeft < 60 ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500 text-slate-900'}`}>
                    <Clock size={24} />
                    {formatTime(timeLeft)}
                 </div>
              </div>

              <h3 className="text-3xl font-black mb-12 leading-relaxed">{currentQ.text}</h3>

              <div className="space-y-4">
                {/* Answer Inputs for Taker */}
                {currentQ.type === QuestionType.TRUE_FALSE && (
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                       onClick={() => setAnswers({...answers, [currentQ.id]: 'true'})}
                       className={`p-8 rounded-[2rem] font-black text-xl border-4 transition-all ${answers[currentQ.id] === 'true' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-100 dark:border-slate-800'}`}
                     >
                        {t('true_val')}
                     </button>
                     <button 
                       onClick={() => setAnswers({...answers, [currentQ.id]: 'false'})}
                       className={`p-8 rounded-[2rem] font-black text-xl border-4 transition-all ${answers[currentQ.id] === 'false' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-100 dark:border-slate-800'}`}
                     >
                        {t('false_val')}
                     </button>
                  </div>
                )}

                {(currentQ.type === QuestionType.SINGLE_CHOICE || currentQ.type === QuestionType.MULTIPLE_CHOICE) && (
                  <div className="grid gap-4">
                    {currentQ.options?.map((opt) => (
                      <button 
                        key={opt.id}
                        onClick={() => {
                          if (currentQ.type === QuestionType.SINGLE_CHOICE) {
                            setAnswers({...answers, [currentQ.id]: opt.id});
                          } else {
                            const current = (answers[currentQ.id] as string[]) || [];
                            const next = current.includes(opt.id) ? current.filter(i => i !== opt.id) : [...current, opt.id];
                            setAnswers({...answers, [currentQ.id]: next});
                          }
                        }}
                        className={`p-6 rounded-2xl border-2 transition-all text-right flex items-center justify-between font-bold ${
                          (currentQ.type === QuestionType.SINGLE_CHOICE && answers[currentQ.id] === opt.id) ||
                          (currentQ.type === QuestionType.MULTIPLE_CHOICE && (answers[currentQ.id] as string[])?.includes(opt.id))
                          ? 'border-amber-500 bg-amber-500/10' : 'border-slate-100 dark:border-slate-800'
                        }`}
                      >
                         <span>{opt.text}</span>
                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                           (currentQ.type === QuestionType.SINGLE_CHOICE && answers[currentQ.id] === opt.id) ||
                           (currentQ.type === QuestionType.MULTIPLE_CHOICE && (answers[currentQ.id] as string[])?.includes(opt.id))
                           ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                         }`}>
                           {((currentQ.type === QuestionType.SINGLE_CHOICE && answers[currentQ.id] === opt.id) ||
                           (currentQ.type === QuestionType.MULTIPLE_CHOICE && (answers[currentQ.id] as string[])?.includes(opt.id))) && <CheckCircle size={16} className="text-slate-900" />}
                         </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentQ.type === QuestionType.SHORT_ESSAY && (
                  <textarea 
                    rows={6}
                    value={answers[currentQ.id] || ''}
                    onChange={e => setAnswers({...answers, [currentQ.id]: e.target.value})}
                    placeholder={isRtl ? 'اكتب إجابتك هنا بوضوح...' : 'Write your answer clearly here...'}
                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] outline-none border-2 border-transparent focus:border-amber-500 font-bold"
                  />
                )}

                {currentQ.type === QuestionType.IMAGE_HOTSPOT && (
                  <div className="relative inline-block overflow-hidden rounded-3xl border-4 border-slate-900 shadow-2xl">
                     <img src={currentQ.imageUrl} className="max-w-full" alt="Hotspot Task" 
                       onClick={(e) => {
                         const rect = (e.target as HTMLImageElement).getBoundingClientRect();
                         const x = ((e.clientX - rect.left) / rect.width) * 100;
                         const y = ((e.clientY - rect.top) / rect.height) * 100;
                         setAnswers({...answers, [currentQ.id]: { x, y }});
                       }}
                     />
                     {answers[currentQ.id] && (
                       <div 
                         className="absolute w-10 h-10 bg-amber-500/40 border-2 border-amber-500 rounded-full flex items-center justify-center text-white font-black shadow-xl backdrop-blur-sm pointer-events-none"
                         style={{ left: `${answers[currentQ.id].x}%`, top: `${answers[currentQ.id].y}%`, transform: 'translate(-50%, -50%)' }}
                       >
                         <CheckCircle size={20} />
                       </div>
                     )}
                  </div>
                )}
              </div>

              <div className="mt-16 flex justify-between">
                 <button 
                   disabled={currentQuestionIndex === 0}
                   onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                   className="flex items-center gap-2 px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black disabled:opacity-30"
                 >
                    <ChevronLeft size={20} className={isRtl ? 'rotate-180' : ''} />
                    {isRtl ? 'السابق' : 'Previous'}
                 </button>
                 {currentQuestionIndex < newExam.questions.length - 1 ? (
                   <button 
                     onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                     className="flex items-center gap-2 px-10 py-4 bg-amber-500 text-slate-900 rounded-2xl font-black hover:scale-105 transition-all"
                   >
                      {isRtl ? 'التالي' : 'Next'}
                      <ChevronRight size={20} className={isRtl ? 'rotate-180' : ''} />
                   </button>
                 ) : (
                   <button 
                     onClick={handleFinishExam}
                     className="px-12 py-4 bg-green-500 text-white rounded-2xl font-black shadow-xl shadow-green-500/20 hover:scale-110 transition-all"
                   >
                      {t('submit_exam')}
                   </button>
                 )}
              </div>
           </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="lg:w-1/4 space-y-6">
           <div className={`p-8 rounded-[3rem] border shadow-2xl ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white'}`}>
              <h4 className="font-black mb-6 flex items-center gap-2">
                 <Layout size={18} className="text-amber-500" />
                 {isRtl ? 'خريطة الاختبار' : 'Exam Navigator'}
              </h4>
              <div className="grid grid-cols-4 gap-3">
                 {newExam.questions.map((_, i) => (
                   <button 
                     key={i}
                     onClick={() => setCurrentQuestionIndex(i)}
                     className={`w-full aspect-square rounded-xl font-black text-sm flex items-center justify-center transition-all ${
                       currentQuestionIndex === i ? 'bg-amber-500 text-slate-900 scale-110' : 
                       answers[newExam.questions[i].id] ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-gray-400'
                     }`}
                   >
                      {i + 1}
                   </button>
                 ))}
              </div>
           </div>

           <div className="p-8 rounded-[3rem] border border-amber-500/20 bg-amber-500/5 text-amber-600">
              <div className="flex items-center gap-3 mb-4">
                 <Info size={20} />
                 <span className="font-black text-sm">{isRtl ? 'توجيهات العقرب' : 'Scorpion Tips'}</span>
              </div>
              <p className="text-xs font-bold leading-relaxed">{isRtl ? 'ركز في قراءة السؤال جيداً قبل الإجابة. يمكنك العودة للمراجعة في أي وقت قبل انتهاء العداد.' : 'Read each question carefully. You can go back and review at any time before the timer runs out.'}</p>
           </div>
        </div>
      </div>
    );
  }

  return null;
};

const TypeButton = ({ icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-900 rounded-xl text-xs font-black transition-all"
  >
    {icon}
    <span>{label}</span>
  </button>
);

const FileText = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);

export default ExamsModule;
