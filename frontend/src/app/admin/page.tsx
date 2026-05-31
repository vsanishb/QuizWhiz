"use client";

import { useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

import { Question } from "@/types/question";

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
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
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get("/api/admin/questions");
      setQuestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/api/admin/questions", form);
      alert("Question created successfully");
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
      alert(error?.response?.data?.detail || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Delete question?")) {
      return;
    }
    try {
      await api.delete(`/api/admin/questions/${id}`);
      alert("Question deleted");
      await fetchQuestions();
    } catch (error: any) {
      alert(error?.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <AuthGuard>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 bg-white min-h-screen font-sans">
        <div className="mb-6 md:mb-8 text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-[#6c757d] text-sm md:text-base mt-1 md:mt-2">
            Manage quiz questions and platform content.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
          <div className="border border-black rounded-xl p-4 md:p-5 bg-[#fffdf0] text-left">
            <p className="text-xs md:text-sm text-[#7f8c8d] font-medium truncate">Total Questions</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-0.5 md:mt-1">
              {questions.length}
            </h2>
          </div>

          <div className="border border-black rounded-xl p-4 md:p-5 bg-[#f0f9eb] text-left">
            <p className="text-xs md:text-sm text-[#7f8c8d] font-medium truncate">Easy Questions</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-0.5 md:mt-1">
              {questions.filter((q) => q.difficulty === "EASY").length}
            </h2>
          </div>

          <div className="border border-black rounded-xl p-4 md:p-5 bg-[#f4f6f7] text-left">
            <p className="text-xs md:text-sm text-[#7f8c8d] font-medium truncate">Medium Questions</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-0.5 md:mt-1">
              {questions.filter((q) => q.difficulty === "MEDIUM").length}
            </h2>
          </div>

          <div className="border border-black rounded-xl p-4 md:p-5 bg-[#fdf2e9] text-left">
            <p className="text-xs md:text-sm text-[#7f8c8d] font-medium truncate">Hard Questions</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-0.5 md:mt-1">
              {questions.filter((q) => q.difficulty === "HARD").length}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <form
            onSubmit={createQuestion}
            className="w-full lg:col-span-5 bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">
              Create Question
            </h2>

            <div className="grid gap-3.5">
              <input
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition"
                placeholder="Question text"
                value={form.question_text}
                onChange={(e) => setForm({ ...form, question_text: e.target.value })}
                required
              />

              <input
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition"
                placeholder="Option A"
                value={form.option_a}
                onChange={(e) => setForm({ ...form, option_a: e.target.value })}
                required
              />

              <input
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition"
                placeholder="Option B"
                value={form.option_b}
                onChange={(e) => setForm({ ...form, option_b: e.target.value })}
                required
              />

              <input
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition"
                placeholder="Option C"
                value={form.option_c}
                onChange={(e) => setForm({ ...form, option_c: e.target.value })}
                required
              />

              <input
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition"
                placeholder="Option D"
                value={form.option_d}
                onChange={(e) => setForm({ ...form, option_d: e.target.value })}
                required
              />

              <div className="grid grid-cols-3 gap-2 md:gap-3 mt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] md:text-xs font-semibold text-gray-500 px-1 truncate">Correct</label>
                  <select
                    className="w-full border border-gray-300 bg-white rounded-lg p-2.5 md:p-3 text-sm focus:outline-none focus:border-black transition"
                    value={form.correct_option}
                    onChange={(e) => setForm({ ...form, correct_option: e.target.value })}
                  >
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                    <option>D</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] md:text-xs font-semibold text-gray-500 px-1 truncate">Difficulty</label>
                  <select
                    className="w-full border border-gray-300 bg-white rounded-lg p-2.5 md:p-3 text-sm focus:outline-none focus:border-black transition"
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  >
                    <option>EASY</option>
                    <option>MEDIUM</option>
                    <option>HARD</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] md:text-xs font-semibold text-gray-500 px-1 truncate">Points</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full border border-gray-300 rounded-lg p-2.5 md:p-3 text-sm focus:outline-none focus:border-black transition"
                    value={form.points}
                    onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full mt-3 bg-gray-900 text-white text-sm rounded-lg p-3 font-semibold hover:bg-black disabled:opacity-50 transition-all shadow-sm"
              >
                {loading ? "Creating..." : "Create Question"}
              </button>
            </div>
          </form>

          <div className="w-full lg:col-span-7">
            <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-5">
              Existing Questions
            </h2>

            {questions.length === 0 && (
              <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-sm text-gray-400 bg-gray-50">
                No questions available.
              </div>
            )}

            <div className="space-y-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className={`border border-black rounded-xl p-4 md:p-5 bg-white shadow-sm transition-all
                    ${
                      question.difficulty === "EASY"
                        ? "bg-[#f0f9eb]/30"
                        : question.difficulty === "MEDIUM"
                        ? "bg-[#f4f6f7]/30"
                        : "bg-[#fdf2e9]/30"
                    }
                  `}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="space-y-2 text-left">
                      <h3 className="font-bold text-base md:text-lg text-gray-900 leading-snug break-words">
                        {question.question_text}
                      </h3>

                      <div className="flex flex-wrap gap-2 items-center">
                        <span
                          className={`
                            px-3 py-1 rounded-full text-xs font-semibold border border-black
                            ${
                              question.difficulty === "EASY"
                                ? "bg-[#f0f9eb]"
                                : question.difficulty === "MEDIUM"
                                ? "bg-[#f4f6f7]"
                                : "bg-[#fdf2e9]"
                            }
                          `}
                        >
                          {question.difficulty}
                        </span>

                        <span className="bg-[#fffdf0] border border-black px-3 py-1 rounded-full text-xs font-semibold text-gray-900">
                          {question.points} pts
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="w-full sm:w-auto text-center text-xs font-semibold border border-gray-300 text-gray-500 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}