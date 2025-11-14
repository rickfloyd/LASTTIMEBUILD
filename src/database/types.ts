import { Document } from 'mongoose';

// User interfaces
export interface IUserProfile {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  birthDate?: Date;
  phone?: string;
}

export interface IUserPreferences {
  theme: 'dark' | 'light' | 'cyber';
  notifications: {
    email: boolean;
    push: boolean;
    trading: boolean;
    mining: boolean;
  };
  privacy: {
    showProfile: boolean;
    showTrades: boolean;
    showMining: boolean;
  };
}

export interface IUserVerification {
  email: boolean;
  phone: boolean;
  age: boolean;
  kyc: boolean;
}

export interface IUserSubscription {
  plan: 'free' | 'premium' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  expiresAt?: Date;
  features: string[];
}

export interface IUserGaming {
  level: number;
  experience: number;
  achievements: string[];
  inventory: Array<{
    itemId: string;
    quantity: number;
    acquiredAt: Date;
  }>;
  vaultAccess: boolean;
}

export interface IUserTrading {
  experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  portfolioValue: number;
  totalTrades: number;
  successRate: number;
}

export interface IUserMining {
  hashRate: number;
  powerConsumption: number;
  electricityCost: number;
  hardware: string[];
  pools: string[];
  totalEarnings: number;
}

export interface IUserActivity {
  lastLogin?: Date;
  lastActive?: Date;
  loginCount: number;
  ipAddresses: string[];
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profile: IUserProfile;
  preferences: IUserPreferences;
  verification: IUserVerification;
  subscription: IUserSubscription;
  gaming: IUserGaming;
  trading: IUserTrading;
  mining: IUserMining;
  activity: IUserActivity;
  status: 'active' | 'suspended' | 'banned';
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Chat interfaces
export interface IChatAttachment {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface IChatMessage extends Document {
  roomId: string;
  userId: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  attachments: IChatAttachment[];
  editedAt?: Date;
  isDeleted: boolean;
  reactions: Array<{
    userId: string;
    emoji: string;
    createdAt: Date;
  }>;
  replyTo?: string;
  isEncrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatRoomMember {
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  lastRead?: Date;
  isMuted: boolean;
}

export interface IChatRoom extends Document {
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  category: 'general' | 'trading' | 'mining' | 'gaming' | 'support';
  members: IChatRoomMember[];
  settings: {
    maxMembers: number;
    allowFiles: boolean;
    allowImages: boolean;
    moderated: boolean;
    encrypted: boolean;
  };
  metadata: {
    messageCount: number;
    lastActivity?: Date;
    tags: string[];
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Trading interfaces
export interface ITradingActivity extends Document {
  userId: string;
  platform: 'quantum-charts' | 'external';
  action: 'buy' | 'sell' | 'hold' | 'analysis';
  asset: {
    symbol: string;
    name: string;
    type: 'stock' | 'crypto' | 'forex' | 'commodity';
    exchange: string;
  };
  quantity?: number;
  price?: number;
  value?: number;
  fees?: number;
  profit?: number;
  metadata: {
    strategy?: string;
    confidence?: number;
    riskLevel?: 'low' | 'medium' | 'high';
    notes?: string;
    tags?: string[];
  };
  executedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mining interfaces
export interface IMiningActivity extends Document {
  userId: string;
  action: 'start' | 'stop' | 'optimize' | 'payout';
  coin: {
    symbol: string;
    name: string;
    algorithm: string;
  };
  pool?: {
    name: string;
    url: string;
    fee: number;
  };
  hardware: {
    name: string;
    hashRate: number;
    powerDraw: number;
  };
  performance: {
    actualHashRate?: number;
    temperature?: number;
    efficiency?: number;
    shares?: {
      accepted: number;
      rejected: number;
      stale: number;
    };
  };
  earnings?: {
    amount: number;
    currency: string;
    usdValue: number;
  };
  costs?: {
    electricity: number;
    maintenance: number;
  };
  duration?: number; // minutes
  metadata: {
    notes?: string;
    optimization?: string;
    issues?: string[];
  };
  executedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Session interfaces
export interface ISessionDevice {
  type: string;
  browser?: string;
  os?: string;
  ip?: string;
}

export interface ISession extends Document {
  userId: string;
  token: string;
  device: ISessionDevice;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}