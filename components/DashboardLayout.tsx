
import React, { useState } from 'react';
import { UserRole } from '../types';
import { useAppContext } from '../context/AppContext';
import { 
  LayoutDashboard, Users, Wallet, Settings, LogOut, Menu, X,
  MessageSquare, Sun, Moon, Zap, Activity, Trophy, Megaphone, BrainCircuit, Bell, ShieldCheck, GraduationCap, ClipboardCheck
} from 'lucide-react';
import SmartTutor from './SmartTutor';
import AdminView from './views/AdminView';
import TeacherView from './views/TeacherView';
import StudentView from './views/StudentView';
import AccountantView from './views/AccountantView';
import ParentView from './views/ParentView';
import ChatSystem from './ChatSystem';
import ExamsModule from './ExamsModule';
import AnnouncementsModule from './AnnouncementsModule';
import SmartAnalytic from './SmartAnalytic';
import ManagementModule from './ManagementModule';

interface DashboardLayoutProps {
  role: UserRole;
  onLogout: () => void;
  onRoleSwitch: (role: UserRole) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, onLogout }) => {
  const { lang, setLang, theme, toggleTheme, t, user } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  const isRtl = lang === 'ar';

  const getMenuItems = () => {
    const items = [
      { id: 'overview', label: t('dashboard'), icon: <LayoutDashboard size={18} /> },
      { id: 'announcements', label: t('announcements_title'), icon: <Megaphone size={18} /> },
    ];

    if (role === UserRole.ADMIN) {
      items.push({ id: 'approvals', label: t('approvals'), icon: <ClipboardCheck size={18} /> });
      items.push({ id: 'manage_teachers', label: t('active_teachers'), icon: <Users size={18} /> });
      items.push({ id: 'manage_students', label: t('active_students'), icon: <GraduationCap size={18} /> });
      items.push({ id: 'finance', label: t('monthly_revenue'), icon: <Wallet size={18} /> });
    } else if (role === UserRole.TEACHER) {
      items.push({ id: 'manage_students', label: t('active_students'), icon: <GraduationCap size={18} /> });
      items.push({ id: 'exams', label: t('exam_module'), icon: <Trophy size={18} /> });
    } else if (role === UserRole.STUDENT) {
      items.push({ id: 'exams', label: t('exam_module'), icon: <Trophy size={18} /> });
      items.push({ id: 'tutor', label: t('ai_tutor_title'), icon: <Zap size={18} /> });
    }

    items.push({ id: 'analyst', label: t('analyst_tab'), icon: <BrainCircuit size={18} /> });
    items.push({ id: 'messages', label: t('messages'), icon: <MessageSquare size={18} /> });
    items.push({ id: 'settings', label: t('settings'), icon: <Settings size={18} /> });

    return items;
  };

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (activeTab === 'messages') return <ChatSystem currentUserRole={role} />;
    if (activeTab === 'tutor') return <SmartTutor />;
    if (activeTab === 'analyst') return <SmartAnalytic role={role} dataContext="كافة الأنظمة تعمل بوضع التشغيل الآمن." />;
    if (activeTab === 'exams') return <ExamsModule mode={role === UserRole.TEACHER ? 'create' : 'take'} onFinished={() => setActiveTab('overview')} />;
    if (activeTab === 'announcements') return <AnnouncementsModule currentUserRole={role} />;
    if (activeTab === 'approvals') return <ManagementModule mode="approvals" />;
    if (activeTab === 'manage_teachers') return <ManagementModule mode="users" roleFilter={UserRole.TEACHER} />;
    if (activeTab === 'manage_students') return <ManagementModule mode="users" roleFilter={UserRole.STUDENT} />;
    
    switch (role) {
      case UserRole.ADMIN: return <AdminView onNavigate={navigateTo} />;
      case UserRole.TEACHER: return <TeacherView onNavigate={navigateTo} />;
      case UserRole.STUDENT: return <StudentView onNavigate={navigateTo} />;
      case UserRole.ACCOUNTANT: return <AccountantView onNavigate={navigateTo} />;
      case UserRole.PARENT: return <ParentView onNavigate={navigateTo} />;
      default: return null;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-950'}`}>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/40 z-[40] md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>}

      <aside className={`fixed inset-y-0 ${isRtl ? 'right-0' : 'left-0'} z-50 w-64 glass-sidebar md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')} md:static transition-transform duration-300 ease-in-out border-l dark:border-white/5`}>
        <div className="flex items-center justify-between p-6 border-b dark:border-white/5">
          <div className="flex items-center gap-2">
            <Zap className="text-amber-500 fill-amber-500" size={20} />
            <h2 className="text-xl font-black text-amber-500 uppercase tracking-tighter">{t('brand_name')}</h2>
          </div>
          <button className="md:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-160px)] no-scrollbar">
          {getMenuItems().map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all ${activeTab === item.id ? 'bg-amber-500 text-slate-950 font-black shadow-lg' : 'text-slate-600 dark:text-slate-400 hover:bg-amber-500/10 hover:text-amber-600'}`}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span className="text-[11px] font-black leading-normal uppercase">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md">
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl font-black text-xs">
            <LogOut size={18} /> {t('logout')}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 glass-sidebar flex items-center justify-between px-6 z-[30] border-b dark:border-white/5 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></button>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 rounded-full text-[9px] font-black uppercase border border-emerald-500/20">
               <Activity size={10} /> {t('system_status')}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowNotifications(!showNotifications)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 relative">
              <Bell size={18} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </button>
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 font-black text-[10px] text-amber-600">
              {lang === 'ar' ? 'EN' : 'AR'}
            </button>
            <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className={isRtl ? 'text-left' : 'text-right'}>
                <p className="text-[11px] font-black text-slate-950 dark:text-white leading-none">{user?.firstName}</p>
                <p className="text-[8px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1 leading-none">{t(role)}</p>
              </div>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} alt="Avatar" className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20" />
            </div>
          </div>
        </header>

        {showNotifications && (
           <div className={`absolute top-16 ${isRtl ? 'left-6' : 'right-6'} w-80 glass-sidebar z-[100] rounded-2xl shadow-2xl p-4 border dark:border-white/5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl animate-in slide-in-from-top-2`}>
              <h4 className="font-black text-xs uppercase tracking-widest text-amber-500 mb-4">{isRtl ? 'التنبيهات الجديدة' : 'Recent Alerts'}</h4>
              <div className="space-y-3">
                 <NotificationItem text={isRtl ? 'تم رفع ملف مراجعة جديد' : 'New revision file uploaded'} time="5m" />
                 <NotificationItem text={isRtl ? 'رسالة جديدة من المعلم' : 'New message from teacher'} time="12m" />
                 <NotificationItem text={isRtl ? 'موعد اختبار الفيزياء غداً' : 'Physics exam tomorrow'} time="1h" />
              </div>
           </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar bg-slate-50/30 dark:bg-transparent">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

const NotificationItem = ({text, time}: any) => (
  <div className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all border-b dark:border-white/5 last:border-0">
     <p className="text-xs font-bold text-slate-900 dark:text-slate-200">{text}</p>
     <p className="text-[9px] text-slate-400 mt-1 font-black uppercase">{time}</p>
  </div>
);

export default DashboardLayout;
