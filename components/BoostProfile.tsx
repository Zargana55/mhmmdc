
import React, { useState } from 'react';
import { Zap, Rocket, TrendingUp, CreditCard, Send, CheckCircle2, Copy, Info, ShieldCheck, Landmark, AlertCircle, X, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';
import { translations, Language } from '../translations';
import { SystemConfig } from '../App';

interface BoostProfileProps {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
  lang: Language;
  onOrderCreated: (order: any) => void;
  systemConfig: SystemConfig;
}

const BoostProfile: React.FC<BoostProfileProps> = ({ user, setUser, lang, onOrderCreated, systemConfig }) => {
  const [boostAmount, setBoostAmount] = useState(100);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'pending' | 'instructions'>('idle');
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const t = translations[lang];

  const handleBoost = () => {
    if (user.credits < boostAmount) {
      alert(lang === 'tr' ? "Yetersiz kredi!" : "Insufficient credits!");
      return;
    }
    setUser({
      ...user,
      credits: user.credits - boostAmount,
      tasksPosted: user.tasksPosted + 1
    });
    alert(lang === 'tr' ? "Profiliniz başarıyla öne çıkarıldı!" : `Successfully spent ${boostAmount} C to boost your profile!`);
  };

  const handleManualPurchase = (pack: any) => {
    setSelectedPack(pack);
    setPurchaseStatus('instructions');
  };

  const sendTelegramNotification = async (order: any) => {
    const { telegramToken, adminChatId, notifyNewOrders, messageTemplate } = systemConfig.botSettings;
    
    if (notifyNewOrders && telegramToken && adminChatId) {
      let message = messageTemplate
        .replace('{username}', order.username)
        .replace('{amount}', order.amount.toString())
        .replace('{type}', order.type)
        .replace('{id}', order.id);

      try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: adminChatId,
            text: message,
            parse_mode: 'Markdown'
          })
        });
      } catch (err) {
        console.error("Telegram notify failed:", err);
      }
    }
  };

  const confirmPaymentSent = async () => {
    setPurchaseStatus('pending');
    
    const newOrder = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      username: user.username,
      amount: selectedPack.credits,
      type: 'Havale/EFT',
      timestamp: new Date().toLocaleTimeString()
    };
    
    await sendTelegramNotification(newOrder);
    
    setTimeout(() => {
      onOrderCreated(newOrder);
      setTimeout(() => setPurchaseStatus('idle'), 3000);
    }, 800);
  };

  const copyIban = () => {
    navigator.clipboard.writeText(systemConfig.paymentInfo.iban);
    alert(lang === 'tr' ? "IBAN Kopyalandı!" : "IBAN Copied!");
  };

  const copyUsername = () => {
    const textToCopy = `${systemConfig.paymentInfo.descriptionPrefix}${user.username}`;
    navigator.clipboard.writeText(textToCopy);
    alert(lang === 'tr' ? "Kullanıcı adı ve kod kopyalandı! Açıklamaya yapıştırın." : "Username and code copied! Paste into description.");
  };

  const creditPacks = [
    { id: 'start', name: lang === 'tr' ? 'Başlangıç Paketi' : 'Starter Pack', credits: 500, price: 149.90, popular: false },
    { id: 'pro', name: lang === 'tr' ? 'Popüler Paket' : 'Pro Pack', credits: 2000, price: 499.90, popular: true },
    { id: 'ultra', name: lang === 'tr' ? 'Ultra Destek' : 'Ultra Pack', credits: 5000, price: 999.90, popular: false },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {purchaseStatus === 'instructions' && selectedPack && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="bg-indigo-600 p-8 text-white relative">
              <button 
                onClick={() => setPurchaseStatus('idle')} 
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-white/20 rounded-2xl">
                   <Landmark className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black">{lang === 'tr' ? 'Ödeme Bilgileri' : 'Payment Details'}</h3>
              </div>
              <p className="text-indigo-100 font-medium opacity-80">
                {selectedPack.credits} {t.common.credits} - {formatCurrency(selectedPack.price)}
              </p>
            </div>

            <div className="p-10 space-y-8">
              <div className="p-6 bg-red-50 rounded-3xl border-2 border-red-100 animate-pulse-subtle">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-500 text-white rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-red-900 text-sm mb-1 uppercase tracking-tight">
                      {lang === 'tr' ? 'DİKKAT: AÇIKLAMA KISMI' : 'ATTENTION: DESCRIPTION FIELD'}
                    </h4>
                    <p className="text-red-700 text-xs font-bold leading-relaxed mb-4">
                      {lang === 'tr' 
                        ? "Kredilerin hesabınıza tanımlanabilmesi için banka transferi yaparken AÇIKLAMA kısmına aşağıdaki kullanıcı adınızı birebir yazmalısınız:" 
                        : "To receive your credits, you MUST write the following username exactly in the bank transfer DESCRIPTION field:"}
                    </p>
                    <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-red-200 shadow-sm">
                      <span className="text-lg font-black text-slate-900">{systemConfig.paymentInfo.descriptionPrefix}{user.username}</span>
                      <button 
                        onClick={copyUsername}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl font-black text-[10px] hover:bg-red-200 transition-all uppercase tracking-widest"
                      >
                        <Copy className="w-3 h-3" />
                        {lang === 'tr' ? 'KOPYALA' : 'COPY'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">IBAN ({systemConfig.paymentInfo.accountHolder})</div>
                  <div className="flex items-center justify-between gap-4">
                    <code className="text-sm md:text-base font-black text-slate-800 break-all">{systemConfig.paymentInfo.iban}</code>
                    <button onClick={copyIban} className="p-3 bg-white text-indigo-600 border border-slate-200 shadow-sm rounded-xl hover:bg-indigo-50 transition-all shrink-0">
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hesap Sahibi</div>
                    <div className="font-black text-slate-900 text-xs truncate">{systemConfig.paymentInfo.accountHolder}</div>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Banka</div>
                    <div className="font-black text-slate-900 text-xs truncate">{systemConfig.paymentInfo.bankName}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={confirmPaymentSent}
                  className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 active:scale-95"
                >
                  <Send className="w-6 h-6" />
                  {lang === 'tr' ? 'Ödemeyi Gönderdim' : 'I Have Sent Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{t.boost.title}</h1>
            <p className="text-slate-500 text-lg font-medium">{t.boost.subtitle}</p>
          </div>

          <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm space-y-10">
            <div>
              <label className="block text-xs font-black text-slate-400 mb-6 uppercase tracking-[0.2em]">{t.boost.intensity}</label>
              <div className="grid grid-cols-3 gap-4">
                {[100, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBoostAmount(amount)}
                    className={`py-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-2 ${
                      boostAmount === amount 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-100 scale-105' 
                      : 'border-slate-50 hover:border-slate-200 text-slate-400 bg-slate-50/50'
                    }`}
                  >
                    <span className="text-2xl font-black">{amount}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.common.credits}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5 p-8 bg-slate-50 rounded-[35px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">{t.boost.estReach}</span>
                <span className="text-slate-900 font-black flex items-center gap-2">
                  ~{boostAmount * 2.5} {lang === 'tr' ? 'üretici' : 'creators'}
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">{t.boost.duration}</span>
                <span className="text-slate-900 font-black">48 Hours</span>
              </div>
            </div>

            <button 
              onClick={handleBoost}
              className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black text-xl hover:bg-indigo-600 shadow-2xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-4 group"
            >
              <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              {t.boost.activate}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
            {purchaseStatus === 'pending' && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[35px] flex items-center justify-center mb-8 shadow-lg shadow-emerald-50">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <p className="text-2xl font-black text-slate-900 mb-4">{t.boost.botSent}</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full">
                  <Landmark className="w-4 h-4" />
                  Manuel Onay Bekleniyor
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-2xl text-slate-900 flex items-center gap-3">
                <CreditCard className="w-7 h-7 text-indigo-600" />
                {t.boost.purchaseTitle}
              </h3>
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">{t.boost.purchaseDesc}</p>
            
            <div className="space-y-4">
              {creditPacks.map((pack) => (
                <button 
                  key={pack.id}
                  onClick={() => handleManualPurchase(pack)}
                  className={`w-full flex items-center justify-between p-7 rounded-[32px] border-2 transition-all group text-left relative ${
                    pack.popular ? 'bg-slate-900 border-slate-900 text-white shadow-xl translate-x-1' : 'bg-white border-slate-100 text-slate-900 hover:border-indigo-500'
                  }`}
                >
                  {pack.popular && (
                    <div className="absolute -top-3 right-8 px-4 py-1 bg-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">En Popüler</div>
                  )}
                  <div>
                    <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${pack.popular ? 'text-indigo-400' : 'text-indigo-600'}`}>{pack.name}</div>
                    <div className="text-2xl font-black">{pack.credits} <span className="text-sm font-medium opacity-60">Kredi</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black">{formatCurrency(pack.price)}</div>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${pack.popular ? 'text-slate-500' : 'text-slate-400'}`}>{t.boost.manualPay}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoostProfile;