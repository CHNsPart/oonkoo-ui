# OonkoO UI - Component Registry Architecture Plan

## Project Overview

**OonkoO UI** is a modern component library featuring awesome Tailwind CSS and Framer Motion components for React projects. Built with Next.js, it provides beautifully animated components that developers can either install via CLI or copy-paste directly into their projects.

### Mission Statement
> Awesome Tailwind CSS and Framer Motion components for your React project. Copy paste the most popular components from the web and use them in your project without having to worry about styling and animations. Built with TailwindCSS and Framer Motion.

### Key Highlights

**Dual Installation Methods:**
1. **CLI Installation**: `npx shadcn@latest add @oonkoo/button` - Automatic setup with dependencies
2. **Copy-Paste**: Browse, copy, paste, and customize - Complete code ownership

**Modern Documentation Experience:**
- Landing page at `ui.oonkoo.com`
- Component docs at `ui.oonkoo.com/docs/[component]`
- Sidebar navigation for easy browsing
- Interactive component controls dock (variants, sizes, etc.)
- Live preview with real-time updates
- Syntax-highlighted code blocks with copy buttons
- Both CLI and manual installation tabs

### Key Features
- 🎨 Beautiful, animated components with Framer Motion
- 🚀 Dual installation: CLI via shadcn OR copy-paste
- 📦 Zero npm package dependencies
- 🎭 Full source code ownership
- 🌙 Dark mode support
- ⚡ Built with Next.js 14+, TypeScript, TailwindCSS & Framer Motion
- 🎯 Popular, battle-tested component patterns
- 🔧 Component variants, sizes, and customization controls

---

## Project Structure

```
oonkoo-ui/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                          # Landing page (ui.oonkoo.com)
│   ├── globals.css
│   └── docs/
│       ├── layout.tsx                     # Docs layout with sidebar
│       ├── page.tsx                       # Docs home
│       └── [component]/
│           └── page.tsx                   # Component documentation pages
├── components/
│   ├── ui/
│   │   └── (installed demo components)
│   ├── docs/
│   │   ├── sidebar.tsx                   # Documentation sidebar navigation
│   │   ├── component-preview.tsx         # Live component preview
│   │   ├── code-block.tsx                # Syntax highlighted code
│   │   ├── component-controls.tsx        # Variant/size controls dock
│   │   └── copy-button.tsx               # Copy-paste functionality
│   └── landing/
│       ├── hero.tsx
│       ├── features.tsx
│       └── component-showcase.tsx
├── registry/
│   └── default/
│       ├── button/
│       │   └── button.tsx
│       └── utils/
│           └── cn.ts
├── public/
│   └── r/
│       ├── button.json                   # Generated registry files
│       └── cn.json
├── lib/
│   ├── utils.ts
│   └── registry-utils.ts                 # Helper for registry operations
├── config/
│   ├── site.ts                           # Site configuration
│   └── docs.ts                           # Documentation structure
├── registry.json
├── components.json
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Setup Instructions

### Step 1: Initialize Next.js Project

```bash
# Create Next.js app
npx create-next-app@latest oonkoo-ui

# Configuration choices:
# ✔ Would you like to use TypeScript? Yes
# ✔ Would you like to use ESLint? Yes
# ✔ Would you like to use Tailwind CSS? Yes
# ✔ Would you like to use `src/` directory? No
# ✔ Would you like to use App Router? Yes
# ✔ Would you like to customize the default import alias? Yes (@/*)

cd oonkoo-ui
```

### Step 2: Install shadcn CLI

```bash
# Initialize shadcn
npx shadcn@latest init

# Configuration:
# ✔ Which style would you like to use? › New York
# ✔ Which color would you like to use as base color? › Zinc
# ✔ Would you like to use CSS variables for colors? › Yes
```

### Step 3: Create Registry Structure

```bash
# Create registry directories
mkdir -p registry/default/button
mkdir -p registry/default/utils
mkdir -p public/r
mkdir -p components/docs
mkdir -p components/landing
mkdir -p config
```

### Step 4: Install Dependencies

```bash
# Core dependencies for animations and utilities
npm install framer-motion clsx tailwind-merge class-variance-authority

