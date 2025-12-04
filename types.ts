export enum AppView {
  DASHBOARD = 'DASHBOARD',
  QUESTS = 'QUESTS',
  COACH = 'COACH',
  FOCUS = 'FOCUS',
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  completed: boolean;
  xp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface UserState {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  moodHistory: { date: string; score: number }[];
  streak: number;
}

export interface MoodLog {
  date: string;
  score: number; // 1-10
  note?: string;
}

// For Gemini JSON responses
export interface GeneratedQuest {
  title: string;
  description: string;
  difficulty: string;
  xp: number;
}