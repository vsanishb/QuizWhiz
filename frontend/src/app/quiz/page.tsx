"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

import api from "@/lib/api";

import { Question } from "@/types/question";

interface FeedbackState {
  show: boolean;
  isCorrect: boolean;
  pointsAwarded: number;
}

export default function QuizPage() {
  const router = useRouter();

  // Core Data States
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Status States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Custom Modal Feedback State
  const [feedback, setFeedback] = useState<FeedbackState>({
    show: false,
    isCorrect: false,
    pointsAwarded: 0,
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/questions/unattempted");
      setQuestions(response.data);
      setCurrentIndex(0);
      setSelectedOption(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption || questions.length === 0) return;

    const currentQuestion = questions[currentIndex];

    try {
      setSubmitting(true);

      const response = await api.post("/api/submissions", {
        question_id: currentQuestion.id,
        selected_option: selectedOption,
      });

      setFeedback({
        show: true,
        isCorrect: response.data.correct,
        pointsAwarded: response.data.points_awarded || 0,
      });

    } catch (error: any) {
      alert(error?.response?.data?.detail || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setFeedback({ show: false, isCorrect: false, pointsAwarded: 0 });
    setSelectedOption(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push("/leaderboard");
    }
  };

  const isLastQuestion = currentIndex === questions.length - 1;
  const hasQuestions = questions.length > 0;
  const currentQuestion = questions[currentIndex];

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden">
        <Navbar />

        {/* Main Content Area - Locked into remaining viewport space */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-center overflow-hidden">
          
          {loading ? (
            <div className="border border-gray-200 rounded-2xl p-12 text-center bg-white shadow-sm my-auto max-w-md mx-auto w-full">
              <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-1">Loading Quiz</h2>
              <p className="text-gray-500 text-sm">Preparing your questions...</p>
            </div>
          ) : hasQuestions && currentQuestion ? (
            <div className="w-full flex flex-col justify-between h-full max-h-[75vh]">
              
              {/* Header Context */}
              <div className="flex justify-between items-center mb-5 shrink-0">
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-wider text-gray-900">
                    Quiz Challenge
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                    Test your knowledge and secure your rank on the leaderboard.
                  </p>
                </div>
              </div>

              {/* Metric Metrics & Progress Tracker */}
              <div className="mb-5 shrink-0">
                <div className="flex justify-between items-end mb-2 text-xs font-bold uppercase tracking-wider text-gray-600">
                  <span>
                    Question <strong className="text-gray-900 font-extrabold text-sm">{currentIndex + 1}</strong> of {questions.length}
                  </span>
                  <span className="bg-gray-900 text-white px-3 py-1 rounded-md font-mono text-xs">
                    VALUE: {currentQuestion.points} PTS
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gray-900 h-2 transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Core Quiz Workbox - Scrollbar hidden beautifully */}
              <div className="flex-1 min-h-0 border-2 border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm bg-white flex flex-col justify-between overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="shrink-0 mb-5">
                  <div className="mb-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${
                        currentQuestion.difficulty === "EASY"
                          ? "bg-green-50 border-green-300 text-green-800"
                          : "bg-yellow-50 border-yellow-300 text-yellow-800"
                          ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                          : "bg-red-50 border-red-300 text-red-800"
                      }`}
                    >
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-snug">
                    {currentQuestion.question_text}
                  </h2>
                </div>

                {/* Option Selections */}
                <div className="grid gap-3 my-auto">
                  {[
                    { key: "A", text: currentQuestion.option_a },
                    { key: "B", text: currentQuestion.option_b },
                    { key: "C", text: currentQuestion.option_c },
                    { key: "D", text: currentQuestion.option_d },
                  ].map((opt) => {
                    const isSelected = selectedOption === opt.key;
                    return (
                      <button
                        key={opt.key}
                        disabled={submitting}
                        onClick={() => setSelectedOption(opt.key)}
                        className={`w-full border-2 p-4 rounded-xl text-left transition duration-150 flex items-center gap-4 text-sm font-semibold disabled:opacity-50 ${
                          isSelected
                            ? "border-gray-900 bg-gray-50 ring-1 ring-gray-990"
                            : "border-gray-200 hover:bg-gray-50 hover:border-gray-400"
                        }`}
                      >
                        <span
                          className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-mono text-xs font-bold border transition-colors ${
                            isSelected
                              ? "bg-gray-900 border-gray-900 text-white"
                              : "bg-white border-gray-300 text-gray-700"
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span className="text-gray-800 line-clamp-2">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end shrink-0">
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedOption || submitting}
                    className="bg-gray-900 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center min-w-[160px]"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Submit Answer"
                    )}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Premium Standout Completed UI */
            <div className="border-2 border-gray-900 rounded-3xl p-10 md:p-12 text-center bg-white shadow-xl my-auto max-w-xl mx-auto w-full">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
                <div className="w-3 h-3 bg-gray-950 rounded-full animate-ping" />
              </div>
              
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 rounded-full border border-gray-300 text-gray-600">
                Status: Completed
              </span>
              
              <h2 className="text-3xl font-black tracking-tight text-gray-900 mt-4 mb-3">
                Quiz Finished Successfully
              </h2>
              
              <p className="text-gray-600 text-sm mb-8 max-w-sm mx-auto font-medium leading-relaxed">
                All assigned challenge blocks have been resolved. Let's see how you place among other competitors.
              </p>
              
              <button
                onClick={() => router.push("/leaderboard")}
                className="bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-black transition text-xs font-bold uppercase tracking-widest shadow-md w-full sm:w-auto"
              >
                Let's See How You Did
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Structured Evaluation Modal Overlay */}
      {feedback.show && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl border-2 border-gray-200 text-center transform transition-all animate-in scale-in-95 duration-150">
            
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border-2 font-mono text-lg font-black ${
              feedback.isCorrect 
                ? "bg-green-50 border-green-500 text-green-600" 
                : "bg-red-50 border-red-500 text-red-600"
            }`}>
              {feedback.isCorrect ? "Y" : "N"}
            </div>

            <h3 className="text-xl font-black tracking-tight mb-2 text-gray-900 uppercase">
              {feedback.isCorrect ? "Correct Answer" : "Incorrect Answer"}
            </h3>

            <p className="text-sm text-gray-600 mb-6 font-medium px-2 leading-relaxed">
              {isLastQuestion ? (
                "You have successfully finished your quiz, let's see how you did!"
              ) : feedback.isCorrect ? (
                `Action successful. You have been awarded +${feedback.pointsAwarded} points to your total profile score.`
              ) : (
                "The response recorded was invalid. Proceed forward to evaluate the remaining items."
              )}
            </p>

            <button
              onClick={handleNextQuestion}
              className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition focus:outline-none shadow-sm"
            >
              {isLastQuestion ? "Let's See How You Did" : "Next Question"}
            </button>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}