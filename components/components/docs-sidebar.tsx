"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Lock,
  Twitter,
  Package,
  Terminal,
  FileCode,
  Layers,
  Wand2,
  LayoutGrid,
  ChevronRight,
  ChevronDown,
  Rocket,
  BookOpen,
  Crown,
  Gift,
  Users,
  ChevronsUpDown,
  ChevronsDownUp,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { RegistryIndexItem } from "@/types/registry";

interface DocsSidebarProps {
  components: RegistryIndexItem[];
}

// Category configuration with icons
const categoryConfig: Record<string, { label: string; icon: React.ElementType }> = {
  hero: { label: "Hero Sections", icon: Sparkles },
  features: { label: "Features", icon: LayoutGrid },
  pricing: { label: "Pricing", icon: Package },
  testimonials: { label: "Testimonials", icon: FileCode },
  faq: { label: "FAQ", icon: FileCode },
  footer: { label: "Footer", icon: Layers },
  navigation: { label: "Navigation", icon: Layers },
  dashboard: { label: "Dashboard", icon: LayoutGrid },
  forms: { label: "Forms", icon: FileCode },
  cards: { label: "Cards", icon: LayoutGrid },
  buttons: { label: "Buttons", icon: Package },
  cta: { label: "CTA", icon: Rocket },
  animations: { label: "Animations", icon: Wand2 },
  other: { label: "Other", icon: FileCode },
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

// Menu button component
function MenuButton({
  children,
  isActive,
  className,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground font-medium",
        className
      )}
    >
      {children}
    </div>
  );
}

