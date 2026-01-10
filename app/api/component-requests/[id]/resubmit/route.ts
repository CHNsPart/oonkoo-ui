import { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/kinde";
import { successResponse, Errors } from "@/lib/api-response";

// Schema for resubmitting a request
const resubmitSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  code: z.string().min(50, "Code must be at least 50 characters"),
  previewCode: z.string().optional(),
  previewImage: z.string().url().optional(),
  type: z.enum(["BLOCK", "ELEMENT", "TEMPLATE", "ANIMATION"]).default("BLOCK"),
  tier: z.enum(["COMMUNITY_FREE", "COMMUNITY_PAID"]).default("COMMUNITY_FREE"),
  category: z.enum([
    "HERO", "FEATURES", "PRICING", "TESTIMONIALS", "FAQ", "FOOTER",
    "NAVIGATION", "DASHBOARD", "FORMS", "CARDS", "BUTTONS", "CURSOR",
    "ANIMATIONS", "BACKGROUND", "OTHER"
  ]).default("OTHER"),
  tags: z.array(z.string()).max(5).default([]),
  dependencies: z.array(z.string()).default([]),
  price: z.number().min(1).max(999).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/component-requests/[id]/resubmit
 * Resubmit a rejected request with updated data
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Find the request and verify ownership + status
    const existingRequest = await prisma.componentRequest.findFirst({
      where: {
        id,
        requesterId: user.id,
        status: "REJECTED",
      },
    });

    if (!existingRequest) {
      return Errors.NOT_FOUND("Request not found or cannot be resubmitted");
    }

    const body = await req.json();
    const data = resubmitSchema.parse(body);

    // Validate tier - only SELLER can submit COMMUNITY_PAID
    if (data.tier === "COMMUNITY_PAID") {
      if (user.sellerStatus !== "VERIFIED") {
        return Errors.FORBIDDEN();
      }
      if (!data.price) {
        return Errors.VALIDATION({ price: ["Price is required for paid components"] });
      }
    }

    // Update the request with new data and reset status
    const updatedRequest = await prisma.componentRequest.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        code: data.code,
        previewCode: data.previewCode || null,
        previewImage: data.previewImage || null,
        type: data.type,
        tier: data.tier,
        category: data.category,
        tags: data.tags,
        dependencies: data.dependencies,
        price: data.tier === "COMMUNITY_PAID" ? data.price : null,
        // Reset status and review fields
        status: "PENDING",
        rejectionReason: null,
        adminNotes: null,
        reviewerId: null,
        reviewedAt: null,
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

    return successResponse(updatedRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Errors.VALIDATION(error.flatten().fieldErrors as Record<string, string[]>);
    }
    console.error("Error resubmitting request:", error);
    return Errors.INTERNAL();
  }
}
