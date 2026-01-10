import { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdmin } from "@/lib/kinde";
import { successResponse, Errors } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Schema for updating request status (admin only)
const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_REVIEW", "TESTING", "APPROVED", "REJECTED", "CANCELLED"]),
  adminNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
});

/**
 * GET /api/component-requests/[id]
 * Get a single component request
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return Errors.UNAUTHORIZED();
    }

    const request = await prisma.componentRequest.findUnique({
      where: { id },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        publishedComponent: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
        files: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!request) {
      return Errors.NOT_FOUND("Component request");
    }

    // Check access - only requester or admin can view
    const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
    if (!isAdmin && request.requesterId !== user.id) {
      return Errors.FORBIDDEN();
    }

    // Hide admin notes from non-admins
    if (!isAdmin) {
      return successResponse({
        ...request,
        adminNotes: null,
      });
    }

    return successResponse(request);
  } catch (error) {
    console.error("Error fetching component request:", error);
    return Errors.INTERNAL();
  }
}

/**
 * PATCH /api/component-requests/[id]
 * Update request status (admin only)
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const admin = await requireAdmin();

    const body = await req.json();
    const data = updateStatusSchema.parse(body);

    // Get current request
    const request = await prisma.componentRequest.findUnique({
      where: { id },
      include: {
        requester: true,
      },
    });

    if (!request) {
      return Errors.NOT_FOUND("Component request");
    }

    // Don't allow updating already approved/rejected/cancelled requests
    if (["APPROVED", "REJECTED", "CANCELLED"].includes(request.status) && data.status !== request.status) {
      // Allow re-opening rejected requests for resubmission
      if (request.status === "REJECTED" && data.status === "PENDING") {
        // This is allowed - admin is re-opening for review
      } else {
        return Errors.VALIDATION({
          status: [`Cannot change status from ${request.status}`],
        });
      }
    }

    // If rejecting, require a reason
    if (data.status === "REJECTED" && !data.rejectionReason) {
      return Errors.VALIDATION({
        rejectionReason: ["Rejection reason is required"],
      });
    }

    // Update the request
    const updatedRequest = await prisma.componentRequest.update({
      where: { id },
      data: {
        status: data.status,
        adminNotes: data.adminNotes,
        rejectionReason: data.status === "REJECTED" ? data.rejectionReason : null,
        reviewerId: admin.id,
        reviewedAt: new Date(),
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // TODO: Send email notification to requester about status change

    return successResponse(updatedRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Errors.VALIDATION(error.flatten().fieldErrors as Record<string, string[]>);
    }
    console.error("Error updating component request:", error);
    return Errors.INTERNAL();
  }
}

/**
 * DELETE /api/component-requests/[id]
 * Cancel a request (requester only, if still pending)
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return Errors.UNAUTHORIZED();
    }

    const request = await prisma.componentRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return Errors.NOT_FOUND("Component request");
    }

    // Only requester can cancel their own request
    const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
    if (!isAdmin && request.requesterId !== user.id) {
      return Errors.FORBIDDEN();
    }

    // Can only cancel pending requests (or admin can cancel any)
    if (!isAdmin && request.status !== "PENDING") {
      return Errors.VALIDATION({
        status: ["Can only cancel pending requests"],
      });
    }

    const updatedRequest = await prisma.componentRequest.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });

    return successResponse(updatedRequest);
  } catch (error) {
    console.error("Error cancelling component request:", error);
    return Errors.INTERNAL();
  }
}
