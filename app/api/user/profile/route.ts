import { NextRequest } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/kinde";
import { prisma } from "@/lib/prisma";
import { Errors, successResponse } from "@/lib/api-response";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  techStack: z.array(z.string()).max(20).optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Errors.UNAUTHORIZED();
    }

    const body = await req.json();
    const validatedData = updateProfileSchema.safeParse(body);

    if (!validatedData.success) {
      return Errors.VALIDATION(validatedData.error.flatten().fieldErrors);
    }

    const { name, bio, githubUrl, twitterUrl, websiteUrl, techStack } =
      validatedData.data;

    // Calculate profile completion
    const profileComplete = Boolean(
      name &&
        bio &&
        techStack &&
        techStack.length > 0 &&
        (githubUrl || twitterUrl || websiteUrl)
    );

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name ?? undefined,
        bio: bio ?? undefined,
        githubUrl: githubUrl || null,
        twitterUrl: twitterUrl || null,
        websiteUrl: websiteUrl || null,
        techStack: techStack ?? undefined,
        profileComplete,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        githubUrl: true,
        twitterUrl: true,
        websiteUrl: true,
        techStack: true,
        profileComplete: true,
      },
    });

    return successResponse(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    return Errors.INTERNAL();
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Errors.UNAUTHORIZED();
    }

    return successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      githubUrl: user.githubUrl,
      twitterUrl: user.twitterUrl,
      websiteUrl: user.websiteUrl,
      techStack: user.techStack,
      profileComplete: user.profileComplete,
      role: user.role,
      sellerStatus: user.sellerStatus,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return Errors.INTERNAL();
  }
}
