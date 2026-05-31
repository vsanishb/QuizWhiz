"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useRouter,
  usePathname,
} from "next/navigation";

import {
  useCurrentUser,
} from "@/hooks/useCurrentUser";

export default function Navbar() {
  const router = useRouter();

  const pathname =
    usePathname();

  const user =
    useCurrentUser();

  const [menuOpen,
    setMenuOpen] =
    useState(false);

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    router.push(
      "/login"
    );
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navItemClass = (
    path: string
  ) =>
    `px-4 py-2 rounded-xl transition-all duration-200 font-medium ${
      pathname === path
        ? "bg-black text-white shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-black"
    }`;

  return (
    <>
      {/* Navbar */}

      <nav className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left */}

            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setMenuOpen(true)
                }
                className="
                  md:hidden
                  border
                  border-gray-300
                  rounded-xl
                  px-3
                  py-2
                  hover:bg-gray-100
                  transition
                "
              >
                ☰
              </button>

              <Link
                href="/dashboard"
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                "
              >
                QuizWhiz
              </Link>
            </div>

            {/* Desktop Navigation */}

            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/quiz"
                className={navItemClass(
                  "/quiz"
                )}
              >
                Quiz
              </Link>

              <Link
                href="/dashboard"
                className={navItemClass(
                  "/dashboard"
                )}
              >
                Dashboard
              </Link>

              <Link
                href="/leaderboard"
                className={navItemClass(
                  "/leaderboard"
                )}
              >
                Leaderboard
              </Link>

              {user?.role ===
                "ADMIN" && (
                <Link
                  href="/admin"
                  className={navItemClass(
                    "/admin"
                  )}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Desktop User */}

            <div className="hidden md:flex items-center gap-4">
              {user && (
                <>
                  <div
                    className="
                    w-10
                    h-10
                    rounded-full
                    bg-black
                    text-white
                    flex
                    items-center
                    justify-center
                    font-semibold
                    text-sm
                  "
                  >
                    {user.username
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {user.username}
                    </div>

                    <div className="text-xs text-gray-500">
                      {user.total_score} pts
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={logout}
                className="
                  border
                  border-gray-300
                  bg-white
                  text-gray-700
                  px-4
                  py-2
                  rounded-xl
                  hover:bg-gray-100
                  transition
                "
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}

      <div
        onClick={closeMenu}
        className={`
          fixed
          inset-0
          bg-black/50
          z-40
          transition-all
          duration-300
          ${
            menuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
      />

      {/* Mobile Drawer */}

      <div
        className={`
          fixed
          top-0
          left-0
          h-full
          w-80
          bg-white
          z-50
          shadow-2xl
          transition-transform
          duration-300
          ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Header */}

        <div className="p-5 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                QuizWhiz
              </h2>

              <p className="text-sm text-gray-500">
                AI Quiz Platform
              </p>
            </div>

            <button
              onClick={closeMenu}
              className="
                w-9
                h-9
                rounded-lg
                hover:bg-gray-100
                transition
              "
            >
              ✕
            </button>
          </div>
        </div>

        {/* User Section */}

        {user && (
          <div className="p-5 border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <div
                className="
                w-12
                h-12
                rounded-full
                bg-black
                text-white
                flex
                items-center
                justify-center
                font-semibold
              "
              >
                {user.username
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <div>
                <div className="font-semibold">
                  {user.username}
                </div>

                <div className="text-sm text-gray-500">
                  {user.total_score} points
                </div>
              </div>
            </div>

            <div
              className="
                mt-3
                inline-flex
                px-3
                py-1
                rounded-full
                bg-blue-100
                text-blue-700
                text-xs
                font-medium
              "
            >
              {user.role}
            </div>
          </div>
        )}

        {/* Navigation */}

        <div className="p-4 flex flex-col gap-2">
          <Link
            href="/dashboard"
            onClick={closeMenu}
            className={navItemClass(
              "/dashboard"
            )}
            
          >
             Dashboard
          </Link>

          <Link
            href="/quiz"
            onClick={closeMenu}
            className={navItemClass(
              "/quiz"
            )}
          >
             Quiz
          </Link>

          <Link
            href="/leaderboard"
            onClick={closeMenu}
            className={navItemClass(
              "/leaderboard"
            )}
          >
             Leaderboard
          </Link>

          {user?.role ===
            "ADMIN" && (
            <Link
              href="/admin"
              onClick={closeMenu}
              className={navItemClass(
                "/admin"
              )}
            >
               Admin Panel
            </Link>
          )}

          <button
            onClick={logout}
            className="
              mt-6
              border
              border-gray-300
              bg-white
              text-gray-700
              px-4
              py-3
              rounded-xl
              hover:bg-gray-100
              transition
              text-left
              font-medium
            "
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}