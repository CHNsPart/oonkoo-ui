import React from "react";
import { cn } from "@/lib/utils";

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
}

export const PulsatingButton = React.forwardRef<
  HTMLButtonElement,
  PulsatingButtonProps
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

PulsatingButton.displayName = "PulsatingButton";

export default function Preview() {
  return (
    <div className="flex flex-col md:flex-row min-h-[400px] w-full items-center justify-center gap-6 p-8">
      <PulsatingButton className="bg-zinc-600 text-white">Default Pulse</PulsatingButton>
      <PulsatingButton pulseColor="#4AFE80" duration="2s">
        Blue Pulse
      </PulsatingButton>
      <PulsatingButton pulseColor="#8b5cf6" duration="1s" className="bg-purple-600">
        Purple Fast
      </PulsatingButton>
    </div>
  );
}
