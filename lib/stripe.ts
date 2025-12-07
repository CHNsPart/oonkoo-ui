import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

// Price IDs from Stripe Dashboard
export const PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
} as const;

// Platform fee for marketplace (20%)
export const PLATFORM_FEE_PERCENT = 20;

// Subscription plan details
export const PLANS = {
  FREE: {
    name: "Free",
    description: "For individuals getting started",
    price: 0,
  },
  PRO: {
    name: "Pro",
    description: "For professional developers",
    price: 10,
  },
} as const;
