"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lock,
  Twitter,
  Package,
  Terminal,
  ChevronDown,
  Rocket,
  BookOpen,
  Crown,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { RegistryIndexItem } from "@/types/registry";

interface DocsSidebarProps {
  components: RegistryIndexItem[];
}

// Category configuration
const categoryConfig: Record<string, { label: string }> = {
  hero: { label: "Hero Sections" },
  features: { label: "Features" },
  pricing: { label: "Pricing" },
  testimonials: { label: "Testimonials" },
  faq: { label: "FAQ" },
  footer: { label: "Footer" },
  navigation: { label: "Navigation" },
  dashboard: { label: "Dashboard" },
  forms: { label: "Forms" },
  cards: { label: "Cards" },
  buttons: { label: "Buttons" },
  cursor: { label: "Cursor Effects" },
  background: { label: "Backgrounds" },
  cta: { label: "Call to Action" },
  animations: { label: "Animations" },
  other: { label: "Other" },
};

// Get Started navigation
const getStartedNav = [
  { title: "Introduction", href: "/components", icon: BookOpen },
  { title: "Installation", href: "/components/installation", icon: Package },
  { title: "CLI", href: "/components/cli", icon: Terminal },
];

// Group components by tier and then by category
function groupComponentsByTierAndCategory(components: RegistryIndexItem[]) {
  const proComponents: Record<string, RegistryIndexItem[]> = {};
  const freeComponents: Record<string, RegistryIndexItem[]> = {};

  components.forEach((component) => {
    const category = component.category.toLowerCase();
    const isPro = component.tier === "pro";

    if (isPro) {
      if (!proComponents[category]) {
        proComponents[category] = [];
      }
      proComponents[category].push(component);
    } else {
      if (!freeComponents[category]) {
        freeComponents[category] = [];
      }
      freeComponents[category].push(component);
    }
  });

  return { proComponents, freeComponents };
}

// Component link item - minimal design
function ComponentLink({
  component,
  isActive,
  isPro,
}: {
  component: RegistryIndexItem;
  isActive: boolean;
  isPro: boolean;
}) {
  return (
    <Link
      href={`/components/${component.slug}`}
      className={cn(
        "group/item flex items-center justify-between py-1.5 px-3 text-[13px] transition-all duration-200 rounded-md",
        isActive
          ? "text-foreground font-medium bg-accent/50"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
      )}
    >
      <span className="truncate">{component.name}</span>
      <div className="flex items-center gap-1.5 shrink-0">
        {component.badge === "new" && (
          <Badge className="h-[18px] px-1.5 text-[10px] font-medium bg-primary/20 text-primary hover:bg-primary/20 border-0">
            New
          </Badge>
        )}
        {component.badge === "updated" && (
          <Badge className="h-[18px] px-1.5 text-[10px] font-medium bg-muted text-muted-foreground hover:bg-muted border-0">
            Updated
          </Badge>
        )}
        {isPro && (
          <Lock className="h-3 w-3 text-purple-400/60" />
        )}
      </div>
    </Link>
  );
}

