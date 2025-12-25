
import React, { useState } from 'react';
import { Instagram, Play, Youtube, Twitter, Search, ChevronRight, Award, Trophy, Filter, Star, ExternalLink } from 'lucide-react';
import { PLATFORM_CONFIG } from '../constants';
import { translations, Language } from '../translations';

const MOCK_FEED = [
  { id: '1', username: 'TravelVlogs_TR', platform: 'instagram', boostScore: 950, reputation: 99, avatar: 'https://picsum.photos/seed/p1/100', isVip: true, category: 'Travel' },
  { id: '2', username: 'TechReview_Hub', platform: 'youtube', boostScore: 820, reputation: 95, avatar: 'https://picsum.photos/seed/p2/100', isVip: false, category: 'Tech' },
  { id: '3', username: 'FashionDaily', platform: 'tiktok', boostScore: 710, reputation: 92, avatar: 'https://picsum.photos/seed/p3/100', isVip: true, category: 'Fashion' },
  { id: '4', username: 'CryptoTalk', platform: 'twitter', boostScore: 650, reputation: 98, avatar: 'https://picsum.photos/seed/p4/100', isVip: false, category: 'Finance' },
  { id: '5', username: 'ArtGallery_01', platform: 'instagram', boostScore: 540, reputation: 94, avatar: 'https://picsum.photos/seed/p5/100', isVip: true, category: 'Art' },
];

const LEADERBOARD = [
  { id: 1, name: 'GrowthHacker_X', growth: '+2.4K', avatar: 'https://picsum.photos/seed/l1/100' },
  { id: 2, name: 'CreatorStudio', growth: '+1.8K', avatar: 'https://picsum.photos/seed/l2/100' },
  { id: 3, name: 'SocialQueen', growth: '+1.5K', avatar: 'https://picsum.photos/seed/l3/100' },
];

interface ExploreFeedProps {
  lang: Language;
}

const ExploreFeed: React.FC<ExploreFeedProps> = ({ lang }) => {
  const t = translations[lang];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Travel', 'Tech', 'Fashion', 'Finance', 'Art', 'Gaming'];

  const getIcon = (platform: string) => {
    switch(platform) {
      case 'instagram': return Instagram;
      case 'youtube': return Youtube;
      case 'twitter': return Twitter;
      default: return Play;
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{t.explore.title}</h1>
          <p className="text-slate-500 text-lg font-medium">{t.explore.subtitle}</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder={t.explore.searchPlaceholder}
            className="pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[20px] w-full md:w-80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900 shadow-sm"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' 
                    : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_FEED.filter(item => selectedCategory === 'All' || item.category === selectedCategory).map((item) => {
              const PlatformIcon = getIcon(item.platform);
              return (
                <div key={item.id} className="bg-white rounded-[40px] p-8 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
                  <div className="relative mb-8 text-center">
                    <div className="w-24 h-24 mx-auto relative">
                      <img src={item.avatar} className="w-full h-full rounded-[35px] border-4 border-slate-50 group-hover:border-indigo-100 transition-colors object-cover shadow-lg" alt={item.username} />
                      {item.isVip && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white p-2 rounded-2xl shadow-xl border-2 border-white">
                          <Trophy className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center mb-8">
                    <h3 className="font-black text-xl text-slate-900 group-hover:text-indigo-600 transition-colors mb-1 truncate">{item.username}</h3>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.category}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${(PLATFORM_CONFIG as any)[item.platform].color}`}>
                        {(PLATFORM_CONFIG as any)[item.platform].label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[28px] mb-8">
                    <div className="text-center flex-1 border-r border-slate-200">
                      <div className="text-lg font-black text-slate-900">{item.boostScore}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-lg font-black text-emerald-500">{item.reputation}%</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rep</div>
                    </div>
                  </div>

                  <button 
                    className="w-full py-4.5 bg-slate-900 text-white rounded-[24px] font-black text-sm hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200 flex items-center justify-center gap-2 group/btn"
                  >
                    {t.explore.followEarn}
                    <PlatformIcon className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8 flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-500" />
              Top Creators
            </h3>
            <div className="space-y-6">
              {LEADERBOARD.map((leader) => (
                <div key={leader.id} className="flex items-center gap-4 group cursor-pointer">
                  <div className="relative">
                    <img src={leader.avatar} className="w-12 h-12 rounded-2xl border-2 border-slate-50 object-cover" alt={leader.name} />
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-slate-900 text-white text-[10px] font-black rounded-lg flex items-center justify-center">
                      {leader.id}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{leader.name}</div>
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{leader.growth} Boost</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 p-12 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <Award className="w-48 h-48" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">VIP Access</h3>
            <p className="text-slate-400 font-medium mb-10 leading-relaxed">
              Get 1.5x more visibility and exclusive verified badge.
            </p>
            <button className="w-full py-4.5 bg-indigo-600 text-white rounded-[24px] font-black text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreFeed;
