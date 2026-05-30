"use client";

import { useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

import { Question } from "@/types/question";

export default function AdminPage() {

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
    fetchQuestions();
  }, []);

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
          "Question created"
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
    async (id: string) => {

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

        await fetchQuestions();

      } catch (error) {
        console.error(error);
      }
    };

  return (
    <AuthGuard>
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          Admin Panel
        </h1>

        <form
          onSubmit={
            createQuestion
          }
          className="border rounded p-6 mb-8"
        >

          <h2 className="text-2xl font-semibold mb-4">
            Create Question
          </h2>

          <div className="grid gap-3">

            <input
              className="border p-2"
              placeholder="Question"
              value={
                form.question_text
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  question_text:
                    e.target.value,
                })
              }
            />

            <input
              className="border p-2"
              placeholder="Option A"
              value={
                form.option_a
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  option_a:
                    e.target.value,
                })
              }
            />

            <input
              className="border p-2"
              placeholder="Option B"
              value={
                form.option_b
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  option_b:
                    e.target.value,
                })
              }
            />

            <input
              className="border p-2"
              placeholder="Option C"
              value={
                form.option_c
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  option_c:
                    e.target.value,
                })
              }
            />

            <input
              className="border p-2"
              placeholder="Option D"
              value={
                form.option_d
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  option_d:
                    e.target.value,
                })
              }
            />

            <select
              className="border p-2"
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
              className="border p-2"
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
              <option>
                EASY
              </option>

              <option>
                MEDIUM
              </option>

              <option>
                HARD
              </option>
            </select>

            <input
              type="number"
              className="border p-2"
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

            <button
              disabled={loading}
              className="border p-2"
            >
              {loading
                ? "Creating..."
                : "Create Question"}
            </button>

          </div>
        </form>

        <div>

          <h2 className="text-2xl font-semibold mb-4">
            Existing Questions
          </h2>

          {questions.map(
            (question) => (
              <div
                key={question.id}
                className="border rounded p-4 mb-4"
              >

                <div className="flex justify-between">

                  <div>

                    <h3 className="font-semibold">
                      {
                        question.question_text
                      }
                    </h3>

                    <p>
                      Difficulty:
                      {" "}
                      {
                        question.difficulty
                      }
                    </p>

                    <p>
                      Points:
                      {" "}
                      {
                        question.points
                      }
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      deleteQuestion(
                        question.id
                      )
                    }
                    className="border px-4 py-2"
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