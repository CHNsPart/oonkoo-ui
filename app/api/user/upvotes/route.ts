import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/kinde";
import { successResponse, Errors } from "@/lib/api-response";

/**
 * GET /api/user/upvotes
 * Get all component slugs the current user has upvoted
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return successResponse({ upvotedSlugs: [] });
    }

    const upvotes = await prisma.upvote.findMany({
      where: { userId: user.id },
      include: {
        component: {
          select: { slug: true },
        },
      },
    });

    const upvotedSlugs = upvotes.map((u) => u.component.slug);

    return successResponse({ upvotedSlugs });
  } catch (error) {
    console.error("Get user upvotes error:", error);
    return Errors.INTERNAL();
  }
}
