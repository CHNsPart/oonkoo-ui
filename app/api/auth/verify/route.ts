import { NextRequest } from "next/server";

import { ApiKeyService } from "@/services/api-key.service";
import { successResponse, Errors } from "@/lib/api-response";
import { isValidAuthToken } from "@/lib/api-keys";

/**
 * POST /api/auth/verify
 * Verify an API key or CLI token and return user info
 * Used by the CLI to authenticate
 */
export async function POST(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Errors.UNAUTHORIZED();
    }

    const token = authHeader.replace("Bearer ", "");

    // Validate token format (API key or CLI token)
    if (!isValidAuthToken(token)) {
      return Errors.UNAUTHORIZED();
    }

    // Validate the token and get user
    const user = await ApiKeyService.validateKey(token);

    if (!user) {
      return Errors.UNAUTHORIZED();
    }

    // Return user info
    return successResponse({
      userId: user.id,
      email: user.email,
      name: user.name,
      hasPro: user.subscription?.status === "ACTIVE",
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return Errors.INTERNAL();
  }
}
