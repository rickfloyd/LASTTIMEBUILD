export type EduLesson = {
  id: string;
  title: string;
  level: "Starter" | "Core" | "Advanced";
  topic: "Basics" | "Risks" | "Scams" | "Wallets" | "Spending" | "Tax";
  minutes: number;
  bullets: string[];
  updatedAt: number;
  active: boolean;
};

export type EduQuiz = {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  updatedAt: number;
  active: boolean;
};

export type EduProgress = {
  id: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  updatedAt: number;
};
