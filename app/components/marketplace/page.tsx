import { Store, Crown, Sparkles, ArrowRight, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Marketplace | OonkooUI",
  description: "Browse and purchase premium components created by verified developers.",
};

export default function MarketplacePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Hero Banner */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-orange-500/10">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Store className="h-4 w-4 text-purple-500" />
              <span>Marketplace</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Premium Components{" "}
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Discover premium components created by verified developers.
              Purchase high-quality, production-ready UI components for your projects.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" disabled className="gap-2">
                <Crown className="h-4 w-4" />
                Become a Seller
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/components/community" className="gap-2">
                  <Users className="h-4 w-4" />
                  Browse Community
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/10">
            <Sparkles className="h-10 w-10 text-purple-500" />
          </div>
          <h2 className="mb-3 text-2xl font-semibold">Coming Soon</h2>
          <p className="mb-8 max-w-md text-muted-foreground">
            We&apos;re building a marketplace where verified sellers can list their premium components.
            Developers can monetize their work and buyers get quality components.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Premium Components</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Verified Sellers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <span>Secure Payments</span>
            </div>
          </div>

          {/* Seller Benefits */}
          <div className="mt-12 grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
            <div className="rounded-lg border bg-card p-4 text-left">
              <DollarSign className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-semibold mb-1">80% Revenue</h3>
              <p className="text-sm text-muted-foreground">
                Keep 80% of every sale. We only take 20% platform fee.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 text-left">
              <Crown className="h-8 w-8 text-purple-500 mb-2" />
              <h3 className="font-semibold mb-1">Verified Badge</h3>
              <p className="text-sm text-muted-foreground">
                Get verified status and build trust with buyers.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 text-left">
              <Store className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="font-semibold mb-1">Global Reach</h3>
              <p className="text-sm text-muted-foreground">
                Sell to developers worldwide through our platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
