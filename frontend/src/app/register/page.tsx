"use client";

import { useState } from "react";
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
    <div className="flex min-h-screen items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-96"
      >
        <h1 className="text-3xl font-bold">
          Register
        </h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          className="border p-2"
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
          className="border p-2"
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
          className="border p-2"
        />

        <button
          disabled={loading}
          className="border p-2"
        >
          {loading
            ? "Registering..."
            : "Register"}
        </button>
      </form>
    </div>
  );
}