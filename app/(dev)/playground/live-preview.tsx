"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback, Fragment } from "react";
import { LiveProvider, LivePreview as ReactLivePreview, LiveError } from "react-live";
import * as LucideIcons from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimation,
  useInView,
  useScroll,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Mock UI components
const MockButton = ({ children, className = "", variant = "default", size = "default", asChild, ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  const sizes: Record<string, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  };
  return (
    <button className={cn(baseStyles, variants[variant] || variants.default, sizes[size] || sizes.default, className)} {...props}>
      {children}
    </button>
  );
};

const MockBadge = ({ children, className = "", variant = "default", ...props }: any) => {
  const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";
  const variants: Record<string, string> = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    outline: "text-foreground",
  };
  return (
    <span className={cn(baseStyles, variants[variant] || variants.default, className)} {...props}>
      {children}
    </span>
  );
};

const MockCard = ({ children, className = "", ...props }: any) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props}>
    {children}
  </div>
);

const MockInput = ({ className = "", ...props }: any) => (
  <input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
      className
    )}
    {...props}
  />
);

const MockLink = ({ href, children, className, ...props }: any) => (
  <a href={href || "#"} className={className} onClick={(e) => e.preventDefault()} {...props}>
    {children}
  </a>
);

const MockImage = ({ src, alt, className, fill, width, height, ...props }: any) => {
  const style = fill ? { position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const } : {};
  return <img src={src || "/placeholder.svg"} alt={alt || ""} className={className} style={style} {...props} />;
};

// Scope for react-live
const scope = {
  // React
  React,
  Fragment,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,

  // Framer Motion
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimation,
  useInView,
  useScroll,
  useMotionTemplate,
  useReducedMotion,

  // Lucide Icons
  ...LucideIcons,

  // Mock components
  Button: MockButton,
  Badge: MockBadge,
  Card: MockCard,
  Input: MockInput,
  Link: MockLink,
  Image: MockImage,

  // Utils
  cn,
};

function transformCode(code: string): string {
  // Remove imports
  let transformed = code.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, "");

  // Remove "use client" directive
  transformed = transformed.replace(/['"]use client['"];?\s*/g, "");

  // Remove TypeScript interfaces and types
  transformed = transformed.replace(/^interface\s+\w+\s*{[^}]*}/gm, "");
  transformed = transformed.replace(/^type\s+\w+\s*=\s*[^;]+;/gm, "");

  // Remove export keywords from const declarations
  transformed = transformed.replace(/export\s+const/g, "const");

  // Remove TypeScript type annotations from React.FC and forwardRef
  transformed = transformed.replace(/:\s*React\.FC<[^>]+>/g, "");
  transformed = transformed.replace(/React\.forwardRef<[^>]+>/g, "React.forwardRef");

  // Find the default export (Preview component)
  const defaultExportMatch = transformed.match(/export\s+default\s+function\s+(\w+)/);

  if (defaultExportMatch) {
    const componentName = defaultExportMatch[1];
    transformed = transformed.replace(/export\s+default\s+function/, "function");
    transformed = transformed.replace(/export\s+function/g, "function");
    transformed = `${transformed}\n\nrender(<${componentName} />);`;
  } else {
    // Try named export
    const namedExportMatch = transformed.match(/export\s+function\s+(\w+)/);
    if (namedExportMatch) {
      const componentName = namedExportMatch[1];
      transformed = transformed.replace(/export\s+function/g, "function");
      transformed = `${transformed}\n\nrender(<${componentName} />);`;
    }
  }

  return transformed;
}

interface LivePreviewProps {
  code: string;
  controlValues?: Record<string, any>;
}

export function LivePreview({ code, controlValues = {} }: LivePreviewProps) {
  const transformedCode = useMemo(() => {
    let transformed = transformCode(code);

    // If we have control values, inject them as props
    if (Object.keys(controlValues).length > 0) {
      // Build props string from control values
      const propsStr = Object.entries(controlValues)
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `${key}="${value}"`;
          }
          return `${key}={${JSON.stringify(value)}}`;
        })
        .join(' ');

      // Replace the render call to include props
      transformed = transformed.replace(
        /render\(<(\w+)\s*\/>\);/,
        `render(<$1 ${propsStr} />);`
      );
    }

    return transformed;
  }, [code, controlValues]);

  return (
    <LiveProvider code={transformedCode} scope={scope} noInline={true}>
      <div className="w-full">
        <LiveError className="text-red-400 bg-red-950/50 border border-red-900 rounded-lg p-4 mb-4 text-sm font-mono" />
        <ReactLivePreview className="w-full" />
      </div>
    </LiveProvider>
  );
}
