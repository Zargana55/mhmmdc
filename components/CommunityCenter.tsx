
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, HelpCircle, Shield, CreditCard, PlayCircle, Users, ExternalLink, PlusSquare } from 'lucide-react';
import { Language, translations } from '../translations';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onToggle }) => (
  <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden mb-3 transition-all">
    <button 
      onClick={onToggle}
      className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
    >
      <span className="font-bold text-slate-800">{question}</span>
      {isOpen ? <ChevronUp className="w-5 h-5 text-indigo-500" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
    </button>
    {isOpen && (
      <div className="px-6 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
        <p className="text-slate-600 leading-relaxed text-sm">{answer}</p>
      </div>
    )}
  </div>
);

const CommunityCenter: React.FC<{ lang: Language }> = ({ lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'basics' | 'credits' | 'safety'>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const t = translations[lang];

  const FAQ_DATA = [
    { 
      category: 'basics', 
      q: lang === 'tr' ? "CreatorBoost nasıl çalışır?" : "How does CreatorBoost work?", 
      a: lang === 'tr' ? "CreatorBoost, gerçek içerik üreticilerini birbirine bağlayan organik bir büyüme pazar yeridir. Görevleri tamamlayarak kredi kazanır, bu kredileri kendi profilinizi öne çıkarmak için kullanırsınız." : "CreatorBoost is an organic growth marketplace that connects real content creators. You earn credits by completing tasks and spend them to boost your own profile."
    },
    { 
      category: 'credits', 
      q: lang === 'tr' ? "Kredilerim ne zaman yatar?" : "When will I receive my credits?", 
      a: lang === 'tr' ? "Doğrulanan her görevden sonra ödülün %20'si anında, %80'i ise takibi bırakmadığınızdan emin olmak için 48-72 saat sonra hesabınıza geçer." : "After a verified task, 20% of the reward is paid immediately, and the remaining 80% is released after 48-72 hours to ensure the follow is permanent."
    },
    { 
      category: 'safety', 
      q: lang === 'tr' ? "Hesabım güvende mi?" : "Is my account safe?", 
      a: lang === 'tr' ? "Evet! Asla şifrenizi istemiyoruz. Tüm işlemler halka açık profil bağlantıları üzerinden ve gerçek kişilerle yapılır. Bot kullanımı yasaktır." : "Yes! We never ask for your password. All interactions happen via public profile links with real people. The use of bots is strictly prohibited."
    },
    { 
      category: 'basics', 
      q: lang === 'tr' ? "VIP Üyelik nedir?" : "What is VIP Membership?", 
      a: lang === 'tr' ? "VIP üyeler, öne çıkarma işlemlerinde 1.5x daha fazla görünürlük alır, daha az komisyon öder ve itibar puanları daha hızlı artar." : "VIP members get 1.5x more visibility on boosts, pay lower commissions, and their reputation score increases faster."
    }
  ];

  const FORUM_POSTS = [
    { id: 1, author: "TravelerJack", title: lang === 'tr' ? "Instagram'da daha fazla etkileşim için ipuçları" : "Tips for more engagement on Instagram", views: 1240, replies: 24, time: "2h ago", avatar: "https://picsum.photos/seed/p1/100" },
    { id: 2, author: "TechTalks", title: lang === 'tr' ? "YouTube şort videoları için en iyi saatler?" : "Best times for YouTube Shorts?", views: 850, replies: 15, time: "5h ago", avatar: "https://picsum.photos/seed/p2/100" },
    { id: 3, author: "GrowthMaster", title: lang === 'tr' ? "CreatorBoost'ta itibar puanı nasıl korunur?" : "How to maintain reputation on CreatorBoost?", views: 3200, replies: 89, time: "1d ago", avatar: "https://picsum.photos/seed/p3/100" },
  ];

  const filteredFaqs = FAQ_DATA.filter(faq => 
    (activeCategory === 'all' || faq.category === activeCategory) &&
    (faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Search Section */}
      <div className="relative bg-white rounded-[40px] p-10 md:p-14 border border-slate-100 shadow-sm overflow-hidden mb-12">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12">
          <HelpCircle className="w-64 h-64" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter text-slate-900">{t.community.title}</h1>
          <p className="text-slate-500 text-lg mb-10 font-medium">{t.community.subtitle}</p>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder={t.common.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4.5 bg-slate-50 text-slate-900 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white border border-slate-200 transition-all text-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Forum Section - Resimdeki Tasarım Uygulandı */}
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-8 px-2">
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <MessageCircle className="w-9 h-9 text-indigo-500" />
              {t.community.forumTitle}
            </h2>
            <button className="flex items-center gap-2.5 px-6 py-3 bg-[#eef2ff] text-indigo-600 rounded-2xl font-bold hover:bg-indigo-100 transition-all shadow-sm active:scale-95">
              <PlusSquare className="w-5 h-5" />
              {t.common.ask}
            </button>
          </div>

          <div className="space-y-5">
            {FORUM_POSTS.map((post) => (
              <div key={post.id} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <img src={post.avatar} className="w-16 h-16 rounded-full border-2 border-slate-50 object-cover" alt={post.author} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 leading-tight">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                      <span className="text-slate-500">{post.author}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>{post.time}</span>
                    </div>
                  </div>

                  <div className="flex gap-8 shrink-0 ml-4 hidden sm:flex">
                    <div className="text-center">
                      <div className="text-lg font-black text-slate-700 leading-none mb-1.5">{post.replies}</div>
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.community.stats.replies}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-black text-slate-700 leading-none mb-1.5">{post.views}</div>
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.community.stats.views}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[40px] text-slate-500 font-black text-lg hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-3 mt-4 group">
              {t.common.viewAll}
              <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-8 px-2">
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <HelpCircle className="w-9 h-9 text-indigo-500" />
              {t.community.faqTitle}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { id: 'basics', label: t.community.categories.basics, icon: PlayCircle },
              { id: 'credits', label: t.community.categories.credits, icon: CreditCard },
              { id: 'safety', label: t.community.categories.safety, icon: Shield },
              { id: 'all', label: t.community.categories.all, icon: Users },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`p-5 rounded-3xl border-2 transition-all flex items-center gap-3 ${
                  activeCategory === cat.id 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                }`}
              >
                <cat.icon className={`w-5 h-5 ${activeCategory === cat.id ? 'text-white' : 'text-indigo-500'}`} />
                <span className="font-bold text-sm">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredFaqs.map((faq, i) => (
              <FAQItem 
                key={i} 
                question={faq.q} 
                answer={faq.a} 
                isOpen={openFaqIndex === i} 
                onToggle={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCenter;
