"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/checkout-button";
import { subscriptionPlans } from "@/config/subscription";
import { useAuth } from "@/hooks/use-auth";

export function PricingCards() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  function handleFreeClick() {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      window.location.href = "/api/auth/login?post_login_redirect_url=/dashboard";
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {subscriptionPlans.map((plan) => (
        <Card
          key={plan.id}
          className={
            plan.highlighted
              ? "border-primary shadow-lg relative"
              : "relative"
          }
        >
          {plan.badge && (
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
              {plan.badge}
            </Badge>
          )}
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Image
                src={plan.id === "free" ? "/free-plan-badge.svg" : "/pro-plan-badge.svg"}
                alt={`${plan.name} Plan`}
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
            </div>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <span className="text-4xl font-bold">
                ${plan.price.monthly}
              </span>
              {plan.price.monthly > 0 && (
                <span className="text-muted-foreground">/month</span>
              )}
            </div>
            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {plan.id === "free" ? (
              <Button
                className="w-full"
                variant="outline"
                onClick={handleFreeClick}
                disabled={isLoading ?? false}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isAuthenticated ? (
                  "Go to Dashboard"
                ) : (
                  "Get Started Free"
                )}
              </Button>
            ) : (
              <CheckoutButton className="w-full" size="default">
                Subscribe to Pro
              </CheckoutButton>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
