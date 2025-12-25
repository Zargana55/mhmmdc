
export const FORMULAS = {
  calculateRankingScore: (boost: number, isVip: boolean, reputation: number, ageInHours: number, risk: number) => {
    const vipMult = isVip ? 1.5 : 1.0;
    const repMult = Math.max(0.1, reputation / 100);
    const gravity = 1.5;
    return (boost * vipMult * repMult) / Math.pow(ageInHours + 2, gravity) - (risk * 50);
  },
  
  payoutSplit: {
    immediate: 0.2, // 20%
    delayed: 0.8,   // 80% (24-72h)
  },
  
  stakeRequirement: 0.5, // 50% of task reward locked from worker
  
  penalties: {
    falseProof: { burnStake: true, reputationHit: 20, cooldownHours: 24 },
    unfollowDetected: { reputationHit: 50, banEscalation: 1 },
  }
};

export const PLATFORM_CONFIG = {
  instagram: { color: 'text-pink-600', bg: 'bg-pink-50', label: 'Instagram' },
  tiktok: { color: 'text-slate-900', bg: 'bg-slate-100', label: 'TikTok' },
  youtube: { color: 'text-red-600', bg: 'bg-red-50', label: 'YouTube' },
  twitter: { color: 'text-blue-400', bg: 'bg-blue-50', label: 'Twitter' },
};
