
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudentType, User, UserRole } from '../types';

type Language = 'ar' | 'en';
type Theme = 'light' | 'dark';

interface AppContextType {
  lang: Language;
  theme: Theme;
  user: User | null;
  studentType: StudentType | null;
  setLang: (l: Language) => void;
  setUser: (u: User | null) => void;
  setStudentType: (st: StudentType | null) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
  useAiQuestion: () => boolean;
}

const translations: Record<string, Record<Language, string>> = {
  brand_name: { ar: 'العقرب', en: 'AL-AQRAB' },
  home: { ar: 'الرئيسية', en: 'Home' },
  about: { ar: 'عن المنظومة', en: 'About' },
  services: { ar: 'خدماتنا', en: 'Services' },
  stats: { ar: 'إحصائيات', en: 'Stats' },
  contact: { ar: 'اتصل بنا', en: 'Contact' },
  analyst_tab: { ar: 'المحلل الذكي AI', en: 'AI Analyst' },
  login: { ar: 'دخول المنظومة', en: 'Portal Login' },
  logout: { ar: 'خروج آمن', en: 'Secure Logout' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
  dashboard: { ar: 'لوحة القيادة', en: 'Dashboard' },
  announcements_title: { ar: 'المنشورات والملفات', en: 'Notices & Files' },
  ai_tutor_title: { ar: 'المعلم الخصوصي AI', en: 'AI Tutor' },
  active_teachers: { ar: 'إدارة المعلمين', en: 'Teachers Mgmt' },
  active_students: { ar: 'إدارة الطلاب', en: 'Students Mgmt' },
  approvals: { ar: 'مركز الاعتمادات', en: 'Approvals Hub' },
  monthly_revenue: { ar: 'السجلات المالية', en: 'Finance Logs' },
  exam_module: { ar: 'منصة الاختبارات', en: 'Exam Hub' },
  messages: { ar: 'مركز المراسلة', en: 'Message Center' },
  student: { ar: 'طالب', en: 'Student' },
  teacher: { ar: 'معلم خبير', en: 'Expert Teacher' },
  admin: { ar: 'مدير النظام', en: 'Sys Admin' },
  parent: { ar: 'ولي أمر', en: 'Guardian' },
  accountant: { ar: 'محاسب مالي', en: 'Accountant' },
  system_status: { ar: 'النظام: مستقر', en: 'Status: Optimal' },
  type_message: { ar: 'اكتب استفسارك هنا...', en: 'Type your query...' },
  search_placeholder: { ar: 'البحث السريع...', en: 'Quick Search...' },
  pending_approvals: { ar: 'طلبات بانتظار الموافقة', en: 'Pending Approvals' },
  create_user: { ar: 'إضافة مستخدم جديد', en: 'Add New User' },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>((localStorage.getItem('lang') as Language) || 'ar');
  const [theme, setThemeState] = useState<Theme>((localStorage.getItem('theme') as Theme) || 'light');
  const [user, setUser] = useState<User | null>(null);
  const [studentType, setStudentTypeState] = useState<StudentType | null>(null);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const useAiQuestion = () => {
    if (!user || user.role !== UserRole.STUDENT) return true;
    if (user.aiQuestionsCount <= 0) return false;
    setUser({ ...user, aiQuestionsCount: user.aiQuestionsCount - 1 });
    return true;
  };

  const t = (key: string) => translations[key]?.[lang] || key;

  return (
    <AppContext.Provider value={{ 
      lang, theme, user, studentType, setLang: setLangState, setUser, 
      setStudentType: setStudentTypeState, toggleTheme: () => setThemeState(t => t === 'dark' ? 'light' : 'dark'), 
      t, useAiQuestion 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
