"use client";

import { useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

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

  const fetchLeaderboard =
    async () => {
      try {
        setLoading(true);
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

  const firstPlace =
    leaderboard[0];

  const secondPlace =
    leaderboard[1];

  const thirdPlace =
    leaderboard[2];

  return (
    <AuthGuard>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold">
              Leaderboard
            </h1>

            <p className="text-gray-500 mt-2">
              Top performers ranked by score.
            </p>
          </div>

          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="border rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading && leaderboard.length === 0 && (
          <div className="border rounded-lg p-6">
            Loading leaderboard...
          </div>
        )}

        {!loading &&
          leaderboard.length === 0 && (
            <div className="border rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-2">
                No Rankings Yet
              </h2>

              <p className="text-gray-500">
                Users will appear here after
                completing quizzes.
              </p>
            </div>
          )}

        {leaderboard.length > 0 && (
          <>
            {/* Stats */}

            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="border rounded-lg p-3 md:p-5 bg-yellow-50">
                <p className="text-xs md:text-sm text-gray-500">
                  Top Score
                </p>

                <h2 className="text-lg md:text-3xl font-bold">
                  {firstPlace?.score ?? 0}
                </h2>
              </div>

              <div className="border rounded-lg p-3 md:p-5 bg-blue-50">
                <p className="text-xs md:text-sm text-gray-500">
                  Total Participants
                </p>

                <h2 className="text-lg md:text-3xl font-bold">
                  {leaderboard.length}
                </h2>
              </div>

              <div className="border rounded-lg p-3 md:p-5 bg-green-50">
                <p className="text-xs md:text-sm text-gray-500">
                  Current Leader
                </p>

                <h2 className="text-sm md:text-xl font-bold truncate">
                  {firstPlace?.username}
                </h2>
              </div>
            </div>

            {/* Top 3 - Ordered Left to Right: 1st (Biggest) -> 2nd -> 3rd */}

            <div className="grid grid-cols-3 gap-3 mb-8 items-end">
              {firstPlace && (
                <div className="border rounded-lg p-4 md:p-8 bg-yellow-100 text-center shadow-sm">
                  <div className="text-3xl md:text-5xl mb-1 md:mb-3">
                    🥇
                  </div>

                  <h2 className="font-bold text-base md:text-3xl truncate">
                    {firstPlace.username}
                  </h2>

                  <p className="text-xs md:text-lg font-semibold text-gray-700 mt-1">
                    {firstPlace.score} pts
                  </p>
                </div>
              )}

              {secondPlace && (
                <div className="border rounded-lg p-3 md:p-5 bg-gray-100 text-center">
                  <div className="text-2xl md:text-3xl mb-1 md:mb-2">
                    🥈
                  </div>

                  <h2 className="font-bold text-sm md:text-xl truncate">
                    {secondPlace.username}
                  </h2>

                  <p className="text-xs md:text-base text-gray-600">
                    {secondPlace.score} pts
                  </p>
                </div>
              )}

              {thirdPlace && (
                <div className="border rounded-lg p-2 md:p-4 bg-orange-100 text-center opacity-90">
                  <div className="text-xl md:text-2xl mb-1 md:mb-2">
                    🥉
                  </div>

                  <h2 className="font-bold text-xs md:text-lg truncate">
                    {thirdPlace.username}
                  </h2>

                  <p className="text-xs md:text-sm text-gray-700">
                    {thirdPlace.score} pts
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Table */}

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">
                      Rank
                    </th>

                    <th className="p-3 text-left">
                      Username
                    </th>

                    <th className="p-3 text-left">
                      Score
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {leaderboard.map(
                    (entry) => (
                      <tr
                        key={
                          entry.rank
                        }
                        className="border-t"
                      >
                        <td className="p-3 font-medium">
                          {entry.rank === 1
                            ? "🥇"
                            : entry.rank === 2
                            ? "🥈"
                            : entry.rank === 3
                            ? "🥉"
                            : `#${entry.rank}`}
                        </td>

                        <td className="p-3">
                          {entry.username}
                        </td>

                        <td className="p-3 font-semibold">
                          {entry.score}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}

            <div className="md:hidden flex flex-col gap-4">
              {leaderboard.map(
                (entry) => (
                  <div
                    key={entry.rank}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-bold">
                          {entry.username}
                        </h2>

                        <p className="text-gray-500">
                          Rank #
                          {entry.rank}
                        </p>
                      </div>

                      <div className="text-xl font-bold">
                        {entry.score}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}