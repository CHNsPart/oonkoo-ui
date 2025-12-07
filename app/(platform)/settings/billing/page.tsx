"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowLeft,
  Loader2,
  Crown,
  Zap,
  Check
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckoutButton } from "@/components/checkout-button";
import { subscriptionPlans } from "@/config/subscription";

interface SubscriptionData {
  subscription: {
    id: string;
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    canceledAt: string | null;
    price: {
      amount: number;
      currency: string;
      interval: string;
    } | null;
    paymentMethod: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
    } | null;
  } | null;
  isPro: boolean;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function StatusBadge({ status, cancelAtPeriodEnd }: { status: string; cancelAtPeriodEnd: boolean }) {
  if (cancelAtPeriodEnd) {
    return (
      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
        <AlertCircle className="mr-1 h-3 w-3" />
        Canceling
      </Badge>
    );
  }

  switch (status) {
    case "active":
      return (
        <Badge className="bg-emerald-500 hover:bg-emerald-600">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Active
        </Badge>
      );
    case "past_due":
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Past Due
        </Badge>
      );
    case "canceled":
      return (
        <Badge variant="secondary">
          <XCircle className="mr-1 h-3 w-3" />
          Canceled
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {capitalizeFirst(status)}
        </Badge>
      );
  }
}

export default function BillingPage() {
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch("/api/stripe/subscription");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  async function handleManageSubscription() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const json = await res.json();
      if (json.success && json.data.url) {
        window.location.href = json.data.url;
      }
    } catch (error) {
      console.error("Failed to open portal:", error);
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 max-w-4xl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  const subscription = data?.subscription;
  const isPro = data?.isPro ?? false;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and payment details.
          </p>
        </div>
      </div>

      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPro ? (
                <div className="p-2 rounded-lg bg-primary/10">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-muted">
                  <Zap className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <CardTitle>{isPro ? "Pro Plan" : "Free Plan"}</CardTitle>
                <CardDescription>
                  {isPro
                    ? "Full access to all premium features"
                    : "Basic access to free components"}
                </CardDescription>
              </div>
            </div>
            {subscription && (
              <StatusBadge
                status={subscription.status}
                cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isPro && subscription ? (
            <>
              {/* Subscription Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-2xl font-bold">
                    {subscription.price
                      ? `${formatCurrency(subscription.price.amount, subscription.price.currency)}/${subscription.price.interval}`
                      : "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {subscription.cancelAtPeriodEnd ? "Access Until" : "Next Billing Date"}
                  </p>
                  <p className="text-lg font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
              </div>

              {subscription.cancelAtPeriodEnd && (
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-500">Subscription Canceling</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your subscription will end on {formatDate(subscription.currentPeriodEnd)}.
                        You&apos;ll continue to have access until then.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Payment Method */}
              {subscription.paymentMethod && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Payment Method</p>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {capitalizeFirst(subscription.paymentMethod.brand)} ending in {subscription.paymentMethod.last4}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires {subscription.paymentMethod.expMonth}/{subscription.paymentMethod.expYear}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                    >
                      {portalLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="flex-1"
                >
                  {portalLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Manage Subscription
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Free Plan - Current Features */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You&apos;re currently on the Free plan. Here&apos;s what&apos;s included:
                </p>
                <div className="grid gap-2">
                  {subscriptionPlans[0].features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pro Plan Card - Show for free users */}
      {!isPro && (
        <Card className="border-primary shadow-lg relative">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
            Most Popular
          </Badge>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/pro-plan-badge.svg"
                alt="Pro Plan"
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <div>
                <CardTitle className="text-2xl">Pro Plan</CardTitle>
                <CardDescription>{subscriptionPlans[1].description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <span className="text-4xl font-bold">
                ${subscriptionPlans[1].price.monthly}
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <div className="grid gap-2">
              {subscriptionPlans[1].features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <CheckoutButton className="w-full">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </CheckoutButton>

            <p className="text-xs text-center text-muted-foreground">
              Cancel anytime. No questions asked.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Billing History Card - For Pro users */}
      {isPro && (
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              View and download your past invoices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              disabled={portalLoading}
            >
              {portalLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  View Invoices
                  <ExternalLink className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Opens Stripe billing portal to view all invoices and receipts.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
