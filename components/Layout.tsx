
import React, { useState } from 'react';
import { LayoutDashboard, Users, Zap, TrendingUp, ShieldAlert, LogOut, Menu, MessageSquare, Bell, ChevronDown, Award, CheckCircle2, Wallet, XCircle, Info } from 'lucide-react';
import { translations, Language } from '../translations';
import { UserRole } from '../types';
import { Notification } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  lang: Language;
  setLang: (l: Language) => void;
  onSignOut: () => void;
  notifications: Notification[];
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, lang, setLang, onSignOut, notifications }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const t = translations[lang];

  const navItems = [
    { id: 'explore', label: t.nav.explore, icon: TrendingUp },
    { id: 'earn', label: t.nav.earn, icon: Users },
    { id: 'boost', label: t.nav.boost, icon: Zap },
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'community', label: t.nav.community, icon: MessageSquare },
    { id: 'admin', label: t.nav.admin, icon: ShieldAlert, adminOnly: true },
  ];

  const formatCredits = (val: number) => {
    return new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US').format(val);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-['Inter']">
      {/* Admin Warning Bar */}
      {user.role === UserRole.ADMIN && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-[10px] font-black py-1.5 px-4 text-center z-[100] flex items-center justify-center gap-2 shadow-lg md:hidden">
          <ShieldAlert className="w-3 h-3" />
          ADMİN YETKİSİ AKTİF - SİSTEM KONTROLÜ SİZDE
        </div>
      )}

      {/* Mobile Header */}
      <div className={`md:hidden bg-[#0f172a] border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 ${user.role === UserRole.ADMIN ? 'mt-8' : ''}`}>
        <div className="font-black text-2xl text-indigo-400 tracking-tighter">CB</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:text-white transition-colors">
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-[60] bg-[#0f172a] text-white w-80 transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-black text-white tracking-tighter">
              Creator<span className="text-indigo-500">Boost</span>
            </div>
          </div>
          
          <div className={`mb-12 p-6 bg-[#1e293b] border rounded-[32px] shadow-2xl relative overflow-hidden group ${user.role === UserRole.ADMIN ? 'border-red-500/50' : 'border-slate-700/50'}`}>
            {user.role === UserRole.ADMIN && (
              <div className="absolute top-0 right-0">
                <div className="bg-red-500 text-white text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-tighter shadow-lg animate-pulse">ADMIN MODE</div>
              </div>
            )}
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <Award className="w-16 h-16" />
            </div>
            <div className="flex items-center gap-4 mb-6">
              <img src={user.avatar} className="w-14 h-14 rounded-2xl border-2 border-indigo-500/30 object-cover shadow-lg" alt="avatar" />
              <div className="overflow-hidden">
                <div className="text-[15px] font-black text-white truncate leading-tight">{user.username}</div>
                <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${user.role === UserRole.ADMIN ? 'text-red-400' : 'text-indigo-400'}`}>
                   {user.role} Member
                </div>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-700/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Wallet className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.common.balance}</span>
                </div>
                <span className="text-sm font-black text-emerald-400 tabular-nums">
                  {formatCredits(user.credits)} C
                </span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${user.role === UserRole.ADMIN ? 'bg-red-500' : 'bg-indigo-500'}`} 
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.filter(item => !item.adminOnly || user.role === UserRole.ADMIN).map((item) => {
              const isActive = activeTab === item.id;
              const isAdminItem = item.id === 'admin';
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative ${
                    isActive 
                      ? (isAdminItem ? 'bg-red-600 text-white shadow-xl shadow-red-600/30 translate-x-1' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 translate-x-1')
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : (isAdminItem ? 'text-red-400' : 'text-slate-500')}`} />
                  <span className="text-sm font-black tracking-tight">{item.label}</span>
                  {isAdminItem && !isActive && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  )}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
                </button>
              );
            })}
          </nav>

          <div className="pt-8 border-t border-slate-800/50 space-y-4">
            <div className="flex bg-slate-800/50 p-1.5 rounded-xl">
              <button onClick={() => setLang('tr')} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${lang === 'tr' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>TR</button>
              <button onClick={() => setLang('en')} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${lang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>EN</button>
            </div>
            <button 
              onClick={onSignOut}
              className="flex items-center gap-3 text-slate-500 hover:text-red-400 transition-all w-full px-4 py-3 group font-black text-sm"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {t.nav.signOut}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-40 hidden md:flex">
          <div className="flex items-center gap-4">
            <div className="text-sm font-black text-slate-400 uppercase tracking-widest">
               Status: <span className="text-emerald-500">Live & Synchronized</span>
            </div>
            {user.role === UserRole.ADMIN && (
              <div className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black flex items-center gap-2 border border-red-100">
                <ShieldAlert className="w-3 h-3" />
                ANA YÖNETİCİ PANELİ
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
               <Wallet className="w-4 h-4 text-indigo-500" />
               <span className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">{t.common.balance}:</span>
               <span className="text-sm font-black text-indigo-600 tabular-nums">{formatCredits(user.credits)} C</span>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></div>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 p-6 z-50 animate-in slide-in-from-top-4">
                  <h4 className="font-black text-slate-900 mb-4 px-2">Notifications</h4>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">Henüz bildirim yok.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 rounded-2xl border flex gap-3 ${
                          notif.type === 'success' ? 'bg-emerald-50 border-emerald-100' : 
                          notif.type === 'error' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'
                        }`}>
                           {notif.type === 'success' ? (
                             <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                           ) : notif.type === 'error' ? (
                             <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                           ) : (
                             <Info className="w-5 h-5 text-indigo-500 shrink-0" />
                           )}
                           <div>
                             <p className="text-xs font-bold text-slate-900 leading-tight mb-1">{notif.message}</p>
                             <p className="text-[8px] font-black text-slate-400 uppercase">{notif.timestamp}</p>
                           </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="h-8 w-px bg-slate-100"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <div className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{user.username}</div>
                <div className={`text-[10px] font-black uppercase tracking-widest ${user.role === UserRole.ADMIN ? 'text-red-500' : 'text-slate-400'}`}>{user.role}</div>
              </div>
              <img src={user.avatar} className="w-10 h-10 rounded-xl border border-slate-100 shadow-sm" alt="avatar" />
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-50 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
