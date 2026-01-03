
import React from 'react';
import { Users, ShieldCheck, Zap, Activity, Database, Lock, Settings, Megaphone, Terminal, Cpu, HardDrive, BrainCircuit, ClipboardCheck, GraduationCap } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { UserRole } from '../../types';

interface ViewProps {
  onNavigate: (tab: string) => void;
}

const AdminView: React.FC<ViewProps> = ({ onNavigate }) => {
  const { lang, theme, t } = useAppContext();
  const isRtl = lang === 'ar';
  
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="glass-card rounded-[3rem] p-10 flex flex-col md:flex-row justify-between items-center gap-10 scorpion-glow smooth-transition border-white/40 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 shadow-xl">
        <div className="flex items-center gap-8">
           <div className="w-20 h-20 bg-amber-500 text-slate-950 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/30">
              <Terminal size={36} />
           </div>
           <div>
              <h1 className="text-3xl font-black text-amber-500 leading-tight uppercase">
                {isRtl ? 'مركز القيادة والتحكم' : 'Command Center'}
              </h1>
              <p className="text-slate-950 dark:text-slate-400 font-bold text-base mt-1">
                {isRtl ? 'إدارة المنظومة التعليمية بذكاء وأمان.' : 'Manage educational system smartly and securely.'}
              </p>
           </div>
        </div>
        <div className="flex gap-4">
          <StatusChip icon={<Cpu size={16} />} label="CPU" value="14%" color="text-emerald-500" />
          <StatusChip icon={<HardDrive size={16} />} label="RAM" value="68%" color="text-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <QuickAction onClick={() => onNavigate('approvals')} icon={<ClipboardCheck />} label={t('approvals')} count={3} />
            <QuickAction onClick={() => onNavigate('manage_teachers')} icon={<Users />} label={t('active_teachers')} />
            <QuickAction onClick={() => onNavigate('manage_students')} icon={<GraduationCap />} label={t('active_students')} />
            <QuickAction onClick={() => onNavigate('announcements')} icon={<Megaphone />} label={t('announcements_title')} />
            <QuickAction onClick={() => onNavigate('messages')} icon={<Zap />} label={t('messages')} />
            <QuickAction onClick={() => onNavigate('settings')} icon={<Settings />} label={t('settings')} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[3rem] scorpion-glow smooth-transition bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg border dark:border-white/5">
            <h3 className="font-black text-[11px] mb-8 flex items-center gap-3 text-slate-400 uppercase tracking-widest">
              <Activity size={18} className="text-amber-500" />
              {isRtl ? 'الاستقرار الأمني' : 'Security Stability'}
            </h3>
            <div className="space-y-6">
              <StatusItem label={isRtl ? 'قاعدة البيانات' : 'Database'} value={isRtl ? 'نشطة' : 'Active'} />
              <StatusItem label={isRtl ? 'نظام الحماية' : 'Firewall'} value={isRtl ? 'مؤمن' : 'Secured'} />
              <StatusItem label={isRtl ? 'التشفير' : 'Encryption'} value="AES-256" />
            </div>
          </div>

          <div className="bg-amber-500 p-8 rounded-[3rem] text-slate-950 shadow-2xl shadow-amber-500/20 border-t-4 border-white/30 transition-transform hover:scale-[1.02]">
             <div className="flex items-center gap-3 mb-3">
                <ShieldCheck size={24} />
                <h4 className="font-black text-xl">{isRtl ? 'أمان العقرب' : 'Scorpion Shield'}</h4>
             </div>
             <p className="text-xs font-bold opacity-80 leading-relaxed">
               {isRtl ? 'كافة البيانات والدرجات والعمليات المالية تحت حماية مشفرة تامة من أي تدخل خارجي.' : 'All data, grades, and finance are under full encrypted protection.'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusChip = ({ label, value, color, icon }: any) => (
  <div className="glass-card px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 flex flex-col items-center min-w-[110px] backdrop-blur-md">
    <div className="flex items-center gap-2 mb-1 text-slate-400">
       {icon}
       <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
    </div>
    <span className={`text-xl font-black ${color}`}>{value}</span>
  </div>
);

const QuickAction = ({ icon, label, onClick, count }: any) => (
  <button onClick={onClick} className="glass-card flex flex-col items-center gap-4 p-8 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg scorpion-glow smooth-transition active:scale-95 group shadow-md border dark:border-white/5 relative">
    {count && (
      <div className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg animate-bounce">
         {count}
      </div>
    )}
    <div className="p-5 bg-amber-500/10 text-amber-500 rounded-2xl smooth-transition group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:shadow-lg">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
    </div>
    <span className="text-[10px] font-black text-slate-950 dark:text-slate-200 uppercase tracking-widest">{label}</span>
  </button>
);

const StatusItem = ({ label, value }: any) => (
  <div className="flex justify-between items-center text-sm font-bold border-b dark:border-white/5 pb-4 last:border-0 last:pb-0">
    <span className="text-slate-500">{label}</span>
    <span className="text-slate-950 dark:text-white font-black">{value}</span>
  </div>
);

export default AdminView;
