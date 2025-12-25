
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { Award, Zap, Users, History, Settings, ChevronRight, Edit3, Camera, X, Check, Loader2, TrendingUp, BarChart2, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { translations, Language } from '../translations';

const GROWTH_DATA = [
  { day: 'Mon', followers: 120, interaction: 400 },
  { day: 'Tue', followers: 150, interaction: 520 },
  { day: 'Wed', followers: 180, interaction: 480 },
  { day: 'Thu', followers: 210, interaction: 610 },
  { day: 'Fri', followers: 250, interaction: 800 },
  { day: 'Sat', followers: 320, interaction: 950 },
  { day: 'Sun', followers: 380, interaction: 1100 },
];

interface UserDashboardProps {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
  lang: Language;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, setUser, lang }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bio, setBio] = useState("Building the next big community for creators.");
  const t = translations[lang];

  return (
    <div className="space-y-8 pb-20">
      {/* Profile Header Card */}
      <div className="bg-white p-8 md:p-12 rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-16 opacity-[0.02] -rotate-12">
          <Settings className="w-80 h-80" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500 rounded-[50px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img src={user.avatar} className="w-40 h-40 md:w-48 md:h-48 rounded-[50px] border-4 border-white shadow-2xl object-cover relative z-10" alt="avatar" />
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute -bottom-2 -right-2 p-4 bg-white text-indigo-600 rounded-2xl shadow-xl border border-slate-50 hover:scale-110 transition-transform z-20"
            >
              <Edit3 className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{user.username}</h1>
              <div className="flex justify-center md:justify-start gap-2">
                <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full tracking-widest shadow-lg shadow-indigo-200">
                  {user.role}
                </span>
                <span className="px-4 py-1.5 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase rounded-full tracking-widest">
                  Verified
                </span>
              </div>
            </div>
            <p className="text-slate-500 text-xl font-medium mb-8 max-w-xl leading-relaxed italic">"{bio}"</p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                <Users className="w-5 h-5 text-indigo-500" />
                <span className="font-bold text-slate-700">{user.tasksCompleted} {lang === 'tr' ? 'Görev' : 'Tasks'}</span>
              </div>
              <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                <Activity className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-slate-700">{user.reputation}% {lang === 'tr' ? 'İtibar' : 'Reputation'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{lang === 'tr' ? 'Büyüme Analizi' : 'Growth Analytics'}</h3>
              <p className="text-slate-400 text-sm font-medium">{lang === 'tr' ? 'Son 7 günlük performansınız' : 'Your performance in last 7 days'}</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Followers</span>
              </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorFollow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="followers" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorFollow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <TrendingUp className="w-40 h-40" />
            </div>
            <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-slate-400">{lang === 'tr' ? 'Hızlı İstatistik' : 'Quick Stats'}</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">{lang === 'tr' ? 'Haftalık Erişim' : 'Weekly Reach'}</span>
                <span className="text-2xl font-black tabular-nums">12.4K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">{lang === 'tr' ? 'Profil Tıklama' : 'Profile Clicks'}</span>
                <span className="text-2xl font-black tabular-nums text-indigo-400">842</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">{lang === 'tr' ? 'Kazanılan Kredi' : 'Credits Earned'}</span>
                <span className="text-2xl font-black tabular-nums text-emerald-400">+2.5K</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[40px] text-white shadow-xl">
             <h3 className="text-xl font-black mb-4">{lang === 'tr' ? 'İtibar Karnesi' : 'Reputation Score'}</h3>
             <div className="flex items-end gap-3 mb-6">
               <span className="text-6xl font-black leading-none">{user.reputation}%</span>
               <span className="text-indigo-200 font-bold mb-1">Excellent</span>
             </div>
             <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-80">
               {lang === 'tr' 
                ? 'Harika bir üreticisin! Hiçbir sahte kanıt yüklemedin ve tüm takipleri korudun.' 
                : 'You are a great creator! You haven\'t uploaded any fake proofs and kept all follows.'}
             </p>
          </div>
        </div>
      </div>

      {/* Recent History */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <History className="w-6 h-6 text-indigo-500" />
            {lang === 'tr' ? 'Son İşlemler' : 'Recent Transactions'}
          </h3>
          <button className="text-sm font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all uppercase tracking-widest">{t.common.viewAll}</button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { type: 'Task', detail: lang === 'tr' ? 'TikTok Takibi: @dance_queen' : 'TikTok Follow: @dance_queen', date: '10m ago', amount: '+30 C', status: 'Verified' },
            { type: 'Boost', detail: lang === 'tr' ? 'Instagram Profil Desteği' : 'Instagram Profile Boost', date: '2h ago', amount: '-500 C', status: 'Active' },
            { type: 'Task', detail: lang === 'tr' ? 'Youtube Abone: TechTV' : 'Youtube Sub: TechTV', date: '5h ago', amount: '+100 C', status: 'Pending' },
            { type: 'Award', detail: lang === 'tr' ? 'Haftalık Bonus' : 'Weekly Bonus', date: '1d ago', amount: '+250 C', status: 'Gift' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.amount.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-700'}`}>
                  {item.type === 'Boost' ? <Zap className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{item.detail}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date} • {item.status}</div>
                </div>
              </div>
              <div className={`text-lg font-black tabular-nums ${item.amount.startsWith('+') ? 'text-emerald-500' : 'text-slate-900'}`}>
                {item.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
