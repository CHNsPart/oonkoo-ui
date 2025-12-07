import Link from "next/link";
import {
  Sparkles,
  Zap,
  Copy,
  Terminal,
  ArrowRight,
  Download,
  Star,
} from "lucide-react";

import { RegistryService } from "@/services/registry.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Components - OonkooUI",
  description:
    "Browse the OonkooUI component library. Discover free and premium React components for your next project.",
};

export default async function ComponentsPage() {
  const { components, meta } = await RegistryService.getIndex({ limit: 500 });
  const categories = await RegistryService.getCategories();

  // Get featured/popular components
  const freeComponents = components.filter((c) => c.tier === "free");
  const proComponents = components.filter((c) => c.tier === "pro");
  const popularComponents = [...components]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 6);

  return (
    <div className="py-8 px-6 lg:px-10 max-w-5xl">
      {/* Hero Section */}
      <div className="space-y-4 mb-12">
        <Badge variant="secondary" className="gap-1">
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
          <code className="bg-muted px-1 py-0.5 rounded">
            npx oonkoo add [component]
          </code>
        </p>
      </div>

      {/* Popular Components */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular Components</h2>
          <Link
            href={`/components/${components[0]?.slug || ""}`}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularComponents.map((component) => (
            <Link
              key={component.slug}
              href={`/components/${component.slug}`}
              className="group rounded-lg border bg-card p-4 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium group-hover:text-primary transition-colors">
                  {component.name}
                </h3>
                <Badge
                  variant="secondary"
                  className={
                    component.tier === "pro"
                      ? "bg-purple-500/10 text-purple-500"
                      : "bg-green-500/10 text-green-500"
                  }
                >
                  {component.tier === "pro" ? "Pro" : "Free"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {component.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {component.downloads.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {component.upvotes.toLocaleString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((category) => {
            const categoryComponents = components.filter(
              (c) => c.category.toLowerCase() === category.name
            );
            const firstComponent = categoryComponents[0];

            return (
              <Link
                key={category.name}
                href={
                  firstComponent
                    ? `/components/${firstComponent.slug}`
                    : "/components"
                }
                className="flex items-center justify-between rounded-lg border bg-card p-4 hover:border-primary/50 hover:bg-muted/50 transition-all"
              >
                <div>
                  <h3 className="font-medium capitalize">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count} component{category.count !== 1 ? "s" : ""}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-12">
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="text-4xl font-bold text-primary mb-2">
              {freeComponents.length}
            </div>
            <div className="text-muted-foreground">Free Components</div>
          </div>
          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="text-4xl font-bold text-purple-500 mb-2">
              {proComponents.length}
            </div>
            <div className="text-muted-foreground">Pro Components</div>
          </div>
          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="text-4xl font-bold mb-2">{categories.length}</div>
            <div className="text-muted-foreground">Categories</div>
          </div>
        </div>
      </section>

      {/* Pro CTA */}
      <section className="rounded-xl border bg-gradient-to-br from-purple-500/5 via-purple-500/10 to-primary/5 p-8 text-center">
        <Sparkles className="h-10 w-10 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Unlock All Components</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Get access to all {proComponents.length} Pro components, templates,
          and priority support with OonkooUI Pro.
        </p>
        <Button asChild size="lg">
          <Link href="/pricing">
            Get Pro Access
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
