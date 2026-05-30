export interface CreateQuestionRequest {
  question_text: string;

  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;

  correct_option: string;

  difficulty: string;

  points: number;
}