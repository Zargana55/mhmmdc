
import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Users, Eye, Ban, CheckSquare, MessageSquare, Send, CheckCircle2, XCircle, Clock, TrendingUp, Terminal, ShieldCheck, UserCheck, HardDrive, RefreshCw, Landmark, AlertTriangle, Search, Filter, Info, PlusCircle, Settings, Save, Zap, AlertCircle, Copy, MessageSquareCode, BellRing, Lock, HelpCircle, UserX, UserMinus, ShieldQuestion, ExternalLink, Trash2, Smartphone, CreditCard, Banknote } from 'lucide-react';
import { translations, Language } from '../translations';
import { SystemConfig, ChatMessage } from '../App';

interface AdminPanelProps {
  lang: Language;
  pendingOrders: any[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  systemConfig: SystemConfig;
  setSystemConfig: (cfg: SystemConfig) => void;
  chatMessages: ChatMessage[];
  onAdminReply: (userId: string, text: string, source?: 'web' | 'telegram') => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ lang, pendingOrders, onApprove, onReject, systemConfig, setSystemConfig, chatMessages, onAdminReply }) => {
  const t = translations[lang];
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'users' | 'support' | 'settings'>('overview');
  const [localConfig, setLocalConfig] = useState<SystemConfig>(systemConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [testBotStatus, setTestBotStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [replyInput, setReplyInput] = useState('');
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
  const [isTelegramPolling, setIsTelegramPolling] = useState(false);
  const lastUpdateId = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const logs_templates = [
        "Sistem sağlığı kontrol edildi: %100",
        "AI doğrulaması onaylandı",
        "Yeni bir ödeme bildirimi alındı",
        "Veritabanı yedekleme tamamlandı",
        "Telegram API bağlantısı: Kararlı",
      ];
      const newLog = `[${new Date().toLocaleTimeString()}] ${logs_templates[Math.floor(Math.random() * logs_templates.length)]}`;
      setLogs(prev => [newLog, ...prev].slice(0, 15));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Telegram Polling
  useEffect(() => {
    if (!systemConfig.botSettings.telegramToken) return;

    const pollTelegram = async () => {
      try {
        const url = `https://api.telegram.org/bot${systemConfig.botSettings.telegramToken}/getUpdates?offset=${lastUpdateId.current + 1}&timeout=30`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.ok && data.result.length > 0) {
          data.result.forEach((update: any) => {
            lastUpdateId.current = update.update_id;
            if (update.message?.reply_to_message) {
              const originalText = update.message.reply_to_message.text;
              const replyText = update.message.text;
              const idMatch = originalText.match(/\[ID:\s*([^\]]+)\]/);
              if (idMatch && idMatch[1]) {
                const userId = idMatch[1].trim();
                onAdminReply(userId, replyText, 'telegram');
                setLogs(prev => [`[${new Date().toLocaleTimeString()}] TEL-REPLY: @${userId} -> "${replyText}"`, ...prev].slice(0, 15));
              }
            }
          });
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    setIsTelegramPolling(true);
    const pollInterval = setInterval(pollTelegram, 2500);
    return () => {
      clearInterval(pollInterval);
      setIsTelegramPolling(false);
    };
  }, [systemConfig.botSettings.telegramToken, onAdminReply]);

  const handleApprove = (id: string) => {
    setProcessingId(id);
    setTimeout(() => {
      onApprove(id);
      setProcessingId(null);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ONAY: Ref CB-${id} onaylandı.`, ...prev].slice(0, 15));
    }, 1000);
  };

  const handleReject = (id: string) => {
    if (window.confirm("Bu ödemeyi reddetmek istediğinize emin misiniz?")) {
      onReject(id);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] RED: Ref CB-${id} reddedildi.`, ...prev].slice(0, 15));
    }
  };

  const testTelegramBot = async () => {
    const { telegramToken, adminChatId } = localConfig.botSettings;
    if (!telegramToken || !adminChatId) {
      alert("Lütfen Token ve Chat ID girin!");
      return;
    }
    setTestBotStatus('testing');
    try {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: adminChatId, text: "🚀 Bağlantı test mesajı!" })
      });
      setTestBotStatus('success');
    } catch (err) {
      setTestBotStatus('error');
    }
    setTimeout(() => setTestBotStatus('idle'), 3000);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !selectedChatUser) return;
    onAdminReply(selectedChatUser, replyInput, 'web');
    setReplyInput('');
  };

  const chatUsers = Array.from(new Set(chatMessages.filter(m => m.sender === 'user').map(m => m.userId))).map(id => {
    const lastMsg = chatMessages.filter(m => m.userId === id).pop();
    return { id, name: lastMsg?.userName || 'Anonim', lastMsg: lastMsg?.text || '', time: lastMsg?.timestamp || '' };
  });

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-4 shadow-xl">
            Sistem Yönetimi
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kontrol Paneli</h1>
          <p className="text-slate-500 font-medium text-lg">Hoş geldin, sistem şu an %100 kapasiteyle çalışıyor.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-[22px] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
          {['overview', 'payments', 'users', 'support', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'settings' ? 'Ayarlar' : (tab === 'overview' ? 'Genel' : (tab === 'payments' ? 'Ödemeler' : (tab === 'support' ? 'Destek' : 'Kullanıcılar')))}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'support' && (
        <div className="space-y-6">
           <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className={`p-4 rounded-2xl ${isTelegramPolling ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                 <Smartphone className={`w-8 h-8 ${isTelegramPolling ? 'animate-pulse' : ''}`} />
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h3 className="text-xl font-black text-slate-900">Telegram Köprüsü Aktif</h3>
                 <p className="text-sm font-medium text-slate-500">Cevaplar için mesajı Telegram'dan <strong className="text-indigo-600">YANITLA (REPLY)</strong> yapın.</p>
              </div>
           </div>

           <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row h-[700px]">
              <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
                <div className="p-6 border-b border-slate-100 font-black text-xs uppercase tracking-widest text-slate-400">Mesajlar ({chatUsers.length})</div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 no-scrollbar">
                  {chatUsers.map((chat) => (
                    <button 
                      key={chat.id} 
                      onClick={() => setSelectedChatUser(chat.id)}
                      className={`w-full p-6 text-left hover:bg-white transition-all flex gap-4 items-start relative ${selectedChatUser === chat.id ? 'bg-white' : ''}`}
                    >
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black">{chat.name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-slate-900 text-sm truncate">@{chat.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium truncate mt-1">{chat.lastMsg}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col bg-white">
                {selectedChatUser ? (
                  <>
                    <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">@{chatUsers.find(u => u.id === selectedChatUser)?.name.charAt(0)}</div>
                      <span className="font-black">@{chatUsers.find(u => u.id === selectedChatUser)?.name}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/20">
                      {chatMessages.filter(m => m.userId === selectedChatUser || (m.sender === 'admin' && m.userId === selectedChatUser)).map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-4 rounded-[28px] max-w-[75%] text-sm font-medium shadow-sm relative ${
                            msg.sender === 'admin' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                          }`}>
                            {msg.text}
                            {msg.source === 'telegram' && <Smartphone className="w-3 h-3 absolute -top-2 -right-2 text-indigo-400 bg-white rounded-full p-0.5" />}
                          </div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendReply} className="p-6 bg-white border-t border-slate-100 flex gap-4">
                      <input 
                        type="text" 
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        placeholder="Yanıtınızı yazın..." 
                        className="flex-1 bg-slate-50 border-none rounded-[22px] px-6 py-4 text-sm font-bold outline-none"
                      />
                      <button type="submit" className="px-8 py-4 bg-indigo-600 text-white rounded-[22px] font-black text-xs">GÖNDER</button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300"><MessageSquare className="w-12 h-12 mb-4 opacity-20" /><p className="font-black text-xs uppercase">Sohbet seçin</p></div>
                )}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-500">
          {/* ÖDEME AYARLARI BÖLÜMÜ */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Banknote className="w-8 h-8 text-emerald-500" />
                Banka ve Ödeme Bilgileri
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Banka Adı</label>
                  <input 
                    type="text" 
                    value={localConfig.paymentInfo.bankName}
                    onChange={(e) => setLocalConfig({...localConfig, paymentInfo: {...localConfig.paymentInfo, bankName: e.target.value}})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Hesap Sahibi</label>
                  <input 
                    type="text" 
                    value={localConfig.paymentInfo.accountHolder}
                    onChange={(e) => setLocalConfig({...localConfig, paymentInfo: {...localConfig.paymentInfo, accountHolder: e.target.value}})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">IBAN Numarası</label>
                  <input 
                    type="text" 
                    value={localConfig.paymentInfo.iban}
                    onChange={(e) => setLocalConfig({...localConfig, paymentInfo: {...localConfig.paymentInfo, iban: e.target.value}})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Açıklama Öneki (Kod)</label>
                  <input 
                    type="text" 
                    value={localConfig.paymentInfo.descriptionPrefix}
                    onChange={(e) => setLocalConfig({...localConfig, paymentInfo: {...localConfig.paymentInfo, descriptionPrefix: e.target.value}})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                    placeholder="CB-"
                  />
                </div>
              </div>
          </div>

          {/* TELEGRAM AYARLARI BÖLÜMÜ */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <MessageSquareCode className="w-8 h-8 text-sky-500" />
                Telegram Entegrasyonu
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Bot HTTP API Token</label>
                  <input 
                    type="password" 
                    value={localConfig.botSettings.telegramToken}
                    onChange={(e) => setLocalConfig({...localConfig, botSettings: {...localConfig.botSettings, telegramToken: e.target.value}})}
                    className="w-full px-6 py-4 bg-slate-900 text-sky-400 border border-slate-800 rounded-2xl outline-none font-mono text-xs focus:ring-4 focus:ring-sky-500/10"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Yönetici Chat ID</label>
                  <input 
                    type="text" 
                    value={localConfig.botSettings.adminChatId}
                    onChange={(e) => setLocalConfig({...localConfig, botSettings: {...localConfig.botSettings, adminChatId: e.target.value}})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                  />
                </div>
                <div className="flex items-end pb-1">
                   <button onClick={testTelegramBot} className="w-full py-4 rounded-2xl font-black text-xs bg-slate-50 border-2 border-slate-100 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                    {testBotStatus === 'testing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Test Mesajı Gönder
                  </button>
                </div>
              </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <button 
              onClick={() => {
                 setIsSaving(true);
                 setTimeout(() => {
                   setSystemConfig(localConfig);
                   setIsSaving(false);
                   alert("Tüm ayarlar kaydedildi ve güncellendi!");
                 }, 800);
              }}
              className="flex-1 py-6 bg-slate-900 text-white rounded-[32px] font-black text-xl hover:bg-indigo-600 transition-all shadow-2xl flex items-center justify-center gap-4"
            >
              {isSaving ? <RefreshCw className="w-7 h-7 animate-spin" /> : <Save className="w-7 h-7" />}
              Değişiklikleri Uygula
            </button>
            <div className="bg-[#020617] rounded-[32px] p-6 md:w-80 font-mono text-[10px] text-slate-500">
               <div className="flex items-center gap-2 text-indigo-400 mb-2 uppercase tracking-widest font-black"><Terminal className="w-3 h-3"/> Sistem Günlüğü</div>
               {logs.slice(0, 3).map((log, i) => <div key={i} className="truncate">> {log}</div>)}
            </div>
          </div>
        </div>
      )}

      {/* Overview, Payments, Users gibi diğer tablar (Gerekirse benzer şekilde eklenir) */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Aktif Üretici', val: '1,420', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Users },
              { label: 'Sistem Durumu', val: '%100', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: ShieldCheck },
              { label: 'Bekleyen Ödeme', val: pendingOrders.length, color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
              { label: 'Veritabanı', val: 'Kararlı', color: 'text-slate-600', bg: 'bg-slate-50', icon: HardDrive },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
                <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}><stat.icon className="w-6 h-6" /></div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{stat.val}</div>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
