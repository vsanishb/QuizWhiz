// src/hooks/useCurrentUser.ts

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export function useCurrentUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  return user;
}