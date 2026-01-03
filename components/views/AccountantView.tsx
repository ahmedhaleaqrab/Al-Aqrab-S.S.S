import React from 'react';
import { Wallet, Calculator, Receipt, TrendingUp, ArrowUpRight, ArrowDownRight, MessageSquare, Landmark, BarChart3 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SmartAnalytic from '../SmartAnalytic';
import { UserRole } from '../../types';

interface ViewProps {
  onNavigate: (tab: string) => void;
}

const AccountantView: React.FC<ViewProps> = ({ onNavigate }) => {
  const { lang, theme } = useAppContext();
  const isRtl = lang === 'ar';

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CashCard label={isRtl ? 'الخزينة المركزية' : 'Main Treasury'} amount="450,230" type="main" />
        <CashCard label={isRtl ? 'متحصلات اليوم' : 'Daily Revenue'} amount="12,450" type="up" />
        <CashCard label={isRtl ? 'المصروفات' : 'Expenses'} amount="3,200" type="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-[4rem] p-1 border-none overflow-hidden shadow-2xl">
             <SmartAnalytic 
               role={UserRole.ACCOUNTANT} 
               dataContext="السيولة المالية ممتازة. تم سداد 92% من رسوم الشهر. لا توجد ديون معلقة." 
             />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <FinAction onClick={() => onNavigate('finance')} icon={<Receipt />} label={isRtl ? 'الفواتير' : 'Invoices'} />
            <FinAction onClick={() => onNavigate('overview')} icon={<Landmark />} label={isRtl ? 'البنوك' : 'Banks'} />
            <FinAction onClick={() => onNavigate('messages')} icon={<MessageSquare />} label={isRtl ? 'المراسلات' : 'Messages'} />
            <FinAction onClick={() => onNavigate('finance')} icon={<BarChart3 />} label={isRtl ? 'التقارير' : 'Reports'} />
          </div>
        </div>

        <div className="glass-card p-10 rounded-[3.5rem] scorpion-glow smooth-transition border-white/50">
           <h3 className="font-black text-[11px] mb-10 flex items-center gap-3 text-slate-400 uppercase tracking-widest">
              <TrendingUp size={20} className="text-amber-500" />
              {isRtl ? 'آخر التحويلات' : 'Recent Transfers'}
           </h3>
           <div className="space-y-8">
              <TxRow label={isRtl ? 'رسوم طالب #122' : 'Student Fee #122'} amount="+450" color="text-emerald-500" />
              <TxRow label={isRtl ? 'فاتورة الكهرباء' : 'Electricity Bill'} amount="-1,200" color="text-rose-500" />
              <TxRow label={isRtl ? 'صيانة المعامل' : 'Lab Maintenance'} amount="-5,000" color="text-rose-500" />
              <TxRow label={isRtl ? 'أدوات مكتبية' : 'Stationery'} amount="-300" color="text-rose-500" />
           </div>
        </div>
      </div>
    </div>
  );
};

const CashCard = ({ label, amount, type }: any) => (
  <div className={`p-10 rounded-[4rem] glass-card scorpion-glow smooth-transition border-white/60 ${type === 'main' ? 'border-amber-500/30' : ''}`}>
    <div className="flex justify-between items-center mb-8">
       <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">{label}</span>
       <div className={`p-3 rounded-2xl ${type === 'up' ? 'bg-emerald-500/10 text-emerald-500' : type === 'down' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
          {type === 'up' && <ArrowUpRight size={22} />}
          {type === 'down' && <ArrowDownRight size={22} />}
          {type === 'main' && <Wallet size={22} />}
       </div>
    </div>
    <div className="flex items-baseline gap-3">
      <p className="text-5xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{amount}</p>
      <span className="text-sm font-bold text-slate-400 uppercase">ج.م</span>
    </div>
  </div>
);

const FinAction = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="glass-card flex flex-col items-center gap-5 p-10 rounded-[3.5rem] scorpion-glow smooth-transition active:scale-95 group">
    <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-3xl text-slate-400 group-hover:bg-amber-500 group-hover:text-white smooth-transition">
      {/* Fix: cast icon to any for cloneElement to avoid type error */}
      {React.cloneElement(icon as React.ReactElement<any>, { size: 36 })}
    </div>
    <span className="text-sm font-black text-slate-700 dark:text-slate-200">{label}</span>
  </button>
);

const TxRow = ({ label, amount, color }: any) => (
  <div className="flex justify-between items-center text-sm font-bold border-b dark:border-white/5 pb-5 last:border-0 last:pb-0">
    <span className="text-slate-500 dark:text-slate-400">{label}</span>
    <span className={`font-black text-lg ${color}`}>{amount}</span>
  </div>
);

export default AccountantView;