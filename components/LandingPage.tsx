
import React, { useState, useRef } from 'react';
import { ArrowRight, Star, PlayCircle, X, CheckCircle2, Loader2, UserPlus, LogIn, Mail, Lock, User, ShieldCheck, Zap, Globe, BarChart3 } from 'lucide-react';
import { translations, Language } from '../translations';

interface LandingPageProps {
  lang: Language;
  onStart: () => void;
  externalShowAuth: boolean;
  onAuthComplete: (username: string) => void;
  onAuthClose: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ lang, onStart, externalShowAuth, onAuthComplete, onAuthClose }) => {
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
      {externalShowAuth && (
        <AuthModal 
          lang={lang}
          onClose={onAuthClose}
          onComplete={onAuthComplete}
        />
      )}

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 overflow-hidden px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-indigo-500/10 to-transparent -z-10 opacity-70"></div>
        
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-indigo-600 text-[12px] font-bold uppercase tracking-wider mb-8 animate-fade-in shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {lang === 'tr' ? 'V3.0 YAYINDA: AI DESTEKLİ BÜYÜME' : 'V3.0 LIVE: AI-POWERED GROWTH'}
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9] max-w-4xl mx-auto">
            {t.landing.heroTitle}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            {t.landing.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-[20px] font-black text-xl hover:bg-indigo-700 shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 group active:scale-95"
            >
              {t.landing.ctaPrimary}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 rounded-[20px] font-black text-xl hover:bg-slate-50 border border-slate-200 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
            >
              <PlayCircle className="w-6 h-6 text-indigo-600" />
              {t.landing.ctaSecondary}
            </button>
          </div>

          {/* Trusted By Bar */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all">
            <div className="font-black text-2xl text-slate-400 tracking-tighter italic">TikTokRank</div>
            <div className="font-black text-2xl text-slate-400 tracking-tighter italic">InstaBoost</div>
            <div className="font-black text-2xl text-slate-400 tracking-tighter italic">CreatorHub</div>
            <div className="font-black text-2xl text-slate-400 tracking-tighter italic">SocialFlow</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, title: lang === 'tr' ? 'Güvenli Doğrulama' : 'Secure Verification', desc: lang === 'tr' ? 'Gemini AI ile her etkileşimi analiz ediyor ve sadece gerçek hesapları onaylıyoruz.' : 'We analyze every interaction with Gemini AI and only approve real accounts.' },
              { icon: Zap, title: lang === 'tr' ? 'Anında Kredi' : 'Instant Credits', desc: lang === 'tr' ? 'Görev tamamlandığında kredileriniz anında hesabınıza yansır ve kullanıma hazır olur.' : 'Your credits reflect instantly upon completion and are ready for use.' },
              { icon: BarChart3, title: lang === 'tr' ? 'Detaylı Analitik' : 'Deep Analytics', desc: lang === 'tr' ? 'Profilinizin büyümesini gerçek zamanlı grafiklerle takip edin ve kitlenizi tanıyın.' : 'Track your profile growth with real-time charts and know your audience.' },
            ].map((feature, i) => (
              <div key={i} className="group">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section ref={howItWorksRef} className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{t.landing.howItWorks.title}</h2>
            <div className="h-1.5 w-20 bg-indigo-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { id: 1, title: t.landing.howItWorks.step1, desc: t.landing.howItWorks.step1Desc },
              { id: 2, title: t.landing.howItWorks.step2, desc: t.landing.howItWorks.step2Desc },
              { id: 3, title: t.landing.howItWorks.step3, desc: t.landing.howItWorks.step3Desc },
            ].map((step) => (
              <div key={step.id} className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
                <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center text-3xl font-black mb-10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  {step.id}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-lg">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const AuthModal: React.FC<{ lang: Language; onClose: () => void; onComplete: (u: string) => void }> = ({ lang, onClose, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // Login modundaysak e-postayı, Register modundaysak kullanıcı adını ilet
      const finalIdentity = authMode === 'login' ? email : (username || email);
      setTimeout(() => onComplete(finalIdentity), 800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden relative border border-slate-100">
        <button onClick={onClose} className="absolute top-8 right-8 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all z-20">
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-12 pt-20">
          <div className="text-center mb-12">
            <div className="inline-flex p-5 bg-indigo-50 rounded-3xl text-indigo-600 mb-8">
              {authMode === 'login' ? <LogIn className="w-10 h-10" /> : <UserPlus className="w-10 h-10" />}
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-3">
              {authMode === 'login' ? t.auth.welcomeBack : t.auth.joinCommunity}
            </h3>
            <p className="text-slate-500 font-medium">
              {authMode === 'login' ? 'Tekrar hoş geldin üretici!' : 'Aramıza katıl ve organik kitleni büyüt.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder={t.auth.username} 
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold transition-all text-slate-900" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
            )}
            
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="email" 
                placeholder={t.auth.email} 
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold transition-all text-slate-900" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="password" 
                placeholder={t.auth.password} 
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold transition-all text-slate-900" 
                required 
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-6 active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                authMode === 'login' ? t.auth.login : t.auth.register
              )}
              <span>{isLoading ? t.auth.verifying : isSuccess ? t.auth.success : ""}</span>
            </button>
          </form>

          <div className="mt-10 text-center">
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-indigo-600 font-black hover:underline transition-all text-sm uppercase tracking-wider"
            >
              {authMode === 'login' ? t.auth.noAccount : t.auth.hasAccount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
