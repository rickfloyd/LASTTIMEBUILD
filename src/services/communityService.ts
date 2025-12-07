// src/services/communityService.ts
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Idea,
  Script,
  Course,
  LiveStream,
  IdeaVisibility,
  ScriptVisibility,
} from "../types/community";

// ---------- Helpers ----------
function nowMs() {
  return Date.now();
}

function generateDirectLinkToken(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ---------- IDEAS ----------

export async function createIdea(params: {
  authorId: string;
  title: string;
  content: string;
  visibility: IdeaVisibility;
  tags?: string[];
  symbol?: string;
  timeframe?: string;
}): Promise<Idea> {
  const colRef = collection(db, "ideas");
  const directLinkToken =
    params.visibility === "private" ? generateDirectLinkToken() : undefined;

  const docRef = await addDoc(colRef, {
    authorId: params.authorId,
    title: params.title,
    content: params.content,
    symbol: params.symbol ?? null,
    timeframe: params.timeframe ?? null,
    tags: params.tags ?? [],
    visibility: params.visibility,
    directLinkToken: directLinkToken ?? null,
    likeCount: 0,
    commentCount: 0,
    createdAt: nowMs(),
    updatedAt: nowMs(),
    createdAtServer: serverTimestamp(),
  });

  return {
    id: docRef.id,
    authorId: params.authorId,
    title: params.title,
    content: params.content,
    symbol: params.symbol,
    timeframe: params.timeframe,
    tags: params.tags ?? [],
    visibility: params.visibility,
    directLinkToken,
    likeCount: 0,
    commentCount: 0,
    createdAt: nowMs(),
    updatedAt: nowMs(),
  };
}

export async function listPublicIdeas(): Promise<Idea[]> {
  const colRef = collection(db, "ideas");
  const qRef = query(colRef, where("visibility", "==", "public"));
  const snap = await getDocs(qRef);

  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      authorId: data.authorId,
      title: data.title,
      content: data.content,
      symbol: data.symbol ?? undefined,
      timeframe: data.timeframe ?? undefined,
      tags: data.tags ?? [],
      visibility: data.visibility,
      directLinkToken: data.directLinkToken ?? undefined,
      likeCount: data.likeCount ?? 0,
      commentCount: data.commentCount ?? 0,
      createdAt: data.createdAt ?? nowMs(),
      updatedAt: data.updatedAt ?? nowMs(),
    } as Idea;
  });
}

// Load a private idea via direct-link token
export async function getIdeaByDirectToken(
  token: string
): Promise<Idea | null> {
  const colRef = collection(db, "ideas");
  const qRef = query(colRef, where("directLinkToken", "==", token));
  const snap = await getDocs(qRef);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data() as any;
  return {
    id: d.id,
    authorId: data.authorId,
    title: data.title,
    content: data.content,
    symbol: data.symbol ?? undefined,
    timeframe: data.timeframe ?? undefined,
    tags: data.tags ?? [],
    visibility: data.visibility,
    directLinkToken: data.directLinkToken ?? undefined,
    likeCount: data.likeCount ?? 0,
    commentCount: data.commentCount ?? 0,
    createdAt: data.createdAt ?? nowMs(),
    updatedAt: data.updatedAt ?? nowMs(),
  };
}

// ---------- SCRIPTS ----------

export async function publishScript(params: {
  authorId: string;
  name: string;
  description: string;
  visibility: ScriptVisibility;
  sourceCode?: string;
  inviteList?: string[];
}): Promise<Script> {
  const colRef = collection(db, "scripts");
  const directLinkToken =
    params.visibility === "invite-only" ? generateDirectLinkToken() : undefined;

  const docRef = await addDoc(colRef, {
    authorId: params.authorId,
    name: params.name,
    description: params.description,
    visibility: params.visibility,
    // Only attach sourceCode in Firestore if you want – you can also keep it off-chain
    sourceCode:
      params.visibility === "open" || params.visibility === "protected"
        ? params.sourceCode ?? null
        : null,
    inviteList: params.inviteList ?? [],
    directLinkToken: directLinkToken ?? null,
    compiledConfig: null,
    useCount: 0,
    likeCount: 0,
    createdAt: nowMs(),
    updatedAt: nowMs(),
    createdAtServer: serverTimestamp(),
  });

  return {
    id: docRef.id,
    authorId: params.authorId,
    name: params.name,
    description: params.description,
    visibility: params.visibility,
    sourceCode: params.sourceCode,
    inviteList: params.inviteList ?? [],
    directLinkToken,
    compiledConfig: null,
    useCount: 0,
    likeCount: 0,
    createdAt: nowMs(),
    updatedAt: nowMs(),
  };
}

export async function listPublicScripts(): Promise<Script[]> {
  const colRef = collection(db, "scripts");
  const qRef = query(colRef, where("visibility", "!=", "invite-only"));
  const snap = await getDocs(qRef);

  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      authorId: data.authorId,
      name: data.name,
      description: data.description,
      visibility: data.visibility,
      sourceCode: data.sourceCode ?? undefined,
      inviteList: data.inviteList ?? [],
      directLinkToken: data.directLinkToken ?? undefined,
      compiledConfig: data.compiledConfig ?? null,
      useCount: data.useCount ?? 0,
      likeCount: data.likeCount ?? 0,
      createdAt: data.createdAt ?? nowMs(),
      updatedAt: data.updatedAt ?? nowMs(),
    } as Script;
  });
}

