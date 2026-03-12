/**
 * Shared TypeScript types for EduForge
 */

export type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

export type ChallengeType = 'quick_fire' | 'deep_dive' | 'boss' | 'daily' | 'duel';

export type QuestionType = 'multiple_choice' | 'short_answer' | 'code' | 'concept_match';

export interface Question {
  id: string;
  type: QuestionType;
  bloom_level: BloomLevel;
  difficulty: number; // 1-5
  topic: string;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  estimated_seconds: number;
  starter_code?: string;
  test_cases?: { input: string; expected: string }[];
  constraints?: string[];
}

export interface SkillState {
  topic: string;
  masteryProbability: number;
  pLearn: number;
  pGuess: number;
  pSlip: number;
  attemptCount: number;
}

export interface StudentProfile {
  id: string;
  username: string;
  xp: number;
  level: number;
  eloRating: number;
  streakCount: number;
  lastActive: string;
  skillStates: SkillState[];
}

export interface Achievement {
  id: string;
  badgeId: string;
  earnedAt: string;
  citationText: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  xp: number;
  level: number;
}

export interface XPUpdateEvent {
  studentId: string;
  newXP: number;
  delta: number;
}

export interface LevelUpEvent {
  studentId: string;
  newLevel: number;
  badgesUnlocked: string[];
}
