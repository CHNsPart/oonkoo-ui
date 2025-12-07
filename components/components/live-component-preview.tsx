"use client";

import { useState, useRef, useEffect } from "react";
import {
  RefreshCw,
  Maximize2,
  Minimize2,
  Monitor,
  Tablet,
  Smartphone,
  Grid3x3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LiveComponentPreviewProps {
  slug: string;
  name: string;
  className?: string;
  controlValues?: Record<string, any>;
}

type ViewportSize = "desktop" | "tablet" | "mobile";
type BackgroundPattern = "grid" | "dots" | "none";

const backgroundPatterns: Record<BackgroundPattern, {
  label: string;
  style: React.CSSProperties;
}> = {
  grid: {
    label: "Grid",
    style: {
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
      backgroundSize: "24px 24px",
    }
  },
  dots: {
    label: "Dots",
    style: {
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 2px, transparent 2px)",
      backgroundSize: "32px 32px",
    }
  },
  none: {
    label: "Solid",
    style: {
      backgroundImage: "none",
    }
  },
};

const viewportSizes: Record<ViewportSize, {
  width: number;
  icon: React.ReactNode;
  label: string;
  description: string;
}> = {
  desktop: {
    width: 1280,
    icon: <Monitor className="h-4 w-4" />,
    label: "Desktop",
    description: "1280px"
  },
  tablet: {
    width: 768,
    icon: <Tablet className="h-4 w-4" />,
    label: "Tablet",
    description: "768px"
  },
  mobile: {
    width: 375,
    icon: <Smartphone className="h-4 w-4" />,
    label: "Mobile",
    description: "375px"
  },
};

export function LiveComponentPreview({ slug, name, className, controlValues = {} }: LiveComponentPreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);
  const [backgroundPattern, setBackgroundPattern] = useState<BackgroundPattern>("grid");
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Build query string from control values
  const queryParams = Object.keys(controlValues).length > 0
    ? "?" + new URLSearchParams(
        Object.entries(controlValues).map(([key, value]) => [key, String(value)])
      ).toString()
    : "";

  // Track container width for responsive scaling
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleToggleBackground = () => {
    const patterns: BackgroundPattern[] = ["grid", "dots", "none"];
    const currentIndex = patterns.indexOf(backgroundPattern);
    const nextIndex = (currentIndex + 1) % patterns.length;
    setBackgroundPattern(patterns[nextIndex]);
  };

  // Calculate the actual width for the preview iframe
  const getPreviewWidth = () => {
    if (viewport === "desktop") {
      return "100%";
    }
    return `${viewportSizes[viewport].width}px`;
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden",
        isFullscreen && "fixed inset-4 z-50 shadow-2xl",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-zinc-700" />

          {/* Viewport toggles with labels */}
          <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1">
            {(Object.keys(viewportSizes) as ViewportSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setViewport(size)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                  viewport === size
                    ? "bg-zinc-700 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                )}
              >
                {viewportSizes[size].icon}
                <span className="hidden sm:inline">{viewportSizes[size].label}</span>
              </button>
            ))}
          </div>

          {/* Current viewport info */}
          <span className="text-xs text-zinc-500 hidden md:inline">
            {viewportSizes[viewport].description}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white"
            onClick={handleToggleBackground}
            title={`Background: ${backgroundPatterns[backgroundPattern].label}`}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white"
            onClick={handleRefresh}
            title="Refresh preview"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white"
            onClick={handleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div
        ref={containerRef}
        className={cn(
          "bg-zinc-950 overflow-auto",
          isFullscreen ? "h-[calc(100%-52px)]" : "min-h-[450px]"
        )}
      >
        {/* Background pattern */}
        <div
          className={cn(
            "w-full h-full flex justify-center",
            viewport === "desktop" ? "p-0" : "p-2"
          )}
          style={{
            ...backgroundPatterns[backgroundPattern].style,
            minHeight: isFullscreen ? "100%" : "450px",
          }}
        >
          {/* Preview container with iframe */}
          <div
            className={cn(
              "transition-all duration-300 ease-out h-full",
              viewport !== "desktop" && "relative",
              viewport === "desktop" && "w-full"
            )}
            style={{
              width: getPreviewWidth(),
              maxWidth: getPreviewWidth(),
            }}
          >
            {/* Device frame border for non-desktop */}
            {viewport !== "desktop" && (
              <div className="absolute inset-0 rounded-xl border-2 border-zinc-700/50 pointer-events-none -m-1 z-10" />
            )}

            {/* Iframe Preview */}
            <div
              className={cn(
                "bg-background overflow-hidden w-full h-full",
                viewport !== "desktop" ? "rounded-lg border border-zinc-800" : ""
              )}
              style={{
                minHeight: isFullscreen ? "calc(100vh - 120px)" : "430px",
              }}
            >
              <iframe
                key={`${key}-${JSON.stringify(controlValues)}`}
                src={`/api/preview/${slug}${queryParams}`}
                className="w-full h-full border-0"
                style={{ minHeight: isFullscreen ? "calc(100vh - 120px)" : "430px" }}
                title={`${name} preview`}
              />
            </div>

            {/* Device label */}
            {viewport !== "desktop" && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-zinc-500 whitespace-nowrap z-10">
                {viewportSizes[viewport].label} · {viewportSizes[viewport].description}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen backdrop */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm -z-10"
          onClick={handleFullscreen}
        />
      )}
    </div>
  );
}
