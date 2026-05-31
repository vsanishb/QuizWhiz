"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

import api from "@/lib/api";

export default function DashboardPage() {
  const [user, setUser] =
    useState<any>(null);

  const [rank, setRank] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const me =
        await api.get(
          "/api/auth/me"
        );

      const leaderboard =
        await api.get(
          "/api/leaderboard"
        );

      setUser(me.data);

      const userRank =
        leaderboard.data.find(
          (entry: any) =>
            entry.username ===
            me.data.username
        );

      if (userRank) {
        setRank(userRank.rank);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 py-8">
          Loading dashboard...
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Welcome, {user.username}
          </h1>

          <p className="text-gray-500 mt-2">
            Track your quiz performance and leaderboard position.
          </p>
        </div>

        {/* Stats Cards */}

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="border rounded-lg p-3 md:p-6">
            <p className="text-xs md:text-sm text-gray-500">
              Total Score
            </p>

            <h2 className="text-lg md:text-3xl font-bold mt-2">
              {user.total_score}
            </h2>
          </div>

          <div className="border rounded-lg p-3 md:p-6">
            <p className="text-xs md:text-sm text-gray-500">
              Rank
            </p>

            <h2 className="text-lg md:text-3xl font-bold mt-2">
              {rank ?? "-"}
            </h2>
          </div>

          <div className="border rounded-lg p-3 md:p-6">
            <p className="text-xs md:text-sm text-gray-500">
              Role
            </p>

            <h2 className="text-sm md:text-3xl font-bold mt-2 truncate">
              {user.role}
            </h2>
          </div>
        </div>

        {/* Main Content */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Quick Actions
            </h2>

            <div className="flex flex-col gap-3">
              <Link
                href="/quiz"
                className="border rounded p-3 hover:bg-gray-50"
              >
                Take Quiz
              </Link>

              <Link
                href="/leaderboard"
                className="border rounded p-3 hover:bg-gray-50"
              >
                View Leaderboard
              </Link>

              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="border rounded p-3 hover:bg-gray-50"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Account Information
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">
                  Username
                </p>

                <p className="font-medium">
                  {user.username}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="font-medium break-all">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Role
                </p>

                <p className="font-medium">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Performance Summary
          </h2>

          <p className="text-gray-600">
            You currently have{" "}
            <strong>
              {user.total_score}
            </strong>{" "}
            points and hold rank{" "}
            <strong>
              {rank ?? "-"}
            </strong>{" "}
            on the leaderboard.
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}