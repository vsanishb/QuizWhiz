"use client";

import { useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

``
import api from "@/lib/api";

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response =
        await api.get(
          "/api/leaderboard"
        );

      setLeaderboard(
        response.data
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <Navbar />
      
      <div className="max-w-5xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          Leaderboard
        </h1>

        {loading && (
          <p>Loading...</p>
        )}

        {!loading && (
          <table className="w-full border">

            <thead>
              <tr>
                <th className="border p-2">
                  Rank
                </th>

                <th className="border p-2">
                  Username
                </th>

                <th className="border p-2">
                  Score
                </th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.map(
                (entry) => (
                  <tr
                    key={entry.rank}
                  >
                    <td className="border p-2">
                      #{entry.rank}
                    </td>

                    <td className="border p-2">
                      {entry.username}
                    </td>

                    <td className="border p-2">
                      {entry.score}
                    </td>
                  </tr>
                )
              )}
            </tbody>

          </table>
        )}
      </div>
    </AuthGuard>
  );
}