"use client";

import { useState } from "react";

import Link from "next/link";

import {
  useRouter,
  usePathname
} from "next/navigation";

import {
  useCurrentUser
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
    `block px-4 py-3 rounded-lg transition ${
      pathname === path
        ? "bg-black text-white"
        : "hover:bg-gray-100"
    }`;

  return (

    <>

      {/* Navbar */}

      <nav className="border-b bg-white sticky top-0 z-40 shadow-sm">

        <div className="max-w-7xl mx-auto px-4">

          <div className="flex items-center justify-between h-16">

            {/* Left */}

            <div className="flex items-center gap-4">

              <button
                onClick={() =>
                  setMenuOpen(true)
                }
                className="
                  md:hidden
                  border
                  rounded-lg
                  px-3
                  py-2
                  hover:bg-gray-100
                "
              >
                ☰
              </button>

              <Link
                href="/dashboard"
                className="
                  font-bold
                  text-2xl
                "
              >
                QuizWhiz
              </Link>

            </div>

            {/* Desktop Nav */}

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

                <div className="text-right">

                  <div className="font-medium">
                    {user.username}
                  </div>

                  <div className="text-xs text-gray-500">

                    {user.total_score}
                    {" "}
                    pts

                  </div>

                </div>

              )}

              <button
                onClick={logout}
                className="
                  bg-red-500
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  hover:bg-red-600
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
          transition-opacity
          duration-300
          ${
            menuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
      />

      {/* Drawer */}

      <div
        className={`
          fixed
          top-0
          left-0
          h-full
          w-72
          bg-white
          z-50
          shadow-xl
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

          <div className="flex justify-between items-center">

            <h2 className="font-bold text-2xl">
              QuizWhiz
            </h2>

            <button
              onClick={closeMenu}
              className="
                text-xl
                hover:text-red-500
              "
            >
              ✕
            </button>

          </div>

        </div>

        {/* User */}

        {user && (

          <div className="p-5 border-b bg-gray-50">

            <div className="font-semibold text-lg">
              {user.username}
            </div>

            <div className="text-sm text-gray-500">

              {user.total_score}
              {" "}
              points

            </div>

            <div className="text-xs mt-2 inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-700">

              {user.role}

            </div>

          </div>

        )}

        {/* Navigation */}

        <div className="p-4 flex flex-col gap-2">

          <Link
            href="/quiz"
            className={navItemClass(
              "/quiz"
            )}
            onClick={closeMenu}
          >
             Quiz
          </Link>

          <Link
            href="/dashboard"
            className={navItemClass(
              "/dashboard"
            )}
            onClick={closeMenu}
          >
             Dashboard
          </Link>

          <Link
            href="/leaderboard"
            className={navItemClass(
              "/leaderboard"
            )}
            onClick={closeMenu}
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
              onClick={closeMenu}
            >
               Admin Panel
            </Link>

          )}

          <button
            onClick={logout}
            className="
              mt-4
              bg-red-500
              text-white
              px-4
              py-3
              rounded-lg
              hover:bg-red-600
              text-left
            "
          >
            Logout
          </button>

        </div>

      </div>

    </>

  );
}