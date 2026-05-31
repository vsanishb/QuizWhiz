"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      setLoading(true);

      await api.post("/api/auth/register", {
        username,
        email,
        password,
      });

      setSuccessMessage("Registration successful! Redirecting to login...");
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.detail || 
          "Registration failed. Please try again."
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
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
            Create your account
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 border border-black bg-[#fdf2e9] rounded-lg p-3.5 text-left text-sm text-gray-900 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-base leading-none">⚠️</span>
            <div className="flex-1 font-medium leading-tight">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 border border-black bg-[#f0f9eb] rounded-lg p-3.5 text-left text-sm text-gray-900 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-base leading-none">✅</span>
            <div className="flex-1 font-medium leading-tight">{successMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition bg-white text-gray-900"
            required
          />

          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition bg-white text-gray-900"
            required
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-black transition bg-white text-gray-900"
            required
          />

          <button
            disabled={loading || !!successMessage}
            className="w-full mt-2 bg-gray-900 text-white text-sm rounded-lg p-3 font-semibold hover:bg-black disabled:opacity-50 transition-all shadow-sm border border-black"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-[#6c757d]">
            Already have an account?
          </span>{" "}
          <Link
            href="/login"
            className="font-semibold text-gray-900 underline hover:text-black"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}