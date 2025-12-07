"use client";

import Link from "next/link";
import { Crown, Sparkles, Zap, Check } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DocsRightSidebar() {
  const { user, isAuthenticated } = useKindeBrowserClient();

  // TODO: Check if user has pro subscription
  const isPro = false;

  if (isPro) {
    return null;
  }

  return (
    <aside className="hidden xl:block w-[280px] shrink-0 border-l">
      <div className="sticky top-16 p-6">
        <Card className="bg-gradient-to-br from-purple-500/10 via-background to-pink-500/10 border-purple-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                <Crown className="h-4 w-4 text-purple-500" />
              </div>
              <CardTitle className="text-lg">Upgrade to Pro</CardTitle>
            </div>
            <CardDescription>
              Unlock all premium components and features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>50+ Premium Components</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Lifetime Updates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Priority Support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Figma Files Included</span>
              </li>
            </ul>
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
              <Link href="/pricing">
                <Sparkles className="mr-2 h-4 w-4" />
                View Pricing
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="font-medium text-sm">Quick Tip</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Use the CLI to quickly add components to your project
          </p>
          <code className="bg-primary/10 px-1 py-0.5 rounded text-[11px] text-primary font-semibold font-mono">
            npx oonkoo add [component]
          </code>
        </div>
      </div>
    </aside>
  );
}
