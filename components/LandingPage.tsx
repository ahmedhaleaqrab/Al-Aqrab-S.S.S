
import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '../types';
import { useAppContext } from '../context/AppContext';
import { 
  Zap, ArrowRight, Sun, Moon, Globe,
  GraduationCap, X, Sparkles,
  Briefcase, Calculator, 
  ShieldCheck, 
  Trophy, 
  Layers, PhoneCall, Mail, MapPin,
  BrainCircuit, BarChart3, Fingerprint, MonitorPlay, Users, Star, 
  Smartphone, BookOpen, Clock, Award, ShieldAlert, BadgeCheck, LineChart
} from 'lucide-react';

interface LandingPageProps {
  onStart: (role: UserRole) => void;
}

const RevealOnScroll: React.FC<{ children: React.ReactNode, className?: string, type?: 'fade' | 'write' | 'lock-right' | 'lock-left', delay?: string }> = ({ children, className = '', type = 'fade', delay = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    }, { threshold: 0.1 });

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  const getAnimationClass = () => {
    switch (type) {
      case 'write': return isVisible ? 'write-active' : '';
      default: return isVisible ? 'reveal-visible' : 'reveal-hidden';
    }
  };

  const getBaseClass = () => {
    switch (type) {
      case 'write': return 'write-reveal';
      default: return 'reveal-hidden';
    }
  };

  return (
    <div ref={domRef} className={`${getBaseClass()} ${getAnimationClass()} ${delay} ${className}`}>
      {children}
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { t, lang, setLang, theme, toggleTheme, setUser } = useAppContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'select_role'>('login');
  const [currentSlide, setCurrentSlide] = useState(0);
  const isRtl = lang === 'ar';

  const slides = [
    {
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600",
      title: isRtl ? "نظام العقرب: التحول الرقمي الحقيقي" : "Al-Aqrab: The Digital Transformation",
      desc: isRtl ? "بيئة تعليمية ذكية تدمج قوة Gemini لتأمين الاختبارات وإدارة الحسابات بدقة متناهية." : "Smart educational environment integrating Gemini AI to secure exams and manage finances.",
      theme: "الذكاء الاصطناعي",
      icon: <BrainCircuit className="text-amber-500" size={18} />
    },
    {
      url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1600",
      title: isRtl ? "حماية ضد الغش بتقنيات متطورة" : "Advanced Anti-Cheat Protection",
      desc: isRtl ? "نظام رصد ذكي يمنع أي محاولات تلاعب لضمان عدالة كاملة في تقييم مستوى الطالب الحقيقي." : "Intelligent monitoring system preventing any manipulation attempts to ensure full fairness.",
      theme: "الأمان المتقدم",
      icon: <Fingerprint className="text-amber-500" size={18} />
    }
  ];

  const services = [
    {
      icon: <LineChart className="text-emerald-500" />,
      title: isRtl ? "تتبع مسار الطالب" : "Student Progress Tracking",
      desc: isRtl ? "تحليل دقيق لنقاط القوة والضعف وتتبع التطور الدراسي لحظة بلحظة." : "Detailed analysis of strengths and weaknesses with real-time academic tracking."
    },
    {
      icon: <Calculator className="text-blue-500" />,
      title: isRtl ? "إدارة الشؤون المالية" : "Financial Management",
      desc: isRtl ? "سهولة في تحصيل الرسوم، إدارة المصروفات، وإصدار التقارير المالية والضريبية." : "Easy fee collection, expense management, and financial/tax reporting."
    },
    {
      icon: <ShieldAlert className="text-amber-500" />,
      title: isRtl ? "نظام الاختبارات المحمي" : "Secure Exam System",
      desc: isRtl ? "بيئة اختبارات مغلقة مع منع تبديل النوافذ ورصد الحركة الذكي لمنع الغش." : "Locked exam environment with window-switching prevention and motion sensing."
    },
    {
      icon: <Users className="text-purple-500" />,
      title: isRtl ? "بوابة ولي الأمر الذكية" : "Smart Parent Portal",
      desc: isRtl ? "تواصل مباشر وشفاف لمتابعة غياب وحضور الطالب ونتائجه ومعاملاته المالية." : "Direct communication to follow attendance, grades, and financial transactions."
    },
    {
      icon: <Zap className="text-amber-500" />,
      title: isRtl ? "مساعد المعلم الذكي" : "AI Teacher Assistant",
      desc: isRtl ? "توليد أسئلة ذكية، تصحيح آلي للمقالات، وتقديم توصيات مراجعة مخصصة." : "Smart question generation, automated essay grading, and custom review advice."
    },
    {
      icon: <MonitorPlay className="text-indigo-500" />,
      title: isRtl ? "إدارة المؤسسات والمدارس" : "Institution Management",
      desc: isRtl ? "لوحة تحكم مركزية لمراقبة أداء المدرسين والفروع بكفاءة إدارية فائقة." : "Central dashboard to monitor staff and branch performance with high efficiency."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const roles = [
    { id: UserRole.STUDENT, label: t('student'), icon: <GraduationCap size={22} />, desc: isRtl ? 'تجربة تعلم ذكية' : 'Smart learning' },
    { id: UserRole.TEACHER, label: t('teacher'), icon: <Briefcase size={22} />, desc: isRtl ? 'أدوات تعليمية متطورة' : 'Advanced tools' },
    { id: UserRole.ADMIN, label: t('admin'), icon: <ShieldCheck size={22} />, desc: isRtl ? 'تحكم كامل بالمنظومة' : 'Full control' },
    { id: UserRole.ACCOUNTANT, label: t('accountant'), icon: <Calculator size={22} />, desc: isRtl ? 'دقة محاسبية فائقة' : 'Financial accuracy' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'text-slate-100 bg-slate-950' : 'text-slate-950 bg-[#f8fafc]'}`}>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] glass-nav h-14">
        <div className="max-w-6xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => scrollToSection('home')}>
            <div className="p-1 bg-amber-500 rounded-md shadow-md">
              <Zap className="text-slate-950 fill-slate-950" size={14} />
            </div>
            <span className="font-black text-base tracking-tight text-amber-500 uppercase">{t('brand_name')}</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-950 dark:text-slate-400">
             {['home', 'about', 'services', 'stats', 'contact'].map((id) => (
               <button key={id} onClick={() => scrollToSection(id)} className="hover:text-amber-500 transition-colors uppercase">
                 {t(id)}
               </button>
             ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-amber-600 transition-all">
               <Globe size={18} />
            </button>
            <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-slate-950 dark:text-slate-400">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button 
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              className="px-5 py-2 bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 rounded-full font-black text-[11px] shadow-lg hover:scale-105 transition-all"
            >
              {t('login')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="section-anchor relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {slides.map((slide, idx) => (
            <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <img src={slide.url} className="w-full h-full object-cover brightness-[0.35]" alt={slide.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 mt-10">
          <RevealOnScroll type="fade" className="inline-flex items-center gap-2 px-3 py-1 rounded-full premium-glass-card text-amber-500 text-[9px] font-black tracking-widest uppercase mb-8 bg-white/10 dark:bg-white/5 border-amber-500/20">
             {slides[currentSlide].icon}
             <span className="h-3 w-px bg-amber-500/20"></span>
             {slides[currentSlide].theme}
          </RevealOnScroll>
          <div className="min-h-[120px] md:min-h-[140px] flex items-center justify-center mb-6 px-4">
             <RevealOnScroll type="write" className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
               {slides[currentSlide].title}
             </RevealOnScroll>
          </div>
          <RevealOnScroll type="fade" delay="delay-150" className="text-sm md:text-base text-slate-200 font-bold mb-10 max-w-2xl mx-auto leading-relaxed">
            {slides[currentSlide].desc}
          </RevealOnScroll>
          <div className="flex flex-wrap justify-center gap-4">
             <button 
               onClick={() => { setAuthMode('select_role'); setShowAuthModal(true); }}
               className="px-8 py-4 bg-amber-500 text-slate-950 rounded-2xl font-black text-base shadow-2xl hover:translate-y-[-2px] transition-all flex items-center gap-3"
             >
                {isRtl ? 'ابدأ تجربتك' : 'Get Started'}
                <ArrowRight size={18} className={isRtl ? 'rotate-180' : ''} />
             </button>
             <button 
               onClick={() => scrollToSection('services')}
               className="px-8 py-4 premium-glass-card text-white rounded-2xl font-black text-base hover:bg-white/10 transition-all bg-white/5 border-white/20"
             >
                {isRtl ? 'استكشف الخدمات' : 'Explore Services'}
             </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-anchor py-24 px-6 bg-slate-50 dark:bg-transparent">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
           <div className="flex-1 space-y-8 text-right">
              <div className="space-y-4">
                 <h4 className="text-amber-600 font-black text-[11px] uppercase tracking-[0.4em]">{isRtl ? 'عن العقرب' : 'ABOUT US'}</h4>
                 <h2 className="text-3xl md:text-4xl font-black text-amber-500 leading-tight">
                   {isRtl ? 'نظام ذكي يراقب، يحمي، ويدير طموحك التعليمي' : 'Smart system to monitor, protect, and manage'}
                 </h2>
              </div>
              <p className="text-sm md:text-base text-slate-950 dark:text-slate-400 font-bold leading-[2] text-justify">
                منظومة العقرب ليست مجرد برنامج إداري، بل هي بيئة متكاملة تدمج التعليم بالذكاء الاصطناعي والأمان السيبراني. صممنا النظام ليكون الشريك الاستراتيجي لكل معلم ومؤسسة تطمح للتميز الحقيقي، مع ضمان كامل لنزاهة العملية التعليمية وتتبع دقيق للمسارات المالية والأكاديمية.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                 <div className="p-6 rounded-[2rem] premium-glass-card border-slate-200 dark:border-white/5 bg-white shadow-sm">
                    <div className="text-amber-500 mb-3"><BadgeCheck size={32} /></div>
                    <h4 className="text-lg font-black mb-2 text-amber-500">{isRtl ? 'دقة ومصداقية' : 'Credibility'}</h4>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-400 leading-relaxed">{isRtl ? 'تقارير فورية ودقيقة عن سلوك ونتائج الطلاب.' : 'Real-time reports on student behavior and results.'}</p>
                 </div>
                 <div className="p-6 rounded-[2rem] premium-glass-card border-slate-200 dark:border-white/5 bg-white shadow-sm">
                    <div className="text-amber-500 mb-3"><ShieldCheck size={32} /></div>
                    <h4 className="text-lg font-black mb-2 text-amber-500">{isRtl ? 'حماية فائقة' : 'Ultra Security'}</h4>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-400 leading-relaxed">{isRtl ? 'تشفير كامل لكافة البيانات المالية والسجلات.' : 'Full encryption for financial and academic data.'}</p>
                 </div>
              </div>
           </div>
           <div className="flex-1">
              <div className="rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 relative group">
                 <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800" className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" alt="Al-Aqrab SSS" />
                 <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
           </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-anchor py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h4 className="text-amber-600 font-black text-[11px] uppercase tracking-[0.5em]">{isRtl ? 'الخدمات الذكية' : 'SMART SERVICES'}</h4>
            <h2 className="text-4xl font-black text-amber-500">{isRtl ? 'حلولنا التعليمية المتكاملة' : 'Our Integrated Solutions'}</h2>
            <p className="text-slate-600 dark:text-slate-400 font-bold text-base max-w-2xl mx-auto">{isRtl ? 'نظام واحد، حلول متعددة لإدارة المدارس والمراكز بذكاء.' : 'One system, multiple solutions for smart management.'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, i) => (
              <RevealOnScroll key={i} delay={`delay-${i * 100}`} className="p-10 rounded-[3rem] premium-glass-card hover:bg-amber-500/5 transition-all group border-slate-200 dark:border-white/5 shadow-lg flex flex-col bg-white dark:bg-slate-900">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all shadow-sm">
                  {React.cloneElement(service.icon as React.ReactElement<any>, { size: 32 })}
                </div>
                <h3 className="text-xl font-black mb-4 text-amber-500 leading-tight">{service.title}</h3>
                <p className="text-sm font-bold text-slate-950 dark:text-slate-400 leading-[1.8]">{service.desc}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="section-anchor py-20 bg-amber-500">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-slate-950">
           {[
             { val: '250+', label: isRtl ? 'مؤسسة تعليمية' : 'INSTITUTIONS' },
             { val: '200K', label: isRtl ? 'طالب نشط' : 'STUDENTS' },
             { val: '1200+', label: isRtl ? 'معلم متميز' : 'EXPERTS' },
             { val: '99.9%', label: isRtl ? 'أمان ودقة' : 'SECURITY' }
           ].map((stat, i) => (
             <div key={i} className="space-y-2">
                <p className="text-4xl md:text-5xl font-black tracking-tighter">{stat.val}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="section-anchor pt-24 pb-12 px-6 bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
           <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Zap className="text-amber-500 fill-amber-500" size={24} />
                <span className="font-black text-2xl tracking-tighter uppercase text-amber-500">{t('brand_name')}</span>
              </div>
              <p className="text-slate-400 font-bold text-xs leading-[2]">
                {isRtl ? 'المنظومة التعليمية الرائدة في الشرق الأوسط، صممت لتبني مستقبلاً تعليمياً آمناً وذكياً.' : 'Leading system in ME, designed for a smart future.'}
              </p>
           </div>
           <div className="space-y-6 text-right md:col-span-2">
              <h4 className="text-amber-500 font-black text-[11px] tracking-widest uppercase">{t('contact')}</h4>
              <ul className="space-y-4 font-bold text-slate-300 text-xs">
                 <li className="flex items-center gap-4 justify-end"><PhoneCall size={16} className="text-amber-500" /> +20 102 345 6789</li>
                 <li className="flex items-center gap-4 justify-end"><Mail size={16} className="text-amber-500" /> support@alaqrab-system.com</li>
                 <li className="flex items-center gap-4 justify-end"><MapPin size={16} className="text-amber-500" /> {isRtl ? 'القاهرة، مصر' : 'Cairo, Egypt'}</li>
              </ul>
           </div>
        </div>
        <div className="text-center pt-10 border-t border-white/5 text-slate-500 font-black text-[10px] uppercase tracking-[0.4em]">
           © {new Date().getFullYear()} AL-AQRAB SMART SYSTEM. ALL RIGHTS RESERVED.
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
           <div className="relative w-full max-w-xl p-10 rounded-[3rem] premium-glass-card text-center bg-white dark:bg-slate-900 border-white/10 shadow-2xl overflow-hidden">
              <button onClick={() => setShowAuthModal(false)} className="absolute top-8 left-8 p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-slate-400 transition-all">
                <X size={20} />
              </button>

              <div className="mb-10">
                 <h2 className="text-3xl font-black mb-2 text-amber-500">
                   {authMode === 'select_role' ? t('select_role') : t('login')}
                 </h2>
                 <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.3em]">
                   {t('brand_name')} SMART SYSTEM
                 </p>
              </div>

              {authMode === 'select_role' ? (
                <div className="grid grid-cols-2 gap-5">
                  {roles.map((r) => (
                    <button 
                      key={r.id}
                      onClick={() => {
                        setUser({ id: 'demo', firstName: 'زائر', lastName: r.label, email: 'demo@aqrab.com', phone: '', username: 'guest', role: r.id, aiQuestionsCount: 5 });
                        onStart(r.id);
                      }}
                      className="p-6 rounded-2xl border-2 border-slate-100 dark:border-white/5 hover:border-amber-500 hover:bg-amber-500/5 transition-all text-center group bg-slate-50 dark:bg-white/5 shadow-sm"
                    >
                      <div className="p-4 bg-amber-500 text-slate-950 rounded-xl mx-auto mb-3 w-fit group-hover:rotate-6 transition-transform">
                        {r.icon}
                      </div>
                      <h4 className="font-black text-base text-slate-950 dark:text-white">{r.label}</h4>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase mt-2 leading-relaxed">{r.desc}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-5 max-w-sm mx-auto">
                   <input type="text" className="w-full p-5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-transparent rounded-2xl outline-none text-sm font-bold text-center text-slate-950 dark:text-white focus:border-amber-500 transition-all" placeholder={isRtl ? 'اسم المستخدم' : 'Username'} />
                   <input type="password" className="w-full p-5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-transparent rounded-2xl outline-none text-sm font-bold text-center text-slate-950 dark:text-white focus:border-amber-500 transition-all" placeholder="••••••••" />
                   <button 
                     onClick={() => setAuthMode('select_role')}
                     className="w-full py-5 bg-amber-500 text-slate-950 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-all"
                   >
                     {t('login')}
                   </button>
                   <button onClick={() => setAuthMode('select_role')} className="text-[11px] font-black text-amber-600 hover:underline">{isRtl ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}</button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
