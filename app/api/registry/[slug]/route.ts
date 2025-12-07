import { NextRequest } from "next/server";

import { RegistryService } from "@/services/registry.service";
import { getCurrentUser } from "@/lib/kinde";
import { successResponse, Errors } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const user = await getCurrentUser();

    const component = await RegistryService.getComponent(slug, user?.id);

    if (!component) {
      return Errors.NOT_FOUND("Component");
    }

    // Track download if requested via query param
    const { searchParams } = new URL(req.url);
    if (searchParams.get("download") === "true") {
      await RegistryService.trackDownload(slug);
    }

    return successResponse(component);
  } catch (error) {
    console.error("Registry component error:", error);
    return Errors.INTERNAL();
  }
}
