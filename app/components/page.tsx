import Link from "next/link";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import {
  Sparkles,
  Zap,
  Copy,
  Terminal,
  ArrowRight,
  MousePointer2,
  Palette,
  CreditCard,
  MessageSquare,
  HelpCircle,
  PanelBottom,
  Menu,
  LayoutDashboard,
  FormInput,
  Layers,
  RectangleHorizontal,
  Play,
  MoreHorizontal,
  LayoutGrid,
  Rocket,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

import { RegistryService } from "@/services/registry.service";
import { getCurrentUser } from "@/lib/kinde";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComponentCard } from "@/components/components/component-card";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Components - OonkooUI",
  description:
    "Browse the OonkooUI component library. Discover free and premium React components for your next project.",
};

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Category icons mapping
const categoryIcons: Record<string, LucideIcon> = {
  hero: Sparkles,
  features: LayoutGrid,
  pricing: CreditCard,
  testimonials: MessageSquare,
  faq: HelpCircle,
  footer: PanelBottom,
  navigation: Menu,
  dashboard: LayoutDashboard,
  forms: FormInput,
  cards: Layers,
  buttons: RectangleHorizontal,
  cursor: MousePointer2,
  background: Palette,
  cta: Rocket,
  animations: Play,
  other: MoreHorizontal,
};

export default async function ComponentsPage() {
  // Disable all caching for this page
  noStore();

  const user = await getCurrentUser();
  const { components, meta } = await RegistryService.getIndex({ limit: 500 });
  const categories = await RegistryService.getCategories();

  // Get user's upvoted component slugs
  let upvotedSlugs: string[] = [];
  if (user) {
    const upvotes = await prisma.upvote.findMany({
      where: { userId: user.id },
      include: { component: { select: { slug: true } } },
    });
    upvotedSlugs = upvotes.map((u) => u.component.slug);
  }

  // Get featured/popular components
  const freeComponents = components.filter((c) => c.tier === "free");
  const proComponents = components.filter((c) => c.tier === "pro");
  const popularComponents = [...components]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 6);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="space-y-4 mb-12">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1">
          <Sparkles className="h-3 w-3" />
          {meta.total} Components Available
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">
          Beautiful React Components
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Copy and paste beautiful, accessible components into your Next.js
          applications. Free and open source.
        </p>

        <div className="flex flex-wrap gap-3 pt-4">
          <Button asChild size="lg">
            <Link href={`/components/${components[0]?.slug || ""}`}>
              Browse Components
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/components/installation">
              <Terminal className="mr-2 h-4 w-4" />
              Installation Guide
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Install */}
      <div className="rounded-xl border bg-muted/30 p-6 mb-12">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Install
        </h2>
        <div className="flex items-center gap-4 bg-background rounded-lg border p-4">
          <code className="flex-1 font-mono text-sm text-primary">
            npx oonkoo init
          </code>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Run this command to set up OonkooUI in your project. Then add
          components with{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">
            npx oonkoo add [component]
          </code>
        </p>
      </div>

      {/* Popular Components */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Popular Components</h2>
            <p className="text-muted-foreground mt-1">
              Most downloaded components by the community
            </p>
          </div>
          <Link
            href={`/components/${components[0]?.slug || ""}`}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 group"
          >
            View all
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularComponents.map((component, index) => (
            <ComponentCard
              key={component.slug}
              slug={component.slug}
              name={component.name}
              description={component.description}
              tier={component.tier}
              category={component.category}
              downloads={component.downloads}
              upvotes={component.upvotes}
              isUpvoted={upvotedSlugs.includes(component.slug)}
              isAuthenticated={!!user}
              rank={index}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Browse by Category</h2>
          <p className="text-muted-foreground mt-1">
            Find the perfect component for your project
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => {
              const categoryKey = category.name.toLowerCase();
              const CategoryIcon: LucideIcon = categoryIcons[categoryKey] || LayoutGrid;
              const categoryComponents = components.filter(
                (c) => c.category.toLowerCase() === categoryKey
              );
            const firstComponent = categoryComponents[0];
            const proCount = categoryComponents.filter(
              (c) => c.tier === "pro"
            ).length;
            const freeCount = categoryComponents.filter(
              (c) => c.tier === "free"
            ).length;

            return (
              <Link
                key={category.name}
                href={
                  firstComponent
                    ? `/components/${firstComponent.slug}`
                    : "/components"
                }
                className="group"
              >
                <div
                  className={cn(
                    "relative rounded-xl border bg-card overflow-hidden transition-all duration-300",
                    "hover:shadow-md hover:border-primary/20",
                    "hover:-translate-y-0.5"
                  )}
                >
                  {/* Subtle gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative p-5">
                    {/* Icon and arrow */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors duration-300">
                        <CategoryIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>

                    {/* Category name */}
                    <h3 className="font-semibold text-foreground capitalize mb-1">
                      {category.name}
                    </h3>

                    {/* Component counts */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {category.count}
                        </span>{" "}
                        {category.count === 1 ? "component" : "components"}
                      </span>
                      {proCount > 0 && freeCount > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                            <Image src="/pro-plan-badge.svg" alt="Pro" width={12} height={12} className="h-3 w-3" />
                            {proCount}
                          </span>
                          <span className="flex items-center gap-1 text-primary">
                            <Image src="/free-plan-badge.svg" alt="Free" width={12} height={12} className="h-3 w-3" />
                            {freeCount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Preview of component names */}
                    {categoryComponents.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <p className="text-[11px] text-muted-foreground truncate">
                          {categoryComponents
                            .slice(0, 3)
                            .map((c) => c.name)
                            .join(" • ")}
                          {categoryComponents.length > 3 && " ..."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16">
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="relative rounded-xl border bg-card overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative text-center p-8">
              <Image src="/free-plan-badge.svg" alt="Free" width={32} height={32} className="h-8 w-8 mx-auto mb-3" />
              <div className="text-4xl font-bold text-primary mb-1">
                {freeComponents.length}
              </div>
              <div className="text-muted-foreground font-medium">
                Free Components
              </div>
            </div>
          </div>

          <div className="relative rounded-xl border bg-card overflow-hidden group hover:border-purple-500/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
            <div className="relative text-center p-8">
              <Image src="/pro-plan-badge.svg" alt="Pro" width={32} height={32} className="h-8 w-8 mx-auto mb-3" />
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {proComponents.length}
              </div>
              <div className="text-muted-foreground font-medium">
                Pro Components
              </div>
            </div>
          </div>

          <div className="relative rounded-xl border bg-card overflow-hidden group hover:border-muted-foreground/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent" />
            <div className="relative text-center p-8">
              <LayoutGrid className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <div className="text-4xl font-bold text-foreground mb-1">
                {categories.length}
              </div>
              <div className="text-muted-foreground font-medium">
                Categories
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pro CTA */}
      <section className="rounded-xl border bg-gradient-to-r from-neutral-50 to-neutral-100/50 dark:from-neutral-900/50 dark:to-neutral-950/50 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src="/pro-plan-badge.svg"
                alt="OonkooUI Pro"
                className="h-12 w-12"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">OonkooUI Pro</h3>
                <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                  {proComponents.length} components
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Unlock all premium components, templates, and priority support.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button asChild variant="outline" size="sm">
              <Link href={`/components/${proComponents[0]?.slug || ""}`}>
                Preview
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/pricing">
                Get Pro
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
