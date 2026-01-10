import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

import { requireAuth } from "@/lib/kinde";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComponentCard } from "@/components/components/component-card";

export const metadata = {
  title: "Favorites - OonkooUI",
  description: "Your upvoted components",
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Map database tier to component tier
const tierMap: Record<string, "free" | "pro" | "community_free" | "community_paid"> = {
  FREE: "free",
  PRO: "pro",
  COMMUNITY_FREE: "community_free",
  COMMUNITY_PAID: "community_paid",
};

export default async function FavoritesPage() {
  const user = await requireAuth();

  // Get user's upvoted components
  const upvotes = await prisma.upvote.findMany({
    where: { userId: user.id },
    include: {
      component: {
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          tier: true,
          category: true,
          downloads: true,
          upvoteCount: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Filter to only published components
  const favoriteComponents = upvotes
    .filter((u) => u.component.status === "PUBLISHED")
    .map((u) => u.component);

  if (favoriteComponents.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Favorites</h1>
          <p className="text-muted-foreground mt-1">
            Components you've upvoted
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Upvote components you love to save them here for quick access.
            </p>
            <Button asChild>
              <Link href="/components">
                Browse Components
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Favorites</h1>
          <p className="text-muted-foreground mt-1">
            {favoriteComponents.length} component{favoriteComponents.length !== 1 ? "s" : ""} you've upvoted
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/components">
            Browse More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {favoriteComponents.map((component) => (
          <ComponentCard
            key={component.slug}
            slug={component.slug}
            name={component.name}
            description={component.description}
            tier={tierMap[component.tier] || "free"}
            category={component.category}
            downloads={component.downloads}
            upvotes={component.upvoteCount}
            isUpvoted={true}
            isAuthenticated={true}
          />
        ))}
      </div>
    </div>
  );
}
