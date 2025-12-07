import { NextRequest } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/kinde";
import { ApiKeyService } from "@/services/api-key.service";
import { successResponse, Errors } from "@/lib/api-response";

const MAX_KEYS_PER_USER = 5;

const createKeySchema = z.object({
  name: z.string().min(1).max(50).optional().default("Default"),
});

// GET - List all API keys for the user
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Errors.UNAUTHORIZED();
    }

    const keys = await ApiKeyService.listKeys(user.id);
    return successResponse(keys);
  } catch (error) {
    console.error("List API keys error:", error);
    return Errors.INTERNAL();
  }
}

// POST - Create a new API key
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Errors.UNAUTHORIZED();
    }

    // Check key limit
    const keyCount = await ApiKeyService.getKeyCount(user.id);
    if (keyCount >= MAX_KEYS_PER_USER) {
      return Errors.BAD_REQUEST(`Maximum of ${MAX_KEYS_PER_USER} API keys allowed`);
    }

    const body = await req.json();
    const validated = createKeySchema.safeParse(body);

    if (!validated.success) {
      return Errors.VALIDATION(validated.error.flatten().fieldErrors);
    }

    const apiKey = await ApiKeyService.createKey(user.id, validated.data.name);

    return successResponse(apiKey, undefined, 201);
  } catch (error) {
    console.error("Create API key error:", error);
    return Errors.INTERNAL();
  }
}
