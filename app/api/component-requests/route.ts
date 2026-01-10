import { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAuth, requireAdmin } from "@/lib/kinde";
import { successResponse, Errors } from "@/lib/api-response";

// Schema for individual file in multi-file submission
const fileSchema = z.object({
  filename: z.string().min(1, "Filename is required").max(100),
  filepath: z.string().min(1, "Filepath is required").max(200),
  content: z.string().min(10, "File content must be at least 10 characters"),
  isMain: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

// Schema for creating a new component request
const createRequestSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  // Support both single code field (legacy) and files array (new)
  code: z.string().min(50, "Code must be at least 50 characters").optional(),
  files: z.array(fileSchema).max(10, "Maximum 10 files allowed").optional(),
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
}).refine(
  (data) => data.code || (data.files && data.files.length > 0),
  { message: "Either code or files must be provided", path: ["code"] }
).refine(
  (data) => {
    if (!data.files || data.files.length === 0) return true;
    const mainFiles = data.files.filter(f => f.isMain);
    return mainFiles.length === 1;
  },
  { message: "Exactly one file must be marked as main", path: ["files"] }
).refine(
  (data) => {
    if (!data.files || data.files.length === 0) return true;
    const filepaths = data.files.map(f => f.filepath);
    return new Set(filepaths).size === filepaths.length;
  },
  { message: "Duplicate filepaths are not allowed", path: ["files"] }
);

/**
 * GET /api/component-requests
 * List component requests
 * - Admin: sees all requests with filters
 * - User: sees only their own requests
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Errors.UNAUTHORIZED();
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "10");

    const isUserAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

    // Build where clause
    const where: any = {};

    // Non-admins can only see their own requests
    if (!isUserAdmin) {
      where.requesterId = user.id;
    }

    // Filter by status if provided
    if (status && ["PENDING", "IN_REVIEW", "TESTING", "APPROVED", "REJECTED", "CANCELLED"].includes(status)) {
      where.status = status;
    }

    const [requests, total] = await Promise.all([
      prisma.componentRequest.findMany({
        where,
        include: {
          requester: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          reviewer: {
            select: {
              id: true,
              name: true,
            },
          },
          files: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.componentRequest.count({ where }),
    ]);

    return successResponse(requests, {
      page,
      pageSize,
      total,
      hasMore: page * pageSize < total,
    });
  } catch (error) {
    console.error("Error fetching component requests:", error);
    return Errors.INTERNAL();
  }
}

/**
 * POST /api/component-requests
 * Submit a new component request
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    // Check if user can submit requests (must be at least CONTRIBUTOR or have completed profile)
    // For MVP, any authenticated user can submit

    const body = await req.json();
    const data = createRequestSchema.parse(body);

    // Validate tier - only SELLER can submit COMMUNITY_PAID
    if (data.tier === "COMMUNITY_PAID") {
      if (user.sellerStatus !== "VERIFIED") {
        return Errors.FORBIDDEN();
      }
      if (!data.price) {
        return Errors.VALIDATION({ price: ["Price is required for paid components"] });
      }
    }

    // Generate slug from name
    const baseSlug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const suffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${suffix}`;

    // Check for duplicate slug
    const existingSlug = await prisma.componentRequest.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return Errors.VALIDATION({ slug: ["A request with this name already exists"] });
    }

    // Determine the main code: either from files array (main file) or legacy code field
    let mainCode = data.code ?? "";
    if (data.files && data.files.length > 0) {
      const mainFile = data.files.find(f => f.isMain);
      mainCode = mainFile?.content ?? data.files[0].content;
    }

    // Create the request with files in a transaction
    const request = await prisma.$transaction(async (tx) => {
      // Create the component request
      const newRequest = await tx.componentRequest.create({
        data: {
          requesterId: user.id,
          name: data.name,
          slug,
          description: data.description,
          code: mainCode, // Store main code for backward compatibility
          previewCode: data.previewCode,
          previewImage: data.previewImage,
          type: data.type,
          tier: data.tier,
          category: data.category,
          tags: data.tags,
          dependencies: data.dependencies,
          price: data.tier === "COMMUNITY_PAID" ? data.price : null,
          status: "PENDING",
        },
      });

      // If files are provided, create file records
      if (data.files && data.files.length > 0) {
        await tx.componentRequestFile.createMany({
          data: data.files.map((file, index) => ({
            requestId: newRequest.id,
            filename: file.filename,
            filepath: file.filepath,
            content: file.content,
            isMain: file.isMain,
            order: file.order ?? index,
          })),
        });
      } else if (data.code) {
        // Legacy mode: create a single file from the code field
        await tx.componentRequestFile.create({
          data: {
            requestId: newRequest.id,
            filename: `${slug}.tsx`,
            filepath: `${slug}.tsx`,
            content: data.code,
            isMain: true,
            order: 0,
          },
        });
      }

      // Fetch the complete request with files
      return tx.componentRequest.findUnique({
        where: { id: newRequest.id },
        include: {
          requester: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          files: {
            orderBy: { order: "asc" },
          },
        },
      });
    });

    return successResponse(request, undefined, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Errors.VALIDATION(error.flatten().fieldErrors as Record<string, string[]>);
    }
    console.error("Error creating component request:", error);
    return Errors.INTERNAL();
  }
}
