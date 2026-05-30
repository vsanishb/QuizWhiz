"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AuthGuard from "@/components/AuthGuard";
import api from "@/lib/api";

interface DashboardData {
  username: string;
  total_score: number;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] =
    useState<DashboardData | null>(null);

  const [rank, setRank] =
    useState<number | null>(null);

  const [totalUsers, setTotalUsers] =
    useState<number>(0);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const meResponse =
        await api.get("/api/auth/me");

      const leaderboardResponse =
        await api.get("/api/leaderboard");

      setUser(meResponse.data);

      const leaderboard =
        leaderboardResponse.data;

      setTotalUsers(
        leaderboard.length
      );

      const currentUser =
        leaderboard.find(
          (entry: any) =>
            entry.username ===
            meResponse.data.username
        );

      if (currentUser) {
        setRank(currentUser.rank);
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
        <div className="p-8">
          Loading dashboard...
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-5xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="border rounded p-6">
            <h2 className="text-gray-500">
              User
            </h2>

            <p className="text-2xl font-bold">
              {user?.username}
            </p>
          </div>

          <div className="border rounded p-6">
            <h2 className="text-gray-500">
              Score
            </h2>

            <p className="text-2xl font-bold">
              {user?.total_score}
            </p>
          </div>

          <div className="border rounded p-6">
            <h2 className="text-gray-500">
              Rank
            </h2>

            <p className="text-2xl font-bold">
              #{rank}
            </p>
          </div>

        </div>

        <div className="border rounded p-6 mt-6">

          <h2 className="text-xl font-semibold mb-4">
            Statistics
          </h2>

          <p>
            Total Participants:
            {" "}
            {totalUsers}
          </p>

          <p>
            Current Role:
            {" "}
            {user?.role}
          </p>

        </div>

        <div className="flex gap-4 mt-8">

          <Link
            href="/leaderboard"
            className="border px-4 py-2 rounded"
          >
            View Leaderboard
          </Link>

          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="border px-4 py-2 rounded"
            >
              Admin Panel
            </Link>
          )}

        </div>

      </div>

      
    </AuthGuard>
  );
}