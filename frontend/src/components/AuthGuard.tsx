"use client";

import {
  useEffect,
  useState
} from "react";

import {
  useRouter
} from "next/navigation";

import api from "@/lib/api";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({
  children,
}: AuthGuardProps) {

  const router = useRouter();

  const [loading,
    setLoading] =
    useState(true);

  const [authenticated,
    setAuthenticated] =
    useState(false);

  useEffect(() => {

    verifyUser();

  }, []);

  const verifyUser =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {

          router.replace(
            "/login"
          );

          return;
        }

        await api.get(
          "/api/auth/me"
        );

        setAuthenticated(
          true
        );

      } catch {

        localStorage.removeItem(
          "token"
        );

        router.replace(
          "/login"
        );

      } finally {

        setLoading(false);
      }
    };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <div className="animate-pulse text-4xl mb-3">
            🔐
          </div>

          <p className="text-gray-600">
            Authenticating...
          </p>

        </div>

      </div>

    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}