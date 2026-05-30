"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const user = useCurrentUser();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const navItemClass = (path: string) =>
    `px-3 py-2 rounded transition ${
      pathname === path
        ? "bg-black text-white"
        : "hover:bg-gray-100"
    }`;

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

        <div className="flex items-center gap-6">

          <Link
            href="/dashboard"
            className="font-bold text-xl"
          >
            QuizWhiz
          </Link>

          <div className="flex gap-2">

            <Link
              href="/quiz"
              className={navItemClass("/quiz")}
            >
              Quiz
            </Link>

            <Link
              href="/dashboard"
              className={navItemClass("/dashboard")}
            >
              Dashboard
            </Link>

            <Link
              href="/leaderboard"
              className={navItemClass("/leaderboard")}
            >
              Leaderboard
            </Link>

            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className={navItemClass("/admin")}
              >
                Admin
              </Link>
            )}

          </div>
        </div>

        <div className="flex items-center gap-4">

          {user && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {user.username}
              </span>
              {" • "}
              {user.total_score} pts
            </div>
          )}

          <button
            onClick={logout}
            className="border px-3 py-2 rounded hover:bg-gray-100"
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}