import { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/kinde";
import { successResponse, Errors } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Schema for approval
const approveSchema = z.object({
  adminNotes: z.string().optional(),
});

/**
 * POST /api/component-requests/[id]/approve
 * Approve a request (marks it ready for publishing via /dev)
 * - Updates request status to APPROVED
 * - Does NOT create a component (that's done via /dev publish)
 * - Admin should go to /dev/{slug} to configure preview and publish
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const admin = await requireAdmin();

    const body = await req.json().catch(() => ({}));
    const data = approveSchema.parse(body);

    // Get the request
    const request = await prisma.componentRequest.findUnique({
      where: { id },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!request) {
      return Errors.NOT_FOUND("Component request");
    }

    // Can only approve requests in TESTING status
    if (request.status !== "TESTING") {
      return Errors.VALIDATION({
        status: [`Can only approve requests in TESTING status. Current status: ${request.status}`],
      });
    }

    // Update the request status to APPROVED (but don't create component yet)
    const updatedRequest = await prisma.componentRequest.update({
      where: { id },
      data: {
        status: "APPROVED",
        adminNotes: data.adminNotes,
        reviewerId: admin.id,
        reviewedAt: new Date(),
        // Note: publishedComponentId remains null until published via /dev
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return successResponse({
      message: "Component request approved. Go to /dev to configure preview and publish.",
      request: updatedRequest,
      nextStep: {
        action: "Go to Dev Platform",
        url: `/dev/${request.slug}`,
        description: "Configure preview settings and publish the component with the original author attached.",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Errors.VALIDATION(error.flatten().fieldErrors as Record<string, string[]>);
    }
    console.error("Error approving component request:", error);
    return Errors.INTERNAL();
  }
}
