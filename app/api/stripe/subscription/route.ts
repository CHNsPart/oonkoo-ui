import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/kinde";
import { stripe } from "@/lib/stripe";
import { Errors, successResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Errors.UNAUTHORIZED();
    }

    if (!user.subscription?.stripeSubscriptionId) {
      return successResponse({
        subscription: null,
        isPro: false,
      });
    }

    // Fetch full subscription details from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      user.subscription.stripeSubscriptionId,
      {
        expand: ["default_payment_method", "latest_invoice"],
      }
    );

    // Get the price details
    const priceId = stripeSubscription.items.data[0]?.price.id;
    const price = priceId ? await stripe.prices.retrieve(priceId) : null;

    // Type assertion for Stripe subscription period fields
    const periodStart = (stripeSubscription as unknown as { current_period_start: number }).current_period_start;
    const periodEnd = (stripeSubscription as unknown as { current_period_end: number }).current_period_end;

    // Format the response
    const subscription = {
      id: stripeSubscription.id,
      status: stripeSubscription.status,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      currentPeriodStart: new Date(periodStart * 1000).toISOString(),
      currentPeriodEnd: new Date(periodEnd * 1000).toISOString(),
      canceledAt: stripeSubscription.canceled_at
        ? new Date(stripeSubscription.canceled_at * 1000).toISOString()
        : null,
      price: price ? {
        amount: price.unit_amount ? price.unit_amount / 100 : 0,
        currency: price.currency,
        interval: price.recurring?.interval,
      } : null,
      paymentMethod: stripeSubscription.default_payment_method &&
        typeof stripeSubscription.default_payment_method === "object" &&
        stripeSubscription.default_payment_method.type === "card"
        ? {
            brand: stripeSubscription.default_payment_method.card?.brand,
            last4: stripeSubscription.default_payment_method.card?.last4,
            expMonth: stripeSubscription.default_payment_method.card?.exp_month,
            expYear: stripeSubscription.default_payment_method.card?.exp_year,
          }
        : null,
    };

    return successResponse({
      subscription,
      isPro: stripeSubscription.status === "active",
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    return Errors.INTERNAL();
  }
}
