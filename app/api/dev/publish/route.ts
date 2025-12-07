import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/kinde";
import { ComponentType, ComponentTier, ComponentCategory, ComponentStatus } from "@prisma/client";

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
  animations: ComponentCategory.ANIMATIONS,
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
    const { folder, meta, code } = body;

    // Validate required fields
    if (!meta || !code) {
      return NextResponse.json(
        { error: "Missing required fields (meta or code)" },
        { status: 400 }
      );
    }

    const { name, slug, description, type, tier, category, tags, dependencies, registryDependencies, cssSetup } = meta;

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

    // Check if component already exists
    const existingComponent = await prisma.component.findUnique({
      where: { slug },
    });

    let component;

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
          tags: tags || [],
          dependencies: dependencies ? JSON.stringify(dependencies) : undefined,
          registryDeps: registryDependencies || [],
          cssSetup: cssSetup || null,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: `Component "${name}" updated successfully`,
        data: component,
        action: "updated",
      });
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
          tags: tags || [],
          dependencies: dependencies ? JSON.stringify(dependencies) : undefined,
          registryDeps: registryDependencies || [],
          cssSetup: cssSetup || null,
          status: ComponentStatus.PUBLISHED,
          authorId: user.id,
          publishedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: `Component "${name}" published successfully`,
        data: component,
        action: "created",
      });
    }
  } catch (error) {
    console.error("Error publishing component:", error);

    return NextResponse.json(
      { error: "Failed to publish component" },
      { status: 500 }
    );
  }
}
