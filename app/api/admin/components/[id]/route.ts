import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/kinde";
import { ComponentType, ComponentTier, ComponentCategory, ComponentStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    const component = await prisma.component.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: component });
  } catch (error) {
    console.error("Error fetching component:", error);

    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch component" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

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
      status,
      featured,
    } = body;

    // Check if component exists
    const existingComponent = await prisma.component.findUnique({
      where: { id },
    });

    if (!existingComponent) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    // Check if new slug conflicts with another component
    if (slug && slug !== existingComponent.slug) {
      const slugConflict = await prisma.component.findFirst({
        where: { slug, id: { not: id } },
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: "A component with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update component
    const component = await prisma.component.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(code && { code }),
        ...(type && { type: type as ComponentType }),
        ...(tier && { tier: tier as ComponentTier }),
        ...(category && { category: category as ComponentCategory }),
        ...(tags && { tags }),
        ...(dependencies !== undefined && {
          dependencies: dependencies ? JSON.stringify(dependencies) : undefined,
        }),
        ...(registryDeps && { registryDeps }),
        ...(status && { status: status as ComponentStatus }),
        ...(featured !== undefined && { featured }),
      },
    });

    return NextResponse.json({ success: true, data: component });
  } catch (error) {
    console.error("Error updating component:", error);

    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update component" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Check if component exists
    const existingComponent = await prisma.component.findUnique({
      where: { id },
    });

    if (!existingComponent) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    // Delete component
    await prisma.component.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Component deleted" });
  } catch (error) {
    console.error("Error deleting component:", error);

    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete component" },
      { status: 500 }
    );
  }
}
