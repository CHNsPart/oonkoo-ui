import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/kinde";
import { ComponentType, ComponentTier, ComponentCategory, ComponentStatus, ComponentBadge } from "@prisma/client";
import { detectComplexDependencies, generateComponentPath, regenerateRegistry } from "@/lib/registry-generator";

// Only allow in development
const isDev = process.env.NODE_ENV === "development";

// Map string categories to enum values
const categoryMap: Record<string, ComponentCategory> = {
  hero: ComponentCategory.HERO,
  features: ComponentCategory.FEATURES,
  pricing: ComponentCategory.PRICING,
  testimonials: ComponentCategory.TESTIMONIALS,
  faq: ComponentCategory.FAQ,
  footer: ComponentCategory.FOOTER,
  navigation: ComponentCategory.NAVIGATION,
  dashboard: ComponentCategory.DASHBOARD,
  forms: ComponentCategory.FORMS,
  cards: ComponentCategory.CARDS,
  buttons: ComponentCategory.BUTTONS,
  cursor: ComponentCategory.CURSOR,
  animations: ComponentCategory.ANIMATIONS,
  background: ComponentCategory.BACKGROUND,
  other: ComponentCategory.OTHER,
};

// Map string types to enum values
const typeMap: Record<string, ComponentType> = {
  block: ComponentType.BLOCK,
  element: ComponentType.ELEMENT,
  template: ComponentType.TEMPLATE,
  animation: ComponentType.ANIMATION,
};

// Map string tiers to enum values
const tierMap: Record<string, ComponentTier> = {
  free: ComponentTier.FREE,
  pro: ComponentTier.PRO,
  community_free: ComponentTier.COMMUNITY_FREE,
  community_paid: ComponentTier.COMMUNITY_PAID,
};

// Map string badges to enum values
const badgeMap: Record<string, ComponentBadge> = {
  default: ComponentBadge.DEFAULT,
  new: ComponentBadge.NEW,
  updated: ComponentBadge.UPDATED,
};

