export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface LLDQuestion {
  id: string;
  title: string;
  difficulty: QuestionDifficulty;
  category: string;
  description: string;
  requirements: string[];
  constraints: string[];
  hints: string[];
  expectedConcepts: string[];
}
