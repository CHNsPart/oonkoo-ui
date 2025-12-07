"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  Package,
  FileCode,
  Layers,
  Wand2,
  LayoutGrid,
  Rocket,
  Crown,
  Gift,
  Lock,
  ArrowRight,
  Command,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import type { RegistryIndexItem } from "@/types/registry";

interface ComponentSearchProps {
  components: RegistryIndexItem[];
}

// Category icons mapping
const categoryIcons: Record<string, React.ElementType> = {
  hero: Sparkles,
  features: LayoutGrid,
  pricing: Package,
  testimonials: FileCode,
  faq: FileCode,
  footer: Layers,
  navigation: Layers,
  dashboard: LayoutGrid,
  forms: FileCode,
  cards: LayoutGrid,
  buttons: Package,
  cta: Rocket,
  animations: Wand2,
  other: FileCode,
};

// Category labels
const categoryLabels: Record<string, string> = {
  hero: "Hero Sections",
  features: "Features",
  pricing: "Pricing",
  testimonials: "Testimonials",
  faq: "FAQ",
  footer: "Footer",
  navigation: "Navigation",
  dashboard: "Dashboard",
  forms: "Forms",
  cards: "Cards",
  buttons: "Buttons",
  cta: "CTA",
  animations: "Animations",
  other: "Other",
};

export function ComponentSearch({ components }: ComponentSearchProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  // Keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Group components by category
  const groupedComponents = React.useMemo(() => {
    const groups: Record<string, RegistryIndexItem[]> = {};

    components.forEach((component) => {
      const category = component.category.toLowerCase();
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(component);
    });

    return groups;
  }, [components]);

  // Get sorted categories (Pro first, then Free)
  const sortedCategories = React.useMemo(() => {
    return Object.keys(groupedComponents).sort((a, b) => {
      const aHasPro = groupedComponents[a].some((c) => c.tier === "pro");
      const bHasPro = groupedComponents[b].some((c) => c.tier === "pro");
      if (aHasPro && !bHasPro) return -1;
      if (!aHasPro && bHasPro) return 1;
      return a.localeCompare(b);
    });
  }, [groupedComponents]);

  const handleSelect = (slug: string) => {
    setOpen(false);
    router.push(`/components/${slug}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-md bg-muted/50 text-sm text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64"
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search components...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search Components"
        description="Search for components to add to your project"
      >
        <CommandInput placeholder="Search components..." />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Search className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No components found.</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Try searching for something else.
              </p>
            </div>
          </CommandEmpty>

          {/* Quick Actions */}
          <CommandGroup heading="Quick Actions">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                router.push("/components");
              }}
            >
              <FileCode className="mr-2 h-4 w-4" />
              <span>Browse All Components</span>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                router.push("/components/marketplace");
              }}
            >
              <Package className="mr-2 h-4 w-4" />
              <span>Visit Marketplace</span>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* Components by Category */}
          {sortedCategories.map((category) => {
            const Icon = categoryIcons[category] || FileCode;
            const label = categoryLabels[category] || category;
            const categoryComponents = groupedComponents[category];

            return (
              <CommandGroup key={category} heading={label}>
                {categoryComponents.map((component) => {
                  const isPro = component.tier === "pro";
                  const isFree = component.tier === "free";

                  return (
                    <CommandItem
                      key={component.slug}
                      value={`${component.name} ${component.description} ${category}`}
                      onSelect={() => handleSelect(component.slug)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate">{component.name}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {component.description}
                        </span>
                      </div>
                      {isPro && (
                        <Badge
                          variant="secondary"
                          className="ml-auto h-5 px-1.5 text-[10px] bg-purple-500/10 text-purple-500 border-0 shrink-0"
                        >
                          <Lock className="h-2.5 w-2.5 mr-0.5" />
                          Pro
                        </Badge>
                      )}
                      {isFree && (
                        <Badge
                          variant="secondary"
                          className="ml-auto h-5 px-1.5 text-[10px] bg-green-500/10 text-green-500 border-0 shrink-0"
                        >
                          Free
                        </Badge>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium flex">
              <ArrowRight className="h-3 w-3 rotate-[-90deg]" />
              <ArrowRight className="h-3 w-3 rotate-90" />
            </kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium flex">
              Enter
            </kbd>
            <span>Select</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium flex">
              Esc
            </kbd>
            <span>Close</span>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}

// Search button trigger for use in other places
export function ComponentSearchTrigger({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("h-9 w-9", className)}
      onClick={onClick}
    >
      <Search className="h-4 w-4" />
      <span className="sr-only">Search components</span>
    </Button>
  );
}
