
import React from 'react';
import { Book, Activity, ClipboardList, MonitorPlay, MessageSquare, Trophy, Wand2, Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SmartAnalytic from '../SmartAnalytic';
import { UserRole } from '../../types';

interface ViewProps {
  onNavigate: (tab: string) => void;
}

const TeacherView: React.FC<ViewProps> = ({ onNavigate }) => {
  const { lang, theme, t } = useAppContext();
  const isRtl = lang === 'ar';

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
      <div className="glass-card p-10 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-8 scorpion-glow smooth-transition border-white/40 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 shadow-xl">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher" className="w-28 h-28 bg-amber-500/10 rounded-[2.5rem] border-2 border-amber-500/20 p-1 shadow-inner" alt="Profile" />
        <div className="flex-1 text-center md:text-right">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            {isRtl ? 'م/ محمود العزازي' : 'Eng. Mahmoud El-Azazy'}
          </h1>
          <p className="text-slate-500 font-bold text-lg mt-1">{isRtl ? 'كبير معلمي الفيزياء للثانوية العامة' : 'Senior Physics Expert'}</p>
        </div>
        <div className="flex flex-col gap-3">
           <button 
             onClick={() => onNavigate('generate_exam')} 
             className="px-8 py-4 bg-amber-500 text-slate-950 rounded-[1.5rem] font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-3"
           >
              <Wand2 size={20} />
              {t('smart_exam_btn')}
           </button>
           <button onClick={() => onNavigate('exams')} className="px-8 py-4 bg-slate-950 text-white dark:bg-slate-800 rounded-[1.5rem] font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-3">
              <Trophy size={20} />
              {isRtl ? 'إدارة الاختبارات' : 'Exams Management'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-[3rem] p-1 border-none overflow-hidden">
            <SmartAnalytic 
              role={UserRole.TEACHER} 
              dataContext="نسبة نجاح الطلاب في الاختبار الأخير بلغت 92%. هناك حاجة لمراجعة قوانين نيوتن." 
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <ToolCard onClick={() => onNavigate('overview')} icon={<ClipboardList />} label={isRtl ? 'الحضور' : 'Attendance'} color="text-emerald-500" />
             <ToolCard onClick={() => onNavigate('announcements')} icon={<Book />} label={isRtl ? 'الملفات' : 'Files'} color="text-blue-500" />
             <ToolCard onClick={() => onNavigate('messages')} icon={<MessageSquare />} label={isRtl ? 'المحادثات' : 'Chats'} color="text-purple-500" />
             <ToolCard onClick={() => onNavigate('exams')} icon={<Sparkles />} label={isRtl ? 'إحصائيات' : 'Stats'} color="text-amber-500" />
          </div>
        </div>

        <div className="glass-card p-10 rounded-[3.5rem] scorpion-glow smooth-transition bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border dark:border-white/5 shadow-lg">
          <h3 className="font-black text-sm mb-8 flex items-center gap-2 text-slate-400 uppercase tracking-widest">
            <Activity size={16} />
            {isRtl ? 'أداء المجموعات' : 'Groups Analytics'}
          </h3>
          <div className="space-y-8">
             <ProgressRow label={isRtl ? 'مجموعة العباقرة' : 'Elite Group'} value={88} />
             <ProgressRow label={isRtl ? 'مجموعة المتفوقين' : 'Advanced'} value={45} />
             <ProgressRow label={isRtl ? 'مجموعة المراجعة' : 'Revision'} value={72} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolCard = ({ icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="glass-card flex flex-col items-center gap-4 p-8 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-md scorpion-glow smooth-transition active:scale-95 border dark:border-white/5">
    <div className={`p-5 bg-slate-100 dark:bg-slate-800 rounded-3xl ${color} smooth-transition`}>
      {React.cloneElement(icon as React.ReactElement<any>, { size: 32 })}
    </div>
    <span className="text-sm font-black text-slate-700 dark:text-slate-300">{label}</span>
  </button>
);

const ProgressRow = ({ label, value }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between text-[11px] font-black uppercase text-slate-500 tracking-wider">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border dark:border-white/5">
      <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full smooth-transition shadow-sm shadow-amber-500/20" style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default TeacherView;
