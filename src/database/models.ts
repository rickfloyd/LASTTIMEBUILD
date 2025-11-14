import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  IUser,
  IChatMessage,
  IChatRoom,
  ITradingActivity,
  IMiningActivity,
  ISession
} from './types';

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    location: String,
    website: String,
    birthDate: Date,
    phone: String
  },
  preferences: {
    theme: {
      type: String,
      enum: ['dark', 'light', 'cyber'],
      default: 'cyber'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      trading: { type: Boolean, default: true },
      mining: { type: Boolean, default: true }
    },
    privacy: {
      showProfile: { type: Boolean, default: true },
      showTrades: { type: Boolean, default: false },
      showMining: { type: Boolean, default: false }
    }
  },
  verification: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    age: { type: Boolean, default: false },
    kyc: { type: Boolean, default: false }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active'
    },
    expiresAt: Date,
    features: [String]
  },
  gaming: {
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    achievements: [String],
    inventory: [{
      itemId: String,
      quantity: Number,
      acquiredAt: Date
    }],
    vaultAccess: { type: Boolean, default: false }
  },
  trading: {
    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    },
    riskTolerance: {
      type: String,
      enum: ['conservative', 'moderate', 'aggressive'],
      default: 'moderate'
    },
    portfolioValue: { type: Number, default: 0 },
    totalTrades: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 }
  },
  mining: {
    hashRate: { type: Number, default: 0 },
    powerConsumption: { type: Number, default: 0 },
    electricityCost: { type: Number, default: 0.12 },
    hardware: [String],
    pools: [String],
    totalEarnings: { type: Number, default: 0 }
  },
  activity: {
    lastLogin: Date,
    lastActive: Date,
    loginCount: { type: Number, default: 0 },
    ipAddresses: [String]
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderUsername: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  encrypted: {
    type: Boolean,
    default: true
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    mimeType: String
  }],
  reactions: [{
    userId: mongoose.Schema.Types.ObjectId,
    emoji: String,
    timestamp: Date
  }],
  edited: {
    isEdited: { type: Boolean, default: false },
    editedAt: Date,
    originalContent: String
  },
  deleted: {
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: mongoose.Schema.Types.ObjectId
  }
}, {
  timestamps: true
});

// Chat Room Schema
const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  type: {
    type: String,
    enum: ['public', 'private', 'direct'],
    default: 'public'
  },
  platform: {
    type: String,
    enum: ['gaming', 'trading', 'mining', 'general'],
    required: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastRead: Date
  }],
  settings: {
    maxParticipants: { type: Number, default: 100 },
    isEncrypted: { type: Boolean, default: true },
    allowFiles: { type: Boolean, default: true },
    moderated: { type: Boolean, default: false }
  },
  activity: {
    lastMessage: Date,
    messageCount: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Trading Activity Schema
const tradingActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['buy', 'sell', 'short', 'cover'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  totalValue: {
    type: Number,
    required: true
  },
  fees: {
    type: Number,
    default: 0
  },
  platform: {
    type: String,
    enum: ['quantum-charts', 'external'],
    default: 'quantum-charts'
  },
  status: {
    type: String,
    enum: ['pending', 'executed', 'cancelled', 'failed'],
    default: 'pending'
  },
  executedAt: Date,
  notes: String
}, {
  timestamps: true
});

// Mining Activity Schema
const miningActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coin: {
    type: String,
    required: true
  },
  hashRate: {
    type: Number,
    required: true
  },
  power: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  earnings: {
    type: Number,
    default: 0
  },
  costs: {
    electricity: Number,
    pool: Number,
    maintenance: Number
  },
  pool: String,
  hardware: String,
  profit: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Session Schema for authentication
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  device: {
    type: String,
    browser: String,
    os: String,
    ip: String
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-delete expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create models with proper typing
export const User = mongoose.model<IUser>('User', userSchema);
export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
export const ChatRoom = mongoose.model<IChatRoom>('ChatRoom', chatRoomSchema);
export const TradingActivity = mongoose.model<ITradingActivity>('TradingActivity', tradingActivitySchema);
export const MiningActivity = mongoose.model<IMiningActivity>('MiningActivity', miningActivitySchema);
export const Session = mongoose.model<ISession>('Session', sessionSchema);

// Database connection utility
export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(uri?: string): Promise<void> {
    if (this.isConnected) {
      console.log('Database already connected');
      return;
    }

    try {
      const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/quantum-platforms';
      
      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      console.log('✅ Database connected successfully');

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ Database connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ Database disconnected');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('❌ Database disconnection error:', error);
      throw error;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export default DatabaseConnection;