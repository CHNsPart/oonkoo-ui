"use client";

import { ReactNode } from "react";
import { Sparkles, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CategoryTemplate,
  OverlayConfig,
} from "@/lib/component-config";

// =============================================================================
// TYPES
// =============================================================================

interface BasePreviewProps {
  Component: React.ComponentType<any>;
  template: CategoryTemplate;
  component: {
    name: string;
    slug: string;
    description: string;
    tags?: string[];
  };
  props?: Record<string, any>;
  overlays?: OverlayConfig[];
  children?: ReactNode;
}

// =============================================================================
// OVERLAY RENDERER
// =============================================================================

interface OverlayElementProps extends OverlayConfig {
  isOverlay?: boolean;
}

function OverlayElement({
  type,
  text,
  className,
  href,
  variant = "primary",
}: OverlayElementProps) {
  const buttonVariants: Record<string, string> = {
    primary:
      "inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors pointer-events-auto",
    secondary:
      "inline-flex items-center justify-center px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors pointer-events-auto",
    outline:
      "inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-transparent text-foreground font-medium hover:bg-muted transition-colors pointer-events-auto",
    ghost:
      "inline-flex items-center justify-center px-6 py-3 rounded-lg text-foreground font-medium hover:bg-muted transition-colors pointer-events-auto",
  };

  const defaultStyles: Record<string, string> = {
    badge:
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20",
    heading:
      "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground",
    subheading:
      "text-2xl md:text-3xl font-semibold tracking-tight text-foreground",
    paragraph: "text-base md:text-lg text-muted-foreground max-w-2xl",
    divider: "w-16 h-1 bg-primary/50 rounded-full",
  };

  const baseClass = type === "button" ? buttonVariants[variant] : defaultStyles[type];
  const finalClass = cn(baseClass, className);

  switch (type) {
    case "heading":
      return <h1 className={finalClass}>{text}</h1>;
    case "subheading":
      return <h2 className={finalClass}>{text}</h2>;
    case "paragraph":
      return <p className={finalClass}>{text}</p>;
    case "badge":
      return <span className={finalClass}>{text}</span>;
    case "button":
      if (href) {
        return (
          <a
            href={href}
            className={finalClass}
            onClick={(e) => e.preventDefault()}
          >
            {text}
          </a>
        );
      }
      return <button className={finalClass}>{text}</button>;
    case "divider":
      return <div className={finalClass} />;
    default:
      return null;
  }
}

function OverlayRenderer({ overlays }: { overlays: OverlayConfig[] }) {
  if (!overlays || overlays.length === 0) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
      {overlays.map((overlay, index) => (
        <OverlayElement key={index} {...overlay} />
      ))}
    </div>
  );
}

// =============================================================================
// FULL LAYOUT PREVIEW
// For background components - fills container with overlay on top
// =============================================================================

export function FullLayoutPreview({
  Component,
  template,
  component,
  props = {},
  overlays: passedOverlays,
}: BasePreviewProps) {
  // Use passed overlays first, then template defaults
  const overlays = passedOverlays || template.defaultOverlays?.(component as any) || [];

  return (
    <div className={cn("min-h-[600px]", template.containerClass, template.backgroundClass)}>
      {/* Overlay content */}
      {overlays.length > 0 && <OverlayRenderer overlays={overlays} />}

      {/* Interaction hint for cursor components */}
      {template.interactionHint && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-muted-foreground pointer-events-none">
          <MousePointer2 className="h-4 w-4" />
          <span className="text-xs">{template.interactionHint}</span>
        </div>
      )}

      {/* Background component */}
      <Component {...props} />
    </div>
  );
}

// =============================================================================
// CENTERED LAYOUT PREVIEW
// For buttons and simple elements - shows the component centered
// =============================================================================

export function CenteredLayoutPreview({
  Component,
  template,
  component,
  props = {},
}: BasePreviewProps) {
  return (
    <div className={cn("min-h-[600px]", template.containerClass, template.backgroundClass, "rounded-xl")}>
      {/* Branding */}
      <p className="text-xs text-neutral-500 absolute top-4 left-4">
        Built with OonkoO UI
      </p>

      {/* Component - render with simple children */}
      <Component {...props}>
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          {component.name}
        </span>
      </Component>

      {/* Footer */}
      <p className="text-[10px] text-neutral-600 absolute bottom-4 left-1/2 -translate-x-1/2">
        @oonkoohq
      </p>
    </div>
  );
}

// =============================================================================
// GRID LAYOUT PREVIEW
// For cards - shows the component with demo content
// =============================================================================

export function GridLayoutPreview({
  Component,
  template,
  component,
  props = {},
}: BasePreviewProps) {
  return (
    <div className={cn("min-h-[600px]", template.containerClass, template.backgroundClass, "rounded-xl")}>
      {/* Render the card component with demo children */}
      <Component {...props} className="w-80">
        <div className="p-4">
          <div
            className="h-32 w-full rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 mb-4"
          />
          <h3 className="font-semibold text-lg">{component.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {component.description || "Interactive component preview"}
          </p>
        </div>
      </Component>
    </div>
  );
}

// =============================================================================
// DYNAMIC PREVIEW SELECTOR
// Selects the appropriate layout based on template
// =============================================================================

export function CategoryPreview(props: BasePreviewProps & { overlays?: OverlayConfig[] }) {
  const { template, overlays } = props;

  switch (template.layout) {
    case "full":
      return <FullLayoutPreview {...props} overlays={overlays} />;
    case "centered":
      return <CenteredLayoutPreview {...props} overlays={overlays} />;
    case "grid":
      return <GridLayoutPreview {...props} overlays={overlays} />;
    default:
      return <CenteredLayoutPreview {...props} overlays={overlays} />;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export { OverlayRenderer, OverlayElement };
