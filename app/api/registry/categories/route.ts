import { RegistryService } from "@/services/registry.service";
import { successResponse, Errors } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await RegistryService.getCategories();
    return successResponse(categories);
  } catch (error) {
    console.error("Registry categories error:", error);
    return Errors.INTERNAL();
  }
}
