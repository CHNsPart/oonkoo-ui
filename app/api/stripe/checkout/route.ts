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

    // Check if already subscribed
    if (user.subscription?.status === "ACTIVE") {
      return Errors.BAD_REQUEST("You already have an active subscription");
    }

    const session = await StripeService.createCheckoutSession(
      user.id,
      user.email
    );

    return successResponse({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return Errors.INTERNAL();
  }
}
