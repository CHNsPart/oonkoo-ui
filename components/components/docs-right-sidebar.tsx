"use client";

import { Zap } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { ProUpgradeCard } from "./pro-upgrade-card";

export function DocsRightSidebar() {
  const { user, isAuthenticated } = useKindeBrowserClient();

  // TODO: Check if user has pro subscription
  const isPro = false;

  if (isPro) {
    return null;
  }

  return (
    <aside className="hidden xl:block w-[280px] shrink-0 border-l">
      <div className="sticky top-16 p-5 space-y-5">
        {/* Pro Upgrade Card */}
        <ProUpgradeCard />

        {/* Quick Tip */}
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <span className="font-medium text-sm">Quick Tip</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Use the CLI to quickly add components to your project
          </p>
          <code className="block bg-primary/10 px-2 py-1.5 rounded-md text-[11px] text-primary font-semibold font-mono">
            npx oonkoo add [component]
          </code>
        </div>
      </div>
    </aside>
  );
}
