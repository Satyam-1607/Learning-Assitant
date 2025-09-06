
export enum ActionType {
  SUMMARY = 'SUMMARY',
  STRATEGY = 'STRATEGY',
  QUIZ = 'QUIZ',
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface StudyWeek {
  week: number;
  title: string;
  goals: string[];
}

export type StudyPlan = StudyWeek[];

export type ActionResult = string | StudyPlan | QuizQuestion[] | null;
