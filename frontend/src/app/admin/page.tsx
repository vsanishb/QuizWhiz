"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

import { Question } from "@/types/question";

export default function AdminPage() {

  const router = useRouter();

  const [authorized, setAuthorized] =
    useState(false);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      question_text: "",

      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",

      correct_option: "A",

      difficulty: "EASY",

      points: 5,
    });

  useEffect(() => {
    verifyAdmin();
  }, []);

  const verifyAdmin = async () => {

    try {

      const response =
        await api.get(
          "/api/auth/me"
        );

      if (
        response.data.role !==
        "ADMIN"
      ) {

        alert(
          "Admin access required"
        );

        router.replace(
          "/dashboard"
        );

        return;
      }

      setAuthorized(true);

      await fetchQuestions();

    } catch {

      router.replace(
        "/login"
      );
    }
  };

  const fetchQuestions = async () => {

    try {

      const response =
        await api.get(
          "/api/admin/questions"
        );

      setQuestions(
        response.data
      );

    } catch (error) {

      console.error(error);
    }
  };

  const createQuestion =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        setLoading(true);

        await api.post(
          "/api/admin/questions",
          form
        );

        alert(
          "Question created successfully"
        );

        setForm({
          question_text: "",

          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",

          correct_option: "A",

          difficulty: "EASY",

          points: 5,
        });

        await fetchQuestions();

      } catch (error: any) {

        alert(
          error?.response?.data?.detail ||
          "Creation failed"
        );

      } finally {

        setLoading(false);
      }
    };

  const deleteQuestion =
    async (
      id: string
    ) => {

      if (
        !confirm(
          "Delete question?"
        )
      ) {
        return;
      }

      try {

        await api.delete(
          `/api/admin/questions/${id}`
        );

        alert(
          "Question deleted"
        );

        await fetchQuestions();

      } catch (error: any) {

        alert(
          error?.response?.data?.detail ||
          "Delete failed"
        );
      }
    };

  if (!authorized) {

    return (
      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <div className="text-4xl mb-3">
            🔒
          </div>

          <p className="text-lg">
            Verifying admin access...
          </p>

        </div>

      </div>
    );
  }

  return (
    <AuthGuard>

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage quiz questions and platform content.
          </p>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <div className="border rounded-xl p-5 bg-blue-50">

            <p className="text-sm text-gray-500">
              Total Questions
            </p>

            <h2 className="text-3xl font-bold">
              {questions.length}
            </h2>

          </div>

          <div className="border rounded-xl p-5 bg-green-50">

            <p className="text-sm text-gray-500">
              Easy
            </p>

            <h2 className="text-3xl font-bold">
              {
                questions.filter(
                  q =>
                    q.difficulty ===
                    "EASY"
                ).length
              }
            </h2>

          </div>

          <div className="border rounded-xl p-5 bg-yellow-50">

            <p className="text-sm text-gray-500">
              Medium
            </p>

            <h2 className="text-3xl font-bold">
              {
                questions.filter(
                  q =>
                    q.difficulty ===
                    "MEDIUM"
                ).length
              }
            </h2>

          </div>

          <div className="border rounded-xl p-5 bg-red-50">

            <p className="text-sm text-gray-500">
              Hard
            </p>

            <h2 className="text-3xl font-bold">
              {
                questions.filter(
                  q =>
                    q.difficulty ===
                    "HARD"
                ).length
              }
            </h2>

          </div>

        </div>

        {/* Create Question */}

        <form
          onSubmit={createQuestion}
          className="bg-white border rounded-xl shadow-sm p-6 mb-8"
        >

          <h2 className="text-2xl font-semibold mb-6">
            Create Question
          </h2>

          <div className="grid gap-4">

            <input
              className="border rounded-lg p-3"
              placeholder="Question"
              value={form.question_text}
              onChange={(e) =>
                setForm({
                  ...form,
                  question_text:
                    e.target.value,
                })
              }
              required
            />

            <input
              className="border rounded-lg p-3"
              placeholder="Option A"
              value={form.option_a}
              onChange={(e) =>
                setForm({
                  ...form,
                  option_a:
                    e.target.value,
                })
              }
              required
            />

            <input
              className="border rounded-lg p-3"
              placeholder="Option B"
              value={form.option_b}
              onChange={(e) =>
                setForm({
                  ...form,
                  option_b:
                    e.target.value,
                })
              }
              required
            />

            <input
              className="border rounded-lg p-3"
              placeholder="Option C"
              value={form.option_c}
              onChange={(e) =>
                setForm({
                  ...form,
                  option_c:
                    e.target.value,
                })
              }
              required
            />

            <input
              className="border rounded-lg p-3"
              placeholder="Option D"
              value={form.option_d}
              onChange={(e) =>
                setForm({
                  ...form,
                  option_d:
                    e.target.value,
                })
              }
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <select
                className="border rounded-lg p-3"
                value={
                  form.correct_option
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    correct_option:
                      e.target.value,
                  })
                }
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>

              <select
                className="border rounded-lg p-3"
                value={
                  form.difficulty
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    difficulty:
                      e.target.value,
                  })
                }
              >
                <option>EASY</option>
                <option>MEDIUM</option>
                <option>HARD</option>
              </select>

              <input
                type="number"
                min={1}
                className="border rounded-lg p-3"
                value={form.points}
                onChange={(e) =>
                  setForm({
                    ...form,
                    points:
                      Number(
                        e.target.value
                      ),
                  })
                }
              />

            </div>

            <button
              disabled={loading}
              className="bg-black text-white rounded-lg p-3 font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Question"}
            </button>

          </div>

        </form>

        {/* Questions */}

        <div>

          <h2 className="text-2xl font-semibold mb-4">
            Existing Questions
          </h2>

          {questions.length === 0 && (

            <div className="border rounded-xl p-6 bg-gray-50">

              No questions available.

            </div>

          )}

          {questions.map(
            (question) => (

              <div
                key={question.id}
                className="border rounded-xl p-5 bg-white shadow-sm mb-4"
              >

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                  <div>

                    <h3 className="font-semibold text-lg mb-3">
                      {question.question_text}
                    </h3>

                    <div className="flex flex-wrap gap-2">

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

                  <button
                    onClick={() =>
                      deleteQuestion(
                        question.id
                      )
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </AuthGuard>
  );
}