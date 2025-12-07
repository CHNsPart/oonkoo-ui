import { NextRequest } from "next/server";

import { ApiKeyService } from "@/services/api-key.service";
import { getCurrentUser } from "@/lib/kinde";
import { isValidApiKeyFormat } from "@/lib/api-keys";

interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isPro: boolean;
}

/**
 * Authenticate a request using either:
 * 1. API Key (Authorization: Bearer oonkoo_xxx)
 * 2. Session cookie (Kinde)
 */
export async function authenticateRequest(
  req: NextRequest
): Promise<AuthenticatedUser | null> {
  // Try API Key authentication first
  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);

    // Check if it's an OonkooUI API key
    if (isValidApiKeyFormat(token)) {
      const user = await ApiKeyService.validateKey(token);

      if (user) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isPro: user.subscription?.status === "ACTIVE",
        };
      }
    }
  }

  // Fall back to session authentication
  const sessionUser = await getCurrentUser();

  if (sessionUser) {
    return {
      id: sessionUser.id,
      email: sessionUser.email,
      name: sessionUser.name,
      role: sessionUser.role,
      isPro: sessionUser.subscription?.status === "ACTIVE",
    };
  }

  return null;
}

/**
 * Check if the authenticated user has Pro access
 */
export function requirePro(user: AuthenticatedUser | null): boolean {
  return user?.isPro ?? false;
}
