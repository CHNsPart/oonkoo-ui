"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    getToken,
  } = useKindeBrowserClient();

  return {
    user,
    isAuthenticated,
    isLoading,
    getToken,
  };
}
