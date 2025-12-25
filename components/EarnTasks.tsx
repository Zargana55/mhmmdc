
import React, { useState } from 'react';
import { CheckCircle, Clock, ShieldCheck, Camera, ExternalLink, ArrowRight, Zap, Loader2, PlayCircle, Instagram, Youtube, Twitter } from 'lucide-react';
import { UserProfile, Task, TaskStatus } from '../types';
import { verifyTaskProof } from '../services/geminiService';
import { PLATFORM_CONFIG } from '../constants';
import { translations, Language } from '../translations';

const MOCK_TASKS: Task[] = [
  { id: 't1', creatorId: 'c1', platform: 'instagram', targetUsername: 'FitnessLife_TR', reward: 150, stakeRequired: 75, description: 'Follow @FitnessLife_TR on Instagram and upload a screenshot.', status: TaskStatus.AVAILABLE },
  { id: 't2', creatorId: 'c2', platform: 'youtube', targetUsername: 'TechUnboxed', reward: 80, stakeRequired: 40, description: 'Subscribe to TechUnboxed on YouTube and upload a screenshot of your sub.', status: TaskStatus.AVAILABLE },
  { id: 't3', creatorId: 'c3', platform: 'twitter', targetUsername: 'DailyQuotes', reward: 50, stakeRequired: 25, description: 'Follow @DailyQuotes on Twitter and upload proof.', status: TaskStatus.AVAILABLE },
];

interface EarnTasksProps {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
  lang: Language;
}

const EarnTasks: React.FC<EarnTasksProps> = ({ user, setUser, lang }) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const t = translations[lang];

  const handleStartTask = (task: Task) => {
    if (user.credits < task.stakeRequired) {
      alert(lang === 'tr' ? "Yetersiz kredi! Önce kredi kazanmalı veya satın almalısınız." : "Insufficient credits!");
      return;
    }
    setActiveTask(task);
    setStep(1);
    setPreviewUrl(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeTask) return;

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setIsVerifying(true);
    setStep(2);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const result = await verifyTaskProof(base64, activeTask.targetUsername, activeTask.platform);
        setVerificationResult(result);
        setIsVerifying(false);
        
        if (result.isFollowing) {
          setStep(3);
          setUser({
            ...user,
            credits: user.credits + (activeTask.reward * 0.2),
            tasksCompleted: user.tasksCompleted + 1,
            reputation: Math.min(100, user.reputation + 1)
          });
        } else {
          setStep(1);
          alert(lang === 'tr' ? "Doğrulama başarısız: Takip etmediğiniz veya yanlış ekran görüntüsü yüklediğiniz tespit edildi." : "Verification failed.");
        }
      } catch (err) {
        setIsVerifying(false);
        setStep(1);
        alert(lang === 'tr' ? "AI servisi şu an meşgul." : "AI service busy.");
      }
    };
  };

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'instagram': return Instagram;
      case 'youtube': return Youtube;
      case 'twitter': return Twitter;
      default: return PlayCircle;
    }
  };

  if (activeTask && step < 4) {
    const PlatformIcon = getPlatformIcon(activeTask.platform);
    return (
      <div className="max-w-3xl mx-auto py-8 animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-2xl relative">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center text-2xl font-black shadow-lg shadow-indigo-200">
                {step}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {step === 1 ? t.earn.acceptTask : step === 2 ? t.earn.verifying : t.common.success}
                </h2>
                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">@{activeTask.targetUsername} • {activeTask.platform}</p>
              </div>
            </div>
            <button onClick={() => setActiveTask(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
               <Zap className="w-6 h-6 text-slate-300" />
            </button>
          </div>

          {step === 1 && (
            <div className="space-y-8">
              <div className="p-6 bg-amber-50 rounded-[30px] border border-amber-100/50 flex gap-5">
                <ShieldCheck className="w-8 h-8 text-amber-600 shrink-0" />
                <div className="text-sm text-amber-800 leading-relaxed font-medium">
                  <strong className="block text-lg mb-1">{t.earn.stakeLocked.replace('{amount}', activeTask.stakeRequired.toString())}</strong> 
                  {t.earn.stakeInfo}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <button 
                  className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-[35px] border-2 border-slate-100 hover:border-indigo-500 hover:bg-white transition-all group"
                >
                  <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center ${(PLATFORM_CONFIG as any)[activeTask.platform].bg} ${(PLATFORM_CONFIG as any)[activeTask.platform].color}`}>
                    <PlatformIcon className="w-8 h-8" />
                  </div>
                  <span className="font-black text-slate-900 group-hover:text-indigo-600">{t.earn.openProfile.replace('{platform}', activeTask.platform)}</span>
                </button>
                
                <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-[35px] cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
                  {previewUrl ? (
                    <div className="relative w-full h-full flex flex-col items-center">
                      <img src={previewUrl} className="w-full h-40 object-cover rounded-2xl mb-4 border border-slate-200" alt="preview" />
                      <span className="text-indigo-600 font-black text-sm">{lang === 'tr' ? 'Fotoğrafı Değiştir' : 'Change Photo'}</span>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-16 h-16 text-slate-300 mb-6 group-hover:scale-110 transition-transform" />
                      <span className="text-slate-500 font-black text-center">{t.earn.uploadScreenshot}</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-20 space-y-8">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-2xl font-black text-slate-900 mb-2">{t.earn.verifying}</p>
            </div>
          )}

          {step === 3 && verificationResult && (
            <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="w-28 h-28 bg-emerald-100 text-emerald-600 rounded-[40px] flex items-center justify-center mx-auto mb-10">
                <CheckCircle className="w-14 h-14" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{t.earn.verifiedTitle}</h3>
              <p className="text-slate-500 text-xl font-medium mb-12">
                {t.earn.verifiedDesc
                  .replace('{immediate}', (activeTask.reward * 0.2).toString())
                  .replace('{delayed}', (activeTask.reward * 0.8).toString())}
              </p>
              <button onClick={() => setActiveTask(null)} className="px-12 py-5 bg-slate-900 text-white rounded-[24px] font-black text-xl shadow-2xl">
                {t.common.back}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{t.earn.title}</h1>
          <p className="text-slate-500 text-lg font-medium">{t.earn.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_TASKS.map((task) => (
          <div key={task.id} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${(PLATFORM_CONFIG as any)[task.platform].bg} ${(PLATFORM_CONFIG as any)[task.platform].color}`}>
                  {(PLATFORM_CONFIG as any)[task.platform].label}
                </div>
                <div className="flex items-center gap-1 text-emerald-500 font-black text-xl">
                  +{task.reward} C
                </div>
              </div>
              <h3 className="font-black text-2xl text-slate-900 mb-3 truncate group-hover:text-indigo-600 transition-colors">@{task.targetUsername}</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8 line-clamp-2">{task.description}</p>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-slate-50">
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                <span>{t.earn.requiredStake}</span>
                <span className="text-slate-600">{task.stakeRequired} C</span>
              </div>
              <button 
                onClick={() => handleStartTask(task)}
                className="w-full py-4.5 bg-slate-900 text-white rounded-[22px] font-black text-sm hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {t.earn.acceptTask}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[40px] p-8 text-white shadow-2xl flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-3 tracking-tight">{t.earn.adsTitle}</h3>
            <p className="text-indigo-100 font-medium mb-10 leading-relaxed">{t.earn.adsDesc}</p>
          </div>
          <button className="relative z-10 w-full py-4.5 bg-white text-indigo-600 rounded-[22px] font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-xl">
            {t.earn.watchEarn}
            <PlayCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EarnTasks;
