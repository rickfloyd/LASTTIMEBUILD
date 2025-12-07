// src/types/community.ts

export type IdeaVisibility = "public" | "private";

export type ScriptVisibility = "open" | "protected" | "invite-only";

export interface CommunityUser {
  uid: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  isVerifiedTrader: boolean; // gate for selling courses
  createdAt: number;
}

export interface Idea {
  id: string;
  authorId: string;
  title: string;
  content: string;
  symbol?: string;
  timeframe?: string;
  tags: string[];
  visibility: IdeaVisibility; // public / private
  directLinkToken?: string; // for private share links
  likeCount: number;
  commentCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface Script {
  id: string;
  authorId: string;
  name: string;
  description: string;
  // NEVER store whole raw source on the client if you don't want to
  sourceCode?: string; // only present for author in protected / invite-only
  compiledConfig?: unknown;
  visibility: ScriptVisibility; // open / protected / invite-only
  directLinkToken?: string;
  inviteList: string[]; // array of user IDs allowed for invite-only
  useCount: number;
  likeCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface Course {
  id: string;
  authorId: string;
  title: string;
  tagline: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  topics: string[];
  priceUsd: number;
  revenueSplit: {
    creator: number; // normally 0.9
    platform: number; // normally 0.1
  };
  isPublished: boolean;
  trailerVideoUrl?: string;
  coverImageUrl?: string;
  lessonCount: number;
  studentCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface LiveStream {
  id: string;
  hostId: string;
  title: string;
  description: string;
  symbolFocus?: string;
  isLive: boolean;
  // You can plug RTMP / YouTube / Twitch URLs here later
  streamUrl?: string;
  chatEnabled: boolean;
  concurrentViewers: number;
  createdAt: number;
  updatedAt: number;
}
