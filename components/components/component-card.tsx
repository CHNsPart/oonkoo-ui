"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Download,
  ChevronRight,
  LayoutGrid,
  Sparkles,
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
  Rocket,
  BadgeCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { UpvoteButton } from "./upvote-button";

// Helper to check if component is official based on tier
function isOfficialTier(tier: string): boolean {
  return tier === "free" || tier === "pro";
}

// Category icons mapping (internal to avoid Server/Client component issues)
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

interface ComponentCardProps {
  slug: string;
  name: string;
  description: string;
  tier: "free" | "pro" | "community_free" | "community_paid";
  category: string;
  downloads: number;
  upvotes: number;
  isUpvoted?: boolean;
  isAuthenticated?: boolean;
  rank?: number;
  showUpvoteButton?: boolean;
}

export function ComponentCard({
  slug,
  name,
  description,
  tier,
  category,
  downloads,
  upvotes,
  isUpvoted = false,
  isAuthenticated = false,
  rank,
  showUpvoteButton = true,
}: ComponentCardProps) {
  const isPro = tier === "pro" || tier === "community_paid";
  const CategoryIcon = categoryIcons[category.toLowerCase()] || LayoutGrid;

  return (
    <div className="group relative">
      <Link href={`/components/${slug}`} className="block">
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
                    "text-[10px] font-medium gap-1",
                    isPro
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  <Image
                    src={isPro ? "/pro-plan-badge.svg" : "/free-plan-badge.svg"}
                    alt={isPro ? "Pro" : "Free"}
                    width={12}
                    height={12}
                    className="h-3 w-3"
                  />
                  {tier === "pro" ? "Pro" : tier === "community_paid" ? "Paid" : tier === "community_free" ? "Community" : "Free"}
                </Badge>
              </div>
              {/* Rank badge for top 3 */}
              {rank !== undefined && rank < 3 && (
                <div
                  className={cn(
                    "flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold text-white",
                    rank === 0 && "bg-amber-500",
                    rank === 1 && "bg-slate-400",
                    rank === 2 && "bg-orange-400"
                  )}
                >
                  {rank + 1}
                </div>
              )}
            </div>

            {/* Title */}
            <div className="flex items-center gap-1.5 mb-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {name}
              </h3>
              {isOfficialTier(tier) ? (
                <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
              ) : (
                <Users className="h-4 w-4 text-blue-500 shrink-0" />
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-3 pt-3 border-t border-border/50">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Download className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground">
                  {downloads.toLocaleString()}
                </span>
              </span>
              {showUpvoteButton ? (
                <div
                  onClick={(e) => e.preventDefault()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <UpvoteButton
                    slug={slug}
                    initialUpvoted={isUpvoted}
                    initialCount={upvotes}
                    isAuthenticated={isAuthenticated}
                    size="sm"
                  />
                </div>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {upvotes.toLocaleString()}
                  </span>
                  upvotes
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 ml-auto group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
