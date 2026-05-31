"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

import api from "@/lib/api";

import { Question } from "@/types/question";

export default function QuizPage() {

  const router = useRouter();

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {

    try {

      const response =
        await api.get(
          "/api/questions/unattempted"
        );

      setQuestions(
        response.data
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  const submitAnswer = async (
    questionId: string,
    selectedOption: string
  ) => {

    try {

      setSubmitting(true);

      const response =
        await api.post(
          "/api/submissions",
          {
            question_id: questionId,
            selected_option:
              selectedOption,
          }
        );

      if (
        response.data.correct
      ) {

        alert(
          `✅ Correct! +${response.data.points_awarded} points`
        );

      } else {

        alert(
          "❌ Incorrect!"
        );
      }

      await fetchQuestions();

    } catch (error: any) {

      alert(
        error?.response?.data?.detail ||
        "Submission failed"
      );

    } finally {

      setSubmitting(false);
    }
  };

  if (loading) {

    return (

      <AuthGuard>

        <Navbar />

        <div className="max-w-6xl mx-auto px-4 py-12">

          <div className="border rounded-2xl p-10 text-center shadow-sm bg-white">

            <div className="text-6xl mb-4">
              🧠
            </div>

            <h2 className="text-3xl font-bold mb-2">
              Loading Quiz
            </h2>

            <p className="text-gray-500">
              Preparing your questions...
            </p>

          </div>

        </div>

      </AuthGuard>

    );
  }

  return (

    <AuthGuard>

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

          <div>

            <h1 className="text-4xl font-bold">
              Quiz Challenge
            </h1>

            <p className="text-gray-500 mt-2">
              Answer questions and climb the leaderboard.
            </p>

          </div>

          <button
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
            className="
              border
              px-5
              py-3
              rounded-lg
              hover:bg-gray-100
            "
          >
            Dashboard
          </button>

        </div>

        {/* Stats */}

        {questions.length > 0 && (

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

            <div className="border rounded-xl p-5 bg-blue-50">

              <p className="text-sm text-gray-500">
                Questions Remaining
              </p>

              <h2 className="text-3xl font-bold">
                {questions.length}
              </h2>

            </div>

            <div className="border rounded-xl p-5 bg-green-50">

              <p className="text-sm text-gray-500">
                Status
              </p>

              <h2 className="text-2xl font-bold">
                Active
              </h2>

            </div>

          </div>

        )}

        {/* Completed */}

        {questions.length === 0 && (

          <div className="border rounded-2xl p-10 text-center shadow-sm bg-green-50">

            <div className="text-6xl mb-4">
              🎉
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Quiz Completed
            </h2>

            <p className="text-gray-600 mb-6">
              You have answered all available questions.
            </p>

            <button
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="
                bg-black
                text-white
                px-6
                py-3
                rounded-lg
                hover:opacity-90
              "
            >
              Return To Dashboard
            </button>

          </div>

        )}

        {/* Questions */}

        {questions.map(
          (question) => (

            <div
              key={question.id}
              className="
                border
                rounded-2xl
                p-6
                mb-6
                shadow-sm
                bg-white
              "
            >

              <h2 className="text-xl md:text-2xl font-semibold mb-5">

                {question.question_text}

              </h2>

              <div className="grid gap-3">

                <button
                  disabled={submitting}
                  className="
                    border
                    p-4
                    rounded-xl
                    text-left
                    hover:bg-gray-50
                    hover:border-black
                    transition
                    disabled:opacity-50
                  "
                  onClick={() =>
                    submitAnswer(
                      question.id,
                      "A"
                    )
                  }
                >
                  <strong>A.</strong>{" "}
                  {question.option_a}
                </button>

                <button
                  disabled={submitting}
                  className="
                    border
                    p-4
                    rounded-xl
                    text-left
                    hover:bg-gray-50
                    hover:border-black
                    transition
                    disabled:opacity-50
                  "
                  onClick={() =>
                    submitAnswer(
                      question.id,
                      "B"
                    )
                  }
                >
                  <strong>B.</strong>{" "}
                  {question.option_b}
                </button>

                <button
                  disabled={submitting}
                  className="
                    border
                    p-4
                    rounded-xl
                    text-left
                    hover:bg-gray-50
                    hover:border-black
                    transition
                    disabled:opacity-50
                  "
                  onClick={() =>
                    submitAnswer(
                      question.id,
                      "C"
                    )
                  }
                >
                  <strong>C.</strong>{" "}
                  {question.option_c}
                </button>

                <button
                  disabled={submitting}
                  className="
                    border
                    p-4
                    rounded-xl
                    text-left
                    hover:bg-gray-50
                    hover:border-black
                    transition
                    disabled:opacity-50
                  "
                  onClick={() =>
                    submitAnswer(
                      question.id,
                      "D"
                    )
                  }
                >
                  <strong>D.</strong>{" "}
                  {question.option_d}
                </button>

              </div>

              <div className="mt-5 flex flex-wrap gap-2">

                <span
                  className={`
                    px-3 py-1 rounded-full text-sm
                    ${
                      question.difficulty === "EASY"
                        ? "bg-green-100 text-green-700"
                        : question.difficulty === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {question.difficulty}
                </span>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {question.points} pts
                </span>

              </div>

            </div>

          )
        )}

      </div>

    </AuthGuard>

  );
}