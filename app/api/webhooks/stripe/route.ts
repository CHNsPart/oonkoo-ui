import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.mode === "subscription" && session.subscription) {
          await handleSubscriptionCreated(
            session.subscription as string,
            session.customer as string
          );
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        // @ts-expect-error - Stripe types may vary
        const subscriptionId = invoice.subscription;
        if (subscriptionId && typeof subscriptionId === "string") {
          await handleSubscriptionRenewal(subscriptionId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await handleSubscriptionCanceled(subscription.id);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        if (paymentIntent.metadata.type === "component_purchase") {
          await handleComponentPurchase(paymentIntent);
        }
        break;
      }

      case "account.updated": {
        const account = event.data.object;
        await handleConnectAccountUpdate(account);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}

// =====================
// WEBHOOK HANDLERS
// =====================

async function handleSubscriptionCreated(
  subscriptionId: string,
  customerId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const periodStart = (subscription as unknown as { current_period_start: number }).current_period_start;
  const periodEnd = (subscription as unknown as { current_period_end: number }).current_period_end;

  await prisma.subscription.update({
    where: { stripeCustomerId: customerId },
    data: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      status: "ACTIVE",
      currentPeriodStart: new Date(periodStart * 1000),
      currentPeriodEnd: new Date(periodEnd * 1000),
    },
  });

  // Update user role to CONTRIBUTOR if they subscribe
  const sub = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (sub) {
    await prisma.user.update({
      where: { id: sub.userId },
      data: { role: "CONTRIBUTOR" },
    });
  }
}

async function handleSubscriptionRenewal(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const periodStart = (subscription as unknown as { current_period_start: number }).current_period_start;
  const periodEnd = (subscription as unknown as { current_period_end: number }).current_period_end;

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: "ACTIVE",
      currentPeriodStart: new Date(periodStart * 1000),
      currentPeriodEnd: new Date(periodEnd * 1000),
    },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const status =
    subscription.status === "active"
      ? "ACTIVE"
      : subscription.status === "past_due"
        ? "PAST_DUE"
        : subscription.status === "canceled"
          ? "CANCELED"
          : "UNPAID";

  const periodEnd = (subscription as unknown as { current_period_end: number }).current_period_end;

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: new Date(periodEnd * 1000),
    },
  });
}

async function handleSubscriptionCanceled(subscriptionId: string) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: "CANCELED" },
  });
}

async function handleComponentPurchase(paymentIntent: Stripe.PaymentIntent) {
  const { buyerId, componentId } = paymentIntent.metadata;

  const component = await prisma.component.findUnique({
    where: { id: componentId },
    select: { authorId: true, price: true },
  });

  if (!component || !component.price) return;

  const amount = Number(component.price);
  const platformFee = amount * 0.2;
  const sellerAmount = amount * 0.8;

  await prisma.purchase.create({
    data: {
      buyerId,
      componentId,
      sellerId: component.authorId,
      amount,
      platformFee,
      sellerAmount,
      stripePaymentId: paymentIntent.id,
      status: "COMPLETED",
    },
  });
}

async function handleConnectAccountUpdate(account: Stripe.Account) {
  if (account.charges_enabled && account.payouts_enabled) {
    await prisma.user.update({
      where: { stripeConnectId: account.id },
      data: { sellerStatus: "VERIFIED" },
    });
  }
}
