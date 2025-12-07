"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SimpleComponentPreviewProps {
  slug: string;
  name: string;
  className?: string;
}

export function SimpleComponentPreview({
  slug,
  name,
  className
}: SimpleComponentPreviewProps) {
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-xl border border-border bg-background overflow-hidden",
        className
      )}
    >
      {/* Simple Preview Container */}
      <div className="relative w-full min-h-[500px] p-8 flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        {/* Component Preview Iframe */}
        <div className="w-full h-full min-h-[450px]">
          <iframe
            key={key}
            src={`/api/preview/${slug}`}
            className="w-full h-full border-0 rounded-lg"
            style={{ minHeight: "450px" }}
            title={`${name} preview`}
          />
        </div>
      </div>

      {/* Optional: Subtle refresh indicator in corner */}
      <button
        onClick={handleRefresh}
        className="absolute top-4 right-4 p-2 rounded-md bg-background/80 backdrop-blur-sm border border-border hover:bg-accent transition-colors opacity-0 hover:opacity-100 group-hover:opacity-100"
        title="Refresh preview"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  );
}
