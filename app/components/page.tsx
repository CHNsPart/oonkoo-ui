import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import {
  Sparkles,
  Zap,
  Copy,
  Terminal,
  ArrowRight,
  Download,
  Star,
  Crown,
  Gift,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const { components, meta } = await RegistryService.getIndex({ limit: 500 });
  const categories = await RegistryService.getCategories();

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
          {popularComponents.map((component, index) => {
            const isPro = component.tier === "pro";
            const CategoryIcon: LucideIcon =
              categoryIcons[component.category.toLowerCase()] || LayoutGrid;

            return (
              <Link
                key={component.slug}
                href={`/components/${component.slug}`}
                className="group relative"
              >
                <div
                  className={cn(
                    "relative rounded-xl border bg-card overflow-hidden transition-all duration-300",
                    "hover:shadow-lg hover:border-primary/30",
                    "hover:-translate-y-1"
                  )}
                >
                  {/* Subtle gradient on hover */}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                      isPro
                        ? "bg-gradient-to-br from-purple-500/5 to-transparent"
                        : "bg-gradient-to-br from-primary/5 to-transparent"
                    )}
                  />

                  <div className="relative p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            isPro ? "bg-purple-500/10" : "bg-primary/10"
                          )}
                        >
                          <CategoryIcon
                            className={cn(
                              "h-4 w-4",
                              isPro ? "text-purple-500" : "text-primary"
                            )}
                          />
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] font-medium",
                            isPro
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                              : "bg-primary/10 text-primary"
                          )}
                        >
                          {isPro ? (
                            <Crown className="h-3 w-3 mr-1" />
                          ) : (
                            <Gift className="h-3 w-3 mr-1" />
                          )}
                          {isPro ? "Pro" : "Free"}
                        </Badge>
                      </div>
                      {/* Rank badge for top 3 */}
                      {index < 3 && (
                        <div
                          className={cn(
                            "flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold text-white",
                            index === 0 && "bg-amber-500",
                            index === 1 && "bg-slate-400",
                            index === 2 && "bg-orange-400"
                          )}
                        >
                          {index + 1}
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {component.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {component.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Download className="h-3.5 w-3.5" />
                        <span className="font-medium text-foreground">
                          {component.downloads.toLocaleString()}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Star className="h-3.5 w-3.5" />
                        <span className="font-medium text-foreground">
                          {component.upvotes.toLocaleString()}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50 ml-auto group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
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
                            <Crown className="h-3 w-3" />
                            {proCount}
                          </span>
                          <span className="flex items-center gap-1 text-primary">
                            <Gift className="h-3 w-3" />
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
              <Gift className="h-8 w-8 text-primary mx-auto mb-3" />
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
              <Crown className="h-8 w-8 text-purple-500 mx-auto mb-3" />
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
      <section className="relative rounded-2xl border overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent" />

        <div className="relative p-10 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-purple-500/10 mb-6">
            <Crown className="h-10 w-10 text-purple-500" />
          </div>

          <h2 className="text-3xl font-bold mb-3">Unlock All Components</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-lg">
            Get access to all {proComponents.length} Pro components, templates,
            and priority support with OonkooUI Pro.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/pricing">
                Get Pro Access
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={`/components/${proComponents[0]?.slug || ""}`}>
                Preview Pro Components
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
