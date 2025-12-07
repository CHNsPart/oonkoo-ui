import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ComponentBadge } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { slug, badge } = await req.json();

    if (!slug || !badge) {
      return NextResponse.json(
        { error: "Slug and badge are required" },
        { status: 400 }
      );
    }

    // Validate badge value
    if (!["DEFAULT", "NEW", "UPDATED"].includes(badge)) {
      return NextResponse.json(
        { error: "Invalid badge value" },
        { status: 400 }
      );
    }

    // Update the component badge in database
    const updated = await prisma.component.update({
      where: { slug },
      data: { badge: badge as ComponentBadge },
    });

    return NextResponse.json({
      success: true,
      badge: updated.badge,
    });
  } catch (error) {
    console.error("Error updating badge:", error);
    return NextResponse.json(
      { error: "Failed to update badge" },
      { status: 500 }
    );
  }
}
