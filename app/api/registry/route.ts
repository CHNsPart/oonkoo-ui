import { NextRequest } from "next/server";

import { RegistryService } from "@/services/registry.service";
import { successResponse, Errors } from "@/lib/api-response";
import type { RegistrySearchParams } from "@/types/registry";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const params: RegistrySearchParams = {
      query: searchParams.get("q") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      tier: searchParams.get("tier") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      tags: searchParams.get("tags")?.split(",").filter(Boolean) ?? undefined,
      sort: (searchParams.get("sort") as RegistrySearchParams["sort"]) ?? "downloads",
      page: parseInt(searchParams.get("page") ?? "1", 10),
      limit: Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100),
    };

    const { components, meta } = await RegistryService.getIndex(params);

    return successResponse(
      {
        name: "oonkoo",
        version: "1.0.0",
        components,
      },
      meta
    );
  } catch (error) {
    console.error("Registry index error:", error);
    return Errors.INTERNAL();
  }
}
