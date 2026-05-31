"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response =
        await api.post(
          "/api/auth/login",
          {
            email,
            password,
          }
        );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      router.push("/quiz");

    } catch (error: any) {

      alert(
        error?.response?.data?.detail ||
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white border rounded-lg shadow-sm p-6 sm:p-8">

        <div className="mb-6 text-center">

          <h1 className="text-3xl font-bold">
            QuizWhiz
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to continue
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="border rounded p-3"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="border rounded p-3"
            required
          />

          <button
            disabled={loading}
            className="border rounded p-3 font-medium hover:bg-gray-100 disabled:opacity-50"
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </button>

        </form>

        <div className="mt-6 text-center text-sm">

          <span className="text-gray-600">
            Don't have an account?
          </span>

          {" "}

          <Link
            href="/register"
            className="font-semibold underline"
          >
            Register
          </Link>

        </div>

      </div>

    </div>
  );
}