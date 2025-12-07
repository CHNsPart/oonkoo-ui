import { NextRequest } from "next/server";
import { randomBytes } from "crypto";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/kinde";
import { successResponse, Errors } from "@/lib/api-response";

/**
 * POST /api/auth/cli/complete
 * Complete CLI authentication after user logs in via browser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return Errors.BAD_REQUEST("Missing session ID");
    }

    // Get the authenticated user
    const user = await getCurrentUser();

    if (!user) {
      return Errors.UNAUTHORIZED();
    }

    // Find the session
    const session = await prisma.cliAuthSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      return Errors.NOT_FOUND("Session not found or expired");
    }

    // Check if expired
    if (session.expiresAt < new Date()) {
      await prisma.cliAuthSession.delete({ where: { sessionId } });
      return Errors.BAD_REQUEST("Session expired. Please run 'npx oonkoo auth' again.");
    }

    // Check if already completed
    if (session.status === "COMPLETED") {
      return Errors.BAD_REQUEST("Session already used");
    }

    // Generate a CLI token
    const token = `cli_${randomBytes(32).toString("hex")}`;

    // Complete the session
    await prisma.cliAuthSession.update({
      where: { sessionId },
      data: {
        status: "COMPLETED",
        userId: user.id,
        token,
      },
    });

    return successResponse({
      message: "CLI authenticated successfully",
    });
  } catch (error) {
    console.error("CLI auth complete error:", error);
    return Errors.INTERNAL();
  }
}
