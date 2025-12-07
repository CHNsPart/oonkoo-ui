import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/kinde";
import { StripeService } from "@/services/stripe.service";
import { Errors, successResponse } from "@/lib/api-response";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Errors.UNAUTHORIZED();
    }

    if (!user.subscription?.stripeCustomerId) {
      return Errors.BAD_REQUEST("No subscription found");
    }

    const session = await StripeService.createPortalSession(
      user.subscription.stripeCustomerId
    );

    return successResponse({ url: session.url });
  } catch (error) {
    console.error("Portal error:", error);
    return Errors.INTERNAL();
  }
}
