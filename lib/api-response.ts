import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";

export function successResponse<T>(
  data: T,
  meta?: ApiResponse["meta"],
  status = 200
) {
  return NextResponse.json<ApiResponse<T>>(
    { success: true, data, meta },
    { status }
  );
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: Record<string, string[]>
) {
  return NextResponse.json<ApiResponse>(
    { success: false, error: { code, message, details } },
    { status }
  );
}

// Common error responses
export const Errors = {
  UNAUTHORIZED: () =>
    errorResponse("UNAUTHORIZED", "Authentication required", 401),

  FORBIDDEN: () =>
    errorResponse("FORBIDDEN", "Access denied", 403),

  NOT_FOUND: (resource: string) =>
    errorResponse("NOT_FOUND", `${resource} not found`, 404),

  VALIDATION: (details: Record<string, string[]>) =>
    errorResponse("VALIDATION_ERROR", "Validation failed", 400, details),

  BAD_REQUEST: (message: string) =>
    errorResponse("BAD_REQUEST", message, 400),

  CONFLICT: (message: string) =>
    errorResponse("CONFLICT", message, 409),

  RATE_LIMITED: () =>
    errorResponse("RATE_LIMITED", "Too many requests. Please try again later.", 429),

  INTERNAL: () =>
    errorResponse("INTERNAL_ERROR", "Something went wrong", 500),
};