// Render category with components
function CategoryCollapsible({
  category,
  components,
  pathname,
  isPro,
  isOpen,
  onToggle,
}: {
  category: string;
  components: RegistryIndexItem[];
  pathname: string;
  isPro: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const config = categoryConfig[category];
  const Icon = config?.icon || FileCode;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="group/collapsible">
      <li>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            <Icon className="h-4 w-4" />
            <span>{config?.label || category}</span>
            <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="ml-4 border-l pl-2 mt-1 space-y-1">
            {components.map((component) => {
              const isActive = pathname === `/components/${component.slug}`;

              return (
                <li key={component.slug}>
                  <Link
                    href={`/components/${component.slug}`}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    <span className="truncate">{component.name}</span>
                    {component.badge === "new" && (
                      <Badge className="ml-auto h-5 px-1.5 text-[10px] bg-primary text-primary-foreground border-0">
                        New
                      </Badge>
                    )}
                    {component.badge === "updated" && (
                      <Badge className="ml-auto h-5 px-1.5 text-[10px] bg-muted-foreground/20 text-foreground border-0">
                        Updated
                      </Badge>
                    )}
                    {isPro && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 px-1.5 text-[10px] bg-purple-500/10 text-purple-500 border-0"
                      >
                        <Lock className="h-2.5 w-2.5 mr-0.5" />
                        Pro
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </CollapsibleContent>
      </li>
    </Collapsible>
  );
}

// Section header with expand/collapse button
function SectionHeader({
  icon: Icon,
  iconColor,
  title,
  count,
  badgeColor,
  isExpanded,
  onToggle,
  allChildrenOpen,
  onExpandAll,
  onCollapseAll,
}: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  count?: number;
  badgeColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  allChildrenOpen: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <CollapsibleTrigger asChild>
        <button
          onClick={onToggle}
          className="flex flex-1 items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon className={cn("h-3.5 w-3.5", iconColor)} />
          <span className="uppercase tracking-wider">{title}</span>
          {count !== undefined && (
            <Badge
              variant="secondary"
              className={cn("h-5 px-1.5 text-[10px] border-0", badgeColor)}
            >
              {count}
            </Badge>
          )}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 ml-auto transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </button>
      </CollapsibleTrigger>
      {isExpanded && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  allChildrenOpen ? onCollapseAll() : onExpandAll();
                }}
              >
                {allChildrenOpen ? (
                  <ChevronsDownUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronsUpDown className="h-3.5 w-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {allChildrenOpen ? "Collapse all" : "Expand all"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

export function DocsSidebar({ components }: DocsSidebarProps) {
  const pathname = usePathname();
  const { proComponents, freeComponents } = groupComponentsByTierAndCategory(components);

  // Sort categories by the order in categoryConfig
  const sortedProCategories = Object.keys(categoryConfig).filter(
    (cat) => proComponents[cat]?.length > 0
  );
  const sortedFreeCategories = Object.keys(categoryConfig).filter(
    (cat) => freeComponents[cat]?.length > 0
  );

  // Section expanded states
  const [proSectionOpen, setProSectionOpen] = useState(true);
  const [freeSectionOpen, setFreeSectionOpen] = useState(true);
  const [communitySectionOpen, setCommunitySectionOpen] = useState(true);

  // Category open states for Pro
  const [proCategoryStates, setProCategoryStates] = useState<Record<string, boolean>>(
    () => Object.fromEntries(sortedProCategories.map((cat) => [cat, true]))
  );

  // Category open states for Free
  const [freeCategoryStates, setFreeCategoryStates] = useState<Record<string, boolean>>(
    () => Object.fromEntries(sortedFreeCategories.map((cat) => [cat, true]))
  );

  // Check if all categories in a section are open
  const allProCategoriesOpen = sortedProCategories.every((cat) => proCategoryStates[cat]);
  const allFreeCategoriesOpen = sortedFreeCategories.every((cat) => freeCategoryStates[cat]);

  // Expand/collapse all for Pro
  const expandAllPro = () => {
    setProCategoryStates(Object.fromEntries(sortedProCategories.map((cat) => [cat, true])));
  };
  const collapseAllPro = () => {
    setProCategoryStates(Object.fromEntries(sortedProCategories.map((cat) => [cat, false])));
  };

  // Expand/collapse all for Free
  const expandAllFree = () => {
    setFreeCategoryStates(Object.fromEntries(sortedFreeCategories.map((cat) => [cat, true])));
  };
  const collapseAllFree = () => {
    setFreeCategoryStates(Object.fromEntries(sortedFreeCategories.map((cat) => [cat, false])));
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Scrollable Content */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {/* Get Started Section */}
        <div className="pb-4">
          <div className="flex items-center gap-2 px-2 pb-2">
            <Rocket className="h-3.5 w-3.5" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Get Started
            </span>
          </div>
          <ul className="space-y-1">
            {getStartedNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <MenuButton isActive={isActive}>
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </MenuButton>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Pro Components Section */}
        {sortedProCategories.length > 0 && (
          <Collapsible
            open={proSectionOpen}
            onOpenChange={setProSectionOpen}
            className="group/section pb-4"
          >
            <SectionHeader
              icon={Crown}
              iconColor="text-purple-500"
              title="Pro"
              count={Object.values(proComponents).flat().length}
              badgeColor="bg-purple-500/10 text-purple-500"
              isExpanded={proSectionOpen}
              onToggle={() => setProSectionOpen(!proSectionOpen)}
              allChildrenOpen={allProCategoriesOpen}
              onExpandAll={expandAllPro}
              onCollapseAll={collapseAllPro}
            />
            <CollapsibleContent>
              <ul className="space-y-1">
                {sortedProCategories.map((category) => (
                  <CategoryCollapsible
                    key={category}
                    category={category}
                    components={proComponents[category]}
                    pathname={pathname}
                    isPro={true}
                    isOpen={proCategoryStates[category] ?? true}
                    onToggle={() =>
                      setProCategoryStates((prev) => ({
                        ...prev,
                        [category]: !prev[category],
                      }))
                    }
                  />
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Free Components Section */}
        {sortedFreeCategories.length > 0 && (
          <Collapsible
            open={freeSectionOpen}
            onOpenChange={setFreeSectionOpen}
            className="group/section pb-4"
          >
            <SectionHeader
              icon={Gift}
              iconColor="text-green-500"
              title="Free"
              count={Object.values(freeComponents).flat().length}
              badgeColor="bg-green-500/10 text-green-500"
              isExpanded={freeSectionOpen}
              onToggle={() => setFreeSectionOpen(!freeSectionOpen)}
              allChildrenOpen={allFreeCategoriesOpen}
              onExpandAll={expandAllFree}
              onCollapseAll={collapseAllFree}
            />
            <CollapsibleContent>
              <ul className="space-y-1">
                {sortedFreeCategories.map((category) => (
                  <CategoryCollapsible
                    key={category}
                    category={category}
                    components={freeComponents[category]}
                    pathname={pathname}
                    isPro={false}
                    isOpen={freeCategoryStates[category] ?? true}
                    onToggle={() =>
                      setFreeCategoryStates((prev) => ({
                        ...prev,
                        [category]: !prev[category],
                      }))
                    }
                  />
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Community Section */}
        <Collapsible
          open={communitySectionOpen}
          onOpenChange={setCommunitySectionOpen}
          className="group/section pb-4"
        >
          <div className="flex items-center gap-2 px-2 py-1.5">
            <CollapsibleTrigger asChild>
              <button className="flex flex-1 items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Users className="h-3.5 w-3.5 text-blue-500" />
                <span className="uppercase tracking-wider">Community</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 ml-auto transition-transform",
                    communitySectionOpen && "rotate-180"
                  )}
                />
              </button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <ul className="space-y-1">
              <li>
                <Link href="/components/community">
                  <MenuButton isActive={pathname === "/components/community"}>
                    <Users className="h-4 w-4" />
                    <span>Browse Community</span>
                  </MenuButton>
                </Link>
              </li>
              <li>
                <Link href="/components/marketplace">
                  <MenuButton isActive={pathname === "/components/marketplace"}>
                    <Store className="h-4 w-4" />
                    <span>Marketplace</span>
                  </MenuButton>
                </Link>
              </li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </nav>

      {/* Footer */}
      <div className="border-t px-5 py-4">
        <Link
          href="https://twitter.com/oonkoohq"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Twitter className="h-3.5 w-3.5" />
          <span>@oonkoohq</span>
        </Link>
      </div>
    </div>
  );
}
