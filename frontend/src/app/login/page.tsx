"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      setLoading(true);

      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (response && response.data?.access_token) {
        localStorage.setItem("token", response.data.access_token);
        router.push("/quiz");
      }
    } catch (error: any) {
      // Safely capture details if intercepted or directly caught by Axios
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(
          error.response.data?.detail || 
          "Incorrect email or password. Please try again."
        );
      } else {
        setErrorMessage("An unexpected network error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 font-sans">
      <div className="w-full max-w-md bg-white border border-black rounded-xl p-6 sm:p-8">
        
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            QuizWhiz
          </h1>
          <p className="text-[#6c757d] text-sm mt-2">
            Sign in to continue
          </p>
        </div>

        {/* Custom Application Error Box style matched to platform palettes */}
        {errorMessage && (
          <div className="mb-5 border border-black bg-[#fdf2e9] rounded-lg p-3.5 text-left text-sm text-gray-900 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-base leading-none">⚠️</span>
            <div className="flex-1 font-medium leading-tight">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition bg-white text-gray-900"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition bg-white text-gray-900"
            required
          />

          <button
            disabled={loading}
            className="w-full mt-2 bg-gray-900 text-white text-sm rounded-lg p-3 font-semibold hover:bg-black disabled:opacity-50 transition-all shadow-sm border border-black"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-[#6c757d]">
            Don't have an account?
          </span>{" "}
          <Link
            href="/register"
            className="font-semibold text-gray-900 underline hover:text-black"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}