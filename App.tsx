
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import LandingPage from './components/LandingPage.tsx';
import ExploreFeed from './components/ExploreFeed.tsx';
import EarnTasks from './components/EarnTasks.tsx';
import BoostProfile from './components/BoostProfile.tsx';
import UserDashboard from './components/UserDashboard.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import CommunityCenter from './components/CommunityCenter.tsx';
import { UserRole, UserProfile } from './types.ts';
import { translations, Language } from './translations.ts';
import { MessageCircle, X, Send, Smartphone } from 'lucide-react';

interface PendingOrder {
  id: string;
  username: string;
  amount: number;
  type: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
  userId: string;
  userName: string;
  source?: 'web' | 'telegram';
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: string;
}

export interface SystemConfig {
  paymentInfo: {
    bankName: string;
    accountHolder: string;
    iban: string;
    descriptionPrefix: string;
  };
  botSettings: {
    riskThreshold: number;
    autoAuditEnabled: boolean;
    simulationSpeed: 'slow' | 'normal' | 'fast';
    telegramToken: string;
    adminChatId: string;
    notifyNewOrders: boolean;
    notifyRisks: boolean;
    notifyNewUsers: boolean;
    messageTemplate: string;
  };
}

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('creatorboost_lang');
    return (saved === 'tr' || saved === 'en') ? saved : 'tr';
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('creatorboost_isLoggedIn') === 'true';
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('creatorboost_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'n1', type: 'info', message: 'CreatorBoost dünyasına hoş geldiniz!', timestamp: 'Yeni' }
    ];
  });

  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('creatorboost_messages');
    return saved ? JSON.parse(saved) : [
      { id: 'm1', sender: 'admin', text: 'Merhaba! Ben CreatorBoost asistanıyım. Sorularınızı buraya yazabilirsiniz.', timestamp: '10:00', userId: 'system', userName: 'Destek' }
    ];
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('creatorboost_config');
    if (saved) return JSON.parse(saved);
    return {
      paymentInfo: {
        bankName: 'Ziraat Bankası',
        accountHolder: 'CreatorBoost Teknoloji LTD.',
        iban: 'TR00 0000 0000 0000 0000 0000 00',
        descriptionPrefix: 'CB-'
      },
      botSettings: {
        riskThreshold: 85,
        autoAuditEnabled: true,
        simulationSpeed: 'normal',
        telegramToken: '',
        adminChatId: '',
        notifyNewOrders: true,
        notifyRisks: true,
        notifyNewUsers: false,
        messageTemplate: "🚀 *YENİ SİPARİŞ!* \n\n👤 Kullanıcı: @{username} \n💰 Miktar: {amount} C \n💳 Tür: {type} \n🔑 Ref: CB-{id} \n\nLütfen Admin Panelinden onaylayın."
      }
    };
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('creatorboost_user');
    if (savedUser) return JSON.parse(savedUser);
    return {
      id: 'u1',
      username: 'NewCreator',
      credits: 500,
      reputation: 98,
      role: UserRole.USER,
      tasksCompleted: 0,
      tasksPosted: 0,
      isBanned: false,
      avatar: 'https://picsum.photos/seed/default/200'
    };
  });

  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['explore', 'earn', 'boost', 'dashboard', 'community', 'admin'].includes(hash) ? hash : 'landing';
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>(() => {
    const saved = localStorage.getItem('creatorboost_pending_orders');
    return saved ? JSON.parse(saved) : [
      { id: 'TEST01', username: 'Kullanici1', amount: 500, type: 'Havale/EFT', timestamp: '10:30' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('creatorboost_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('creatorboost_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('creatorboost_isLoggedIn', String(isLoggedIn));
    localStorage.setItem('creatorboost_user', JSON.stringify(user));
  }, [isLoggedIn, user]);

  useEffect(() => {
    localStorage.setItem('creatorboost_config', JSON.stringify(systemConfig));
  }, [systemConfig]);

  useEffect(() => {
    localStorage.setItem('creatorboost_pending_orders', JSON.stringify(pendingOrders));
  }, [pendingOrders]);

  useEffect(() => {
    localStorage.setItem('creatorboost_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    window.location.hash = activeTab;
    if (isLoggedIn && (activeTab === 'landing' || activeTab === '')) {
      setActiveTab(user.role === UserRole.ADMIN ? 'admin' : 'explore');
    }
    if (!isLoggedIn && activeTab !== 'landing') {
      setActiveTab('landing');
    }
  }, [activeTab, isLoggedIn, user.role]);

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 5),
      type,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 10));
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUser(prev => ({ ...prev, role: UserRole.USER }));
    setActiveTab('landing');
    localStorage.removeItem('creatorboost_isLoggedIn');
    localStorage.removeItem('creatorboost_user');
  };

  const handleLoginSuccess = (chosenUsername: string) => {
    const emailLower = chosenUsername.toLowerCase();
    const isAdmin = emailLower === 'admin' || emailLower === 'mhmmdc83@gmail.com';
    
    const newUserProfile: UserProfile = {
      id: isAdmin ? 'admin-id' : 'user-' + Math.random().toString(36).substr(2, 5),
      username: isAdmin ? 'Sistem Yöneticisi' : chosenUsername.split('@')[0],
      credits: isAdmin ? 1000000 : 500,
      reputation: 100,
      role: isAdmin ? UserRole.ADMIN : UserRole.USER,
      tasksCompleted: isAdmin ? 999 : 0,
      tasksPosted: isAdmin ? 50 : 0,
      isBanned: false,
      avatar: isAdmin ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' : `https://picsum.photos/seed/${chosenUsername}/200`
    };
    
    setUser(newUserProfile);
    setIsLoggedIn(true);
    setActiveTab(isAdmin ? 'admin' : 'explore');
    setShowAuthModal(false);
    addNotification('info', lang === 'tr' ? 'Hoş geldiniz, oturum açıldı!' : 'Welcome, you are signed in!');
  };

  const sendTelegramChatMessage = async (msg: ChatMessage) => {
    const { telegramToken, adminChatId } = systemConfig.botSettings;
    if (!telegramToken || !adminChatId) return;

    const text = `📬 *YENİ MESAJ: @${msg.userName}*\n` +
                 `━━━━━━━━━━━━━━━━━━\n` +
                 `💬 *Mesaj:* ${msg.text}\n` +
                 `━━━━━━━━━━━━━━━━━━\n` +
                 `🆔 [ID: ${msg.userId}]\n` +
                 `🕒 Saat: ${msg.timestamp}\n\n` +
                 `👉 _Cevap vermek için bu mesajı Yanıtlayın (Reply)._`;

    try {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: adminChatId,
          text: text,
          parse_mode: 'Markdown'
        })
      });
    } catch (err) {
      console.error("Telegram chat notify failed:", err);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: user.role === UserRole.ADMIN ? 'admin' : 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userId: user.id,
      userName: user.username,
      source: 'web'
    };

    setMessages(prev => [...prev, newMessage]);
    setChatInput('');

    if (user.role !== UserRole.ADMIN) {
      sendTelegramChatMessage(newMessage);
      addNotification('info', lang === 'tr' ? 'Destek mesajınız iletildi.' : 'Your support message sent.');
    }
  };

  const handleAdminReply = (userId: string, text: string, source: 'web' | 'telegram' = 'web') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'admin',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userId: userId,
      userName: 'Sistem Yöneticisi',
      source: source
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addPendingOrder = (order: PendingOrder) => {
    setPendingOrders(prev => [order, ...prev]);
  };

  const approveOrder = (orderId: string) => {
    const orderToApprove = pendingOrders.find(o => o.id === orderId);
    if (orderToApprove) {
      setUser(prev => ({
        ...prev,
        credits: prev.credits + orderToApprove.amount
      }));
      setPendingOrders(prev => prev.filter(o => o.id !== orderId));
      addNotification('success', lang === 'tr' ? `CB-${orderId} Onaylandı! +${orderToApprove.amount} Kredi yüklendi.` : `CB-${orderId} Approved! +${orderToApprove.amount} Credits added.`);
    }
  };

  const rejectOrder = (orderId: string) => {
    const orderToReject = pendingOrders.find(o => o.id === orderId);
    if (orderToReject) {
      setPendingOrders(prev => prev.filter(o => o.id !== orderId));
      addNotification('error', lang === 'tr' ? `CB-${orderId} Reddedildi: Banka transferi ulaşmadı!` : `CB-${orderId} Rejected: Bank transfer not received!`);
    }
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return (
        <LandingPage 
          lang={lang} 
          onStart={() => setShowAuthModal(true)} 
          externalShowAuth={showAuthModal}
          onAuthComplete={handleLoginSuccess}
          onAuthClose={() => setShowAuthModal(false)}
        />
      );
    }

    switch (activeTab) {
      case 'explore': return <ExploreFeed lang={lang} />;
      case 'earn': return <EarnTasks user={user} setUser={setUser} lang={lang} />;
      case 'boost': return <BoostProfile user={user} setUser={setUser} lang={lang} onOrderCreated={addPendingOrder} systemConfig={systemConfig} />;
      case 'dashboard': return <UserDashboard user={user} setUser={setUser} lang={lang} />;
      case 'community': return <CommunityCenter lang={lang} />;
      case 'admin': return <AdminPanel lang={lang} pendingOrders={pendingOrders} onApprove={approveOrder} onReject={rejectOrder} systemConfig={systemConfig} setSystemConfig={setSystemConfig} chatMessages={messages} onAdminReply={handleAdminReply} />;
      default: return <ExploreFeed lang={lang} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50">
      {isLoggedIn ? (
        <Layout 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user} 
          lang={lang} 
          setLang={setLang}
          onSignOut={handleSignOut}
          notifications={notifications}
        >
          {renderContent()}
        </Layout>
      ) : (
        <>
          <nav className="absolute top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
            <div className="text-2xl font-black text-indigo-600 tracking-tighter">CreatorBoost</div>
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-200/50 p-1 rounded-lg backdrop-blur-sm">
                <button onClick={() => setLang('tr')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${lang === 'tr' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-indigo-600'}`}>TR</button>
                <button onClick={() => setLang('en')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${lang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-indigo-600'}`}>EN</button>
              </div>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all"
              >
                {lang === 'tr' ? 'Giriş / Kayıt' : 'Sign In / Register'}
              </button>
            </div>
          </nav>
          {renderContent()}
        </>
      )}

      {user.role !== UserRole.ADMIN && (
        <div className="fixed bottom-8 right-8 z-[200]">
          <button 
            onClick={() => setShowChat(!showChat)}
            className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            {showChat ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
          </button>

          {showChat && (
            <div className="absolute bottom-20 right-0 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4">
              <div className="bg-indigo-600 p-6 text-white flex items-center justify-between">
                <div>
                  <h4 className="font-black text-lg">Canlı Destek</h4>
                  <p className="text-[10px] font-medium opacity-80">Size nasıl yardımcı olabiliriz?</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">
                   <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                   <span className="text-[9px] font-black uppercase tracking-widest">Çevrimiçi</span>
                </div>
              </div>
              <div className="p-4 h-80 bg-slate-50 overflow-y-auto flex flex-col gap-3 no-scrollbar">
                {messages.filter(m => m.userId === user.id || m.userId === 'system' || (m.sender === 'admin' && m.userId === user.id)).map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-3 rounded-2xl max-w-[85%] text-[11px] font-medium shadow-sm relative ${
                      msg.sender === 'admin' 
                        ? 'bg-white text-slate-700 rounded-bl-none border border-slate-100' 
                        : 'bg-indigo-600 text-white rounded-br-none'
                    }`}>
                      {msg.text}
                      {msg.source === 'telegram' && msg.sender === 'admin' && (
                        <Smartphone className="w-2.5 h-2.5 absolute -top-1.5 -right-1.5 text-indigo-400" />
                      )}
                      <div className={`text-[8px] mt-1 opacity-50 ${msg.sender === 'admin' ? 'text-slate-400' : 'text-indigo-100'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Mesajınız..." 
                  className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                />
                <button type="submit" className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
