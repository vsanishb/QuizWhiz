export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type Option = "A" | "B" | "C" | "D";

export interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  difficulty: Difficulty;
  points: number;
}

export interface AdminQuestion extends Question {
  correct_option: Option;
}