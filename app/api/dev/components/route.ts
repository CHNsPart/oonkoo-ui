import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOfficialComponent } from "@/lib/component-config";

// Only allow in development
const isDev = process.env.NODE_ENV === "development";

export async function GET() {
  if (!isDev) {
    return NextResponse.json(
      { error: "Only available in development" },
      { status: 403 }
    );
  }

  try {
    // Fetch all published components from database
    const dbComponents = await prisma.component.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        name: true,
        tier: true,
        category: true,
        badge: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { tier: "asc" },
        { category: "asc" },
        { name: "asc" },
      ],
    });

    // Transform to the format expected by dev-layout
    const components = dbComponents.map((c) => ({
      slug: c.slug,
      name: c.name,
      tier: c.tier.toLowerCase(),
      category: c.category.toLowerCase(),
      badge: c.badge?.toLowerCase() || "default",
      isOfficial: isOfficialComponent(c.slug),
      author: c.author
        ? {
            id: c.author.id,
            name: c.author.name,
          }
        : null,
    }));

    return NextResponse.json({
      components,
      count: components.length,
    });
  } catch (error) {
    console.error("Error fetching dev components:", error);
    return NextResponse.json(
      { error: "Failed to fetch components" },
      { status: 500 }
    );
  }
}