// Invite-only access check
export async function getInviteOnlyScriptForUser(params: {
  scriptId: string;
  userId: string;
}): Promise<Script | null> {
  const ref = doc(db, "scripts", params.scriptId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as any;
  if (data.visibility !== "invite-only") return null;
  if (!Array.isArray(data.inviteList) || !data.inviteList.includes(params.userId)) {
    return null;
  }
  return {
    id: snap.id,
    authorId: data.authorId,
    name: data.name,
    description: data.description,
    visibility: data.visibility,
    sourceCode: data.sourceCode ?? undefined,
    inviteList: data.inviteList ?? [],
    directLinkToken: data.directLinkToken ?? undefined,
    compiledConfig: data.compiledConfig ?? null,
    useCount: data.useCount ?? 0,
    likeCount: data.likeCount ?? 0,
    createdAt: data.createdAt ?? nowMs(),
    updatedAt: data.updatedAt ?? nowMs(),
  };
}

// ---------- COURSES (90/10 split) ----------

export async function createCourseDraft(params: {
  authorId: string;
  title: string;
  tagline: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  priceUsd: number;
  topics?: string[];
}): Promise<Course> {
  const colRef = collection(db, "courses");
  const docRef = await addDoc(colRef, {
    authorId: params.authorId,
    title: params.title,
    tagline: params.tagline,
    description: params.description,
    level: params.level,
    topics: params.topics ?? [],
    priceUsd: params.priceUsd,
    revenueSplit: {
      creator: 0.9,
      platform: 0.1,
    },
    isPublished: false,
    trailerVideoUrl: null,
    coverImageUrl: null,
    lessonCount: 0,
    studentCount: 0,
    createdAt: nowMs(),
    updatedAt: nowMs(),
  });

  return {
    id: docRef.id,
    authorId: params.authorId,
    title: params.title,
    tagline: params.tagline,
    description: params.description,
    level: params.level,
    topics: params.topics ?? [],
    priceUsd: params.priceUsd,
    revenueSplit: { creator: 0.9, platform: 0.1 },
    isPublished: false,
    trailerVideoUrl: undefined,
    coverImageUrl: undefined,
    lessonCount: 0,
    studentCount: 0,
    createdAt: nowMs(),
    updatedAt: nowMs(),
  };
}

export async function publishCourse(courseId: string): Promise<void> {
  const ref = doc(db, "courses", courseId);
  await updateDoc(ref, {
    isPublished: true,
    updatedAt: nowMs(),
  });
}

export async function listPublishedCourses(): Promise<Course[]> {
  const colRef = collection(db, "courses");
  const qRef = query(colRef, where("isPublished", "==", true));
  const snap = await getDocs(qRef);

  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      authorId: data.authorId,
      title: data.title,
      tagline: data.tagline,
      description: data.description,
      level: data.level,
      topics: data.topics ?? [],
      priceUsd: data.priceUsd ?? 0,
      revenueSplit: data.revenueSplit ?? { creator: 0.9, platform: 0.1 },
      isPublished: data.isPublished ?? false,
      trailerVideoUrl: data.trailerVideoUrl ?? undefined,
      coverImageUrl: data.coverImageUrl ?? undefined,
      lessonCount: data.lessonCount ?? 0,
      studentCount: data.studentCount ?? 0,
      createdAt: data.createdAt ?? nowMs(),
      updatedAt: data.updatedAt ?? nowMs(),
    } as Course;
  });
}

// ---------- LIVE STREAMS (everyone can go live) ----------

export async function startLiveStream(params: {
  hostId: string;
  title: string;
  description: string;
  symbolFocus?: string;
}): Promise<LiveStream> {
  const colRef = collection(db, "streams");
  const docRef = await addDoc(colRef, {
    hostId: params.hostId,
    title: params.title,
    description: params.description,
    symbolFocus: params.symbolFocus ?? null,
    isLive: true,
    streamUrl: null, // plug real streaming infra later
    chatEnabled: true,
    concurrentViewers: 0,
    createdAt: nowMs(),
    updatedAt: nowMs(),
  });

  return {
    id: docRef.id,
    hostId: params.hostId,
    title: params.title,
    description: params.description,
    symbolFocus: params.symbolFocus,
    isLive: true,
    streamUrl: undefined,
    chatEnabled: true,
    concurrentViewers: 0,
    createdAt: nowMs(),
    updatedAt: nowMs(),
  };
}

export async function endLiveStream(streamId: string): Promise<void> {
  const ref = doc(db, "streams", streamId);
  await updateDoc(ref, {
    isLive: false,
    updatedAt: nowMs(),
  });
}

export async function listLiveStreams(): Promise<LiveStream[]> {
  const colRef = collection(db, "streams");
  const qRef = query(colRef, where("isLive", "==", true));
  const snap = await getDocs(qRef);

  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      hostId: data.hostId,
      title: data.title,
      description: data.description,
      symbolFocus: data.symbolFocus ?? undefined,
      isLive: data.isLive ?? false,
      streamUrl: data.streamUrl ?? undefined,
      chatEnabled: data.chatEnabled ?? true,
      concurrentViewers: data.concurrentViewers ?? 0,
      createdAt: data.createdAt ?? nowMs(),
      updatedAt: data.updatedAt ?? nowMs(),
    } as LiveStream;
  });
}
