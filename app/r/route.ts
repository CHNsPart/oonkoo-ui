import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ComponentStatus, ComponentTier, ComponentType } from "@prisma/client";

/**
 * GET /r
 * Shadcn-compatible registry index
 * Returns all available free components in shadcn registry format
 */
export async function GET() {
  try {
    const components = await prisma.component.findMany({
      where: {
        status: ComponentStatus.PUBLISHED,
        // Only include free components in the public registry
        tier: {
          in: [ComponentTier.FREE, ComponentTier.COMMUNITY_FREE],
        },
      },
      orderBy: { downloads: "desc" },
      select: {
        name: true,
        slug: true,
        description: true,
        type: true,
        tier: true,
        category: true,
        registryDeps: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    // Map component type to shadcn registry type
    const typeMap: Record<ComponentType, string> = {
      BLOCK: "registry:block",
      ELEMENT: "registry:component",
      TEMPLATE: "registry:block",
      ANIMATION: "registry:component",
    };

    const items = components.map((c) => ({
      name: c.slug,
      type: typeMap[c.type] || "registry:block",
      title: c.name,
      description: c.description,
      registryDependencies: c.registryDeps || [],
      categories: [c.category.toLowerCase()],
    }));

    const registry = {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "oonkoo",
      homepage: "https://ui.oonkoo.com",
      items,
    };

    return NextResponse.json(registry, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Registry index error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
