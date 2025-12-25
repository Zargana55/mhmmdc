
export enum UserRole {
  USER = 'USER',
  VIP = 'VIP',
  ADMIN = 'ADMIN'
}

export interface UserProfile {
  id: string;
  username: string;
  credits: number;
  reputation: number; // 0 to 100
  role: UserRole;
  tasksCompleted: number;
  tasksPosted: number;
  isBanned: boolean;
  avatar: string;
}

export enum TaskStatus {
  AVAILABLE = 'AVAILABLE',
  STAKED = 'STAKED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  PENDING_PAYOUT = 'PENDING_PAYOUT',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export interface Task {
  id: string;
  creatorId: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  targetUsername: string;
  reward: number;
  stakeRequired: number;
  description: string;
  status: TaskStatus;
}

export interface ExploreItem {
  id: string;
  username: string;
  platform: string;
  boostScore: number;
  avatar: string;
  reputation: number;
  createdAt: string;
}

export interface CreditFormula {
  baseReward: number;
  stakeRatio: number; // e.g. 0.5 for 50%
  immediatePayoutRatio: number; // e.g. 0.2 for 20%
}
