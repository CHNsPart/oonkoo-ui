import { Users, Heart, Sparkles, ArrowRight, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Community Components | OonkooUI",
  description: "Browse free components created by the OonkooUI community developers.",
};

export default function CommunityPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Hero Banner */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Community Components</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Built by the{" "}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Discover free components created by developers like you. Share your work, get inspired,
              and contribute to the growing collection of community-built UI components.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" disabled className="gap-2">
                <Heart className="h-4 w-4" />
                Submit Component
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/components/marketplace" className="gap-2">
                  <Store className="h-4 w-4" />
                  Marketplace
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
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10">
            <Sparkles className="h-10 w-10 text-blue-500" />
          </div>
          <h2 className="mb-3 text-2xl font-semibold">Coming Soon</h2>
          <p className="mb-8 max-w-md text-muted-foreground">
            We&apos;re building a platform where you can share your free custom components with the community.
            Stay tuned for updates!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Free Components</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <span>Voting & Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Creator Profiles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
