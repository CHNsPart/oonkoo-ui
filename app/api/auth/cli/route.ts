import { NextRequest } from "next/server";
import { randomBytes } from "crypto";

import { prisma } from "@/lib/prisma";
import { successResponse, Errors } from "@/lib/api-response";

// Store pending CLI auth sessions (in production, use Redis or database)
// For now, we'll use a database table approach

/**
 * POST /api/auth/cli
 * Initiate CLI authentication flow
 * Returns a session ID and URL for user to visit
 */
export async function POST() {
  try {
    // Generate a unique session ID
    const sessionId = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store the session in database
    await prisma.cliAuthSession.create({
      data: {
        sessionId,
        expiresAt,
        status: "PENDING",
      },
    });

    // Return the session ID and URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://oonkoo.dev";
    const authUrl = `${baseUrl}/auth/cli?session=${sessionId}`;

    return successResponse({
      sessionId,
      authUrl,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("CLI auth init error:", error);
    return Errors.INTERNAL();
  }
}

/**
 * GET /api/auth/cli?session=xxx
 * Poll for CLI auth status
 */
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session");

    if (!sessionId) {
      return Errors.BAD_REQUEST("Missing session parameter");
    }

    // Find the session
    const session = await prisma.cliAuthSession.findUnique({
      where: { sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            subscription: {
              select: { status: true },
            },
          },
        },
      },
    });

    if (!session) {
      return Errors.NOT_FOUND("Session");
    }

    // Check if expired
    if (session.expiresAt < new Date()) {
      // Clean up expired session
      await prisma.cliAuthSession.delete({ where: { sessionId } });
      return Errors.BAD_REQUEST("Session expired");
    }

    // Return status
    if (session.status === "PENDING") {
      return successResponse({ status: "pending" });
    }

    if (session.status === "COMPLETED" && session.token && session.user) {
      // Clean up used session
      await prisma.cliAuthSession.delete({ where: { sessionId } });

      return successResponse({
        status: "completed",
        token: session.token,
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        hasPro: session.user.subscription?.status === "ACTIVE",
      });
    }

    return successResponse({ status: session.status });
  } catch (error) {
    console.error("CLI auth poll error:", error);
    return Errors.INTERNAL();
  }
}
