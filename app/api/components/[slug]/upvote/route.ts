import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/kinde";
import { successResponse, Errors } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * POST /api/components/[slug]/upvote
 * Toggle upvote for a component (add if not exists, remove if exists)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Errors.UNAUTHORIZED();
    }

    const { slug } = await params;

    // Find the component
    const component = await prisma.component.findUnique({
      where: { slug, status: "PUBLISHED" },
      select: { id: true, upvoteCount: true },
    });

    if (!component) {
      return Errors.NOT_FOUND("Component");
    }

    // Check if user already upvoted
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_componentId: {
          userId: user.id,
          componentId: component.id,
        },
      },
    });

    if (existingUpvote) {
      // Remove upvote
      await prisma.$transaction([
        prisma.upvote.delete({
          where: { id: existingUpvote.id },
        }),
        prisma.component.update({
          where: { id: component.id },
          data: { upvoteCount: { decrement: 1 } },
        }),
      ]);

      return successResponse({
        upvoted: false,
        upvoteCount: component.upvoteCount - 1,
      });
    } else {
      // Add upvote
      await prisma.$transaction([
        prisma.upvote.create({
          data: {
            userId: user.id,
            componentId: component.id,
          },
        }),
        prisma.component.update({
          where: { id: component.id },
          data: { upvoteCount: { increment: 1 } },
        }),
      ]);

      return successResponse({
        upvoted: true,
        upvoteCount: component.upvoteCount + 1,
      });
    }
  } catch (error) {
    console.error("Upvote error:", error);
    return Errors.INTERNAL();
  }
}

/**
 * GET /api/components/[slug]/upvote
 * Check if current user has upvoted this component
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const { slug } = await params;

    // Find the component
    const component = await prisma.component.findUnique({
      where: { slug, status: "PUBLISHED" },
      select: { id: true, upvoteCount: true },
    });

    if (!component) {
      return Errors.NOT_FOUND("Component");
    }

    // If not logged in, just return the count
    if (!user) {
      return successResponse({
        upvoted: false,
        upvoteCount: component.upvoteCount,
      });
    }

    // Check if user has upvoted
    const upvote = await prisma.upvote.findUnique({
      where: {
        userId_componentId: {
          userId: user.id,
          componentId: component.id,
        },
      },
    });

    return successResponse({
      upvoted: !!upvote,
      upvoteCount: component.upvoteCount,
    });
  } catch (error) {
    console.error("Get upvote status error:", error);
    return Errors.INTERNAL();
  }
}
