"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({
  children,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(
      "token"
    );

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
}