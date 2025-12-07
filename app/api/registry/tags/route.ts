import { NextRequest } from "next/server";

import { RegistryService } from "@/services/registry.service";
import { successResponse, Errors } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

    const tags = await RegistryService.getPopularTags(limit);
    return successResponse(tags);
  } catch (error) {
    console.error("Registry tags error:", error);
    return Errors.INTERNAL();
  }
}
