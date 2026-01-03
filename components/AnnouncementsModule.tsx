
import React, { useState, useRef } from 'react';
import { 
  Megaphone, Calendar, Plus, X, User, Clock, 
  Trash2, Send, FileText, Image as ImageIcon, Video,
  Paperclip, ExternalLink, Bell, Sparkles, Upload
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
// Add AnnouncementStatus to imports
import { Announcement, AnnouncementType, UserRole, AnnouncementStatus } from '../types';

interface AnnouncementsModuleProps {
  currentUserRole: UserRole;
}

const AnnouncementsModule: React.FC<AnnouncementsModuleProps> = ({ currentUserRole }) => {
  const { t, lang, theme } = useAppContext();
  const isRtl = lang === 'ar';
  const canCreate = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.TEACHER;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showModal, setShowModal] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: isRtl ? 'ملخص مراجعة الفيزياء PDF' : 'Physics Review Summary PDF',
      content: isRtl ? 'إليكم ملخص الفصل الأول، يرجى قراءته بعناية قبل اختبار السبت.' : 'Here is the summary for Chapter 1, read carefully before Saturday exam.',
      type: AnnouncementType.ANNOUNCEMENT,
      // Fix: Add missing status and authorId properties
      status: AnnouncementStatus.APPROVED,
      date: new Date().toISOString(),
      authorRole: UserRole.TEACHER,
      authorId: 'teacher-demo-id',
      authorName: 'م/ محمود العزازي',
      mediaUrl: 'https://example.com/summary.pdf',
      mediaType: 'pdf'
    }
  ]);

  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '', content: '', type: AnnouncementType.ANNOUNCEMENT, mediaType: 'image'
  });

  const handleCreate = () => {
    if (!formData.title || !formData.content) return;
    const newEntry: Announcement = {
      id: Date.now().toString(),
      title: formData.title!,
      content: formData.content!,
      type: formData.type!,
      // Fix: Add missing status and authorId properties
      status: AnnouncementStatus.APPROVED,
      date: new Date().toISOString(),
      authorRole: currentUserRole,
      authorId: 'current-user-demo-id',
      authorName: currentUserRole === UserRole.ADMIN ? (isRtl ? 'إدارة العقرب' : 'Admin') : (isRtl ? 'المعلم الخبير' : 'Expert Teacher'),
      mediaType: formData.mediaType as any,
      mediaUrl: formData.mediaUrl || (formData.mediaType ? 'https://example.com/demo-file' : undefined)
    };
    setAnnouncements([newEntry, ...announcements]);
    setShowModal(false);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(isRtl ? `تم اختيار: ${file.name}` : `Selected: ${file.name}`);
      setFormData({...formData, mediaUrl: URL.createObjectURL(file)});
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className="p-4 bg-amber-500 text-slate-900 rounded-3xl shadow-xl shadow-amber-500/20">
              <Bell size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black tracking-tight">{t('announcements_title')}</h2>
              <p className="text-gray-500 font-bold">{isRtl ? 'أحدث المستجدات والملفات التعليمية' : 'Latest updates and educational files'}</p>
           </div>
        </div>
        {canCreate && (
          <button 
            onClick={() => setShowModal(true)} 
            className="px-8 py-4 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 rounded-[1.5rem] font-black shadow-xl hover:scale-105 transition-all flex items-center gap-3"
          >
            <Plus size={20} /> {t('create_announcement')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {announcements.map((item) => (
          <div key={item.id} className={`p-8 rounded-[3rem] border shadow-2xl relative overflow-hidden flex flex-col transition-all hover:scale-[1.01] ${theme === 'dark' ? 'bg-slate-900 border-white/5 shadow-black/40' : 'bg-white border-slate-100 shadow-slate-200'}`}>
            <div className="flex justify-between items-start mb-6">
              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 ${item.type === AnnouncementType.ANNOUNCEMENT ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
                {item.type === AnnouncementType.ANNOUNCEMENT ? <Megaphone size={14} /> : <Calendar size={14} />}
                {t(item.type === AnnouncementType.ANNOUNCEMENT ? 'announcement_val' : 'event_val')}
              </span>
              <button className="text-gray-400 hover:text-amber-500 transition-colors"><ExternalLink size={18} /></button>
            </div>

            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-black tracking-tight leading-snug">{item.title}</h3>
              <p className="text-gray-500 dark:text-slate-400 font-bold leading-relaxed">{item.content}</p>
              
              {item.mediaUrl && (
                <div className="mt-4 p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-gray-200 dark:border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl text-amber-500 shadow-sm">
                        {item.mediaType === 'pdf' ? <FileText size={24} /> : item.mediaType === 'video' ? <Video size={24} /> : <ImageIcon size={24} />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{t(`media_${item.mediaType}`)}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{isRtl ? 'ملحق متاح للتحميل' : 'Attachment Ready'}</p>
                      </div>
                   </div>
                   <button className="px-6 py-3 bg-amber-500 text-slate-900 rounded-xl text-xs font-black shadow-lg hover:bg-amber-400 transition-all">{isRtl ? 'فتح' : 'Open'}</button>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black text-xs border border-white/5">
                  {item.authorName.charAt(0)}
                </div>
                <div>
                   <p className="text-xs font-black text-slate-900 dark:text-white">{item.authorName}</p>
                   <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                     <Clock size={10} />
                     {new Date(item.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' })}
                   </p>
                </div>
              </div>
              {canCreate && (
                <button 
                  onClick={() => setAnnouncements(announcements.filter(a => a.id !== item.id))} 
                  className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
           <div className={`relative w-full max-w-2xl p-10 md:p-14 rounded-[4rem] shadow-2xl border ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white'} animate-in zoom-in duration-300`}>
              <button onClick={() => setShowModal(false)} className="absolute top-10 left-10 p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <X size={24} />
              </button>
              
              <h3 className="text-3xl font-black mb-10 flex items-center gap-4">
                <Sparkles className="text-amber-500" /> 
                {t('create_announcement')}
              </h3>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t('post_title')}</label>
                    <input type="text" placeholder={t('post_title')} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-amber-500 font-bold" />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t('post_content')}</label>
                    <textarea rows={4} placeholder={t('post_content')} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-amber-500 font-bold" />
                 </div>
                 
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t('attach_file')}</label>
                    <div className="flex flex-wrap gap-4">
                       <MediaBtn active={formData.mediaType === 'image'} icon={<ImageIcon size={20} />} label={t('media_image')} onClick={() => setFormData({...formData, mediaType: 'image'})} />
                       <MediaBtn active={formData.mediaType === 'pdf'} icon={<FileText size={20} />} label={t('media_pdf')} onClick={() => setFormData({...formData, mediaType: 'pdf'})} />
                       <MediaBtn active={formData.mediaType === 'video'} icon={<Video size={20} />} label={t('media_video')} onClick={() => setFormData({...formData, mediaType: 'video'})} />
                    </div>
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center gap-3 text-slate-400 hover:border-amber-500 hover:text-amber-500 transition-all font-bold"
                    >
                      <Upload size={20} />
                      {isRtl ? 'اختر ملفاً من جهازك' : 'Choose file from device'}
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={onFileSelect} />
                 </div>

                 <button onClick={handleCreate} className="w-full py-6 bg-amber-500 text-slate-900 rounded-[2.2rem] font-black text-xl shadow-2xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center gap-3 mt-6">
                    <Send size={24} className={isRtl ? 'rotate-180' : ''} /> 
                    {t('publish')}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const MediaBtn = ({ icon, active, onClick, label }: any) => (
  <button 
    onClick={onClick} 
    className={`flex-1 min-w-[100px] p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${active ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-lg shadow-amber-500/5' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-gray-400'}`}
  >
    {icon}
    <span className="text-[10px] font-black">{label}</span>
  </button>
);

export default AnnouncementsModule;