# Additional utilities
npm install lucide-react react-syntax-highlighter

# Dev dependencies
npm install -D @types/node @types/react-syntax-highlighter tailwindcss-animate

# Install shadcn tabs component for documentation
npx shadcn@latest add tabs
```

---

## Core Files Configuration

### 1. registry.json (Root Level)

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "oonkoo",
  "homepage": "https://ui.oonkoo.com",
  "items": [
    {
      "name": "button",
      "type": "registry:component",
      "title": "Button",
      "description": "A beautifully animated button component with Framer Motion. Multiple variants and sizes with smooth animations.",
      "registryDependencies": ["cn"],
      "dependencies": ["class-variance-authority", "framer-motion"],
      "files": [
        {
          "path": "registry/default/button/button.tsx",
          "type": "registry:component"
        }
      ],
      "cssVars": {
        "light": {
          "primary": "222.2 47.4% 11.2%",
          "primary-foreground": "210 40% 98%"
        },
        "dark": {
          "primary": "210 40% 98%",
          "primary-foreground": "222.2 47.4% 11.2%"
        }
      }
    },
    {
      "name": "cn",
      "type": "registry:lib",
      "title": "CN Utility",
      "description": "Utility function for merging Tailwind classes",
      "dependencies": ["clsx", "tailwind-merge"],
      "files": [
        {
          "path": "registry/default/utils/cn.ts",
          "type": "registry:lib"
        }
      ]
    }
  ]
}
```

### 2. components.json (Root Level)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@oonkoo": "https://ui.oonkoo.com/r/{name}.json"
  }
}
```

### 3. package.json

```json
{
  "name": "oonkoo-ui",
  "version": "1.0.0",
  "description": "Awesome Tailwind CSS and Framer Motion components for React",
  "private": false,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "registry:build": "shadcn build"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "framer-motion": "^11.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.344.0",
    "react-syntax-highlighter": "^15.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/react-syntax-highlighter": "^15.5.11",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "tailwindcss-animate": "^1.0.7",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.2.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33"
  }
}
```

### 4. tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./registry/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## Component Implementation

### 1. CN Utility Function

**File:** `registry/default/utils/cn.ts`

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 2. Button Component

**File:** `registry/default/button/button.tsx`

```typescript
"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glow: "bg-primary text-primary-foreground shadow-lg shadow-primary/50 hover:shadow-primary/70 hover:shadow-xl transition-all duration-300",
        gradient:
          "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-all duration-300",
        shine:
          "relative bg-primary text-primary-foreground overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

---

## Build Process

### 1. Build Registry

```bash
# Build the registry JSON files
npm run registry:build
```

This command will:
1. Read `registry.json`
2. Process all components in `registry/default/`
3. Generate JSON files in `public/r/`
4. Each component gets its own JSON with embedded source code

**Generated files:**
- `public/r/button.json`
- `public/r/cn.json`

### 2. Example Generated JSON

**File:** `public/r/button.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "button",
  "type": "registry:component",
  "title": "Button",
  "description": "A beautifully animated button component with multiple variants",
  "files": [
    {
      "path": "components/ui/button.tsx",
      "content": "import * as React from \"react\";\nimport { cva, type VariantProps } from \"class-variance-authority\";\nimport { cn } from \"@/lib/utils\";\n\nconst buttonVariants = cva(\n  \"inline-flex items-center justify-center...",
      "type": "registry:component",
      "target": ""
    }
  ],
  "dependencies": ["class-variance-authority"],
  "registryDependencies": ["cn"],
  "cssVars": {
    "light": {
      "primary": "222.2 47.4% 11.2%",
      "primary-foreground": "210 40% 98%"
    },
    "dark": {
      "primary": "210 40% 98%",
      "primary-foreground": "222.2 47.4% 11.2%"
    }
  }
}
```

