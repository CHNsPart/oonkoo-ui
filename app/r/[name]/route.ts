import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ComponentStatus, ComponentTier, ComponentType } from "@prisma/client";

/**
 * GET /r/[name].json
 * Shadcn-compatible registry endpoint for individual components
 * This allows users to install OonkooUI components via:
 * npx shadcn@latest add @oonkoo/component-name
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;

    // Remove .json extension if present
    const slug = name.replace(/\.json$/, "");

    const component = await prisma.component.findUnique({
      where: {
        slug,
        status: ComponentStatus.PUBLISHED,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    // Only free and community free components are available via shadcn CLI
    // Pro components require authentication via oonkoo CLI
    if (component.tier === ComponentTier.PRO || component.tier === ComponentTier.COMMUNITY_PAID) {
      return NextResponse.json(
        {
          error: "Pro component",
          message: "This is a Pro component. Use 'npx oonkoo add' with authentication to install.",
        },
        { status: 403 }
      );
    }

    // Parse dependencies
    let dependencies: string[] = [];
    if (component.dependencies) {
      try {
        dependencies = typeof component.dependencies === "string"
          ? JSON.parse(component.dependencies)
          : component.dependencies as string[];
      } catch {
        dependencies = [];
      }
    }

    // Map component type to shadcn registry type
    const typeMap: Record<ComponentType, string> = {
      BLOCK: "registry:block",
      ELEMENT: "registry:component",
      TEMPLATE: "registry:block",
      ANIMATION: "registry:component",
    };

    // Build shadcn-compatible registry item
    const registryItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: component.slug,
      type: typeMap[component.type] || "registry:block",
      title: component.name,
      description: component.description,
      author: component.author.name
        ? `${component.author.name} <${component.author.email || ""}>`
        : "OonkooUI",
      dependencies: dependencies,
      registryDependencies: component.registryDeps || [],
      files: [
        {
          path: `components/oonkoo/${component.slug}.tsx`,
          type: typeMap[component.type] || "registry:block",
          content: component.code,
        },
      ],
      categories: [component.category.toLowerCase()],
      meta: {
        oonkoo: true,
        tier: component.tier.toLowerCase(),
        downloads: component.downloads,
      },
    };

    // Track download
    await prisma.component.update({
      where: { slug },
      data: { downloads: { increment: 1 } },
    });

    return NextResponse.json(registryItem, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Registry item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
