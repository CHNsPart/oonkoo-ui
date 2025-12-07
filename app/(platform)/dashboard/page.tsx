import Link from "next/link";
import { redirect } from "next/navigation";
import { Blocks, Download, Heart, TrendingUp } from "lucide-react";

import { getCurrentUser } from "@/lib/kinde";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ADMIN_EMAIL = "imchn24@gmail.com";

export const metadata = {
  title: "Dashboard",
  description: "Your OonkooUI dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  // Redirect admin users to admin dashboard
  if (user.email === ADMIN_EMAIL) {
    redirect("/admin");
  }

  const isPro = user.subscription?.status === "ACTIVE";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar ?? undefined} />
            <AvatarFallback>
              {user.name?.charAt(0) ?? user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user.name ?? "Developer"}!
            </h1>
            <p className="text-muted-foreground">
              {isPro ? (
                <Badge variant="default" className="mt-1">
                  Pro Member
                </Badge>
              ) : (
                <span>Free Plan</span>
              )}
            </p>
          </div>
        </div>
        {!isPro && (
          <Button asChild>
            <Link href="/pricing">Upgrade to Pro</Link>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Components Used"
          value="0"
          icon={<Blocks className="h-4 w-4 text-muted-foreground" />}
          description="Components added to projects"
        />
        <StatsCard
          title="Downloads"
          value="0"
          icon={<Download className="h-4 w-4 text-muted-foreground" />}
          description="Total component downloads"
        />
        <StatsCard
          title="Favorites"
          value="0"
          icon={<Heart className="h-4 w-4 text-muted-foreground" />}
          description="Saved components"
        />
        <StatsCard
          title="Contributions"
          value="0"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="Components uploaded"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Browse Components</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Explore our library of free and premium components.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/components">View Components</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Marketplace</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Discover community-created components.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your CLI authentication keys.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/settings">Manage Keys</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CLI Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start with CLI</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Add components to your project with a single command:
          </p>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm">
            <p className="text-muted-foreground"># Initialize OonkooUI in your project</p>
            <p>npx oonkoo@latest init</p>
            <p className="text-muted-foreground mt-2"># Add a component</p>
            <p>npx oonkoo@latest add hero-section-01</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
