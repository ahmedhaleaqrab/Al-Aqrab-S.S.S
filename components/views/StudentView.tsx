import React from 'react';
import { Trophy, Play, Book, Target, Calendar, MessageSquare, Flame, Star, Zap } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SmartAnalytic from '../SmartAnalytic';
import { UserRole } from '../../types';

interface ViewProps {
  onNavigate: (tab: string) => void;
}

const StudentView: React.FC<ViewProps> = ({ onNavigate }) => {
  const { lang, theme, user } = useAppContext();
  const isRtl = lang === 'ar';

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 pb-10">
      {/* Hero Glass Section */}
      <div className="glass-card rounded-[3rem] p-10 relative overflow-hidden group scorpion-glow smooth-transition">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/20 blur-[100px] rounded-full -mr-40 -mt-40 animate-pulse"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <h1 className="text-4xl font-black mb-2 text-slate-900 dark:text-white">
              {isRtl ? `أهلاً يا بطل، ${user?.firstName} 👋` : `Hi Hero, ${user?.firstName} 👋`}
            </h1>
            <p className="font-bold text-slate-500 dark:text-slate-400 text-lg">
              {isRtl ? 'هل أنت مستعد لمغامرة فيزيائية جديدة اليوم؟' : 'Ready for a new Physics adventure today?'}
            </p>
          </div>
          <button onClick={() => onNavigate('announcements')} className="px-12 py-5 bg-amber-500 text-white rounded-[2rem] font-black text-base shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            <Play size={22} fill="currentColor" />
            {isRtl ? 'بدء المذاكرة' : 'Start Learning'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-[3rem] p-1 border-none">
             <SmartAnalytic 
               role={UserRole.STUDENT} 
               dataContext="مستواك في الفيزياء مذهل. تم رصد تحسن بنسبة 20% في الفصل الأخير." 
             />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <StudentTool onClick={() => onNavigate('overview')} icon={<Calendar />} label={isRtl ? 'الجدول' : 'Schedule'} />
             <StudentTool onClick={() => onNavigate('announcements')} icon={<Book />} label={isRtl ? 'ملازمي' : 'Notes'} />
             <StudentTool onClick={() => onNavigate('exams')} icon={<Target />} label={isRtl ? 'اختبارات' : 'Exams'} />
             <StudentTool onClick={() => onNavigate('tutor')} icon={<Zap />} label={isRtl ? 'اسأل AI' : 'Ask AI'} />
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass-card p-10 rounded-[3rem] scorpion-glow smooth-transition">
              <h3 className="font-black text-sm mb-8 flex items-center gap-2 text-slate-400 uppercase tracking-widest">
                <Trophy size={16} />
                {isRtl ? 'خزانة الأوسمة' : 'Achievement Vault'}
              </h3>
              <div className="flex gap-4">
                 <BadgeIcon icon={<Flame className="text-orange-500" />} />
                 <BadgeIcon icon={<Star className="text-amber-500" />} />
                 <BadgeIcon icon={<Zap className="text-blue-500" />} />
              </div>
           </div>

           <div onClick={() => onNavigate('messages')} className="glass-card p-10 rounded-[3rem] cursor-pointer scorpion-glow smooth-transition border-amber-500/20 group">
              <div className="flex items-center gap-3 mb-4">
                 <MessageSquare className="text-amber-500 group-hover:rotate-12 smooth-transition" size={24} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isRtl ? 'مركز التواصل' : 'Messenger'}</span>
              </div>
              <p className="font-black text-xl text-slate-900 dark:text-white">{isRtl ? 'تحدث مع المعلم' : 'Talk to Teacher'}</p>
              <p className="text-xs text-slate-500 font-bold mt-2 leading-relaxed">{isRtl ? 'لا تتردد في طرح أي سؤال يدور في ذهنك حول المادة.' : 'Feel free to ask any question about the subject.'}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const StudentTool = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="glass-card flex flex-col items-center gap-4 p-8 rounded-[2.5rem] scorpion-glow smooth-transition active:scale-95">
    <div className="p-5 bg-amber-500/10 text-amber-500 rounded-3xl smooth-transition">
       {/* Fix: cast icon to any for cloneElement to avoid type error */}
       {React.cloneElement(icon as React.ReactElement<any>, { size: 32 })}
    </div>
    <span className="text-sm font-black text-slate-700 dark:text-slate-300">{label}</span>
  </button>
);

const BadgeIcon = ({ icon }: any) => (
  <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center border-amber-500/10 hover:rotate-12 smooth-transition shadow-sm">
    {/* Fix: cast icon to any for cloneElement to avoid type error */}
    {React.cloneElement(icon as React.ReactElement<any>, { size: 30 })}
  </div>
);

export default StudentView;