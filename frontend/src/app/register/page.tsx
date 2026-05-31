"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

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

      await api.post(
        "/api/auth/register",
        {
          username,
          email,
          password,
        }
      );

      alert(
        "Registration successful"
      );

      router.push("/login");

    } catch (error: any) {

      alert(
        error?.response?.data?.detail ||
        "Registration failed"
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
            Create your account
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <input
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            className="border rounded p-3"
            required
          />

          <input
            placeholder="Email"
            type="email"
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
            placeholder="Password"
            type="password"
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
              ? "Registering..."
              : "Register"}
          </button>

        </form>

        <div className="mt-6 text-center text-sm">

          <span className="text-gray-600">
            Already have an account?
          </span>

          {" "}

          <Link
            href="/login"
            className="font-semibold underline"
          >
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}