export async function POST(request: NextRequest) {
  // Only allow in development mode
  if (!isDev) {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { folder, meta, code, previewConfig } = body;

    // Validate required fields
    if (!meta || !code) {
      return NextResponse.json(
        { error: "Missing required fields (meta or code)" },
        { status: 400 }
      );
    }

    const { name, slug, description, type, tier, category, tags, dependencies, registryDependencies, cssSetup, controls, badge, authorId: metaAuthorId } = meta;

    // Detect complex dependencies and generate component path
    const depsArray = Array.isArray(dependencies) ? dependencies : [];
    const hasComplexDeps = detectComplexDependencies(depsArray);
    const componentPath = generateComponentPath(slug);

    if (!name || !slug || !description) {
      return NextResponse.json(
        { error: "Missing required meta fields (name, slug, or description)" },
        { status: 400 }
      );
    }

    // Map category string to enum
    const categoryEnum = categoryMap[category?.toLowerCase()] || ComponentCategory.OTHER;
    const typeEnum = typeMap[type?.toLowerCase()] || ComponentType.BLOCK;
    const tierEnum = tierMap[tier?.toLowerCase()] || ComponentTier.FREE;
    const badgeEnum = badgeMap[badge?.toLowerCase()] || ComponentBadge.DEFAULT;

    // Prepare metadata object with controls
    // Use Prisma.DbNull to explicitly set to database NULL, or undefined to skip the field
    const metadata = controls && controls.length > 0 ? { controls } : Prisma.DbNull;

    // Check if component already exists
    const existingComponent = await prisma.component.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    });

    let component;

    let action: "created" | "updated";
    let warning: string | null = null;

    // Determine authorId - use metaAuthorId for community components, otherwise current user
    const isCommunityTier = tierEnum === ComponentTier.COMMUNITY_FREE || tierEnum === ComponentTier.COMMUNITY_PAID;
    const existingIsCommunity = existingComponent?.tier === ComponentTier.COMMUNITY_FREE || existingComponent?.tier === ComponentTier.COMMUNITY_PAID;
    const authorIdToUse = isCommunityTier && metaAuthorId ? metaAuthorId : user.id;

    // Overwrite protection checks
    if (existingComponent) {
      // Check 1: Trying to change from community to official (or vice versa)
      if (existingIsCommunity && !isCommunityTier) {
        return NextResponse.json(
          {
            error: "Cannot change a community component to official. This component was submitted by a community member.",
            existingAuthor: existingComponent.author?.name || "Unknown",
            suggestion: "If you need to create an official version, use a different slug."
          },
          { status: 400 }
        );
      }

      // Check 2: Trying to overwrite community component without matching author
      if (existingIsCommunity && isCommunityTier && existingComponent.authorId !== authorIdToUse) {
        return NextResponse.json(
          {
            error: `This community component belongs to "${existingComponent.author?.name || 'another user'}". Select the correct author before publishing.`,
            existingAuthorId: existingComponent.authorId,
            existingAuthorName: existingComponent.author?.name,
            suggestion: "Use 'Load from Request' to auto-fill the correct author."
          },
          { status: 400 }
        );
      }

      // Check 3: Official component being updated - just add warning if author is different
      if (!existingIsCommunity && existingComponent.authorId !== user.id) {
        warning = `Note: You are updating a component originally created by another admin.`;
      }
    }

    if (existingComponent) {
      // Update existing component
      component = await prisma.component.update({
        where: { slug },
        data: {
          name,
          description,
          code,
          type: typeEnum,
          tier: tierEnum,
          category: categoryEnum,
          badge: badgeEnum,
          tags: tags || [],
          dependencies: dependencies ? JSON.stringify(dependencies) : undefined,
          registryDeps: registryDependencies || [],
          cssSetup: cssSetup || null,
          metadata,
          // New preview system fields
          previewConfig: previewConfig || Prisma.DbNull,
          hasComplexDeps,
          componentPath,
          status: ComponentStatus.PUBLISHED,
          // Update author for community components
          ...(isCommunityTier && metaAuthorId ? { authorId: metaAuthorId } : {}),
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      });
      action = "updated";
    } else {
      // Create new component
      component = await prisma.component.create({
        data: {
          name,
          slug,
          description,
          code,
          type: typeEnum,
          tier: tierEnum,
          category: categoryEnum,
          badge: badgeEnum,
          tags: tags || [],
          dependencies: dependencies ? JSON.stringify(dependencies) : undefined,
          registryDeps: registryDependencies || [],
          cssSetup: cssSetup || null,
          metadata,
          // New preview system fields
          previewConfig: previewConfig || Prisma.DbNull,
          hasComplexDeps,
          componentPath,
          status: ComponentStatus.PUBLISHED,
          authorId: authorIdToUse,
          publishedAt: new Date(),
        },
      });
      action = "created";
    }

    // If this is a community component, link it to the original request
    if (isCommunityTier && action === "created") {
      try {
        await prisma.componentRequest.updateMany({
          where: {
            slug: slug,
            status: "APPROVED",
            publishedComponentId: null,
          },
          data: {
            publishedComponentId: component.id,
          },
        });
      } catch (linkError) {
        console.error("[Publish] Failed to link request to component:", linkError);
        // Don't fail the publish if linking fails
      }
    }

    // Auto-regenerate component registry (dev only)
    try {
      const registryCount = await regenerateRegistry();
      console.log(`[Publish] Registry regenerated with ${registryCount} components`);
    } catch (registryError) {
      console.error("[Publish] Failed to regenerate registry:", registryError);
      // Don't fail the publish if registry regeneration fails
    }

    return NextResponse.json({
      success: true,
      message: `Component "${name}" ${action} successfully`,
      data: component,
      action,
      hasComplexDeps,
      componentPath,
      ...(warning ? { warning } : {}),
    });
  } catch (error) {
    console.error("Error publishing component:", error);

    return NextResponse.json(
      { error: "Failed to publish component" },
      { status: 500 }
    );
  }
}
