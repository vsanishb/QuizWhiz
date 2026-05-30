export interface SubmitAnswerRequest {
  question_id: string;
  selected_option: string;
}

export interface SubmissionResponse {
  correct: boolean;
  points_awarded: number;
  total_score: number;
}