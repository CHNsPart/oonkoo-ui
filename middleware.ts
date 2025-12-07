import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Block dev-only routes in production
  if (process.env.NODE_ENV === "production") {
    const pathname = request.nextUrl.pathname;
    if (pathname.startsWith("/playground")) {
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  const response = NextResponse.next();

  // Add security headers
  // Allow iframe embedding for preview routes
  if (request.nextUrl.pathname.startsWith("/api/preview")) {
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
  } else {
    response.headers.set("X-Frame-Options", "DENY");
  }
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

    // Skip rate limiting in development or if Redis is not configured
    if (
      process.env.NODE_ENV === "development" ||
      !process.env.UPSTASH_REDIS_REST_URL
    ) {
      return response;
    }

    // Dynamic import to avoid issues when Redis is not configured
    try {
      const { checkRateLimit } = await import("./lib/rate-limit");

      // Determine rate limit type based on path
      let limitType: "api" | "auth" | "webhook" | "upload" | "search" = "api";
      if (request.nextUrl.pathname.includes("/auth")) {
        limitType = "auth";
      } else if (request.nextUrl.pathname.includes("/webhook")) {
        limitType = "webhook";
      } else if (request.nextUrl.pathname.includes("/upload")) {
        limitType = "upload";
      } else if (request.nextUrl.pathname.includes("/search")) {
        limitType = "search";
      }

      const result = await checkRateLimit(limitType, ip);

      // Add rate limit headers
      response.headers.set("X-RateLimit-Limit", result.limit.toString());
      response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
      response.headers.set("X-RateLimit-Reset", result.reset.toString());

      if (!result.success) {
        return NextResponse.json(
          { error: "Too many requests", retryAfter: result.reset },
          {
            status: 429,
            headers: {
              "Retry-After": Math.ceil(
                (result.reset - Date.now()) / 1000
              ).toString(),
            },
          }
        );
      }
    } catch {
      // If rate limiting fails, allow the request through
      console.warn("Rate limiting unavailable");
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all API routes
    "/api/:path*",
    // Match all pages except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
