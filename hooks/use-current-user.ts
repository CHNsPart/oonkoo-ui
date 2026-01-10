"use client";

import { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface CurrentUser {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  role: string;
}

export function useCurrentUser() {
  const { isAuthenticated } = useKindeBrowserClient();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [isAuthenticated]);

  return { user, isLoading };
}
