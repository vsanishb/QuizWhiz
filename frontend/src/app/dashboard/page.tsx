"use client";

import { useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";

import api from "@/lib/api";

export default function DashboardPage() {

  const [user, setUser] =
    useState<any>(null);

  const [rank, setRank] =
    useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

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
  };

  if (!user)
    return <p>Loading...</p>;

  return (
    <AuthGuard>

      <div className="max-w-4xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-6">
          Dashboard
        </h1>

        <div className="border rounded p-6">

          <h2>
            Welcome {user.username}
          </h2>

          <p>
            Score:
            {" "}
            {user.total_score}
          </p>

          <p>
            Rank:
            {" "}
            {rank}
          </p>

          <p>
            Role:
            {" "}
            {user.role}
          </p>

        </div>

      </div>

    </AuthGuard>
  );
}