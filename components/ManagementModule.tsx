
import React, { useState } from 'react';
import { 
  Users, UserPlus, CheckCircle, XCircle, Search, 
  Filter, ShieldCheck, Mail, Phone, Trash2, 
  ExternalLink, FileText, Calendar, UserCheck, MoreVertical
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole, AnnouncementStatus, User } from '../types';

interface ManagementModuleProps {
  mode: 'users' | 'approvals';
  roleFilter?: UserRole;
}

const ManagementModule: React.FC<ManagementModuleProps> = ({ mode, roleFilter }) => {
  const { t, lang, theme } = useAppContext();
  const isRtl = lang === 'ar';
  
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Simulated Data for Approvals
  const [pendingItems, setPendingItems] = useState([
    { id: '1', title: 'ملف مراجعة فيزياء 2024', author: 'م/ محمود العزازي', type: 'file', date: '2023-10-25' },
    { id: '2', title: 'إعلان مسابقة العباقرة', author: 'إدارة شؤون المعلمين', type: 'announcement', date: '2023-10-24' },
    { id: '3', title: 'اختبار تجريبي - الفصل الثاني', author: 'م/ أحمد شوقي', type: 'exam', date: '2023-10-23' },
  ]);

  // Simulated Users
  const [users, setUsers] = useState<User[]>([
    { id: 'u1', firstName: 'أحمد', lastName: 'علي', username: 'student1', email: 's1@aqrab.com', phone: '0123', role: UserRole.STUDENT, aiQuestionsCount: 5, assignedTeacherId: 't1' },
    { id: 't1', firstName: 'محمود', lastName: 'العزازي', username: 'teacher1', email: 't1@aqrab.com', phone: '0987', role: UserRole.TEACHER, aiQuestionsCount: 0 },
  ]);

  const handleApprove = (id: string) => {
    setPendingItems(pendingItems.filter(item => item.id !== id));
    alert(isRtl ? 'تمت الموافقة والنشر بنجاح!' : 'Approved and published!');
  };

  const handleReject = (id: string) => {
    setPendingItems(pendingItems.filter(item => item.id !== id));
    alert(isRtl ? 'تم رفض الطلب.' : 'Request rejected.');
  };

  if (mode === 'approvals') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4 mb-8">
           <div className="p-4 bg-amber-500 text-slate-950 rounded-3xl shadow-xl shadow-amber-500/20">
              <ShieldCheck size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black">{t('pending_approvals')}</h2>
              <p className="text-slate-500 font-bold">{isRtl ? 'مراجعة واعتماد المحتوى قبل النشر للطلاب' : 'Review and approve content before public release'}</p>
           </div>
        </div>

        <div className="grid gap-6">
          {pendingItems.map(item => (
            <div key={item.id} className="p-8 rounded-[2.5rem] glass-sidebar border-2 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">
               <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl ${item.type === 'file' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                    {item.type === 'file' ? <FileText size={24} /> : <Calendar size={24} />}
                  </div>
                  <div>
                     <h4 className="text-xl font-black text-slate-950 dark:text-white">{item.title}</h4>
                     <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{isRtl ? 'بواسطة:' : 'By:'} {item.author}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <button onClick={() => handleApprove(item.id)} className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:scale-105 transition-all">
                     <CheckCircle size={18} /> {isRtl ? 'قبول ونشر' : 'Approve'}
                  </button>
                  <button onClick={() => handleReject(item.id)} className="px-6 py-3 bg-rose-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-rose-500/20 flex items-center gap-2 hover:scale-105 transition-all">
                     <XCircle size={18} /> {isRtl ? 'رفض' : 'Reject'}
                  </button>
                  <button className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-amber-500 transition-all">
                     <ExternalLink size={18} />
                  </button>
               </div>
            </div>
          ))}
          {pendingItems.length === 0 && (
            <div className="text-center py-20">
               <div className="w-24 h-24 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={48} />
               </div>
               <h3 className="text-xl font-black text-slate-400">{isRtl ? 'لا توجد طلبات معلقة حالياً' : 'No pending requests'}</h3>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="p-4 bg-amber-500 text-slate-950 rounded-3xl shadow-xl shadow-amber-500/20">
              <Users size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black">{roleFilter === UserRole.TEACHER ? t('active_teachers') : t('active_students')}</h2>
              <p className="text-slate-500 font-bold">{isRtl ? 'إدارة الحسابات وربط الصلاحيات' : 'Manage accounts and permissions'}</p>
           </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 rounded-[1.5rem] font-black shadow-xl hover:scale-105 transition-all flex items-center gap-3"
        >
          <UserPlus size={20} /> {t('create_user')}
        </button>
      </div>

      <div className="glass-sidebar p-8 rounded-[3rem] border-2 dark:border-white/5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-8">
           <div className="relative flex-1">
              <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
              <input 
                type="text" 
                placeholder={t('search_placeholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full py-4 px-12 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none font-bold text-sm"
              />
           </div>
           <button className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-amber-500 transition-all">
              <Filter size={18} />
           </button>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-right">
              <thead>
                 <tr className="text-xs font-black text-slate-400 uppercase tracking-widest border-b dark:border-white/5">
                    <th className="pb-4 px-4">{isRtl ? 'المستخدم' : 'User'}</th>
                    <th className="pb-4 px-4">{isRtl ? 'معلومات التواصل' : 'Contact'}</th>
                    <th className="pb-4 px-4">{isRtl ? 'الارتباط' : 'Assigned To'}</th>
                    <th className="pb-4 px-4">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                 </tr>
              </thead>
              <tbody className="divide-y dark:divide-white/5">
                 {users.filter(u => u.role === roleFilter).map(u => (
                    <tr key={u.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                       <td className="py-6 px-4">
                          <div className="flex items-center gap-4 justify-end">
                             <div className="text-right">
                                <p className="font-black text-slate-950 dark:text-white">{u.firstName} {u.lastName}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">@{u.username}</p>
                             </div>
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} className="w-12 h-12 rounded-2xl bg-amber-500/10 p-1" alt="avatar" />
                          </div>
                       </td>
                       <td className="py-6 px-4">
                          <div className="space-y-1">
                             <p className="text-xs font-bold flex items-center gap-2 justify-end text-slate-500">
                                {u.email} <Mail size={12} />
                             </p>
                             <p className="text-xs font-bold flex items-center gap-2 justify-end text-slate-500">
                                {u.phone} <Phone size={12} />
                             </p>
                          </div>
                       </td>
                       <td className="py-6 px-4">
                          {u.role === UserRole.STUDENT && (
                            <div className="flex items-center gap-2 justify-end">
                               <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-[10px] font-black uppercase">
                                  {u.assignedTeacherId ? (isRtl ? 'م/ محمود العزازي' : 'Senior Teacher') : (isRtl ? 'غير مرتبط' : 'Not Assigned')}
                               </span>
                               <UserCheck size={14} className="text-amber-500" />
                            </div>
                          )}
                       </td>
                       <td className="py-6 px-4">
                          <div className="flex items-center gap-2 justify-end">
                             <button className="p-2 text-slate-400 hover:text-amber-500 transition-all"><MoreVertical size={18} /></button>
                             <button className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 size={18} /></button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
           <div className={`relative w-full max-w-2xl p-10 rounded-[3rem] border-2 shadow-2xl bg-white dark:bg-slate-900 ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
              <button onClick={() => setShowAddModal(false)} className="absolute top-10 left-10 p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"><Trash2 size={24} className="text-slate-400" /></button>
              <h3 className="text-2xl font-black mb-10 text-amber-500">{t('create_user')}</h3>
              
              <div className="grid grid-cols-2 gap-6">
                 <Input label={isRtl ? 'الاسم الأول' : 'First Name'} />
                 <Input label={isRtl ? 'الاسم الأخير' : 'Last Name'} />
                 <Input label={isRtl ? 'اسم المستخدم' : 'Username'} />
                 <Input label={isRtl ? 'البريد الإلكتروني' : 'Email'} />
                 <Input label={isRtl ? 'رقم الهاتف' : 'Phone'} />
                 <Input label={isRtl ? 'كلمة المرور' : 'Password'} type="password" />
              </div>

              {roleFilter === UserRole.STUDENT && (
                 <div className="mt-6 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isRtl ? 'المعلم المرتبط' : 'Link to Teacher'}</label>
                    <select className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none font-bold text-sm">
                       <option value="t1">م/ محمود العزازي (فيزياء)</option>
                       <option value="t2">م/ أحمد شوقي (رياضيات)</option>
                    </select>
                 </div>
              )}

              <button className="w-full py-5 bg-amber-500 text-slate-950 rounded-2xl font-black text-lg shadow-xl mt-10 hover:scale-105 transition-all">
                {isRtl ? 'إنشاء الحساب' : 'Create Account'}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

const Input = ({label, type = 'text'}: any) => (
  <div className="space-y-2">
     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
     <input type={type} className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none outline-none font-bold text-sm focus:ring-2 focus:ring-amber-500/20" />
  </div>
);

export default ManagementModule;
