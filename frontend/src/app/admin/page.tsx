"use client";

import { useEffect, useState, useRef } from "react";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

import { Question } from "@/types/question";

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  
  // Custom non-blocking status notification toast
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const initialFormState = {
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
    difficulty: "EASY",
    points: 5,
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Clear notifications automatically after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchQuestions = async () => {
    try {
      const response = await api.get("/api/admin/questions");
      setQuestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Parses FastAPI/Pydantic validation structures securely into human-readable strings
  const parseBackendError = (error: any, fallback: string): string => {
    const detail = error?.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) {
      const err = detail[0];
      const field = Array.isArray(err.loc) ? err.loc.join(".") : "";
      return field ? `Validation failed on field [${field}]: ${err.msg}` : err.msg;
    }
    return fallback;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingQuestionId) {
        await api.put(`/api/admin/questions/${editingQuestionId}`, form);
        setNotification({ message: "Question updated successfully", type: "success" });
      } else {
        await api.post("/api/admin/questions", form);
        setNotification({ message: "Question created successfully", type: "success" });
      }
      
      setForm(initialFormState);
      setEditingQuestionId(null);
      await fetchQuestions();
    } catch (error: any) {
      console.error("422 Error Debugging Info:", error?.response?.data);
      const readableError = parseBackendError(error, "Failed to save question");
      setNotification({ message: readableError, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const startEditQuestion = (question: Question) => {
    setEditingQuestionId(question.id);
    setForm({
      question_text: question.question_text || "",
      option_a: question.option_a || "",
      option_b: question.option_b || "",
      option_c: question.option_c || "",
      option_d: question.option_d || "",
      // Fallback to "A" if backend schema omits correct_option field
      correct_option: (question as any).correct_option || "A",
      difficulty: question.difficulty || "EASY",
      points: question.points ?? 5,
    });

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cancelEdit = () => {
    setForm(initialFormState);
    setEditingQuestionId(null);
  };

  const deleteQuestion = async (id: string) => {
    try {
      await api.delete(`/api/admin/questions/${id}`);
      setNotification({ message: "Question deleted successfully", type: "success" });
      if (editingQuestionId === id) {
        cancelEdit();
      }
      await fetchQuestions();
    } catch (error: any) {
      const readableError = parseBackendError(error, "Delete failed");
      setNotification({ message: readableError, type: "error" });
    }
  };

  return (
    <AuthGuard>
      <Navbar />

      {/* --- FLOATING STATUS TOAST --- */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in">
          <div className={`border-2 border-black rounded-xl p-4 shadow-lg min-w-[300px] max-w-md ${
            notification.type === "success" ? "bg-[#f0f9eb]" : "bg-[#fdf2e9]"
          }`}>
            <p className="text-sm font-semibold text-gray-900 break-words">
              {notification.message}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 bg-white min-h-screen font-sans">
        <div className="mb-6 md:mb-8 text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-[#6c757d] text-sm md:text-base mt-1 md:mt-2">
            Manage quiz questions and platform content.
          </p>
        </div>

        {/* --- STATS DASHBOARD PANELS --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
          <div className="border border-black rounded-xl p-4 md:p-5 bg-[#fffdf0] text-left">
            <p className="text-xs md:text-sm text-[#7f8c8d] font-medium truncate">Total Questions</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-0.5 md:mt-1">{questions.length}</h2>
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
          {/* --- ADMIN INPUT CONTROL FORM --- */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-full lg:col-span-5 bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">
              {editingQuestionId ? "Edit Question" : "Create Question"}
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
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] md:text-xs font-semibold text-gray-500 px-1 truncate">Difficulty</label>
                  <select
                    className="w-full border border-gray-300 bg-white rounded-lg p-2.5 md:p-3 text-sm focus:outline-none focus:border-black transition"
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
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
                {loading ? "Saving..." : editingQuestionId ? "Update Question" : "Create Question"}
              </button>

              {editingQuestionId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="w-full text-center text-xs font-semibold border border-gray-300 text-gray-500 bg-white p-3 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {/* --- DATA TABLE LIST --- */}
          <div className="w-full lg:col-span-7">
            <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-5">Existing Questions</h2>

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
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border border-black ${
                          question.difficulty === "EASY" ? "bg-[#f0f9eb]" : question.difficulty === "MEDIUM" ? "bg-[#f4f6f7]" : "bg-[#fdf2e9]"
                        }`}>
                          {question.difficulty}
                        </span>
                        <span className="bg-[#fffdf0] border border-black px-3 py-1 rounded-full text-xs font-semibold text-gray-900">
                          {question.points} pts
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => startEditQuestion(question)}
                        className="flex-1 sm:flex-none text-center text-xs font-semibold border border-gray-300 text-gray-700 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="flex-1 sm:flex-none text-center text-xs font-semibold border border-gray-300 text-gray-500 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-all"
                      >
                        Delete
                      </button>
                    </div>
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