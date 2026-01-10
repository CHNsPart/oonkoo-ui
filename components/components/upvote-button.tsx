"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UpvoteButtonProps {
  slug: string;
  initialUpvoted?: boolean;
  initialCount?: number;
  isAuthenticated?: boolean;
  size?: "sm" | "default" | "lg";
  showCount?: boolean;
  className?: string;
}

export function UpvoteButton({
  slug,
  initialUpvoted = false,
  initialCount = 0,
  isAuthenticated = false,
  size = "default",
  showCount = true,
  className,
}: UpvoteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [count, setCount] = useState(initialCount);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    // Optimistic update
    const wasUpvoted = upvoted;
    const previousCount = count;

    setUpvoted(!wasUpvoted);
    setCount(wasUpvoted ? count - 1 : count + 1);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/components/${slug}/upvote`, {
          method: "POST",
        });

        if (!response.ok) {
          // Revert on error
          setUpvoted(wasUpvoted);
          setCount(previousCount);
          return;
        }

        const data = await response.json();
        // Sync with server state
        setUpvoted(data.data.upvoted);
        setCount(data.data.upvoteCount);
      } catch (error) {
        // Revert on error
        setUpvoted(wasUpvoted);
        setCount(previousCount);
      }
    });
  };

  const sizeClasses = {
    sm: "h-8 px-2 text-xs",
    default: "h-9 px-3 text-sm",
    lg: "h-10 px-4",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const button = (
    <Button
      variant="outline"
      size="sm"
      onClick={handleUpvote}
      disabled={isPending}
      className={cn(
        "gap-1.5 transition-all",
        sizeClasses[size],
        upvoted && "border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500",
        className
      )}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-all",
          upvoted && "fill-current",
          isPending && "animate-pulse"
        )}
      />
      {showCount && (
        <span className="tabular-nums">{count}</span>
      )}
    </Button>
  );

  if (!isAuthenticated) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>Sign in to upvote</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}