// Category section - collapsible with clean design
function CategorySection({
  category,
  components,
  pathname,
  isPro,
  defaultOpen = true,
}: {
  category: string;
  components: RegistryIndexItem[];
  pathname: string;
  isPro: boolean;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const config = categoryConfig[category];

  // Check if any component in this category is active
  const hasActiveChild = components.some(
    (c) => pathname === `/components/${c.slug}`
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between py-1.5 text-[13px] transition-colors duration-200",
            hasActiveChild
              ? "text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span>{config?.label || category}</span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="mt-1 space-y-0.5">
          {components.map((component) => {
            const isActive = pathname === `/components/${component.slug}`;
            return (
              <ComponentLink
                key={component.slug}
                component={component}
                isActive={isActive}
                isPro={isPro}
              />
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Section header - minimal design
function SectionHeader({
  title,
  icon: Icon,
  count,
  isPro,
}: {
  title: string;
  icon?: LucideIcon;
  count?: number;
  isPro?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 py-2">
      {Icon && (
        <Icon
          className={cn(
            "h-3.5 w-3.5",
            isPro ? "text-purple-400" : "text-muted-foreground/70"
          )}
        />
      )}
      <span
        className={cn(
          "text-[11px] font-semibold uppercase tracking-wider",
          isPro ? "text-purple-400" : "text-muted-foreground/70"
        )}
      >
        {title}
      </span>
      {count !== undefined && (
        <span
          className={cn(
            "text-[10px] font-medium",
            isPro ? "text-purple-400/60" : "text-muted-foreground/50"
          )}
        >
          ({count})
        </span>
      )}
    </div>
  );
}

export function DocsSidebar({ components }: DocsSidebarProps) {
  const pathname = usePathname();
  const { proComponents, freeComponents } = useMemo(
    () => groupComponentsByTierAndCategory(components),
    [components]
  );

  // Sort categories by the order in categoryConfig
  const sortedProCategories = useMemo(
    () =>
      Object.keys(categoryConfig).filter(
        (cat) => proComponents[cat]?.length > 0
      ),
    [proComponents]
  );
  const sortedFreeCategories = useMemo(
    () =>
      Object.keys(categoryConfig).filter(
        (cat) => freeComponents[cat]?.length > 0
      ),
    [freeComponents]
  );

  const proCount = Object.values(proComponents).flat().length;
  const freeCount = Object.values(freeComponents).flat().length;

  return (
    <div className="relative flex h-full flex-col bg-background/95 backdrop-blur-md dark:bg-card">
      {/* Scrollable Content */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent">
        {/* Get Started Section */}
        <div>
          <SectionHeader title="Get Started" icon={Rocket} />
          <div className="space-y-0.5">
            {getStartedNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center py-1.5 px-3 text-[13px] transition-all duration-200 rounded-md",
                    isActive
                      ? "text-foreground font-medium bg-accent/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pro Components Section */}
        {sortedProCategories.length > 0 && (
          <div>
            <SectionHeader
              title="Pro Components"
              icon={Crown}
              count={proCount}
              isPro
            />
            <div className="space-y-3">
              {sortedProCategories.map((category) => (
                <CategorySection
                  key={category}
                  category={category}
                  components={proComponents[category]}
                  pathname={pathname}
                  isPro={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Free Components Section */}
        {sortedFreeCategories.length > 0 && (
          <div>
            <SectionHeader title="Free Components" count={freeCount} />
            <div className="space-y-3">
              {sortedFreeCategories.map((category) => (
                <CategorySection
                  key={category}
                  category={category}
                  components={freeComponents[category]}
                  pathname={pathname}
                  isPro={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Community Section */}
        <div>
          <SectionHeader title="Community" icon={Users} />
          <div className="space-y-0.5">
            <Link
              href="/components/community"
              className={cn(
                "flex items-center py-1.5 px-3 text-[13px] transition-all duration-200 rounded-md",
                pathname === "/components/community"
                  ? "text-foreground font-medium bg-accent/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
              )}
            >
              Browse Community
            </Link>
            <Link
              href="/components/marketplace"
              className={cn(
                "flex items-center py-1.5 px-3 text-[13px] transition-all duration-200 rounded-md",
                pathname === "/components/marketplace"
                  ? "text-foreground font-medium bg-accent/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
              )}
            >
              Marketplace
            </Link>
          </div>
        </div>

        {/* Extra padding at bottom for gradient fade */}
        <div className="h-20" />
      </nav>

      {/* Progressive Blur Gradient Overlay at Bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32">
        {/* Multi-layer gradient for smooth blur effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent dark:from-card dark:via-card/80" />
        <div className="absolute inset-0 backdrop-blur-[1px] [mask-image:linear-gradient(to_top,black_20%,transparent_80%)]" />
      </div>

      {/* Footer - above the gradient */}
      <div className="relative z-10 px-4 py-3 border-t border-border/50">
        <Link
          href="https://twitter.com/oonkoohq"
          target="_blank"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <Twitter className="h-3.5 w-3.5 group-hover:text-[#1DA1F2] transition-colors" />
          <span>Follow @oonkoohq</span>
        </Link>
      </div>
    </div>
  );
}
