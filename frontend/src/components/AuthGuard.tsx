"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/api";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  
  const isRedirecting = useRef(false);

  useEffect(() => {
    verifyUser();
  }, [pathname]);

  const verifyUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        if (!isRedirecting.current) {
          isRedirecting.current = true;
          router.replace("/login");
        }
        return;
      }

      const response = await api.get("/api/auth/me");

      if (pathname.startsWith("/admin") && response.data.role !== "ADMIN") {
        setShowRestrictedModal(true);
        setLoading(false);
        setAuthenticated(false);
        return;
      }

      setAuthenticated(true);
      setLoading(false);
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setShowRestrictedModal(true);
        setLoading(false);
        setAuthenticated(false);
        return;
      }

      localStorage.removeItem("token");
      if (!isRedirecting.current) {
        isRedirecting.current = true;
        router.replace("/login");
      }
    } finally {
      if (!isRedirecting.current && !showRestrictedModal) {
        setLoading(false);
      }
    }
  };

  const handleRedirect = () => {
    setShowRestrictedModal(false);
    router.replace("/dashboard");
  };

  if (showRestrictedModal) {
    return (
      <div className="min-h-screen fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm p-4 font-sans">
        <div className="w-full max-w-sm border border-black rounded-xl p-6 md:p-8 bg-[#fdf2e9] text-center shadow-lg transform transition-all animate-in fade-in zoom-in-95 duration-200">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Restricted Access
          </h2>
          <p className="text-[#6c757d] text-sm mt-2 leading-relaxed">
            You do not have the required administrator privileges to view or manage content on this platform.
          </p>
          <button
            onClick={handleRedirect}
            className="w-full mt-6 bg-gray-900 text-white text-sm rounded-lg p-3 font-semibold hover:bg-black border border-black transition-all shadow-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans">
        <div className="text-center">
          <div className="animate-pulse text-4xl mb-3">🔒</div>
          <p className="text-sm font-medium text-gray-500 tracking-tight">
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