---

## Documentation Website

### Site Configuration

**File:** `config/site.ts`

```typescript
export const siteConfig = {
  name: "OonkoO UI",
  url: "https://ui.oonkoo.com",
  description:
    "Awesome Tailwind CSS and Framer Motion components for your React project. Copy paste the most popular components from the web.",
  links: {
    twitter: "https://twitter.com/oonkoo",
    github: "https://github.com/oonkoo/ui",
  },
};
```

**File:** `config/docs.ts`

```typescript
export const docsConfig = {
  nav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Components",
      href: "/docs/button",
    },
  ],
  sidebar: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
        {
          title: "Installation",
          href: "/docs/installation",
        },
        {
          title: "CLI",
          href: "/docs/cli",
        },
      ],
    },
    {
      title: "Components",
      items: [
        {
          title: "Button",
          href: "/docs/button",
        },
        // More components will be added here
      ],
    },
  ],
};
```

### Documentation Components

**File:** `components/docs/sidebar.tsx`

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docsConfig } from "@/config/docs";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r md:sticky md:block">
      <div className="py-6 pr-6 lg:py-8">
        {docsConfig.sidebar.map((section, i) => (
          <div key={i} className="pb-8">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
              {section.title}
            </h4>
            <div className="grid grid-flow-row auto-rows-max text-sm">
              {section.items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline",
                    pathname === item.href
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
```

**File:** `components/docs/component-preview.tsx`

```typescript
"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface ComponentPreviewProps {
  children: React.ReactNode;
  className?: string;
}

export function ComponentPreview({
  children,
  className,
}: ComponentPreviewProps) {
  return (
    <div className="relative my-4 flex min-h-[350px] w-full items-center justify-center rounded-lg border bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
```

**File:** `components/docs/code-block.tsx`

```typescript
"use client";

import * as React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group", className)}>
      <button
        onClick={copyToClipboard}
        className="absolute right-4 top-4 z-10 rounded-md bg-zinc-800 p-2 opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
```

**File:** `components/docs/component-controls.tsx`

```typescript
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Control {
  name: string;
  type: "select" | "radio" | "checkbox";
  options?: string[];
  defaultValue?: string | boolean;
}

interface ComponentControlsProps {
  controls: Control[];
  onControlChange: (name: string, value: any) => void;
  className?: string;
}

export function ComponentControls({
  controls,
  onControlChange,
  className,
}: ComponentControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "sticky bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex flex-wrap gap-4">
        {controls.map((control) => (
          <div key={control.name} className="flex flex-col gap-2">
            <label className="text-sm font-medium capitalize">
              {control.name}
            </label>
            {control.type === "select" && (
              <select
                className="rounded-md border bg-background px-3 py-1.5 text-sm"
                defaultValue={control.defaultValue as string}
                onChange={(e) => onControlChange(control.name, e.target.value)}
              >
                {control.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {control.type === "radio" && (
              <div className="flex gap-2">
                {control.options?.map((option) => (
                  <label key={option} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={control.name}
                      value={option}
                      defaultChecked={option === control.defaultValue}
                      onChange={(e) =>
                        onControlChange(control.name, e.target.value)
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
```

**File:** `components/docs/copy-button.tsx`

```typescript
"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy Code
        </>
      )}
    </button>
  );
}
```

### 1. Landing Page (ui.oonkoo.com)

**File:** `app/page.tsx`

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Sparkles, Copy } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 py-24">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-5xl w-full text-center space-y-8">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Built with Next.js, TailwindCSS & Framer Motion
          </div>

          <h1 className="text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl">
            Oonko<span className="text-primary">O</span> UI
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Awesome Tailwind CSS and Framer Motion components for your React
            project. Copy paste the most popular components from the web and use
            them in your project without having to worry about styling and
            animations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/docs">
              <Button variant="default" size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs/button">
              <Button variant="outline" size="lg" className="gap-2">
                <Code2 className="h-4 w-4" />
                View Components
              </Button>
            </Link>
          </div>

          {/* Installation Methods */}
          <div className="mt-16 grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="p-6 border rounded-lg bg-card text-left">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                CLI Installation
              </h3>
              <div className="bg-muted p-3 rounded font-mono text-sm">
                <p className="text-primary">
                  npx shadcn@latest add @oonkoo/button
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Install components directly via CLI with automatic setup
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-left">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Copy className="h-5 w-5 text-primary" />
                Copy & Paste
              </h3>
              <div className="bg-muted p-3 rounded font-mono text-sm">
                <p className="text-muted-foreground">
                  Browse • Copy • Paste • Done
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Manually copy component code and customize as needed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why OonkoO UI?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="p-6 border rounded-lg">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">
            Beautiful Components, Ready to Use
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Every component is built with Framer Motion for smooth animations and
            Tailwind CSS for easy customization
          </p>
          <Link href="/docs/button">
            <Button size="lg" variant="glow">
              Browse Components
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

const features = [
  {
    icon: Sparkles,
    title: "Framer Motion Animations",
    description:
      "Every component comes with smooth, performant animations powered by Framer Motion",
  },
  {
    icon: Code2,
    title: "Own Your Code",
    description:
      "Copy-paste or CLI install. The code lives in your project, fully customizable",
  },
  {
    icon: Copy,
    title: "No Package Dependencies",
    description:
      "No npm bloat. Just clean, well-written TypeScript components you can modify",
  },
];
```

### 2. Button Documentation Page (ui.oonkoo.com/docs/button)

**File:** `app/docs/button/page.tsx`

```typescript
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/docs/component-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentControls } from "@/components/docs/component-controls";
import { CopyButton } from "@/components/docs/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ButtonDocs() {
  const [variant, setVariant] = React.useState("default");
  const [size, setSize] = React.useState("default");

  const buttonCode = `<Button variant="${variant}" size="${size}">
  Click me
</Button>`;

  const installCode = `npx shadcn@latest add @oonkoo/button`;

  const manualCode = `"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glow: "bg-primary text-primary-foreground shadow-lg shadow-primary/50 hover:shadow-primary/70 hover:shadow-xl",
        gradient: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg",
        shine: "relative bg-primary text-primary-foreground overflow-hidden",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };`;

  return (
    <div className="max-w-4xl space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Button</h1>
        <p className="text-lg text-muted-foreground">
          A beautifully animated button component with Framer Motion. Multiple
          variants and sizes with smooth spring animations.
        </p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        
        <Tabs defaultValue="cli" className="w-full">
          <TabsList>
            <TabsTrigger value="cli">CLI</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cli" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Install the component via the shadcn CLI. This will add the
              component to your project with all dependencies.
            </p>
            <CodeBlock code={installCode} language="bash" />
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Copy and paste the component code into your project. Make sure you
              have the required dependencies installed.
            </p>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Dependencies:</p>
              <CodeBlock
                code="npm install framer-motion class-variance-authority clsx tailwind-merge"
                language="bash"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  components/ui/button.tsx
                </p>
                <CopyButton text={manualCode} />
              </div>
              <CodeBlock code={manualCode} showLineNumbers />
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Interactive Preview */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Preview</h2>
        <ComponentPreview>
          <Button variant={variant as any} size={size as any}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)} Button
          </Button>
        </ComponentPreview>

        <ComponentControls
          controls={[
            {
              name: "variant",
              type: "select",
              options: [
                "default",
                "secondary",
                "destructive",
                "outline",
                "ghost",
                "link",
                "glow",
                "gradient",
                "shine",
              ],
              defaultValue: "default",
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "default", "lg", "xl"],
              defaultValue: "default",
            },
          ]}
          onControlChange={(name, value) => {
            if (name === "variant") setVariant(value);
            if (name === "size") setSize(value);
          }}
        />
      </section>

      {/* Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Examples</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Variants</h3>
          <ComponentPreview>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </ComponentPreview>
          <CodeBlock
            code={`<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Animated Variants</h3>
          <ComponentPreview className="bg-zinc-950">
            <div className="flex flex-wrap gap-4">
              <Button variant="glow">Glow Effect</Button>
              <Button variant="gradient">Gradient</Button>
              <Button variant="shine">Shine Effect</Button>
            </div>
          </ComponentPreview>
          <CodeBlock
            code={`<Button variant="glow">Glow Effect</Button>
<Button variant="gradient">Gradient</Button>
<Button variant="shine">Shine Effect</Button>`}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Sizes</h3>
          <ComponentPreview>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </ComponentPreview>
          <CodeBlock
            code={`<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>`}
          />
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <CodeBlock
          code={`import { Button } from "@/components/ui/button";

export default function MyComponent() {
  return (
    <div>
      <Button>Click me</Button>
      <Button variant="glow">Glowing Button</Button>
      <Button variant="gradient" size="lg">
        Large Gradient
      </Button>
    </div>
  );
}`}
        />
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Props</h2>
        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">Prop</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Default</th>
                <th className="text-left p-4 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-4 font-mono text-xs">variant</td>
                <td className="p-4 font-mono text-xs">
                  "default" | "destructive" | "outline" | "secondary" | "ghost"
                  | "link" | "glow" | "gradient" | "shine"
                </td>
                <td className="p-4">"default"</td>
                <td className="p-4">The visual style of the button</td>
              </tr>
              <tr className="border-t">
                <td className="p-4 font-mono text-xs">size</td>
                <td className="p-4 font-mono text-xs">
                  "default" | "sm" | "lg" | "xl" | "icon"
                </td>
                <td className="p-4">"default"</td>
                <td className="p-4">The size of the button</td>
              </tr>
              <tr className="border-t">
                <td className="p-4 font-mono text-xs">asChild</td>
                <td className="p-4 font-mono text-xs">boolean</td>
                <td className="p-4">false</td>
                <td className="p-4">
                  Render as a child component (for use with Link, etc.)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
```

### 3. Documentation Layout with Sidebar

**File:** `app/docs/layout.tsx`

```typescript
import { DocsSidebar } from "@/components/docs/sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <DocsSidebar />
      <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
```

---

## Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Vercel Configuration:**

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build && npm run registry:build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/r/:path*",
      "destination": "/r/:path*"
    }
  ]
}
```

### Option 2: Netlify

Create `netlify.toml`:

```toml
[build]
  command = "npm run build && npm run registry:build"
  publish = ".next"

[[redirects]]
  from = "/r/*"
  to = "/r/:splat"
  status = 200
```

### Option 3: Custom Server

Use any static hosting that supports Next.js:
- AWS S3 + CloudFront
- DigitalOcean App Platform
- Cloudflare Pages
- Railway

---

## Usage for End Users

### Step 1: Setup Their Project

Users initialize shadcn in their Next.js project:

```bash
npx shadcn@latest init
```

### Step 2: Add OonkoO UI Registry

Edit `components.json`:

```json
{
  "registries": {
    "@oonkoo-ui": "https://oonkoo-ui.com/r/{name}.json"
  }
}
```

### Step 3: Install Components

```bash
# Install button component
npx shadcn@latest add @oonkoo-ui/button

# Or direct URL
npx shadcn@latest add https://oonkoo-ui.com/r/button.json
```

### Step 4: Use Components

```typescript
import { Button } from "@/components/ui/button";

export default function Page() {
  return <Button variant="glow">Click me</Button>;
}
```

---

## Advanced Features

### 1. Multiple Component Variants

Add more variants to registry:

```json
{
  "items": [
    {
      "name": "button",
      "type": "registry:component"
    },
    {
      "name": "button-icon",
      "type": "registry:component",
      "registryDependencies": ["button"]
    }
  ]
}
```

### 2. Complex Components with Dependencies

```json
{
  "name": "form-button",
  "type": "registry:component",
  "registryDependencies": ["button", "form", "label"],
  "dependencies": ["react-hook-form", "zod"]
}
```

### 3. Blocks (Complete Sections)

```json
{
  "name": "hero-section",
  "type": "registry:block",
  "registryDependencies": ["button", "card"],
  "files": [
    {
      "path": "registry/default/blocks/hero-section.tsx",
      "type": "registry:component"
    }
  ]
}
```

### 4. Theme Support

```json
{
  "cssVars": {
    "theme": {
      "font-heading": "Poppins, sans-serif"
    },
    "light": {
      "brand": "20 14.3% 4.1%",
      "brand-foreground": "60 9.1% 97.8%"
    },
    "dark": {
      "brand": "20 14.3% 4.1%",
      "brand-foreground": "60 9.1% 97.8%"
    }
  }
}
```

---

## PRO Components Architecture

### Option 1: Separate PRO Registry

**Structure:**
```
oonkoo-ui/
├── public/
│   ├── r/           # Free components
│   └── pro/         # PRO components (protected)
```

**Middleware Protection:**

Create `middleware.ts`:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /pro routes
  if (pathname.startsWith("/pro")) {
    const token = request.headers.get("Authorization");
    const licenseKey = request.nextUrl.searchParams.get("license");

    if (!token && !licenseKey) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify token/license
    const isValid = verifyLicense(token || licenseKey);

    if (!isValid) {
      return new NextResponse("Invalid License", { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/pro/:path*",
};

function verifyLicense(key: string | null): boolean {
  // Implement your license verification logic
  // Check against database, JWT, etc.
  return key === process.env.VALID_LICENSE_KEY;
}
```

**User Configuration:**

```json
{
  "registries": {
    "@oonkoo-ui": "https://oonkoo-ui.com/r/{name}.json",
    "@oonkoo-ui-pro": {
      "url": "https://oonkoo-ui.com/pro/{name}.json",
      "headers": {
        "Authorization": "Bearer ${CHNSUI_LICENSE}"
      }
    }
  }
}
```

### Option 2: Dynamic API Routes

**File:** `app/api/pro/[name]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    // Verify license
    const license = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!license) {
      return NextResponse.json({ error: "License required" }, { status: 401 });
    }

    const isValid = await verifyProLicense(license);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid license" }, { status: 403 });
    }

    // Serve component
    const componentPath = join(
      process.cwd(),
      "public",
      "pro",
      `${params.name}.json`
    );

    const component = await readFile(componentPath, "utf-8");

    return new NextResponse(component, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }
}

async function verifyProLicense(license: string): Promise<boolean> {
  // Implement license verification
  // Options:
  // 1. Check against database
  // 2. Verify JWT token
  // 3. Call external licensing API (Gumroad, Lemon Squeezy, Stripe)

  try {
    const response = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        license_key: license,
        instance_id: "oonkoo-ui",
      }),
    });

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    return false;
  }
}
```

### Option 3: Hybrid Approach

Free components in `public/r/`
Pro components served via API with different pricing tiers:

```typescript
// Tier-based access
const TIERS = {
  free: ["button", "card", "input"],
  starter: ["button", "card", "input", "modal", "dropdown"],
  pro: ["*"], // All components
};

function hasAccess(tier: string, component: string): boolean {
  const allowed = TIERS[tier as keyof typeof TIERS];
  return allowed.includes("*") || allowed.includes(component);
}
```

---

## Testing & Quality Assurance

### 1. Component Testing

```bash
npm install -D @testing-library/react @testing-library/jest-dom
```

**File:** `registry/default/button/__tests__/button.test.tsx`

```typescript
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Button variant="glow">Glow</Button>);
    const button = screen.getByText("Glow");
    expect(button).toHaveClass("shadow-primary/50");
  });
});
```

### 2. Registry Validation

Create a test script to validate registry JSON:

**File:** `scripts/validate-registry.ts`

```typescript
import { readFile } from "fs/promises";
import { join } from "path";

async function validateRegistry() {
  const registryPath = join(process.cwd(), "registry.json");
  const registry = JSON.parse(await readFile(registryPath, "utf-8"));

  console.log("✓ Registry JSON is valid");
  console.log(`✓ Found ${registry.items.length} components`);

  // Validate each item
  for (const item of registry.items) {
    console.log(`  Checking ${item.name}...`);

    // Check files exist
    for (const file of item.files) {
      const filePath = join(process.cwd(), file.path);
      try {
        await readFile(filePath);
        console.log(`    ✓ ${file.path}`);
      } catch {
        console.error(`    ✗ Missing: ${file.path}`);
        process.exit(1);
      }
    }
  }

  console.log("\n✓ All validations passed!");
}

validateRegistry();
```

Add to package.json:

```json
{
  "scripts": {
    "validate": "tsx scripts/validate-registry.ts"
  }
}
```

---

## GitHub Actions CI/CD

**File:** `.github/workflows/deploy.yml`

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Validate registry
        run: npm run validate

      - name: Build registry
        run: npm run registry:build

      - name: Build Next.js
        run: npm run build

      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Marketing & Documentation

### 1. SEO Optimization

**File:** `app/layout.tsx`

```typescript
export const metadata = {
  title: "OonkoO UI - Beautiful Animated React Components",
  description:
    "Install beautiful, animated UI components directly into your Next.js project via CLI. Built with TypeScript, Tailwind CSS, and shadcn.",
  keywords: [
    "react components",
    "ui library",
    "tailwind css",
    "shadcn",
    "next.js",
    "typescript",
  ],
  authors: [{ name: "CHNs" }],
  openGraph: {
    title: "OonkoO UI - Beautiful Animated React Components",
    description:
      "Install beautiful, animated UI components directly into your project",
    url: "https://oonkoo-ui.com",
    siteName: "OonkoO UI",
    images: [
      {
        url: "https://oonkoo-ui.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OonkoO UI - Beautiful Animated React Components",
    description:
      "Install beautiful, animated UI components directly into your project",
    images: ["https://oonkoo-ui.com/og-image.png"],
  },
};
```

### 2. README.md

```markdown
# OonkoO UI

Beautiful, animated UI components for Next.js, built with TypeScript and Tailwind CSS.

## Installation

```bash
npx shadcn@latest add @oonkoo-ui/button
```

## Features

- 🎨 Beautiful, animated components
- 🚀 CLI-based installation
- 📦 Zero npm dependencies
- 🎭 Own the source code
- 🌙 Dark mode ready
- ⚡ TypeScript support

## Documentation

Visit [oonkoo-ui.com](https://oonkoo-ui.com) for full documentation.

## License

MIT
```

---

## Monetization Strategy

### Free Tier
- Basic components (button, input, card, etc.)
- Essential animations
- Community support

### Starter Tier ($49)
- All free components
- Advanced animations
- Premium variants
- Email support

### Pro Tier ($99)
- All starter components
- Complex components (data tables, calendars)
- Block templates
- Priority support
- Lifetime updates

### Enterprise ($299)
- All pro features
- Custom components
- White-label option
- Dedicated support
- Source code access to entire library

---

## Roadmap

### Phase 1: MVP (Weeks 1-2)
- ✅ Setup Next.js project
- ✅ Implement button component
- ✅ Configure registry
- ✅ Deploy to Vercel

### Phase 2: Core Components (Weeks 3-4)
- [ ] Input
- [ ] Card
- [ ] Modal/Dialog
- [ ] Dropdown
- [ ] Tabs

### Phase 3: Advanced Components (Weeks 5-8)
- [ ] Data Table
- [ ] Calendar
- [ ] Command Menu
- [ ] Toast/Notification
- [ ] Carousel

### Phase 4: Pro Features (Weeks 9-12)
- [ ] Authentication forms
- [ ] Dashboard blocks
- [ ] Landing page sections
- [ ] Chart components
- [ ] Pro license system

### Phase 5: Growth (Ongoing)
- [ ] Blog/tutorials
- [ ] Video documentation
- [ ] Community Discord
- [ ] Figma design files
- [ ] VS Code extension

---

## Success Metrics

### Technical Metrics
- Registry build time < 5 seconds
- Component install time < 10 seconds
- Zero breaking changes in minor versions
- 100% TypeScript coverage

### Business Metrics
- 1,000 GitHub stars in 6 months
- 100 paying customers in first year
- $5,000 MRR by month 12
- 50% customer retention rate

---

## Support & Community

### Documentation
- Component API reference
- Installation guides
- Migration guides
- Best practices

### Community
- GitHub Discussions
- Discord server
- Twitter updates
- Monthly newsletter

### Support Channels
- GitHub Issues (free tier)
- Email support (paid tiers)
- Priority support (enterprise)
- Custom development (enterprise)

---

## Legal

### License
Components are MIT licensed - users own the code they install.

### Terms of Service
- Free tier: Unlimited usage
- Paid tiers: Per-seat licensing
- Enterprise: Custom agreements

### Privacy Policy
- No tracking on installed components
- Anonymous usage analytics on docs site
- Email only for support/updates

---

## Conclusion

OonkoO UI provides a complete, production-ready foundation for building a component library with dual installation methods. The architecture is scalable, components are high-quality with Framer Motion animations, and the documentation experience is modern and developer-friendly.

---

## Quick Start Implementation Guide

### For Developers Setting Up OonkoO UI:

1. **Initialize Project**
```bash
npx create-next-app@latest oonkoo-ui
cd oonkoo-ui
npx shadcn@latest init
```

2. **Install Dependencies**
```bash
npm install framer-motion clsx tailwind-merge class-variance-authority lucide-react react-syntax-highlighter
npm install -D @types/react-syntax-highlighter tailwindcss-animate
npx shadcn@latest add tabs
```

3. **Create Structure**
```bash
mkdir -p registry/default/{button,utils}
mkdir -p public/r
mkdir -p components/{docs,landing}
mkdir -p config
```

4. **Add Core Files**
- Copy registry.json configuration
- Add button component with Framer Motion
- Create CN utility
- Set up documentation components (sidebar, preview, code-block, controls)

5. **Build & Deploy**
```bash
npm run registry:build
npm run build
vercel --prod
```

### For End Users Installing Components:

**Method 1: CLI (Recommended)**
```bash
# Add registry to components.json
{
  "registries": {
    "@oonkoo": "https://ui.oonkoo.com/r/{name}.json"
  }
}

# Install component
npx shadcn@latest add @oonkoo/button
```

**Method 2: Copy-Paste**
1. Visit ui.oonkoo.com/docs/button
2. Click "Manual" tab
3. Copy the component code
4. Paste into your project
5. Install dependencies if needed

---

## Next Steps

**Phase 1: Foundation (Week 1-2)**
- ✅ Project setup
- ✅ Button component with Framer Motion
- ✅ Documentation system
- ✅ Dual installation methods
- 🔄 Deploy to production

**Phase 2: Core Components (Week 3-4)**
- [ ] Input with animations
- [ ] Card with hover effects
- [ ] Modal/Dialog with spring animations
- [ ] Dropdown with motion
- [ ] Tabs component

**Phase 3: Advanced Components (Week 5-8)**
- [ ] Animated data table
- [ ] Calendar with transitions
- [ ] Command menu
- [ ] Toast notifications with motion
- [ ] Carousel with gestures

**Phase 4: Growth**
- [ ] Video tutorials
- [ ] Blog with component showcases
- [ ] Community examples
- [ ] Figma design kit
- [ ] VS Code snippets

Good luck building OonkoO UI! 🚀
