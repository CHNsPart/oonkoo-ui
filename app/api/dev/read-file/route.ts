import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// Only allow in development
const isDev = process.env.NODE_ENV === "development";

export async function POST(request: NextRequest) {
  if (!isDev) {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { error: "Path is required" },
        { status: 400 }
      );
    }

    // Security: only allow reading from specific directories
    const allowedPaths = ['registry/dev/', 'components/ui/', 'components/oonkoo/'];
    const isAllowed = allowedPaths.some(allowedPath => path.startsWith(allowedPath));

    if (!isAllowed) {
      return NextResponse.json(
        { error: `Can only read from: ${allowedPaths.join(', ')}` },
        { status: 403 }
      );
    }

    const fullPath = join(process.cwd(), path);
    const content = readFileSync(fullPath, 'utf-8');

    return NextResponse.json({
      success: true,
      content,
      path
    });
  } catch (error: any) {
    console.error("Error reading file:", error);

    return NextResponse.json(
      { error: error.message || "Failed to read file" },
      { status: 500 }
    );
  }
}
