import React from 'react';
import { User, MessageCircle, AlertCircle, FileCheck, DollarSign, Activity, Award, Star, ShieldCheck, HeartPulse } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface ViewProps {
  onNavigate: (tab: string) => void;
}

const ParentView: React.FC<ViewProps> = ({ onNavigate }) => {
  const { lang, theme } = useAppContext();
  const isRtl = lang === 'ar';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-10">
      {/* Parent Welcome Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl border dark:border-white/5 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-blue-600">
          <User size={48} />
        </div>
        <div className="flex-1 text-center md:text-right">
          <h1 className="text-3xl font-black mb-2">{isRtl ? 'أهلاً ولي أمر الطالب/ أحمد' : 'Welcome Ahmed\'s Guardian'}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">{isRtl ? 'متابعة دقيقة للأداء الأكاديمي والسلوكي' : 'Close monitoring of academic and behavioral performance'}</p>
        </div>
        <button 
          onClick={() => onNavigate('messages')}
          className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-[1.5rem] font-black shadow-xl hover:scale-105 transition-all"
        >
          <MessageCircle size={20} />
          <span>{isRtl ? 'تواصل مع الإدارة' : 'Contact Support'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] border dark:border-white/5 shadow-xl">
             <h3 className="text-2xl font-black mb-8 flex items-center gap-2">
               <Activity className="text-blue-500" />
               {isRtl ? 'مركز خدمات المتابعة' : 'Guardian Services'}
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <GServiceItem icon={<Star />} label={isRtl ? 'درجات الاختبارات' : 'Grades'} color="text-amber-500" />
                <GServiceItem icon={<HeartPulse />} label={isRtl ? 'التقرير السلوكي' : 'Behavior'} color="text-red-500" />
                <GServiceItem icon={<ShieldCheck />} label={isRtl ? 'الحضور والغياب' : 'Attendance'} color="text-green-500" />
                <GServiceItem icon={<DollarSign />} label={isRtl ? 'بوابة الدفع' : 'Payments'} color="text-blue-500" />
             </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-[3rem] border border-blue-200 dark:border-blue-500/20">
             <div className="flex items-start gap-4">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={28} />
                <div>
                   <h4 className="font-black text-blue-900 dark:text-blue-400 mb-1">{isRtl ? 'إشعار أكاديمي' : 'Academic Notice'}</h4>
                   <p className="text-sm font-bold text-blue-700 dark:text-blue-500 leading-relaxed">
                     {isRtl ? 'تم رفع نتائج اختبار الفيزياء لشهر أكتوبر. أحمد أحرز المركز الخامس على مستوى المجموعة.' : 'Oct Physics results uploaded. Ahmed ranked 5th in his group.'}
                   </p>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border dark:border-white/5 shadow-xl">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2">
                <FileCheck className="text-amber-500" />
                {isRtl ? 'المستحقات المالية' : 'Fees Status'}
              </h3>
              <div className="space-y-4">
                 <div className="p-5 bg-red-50 dark:bg-red-500/10 rounded-2xl flex justify-between items-center border border-red-100 dark:border-red-500/20">
                    <div>
                       <p className="text-xs font-black text-red-600">Pending</p>
                       <p className="text-lg font-black dark:text-white">450.00 EGP</p>
                    </div>
                    <button className="px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-black shadow-lg">Pay Now</button>
                 </div>
                 <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl flex justify-between items-center opacity-60">
                    <div>
                       <p className="text-xs font-black text-slate-400">Paid - Sep</p>
                       <p className="text-lg font-black dark:text-white">450.00 EGP</p>
                    </div>
                    <FileCheck className="text-green-500" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const GServiceItem = ({ icon, label, color }: any) => (
  <button className="flex flex-col items-center gap-3 group">
    <div className={`p-6 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] ${color} shadow-sm group-hover:scale-110 transition-all border border-transparent group-hover:border-blue-500`}>
       {/* Fix: cast icon to any for cloneElement to avoid type error */}
       {React.cloneElement(icon as React.ReactElement<any>, { size: 32 })}
    </div>
    <span className="text-xs font-black dark:text-slate-300">{label}</span>
  </button>
);

export default ParentView;