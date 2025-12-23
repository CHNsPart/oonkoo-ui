"use client"

import React from "react";
import { cn } from "@/lib/utils";

/**
 * PulseButton component props
 * @param pulseColor The color of the pulse effect (hex, rgb, or CSS color)
 * @param duration Animation duration (e.g., "1.5s", "2000ms")
 */
interface PulseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
}

export const PulseButton = React.forwardRef<
  HTMLButtonElement,
  PulseButtonProps
>(
  (
    {
      className,
      children,
      pulseColor = "#808080",
      duration = "1.5s",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "bg-primary text-primary-foreground relative flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-center",
          className
        )}
        style={
          {
            "--pulse-color": pulseColor,
            "--duration": duration,
          } as React.CSSProperties
        }
        {...props}
      >
        <div className="relative z-10">{children}</div>
        <div className="absolute top-1/2 left-1/2 size-full -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-lg bg-inherit" />
      </button>
    );
  }
);

PulseButton.displayName = "PulseButton";
