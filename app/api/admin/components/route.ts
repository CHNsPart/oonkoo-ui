import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/kinde";
import { ComponentType, ComponentTier, ComponentCategory, ComponentStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();

    const body = await request.json();
    const {
      name,
      slug,
      description,
      code,
      type,
      tier,
      category,
      tags,
      dependencies,
      registryDeps,
    } = body;

    // Validate required fields
    if (!name || !slug || !description || !code) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingComponent = await prisma.component.findUnique({
      where: { slug },
    });

    if (existingComponent) {
      return NextResponse.json(
        { error: "A component with this slug already exists" },
        { status: 400 }
      );
    }

    // Create component
    const component = await prisma.component.create({
      data: {
        name,
        slug,
        description,
        code,
        type: type as ComponentType,
        tier: tier as ComponentTier,
        category: category as ComponentCategory,
        tags: tags || [],
        dependencies: dependencies ? JSON.stringify(dependencies) : undefined,
        registryDeps: registryDeps || [],
        status: ComponentStatus.PUBLISHED,
        authorId: user.id,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: component });
  } catch (error) {
    console.error("Error creating component:", error);

    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create component" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await requireAdmin();

    const components = await prisma.component.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: components });
  } catch (error) {
    console.error("Error fetching components:", error);

    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch components" },
      { status: 500 }
    );
  }
}
