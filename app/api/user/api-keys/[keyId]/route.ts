import { getCurrentUser } from "@/lib/kinde";
import { ApiKeyService } from "@/services/api-key.service";
import { successResponse, Errors } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ keyId: string }>;
}

// DELETE - Revoke an API key
export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Errors.UNAUTHORIZED();
    }

    const { keyId } = await params;
    const deleted = await ApiKeyService.deleteKey(user.id, keyId);

    if (!deleted) {
      return Errors.NOT_FOUND("API Key");
    }

    return successResponse({ deleted: true });
  } catch (error) {
    console.error("Delete API key error:", error);
    return Errors.INTERNAL();
  }
}
