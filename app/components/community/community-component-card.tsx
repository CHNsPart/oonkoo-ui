"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Download,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UpvoteButton } from "@/components/components/upvote-button";

interface CommunityComponentCardProps {
  slug: string;
  name: string;
  description: string;
  tier: string;
  downloads: number;
  upvotes: number;
  previewImage: string | null;
  author: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  rank: number;
  isUpvoted: boolean;
  isAuthenticated: boolean;
}

export function CommunityComponentCard({
  slug,
  name,
  description,
  tier,
  downloads,
  upvotes,
  previewImage,
  author,
  rank,
  isUpvoted,
  isAuthenticated,
}: CommunityComponentCardProps) {
  return (
    <div className="group relative">
      <Link href={`/components/${slug}`} className="block">
        <div
          className={cn(
            "relative rounded-xl border bg-card overflow-hidden transition-all duration-300",
            "hover:shadow-lg hover:border-blue-500/30",
            "hover:-translate-y-1"
          )}
        >
          {/* Gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Preview Image */}
          {previewImage && (
            <div className="relative h-36 bg-muted overflow-hidden">
              <Image
                src={previewImage}
                alt={name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            </div>
          )}

          <div className="relative p-5">
            {/* Header with tier badge */}
            <div className="flex items-start justify-between mb-3">
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] font-medium gap-1",
                  tier === "COMMUNITY_PAID"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                )}
              >
                <Image
                  src={tier === "COMMUNITY_PAID" ? "/pro-plan-badge.svg" : "/free-plan-badge.svg"}
                  alt={tier === "COMMUNITY_PAID" ? "Paid" : "Free"}
                  width={12}
                  height={12}
                  className="h-3 w-3"
                />
                {tier === "COMMUNITY_PAID" ? "Paid" : "Free"}
              </Badge>
              {/* Rank badge for top 3 */}
              {rank < 3 && (
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
              <h3 className="font-semibold text-foreground group-hover:text-blue-500 transition-colors">
                {name}
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {description}
            </p>

            {/* Author */}
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={author.avatar || `https://avatar.vercel.sh/${author.id}`}
                  alt={author.name || "Author"}
                />
                <AvatarFallback className="text-[10px]">
                  {author.name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                by <span className="text-foreground font-medium">{author.name || "Anonymous"}</span>
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 pt-3 border-t border-border/50">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Download className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground">
                  {downloads.toLocaleString()}
                </span>
              </span>
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
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 ml-auto group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
