import { stripe, PRICES, PLATFORM_FEE_PERCENT } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export class StripeService {
  // =====================
  // SUBSCRIPTIONS
  // =====================

  /**
   * Create a Stripe Checkout session for Pro subscription
   */
  static async createCheckoutSession(userId: string, email: string) {
    // Get or create Stripe customer
    let subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });
      customerId = customer.id;

      // Create subscription record with UNPAID status
      await prisma.subscription.create({
        data: {
          userId,
          stripeCustomerId: customerId,
          status: "UNPAID",
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRICES.PRO_MONTHLY,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: { userId },
    });

    return session;
  }

  /**
   * Create a Stripe Billing Portal session
   */
  static async createPortalSession(customerId: string) {
    return stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    });
  }

  // =====================
  // STRIPE CONNECT (for marketplace)
  // =====================

  /**
   * Create a Stripe Connect Express account for sellers
   */
  static async createConnectAccount(userId: string, email: string) {
    const account = await stripe.accounts.create({
      type: "express",
      email,
      metadata: { userId },
      capabilities: {
        transfers: { requested: true },
      },
    });

    // Save to user
    await prisma.user.update({
      where: { id: userId },
      data: { stripeConnectId: account.id },
    });

    return account;
  }

  /**
   * Create an onboarding link for Stripe Connect
   */
  static async createConnectOnboardingLink(accountId: string) {
    return stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/onboard?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/onboard?success=true`,
      type: "account_onboarding",
    });
  }

  // =====================
  // MARKETPLACE PAYMENTS
  // =====================

  /**
   * Create a payment intent for purchasing a component
   */
  static async createComponentPurchase(
    buyerId: string,
    componentId: string,
    amount: number,
    sellerConnectId: string
  ) {
    const platformFee = Math.round(amount * (PLATFORM_FEE_PERCENT / 100));

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      application_fee_amount: platformFee * 100,
      transfer_data: {
        destination: sellerConnectId,
      },
      metadata: {
        buyerId,
        componentId,
        type: "component_purchase",
      },
    });

    return paymentIntent;
  }

  // =====================
  // HELPERS
  // =====================

  /**
   * Get subscription status for a user
   */
  static async getSubscriptionStatus(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return { isPro: false, subscription: null };
    }

    const isPro = subscription.status === "ACTIVE";

    return { isPro, subscription };
  }
}
