// =============================================================================
// COMPONENT CONFIGURATION
// Centralized configuration for component registry, preview templates, and badges
// =============================================================================

import { ComponentCategory } from "@prisma/client";

// =============================================================================
// TYPES
// =============================================================================

export interface OverlayConfig {
  type: 'badge' | 'heading' | 'subheading' | 'paragraph' | 'button' | 'divider';
  text?: string;
  className?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export interface CategoryTemplate {
  containerClass: string;
  layout: 'full' | 'centered' | 'grid';
  backgroundClass?: string;
  overlayPosition?: 'overlay' | 'above' | 'below';
  showVariants?: boolean;
  variantCount?: number;
  gridColumns?: number;
  interactionHint?: string;
  defaultOverlays?: (component: { name: string; slug: string; description: string; tags: string[] }) => OverlayConfig[];
}

export interface ControlDefinition {
  name: string;
  type: 'slider' | 'color' | 'text' | 'checkbox' | 'select';
  label: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string }[];
  defaultValue?: string | number | boolean;
}

// =============================================================================
// CATEGORY-BASED PREVIEW TEMPLATES
// =============================================================================

export const CATEGORY_TEMPLATES: Record<string, CategoryTemplate> = {
  // Background components - full screen with overlay content
  background: {
    containerClass: 'h-[600px] w-full relative',
    layout: 'full',
    overlayPosition: 'overlay',
    defaultOverlays: (component) => [
      {
        type: 'badge',
        text: component.tags.includes('webgl') ? 'WebGL Powered' : 'Interactive',
        className: 'mb-4',
      },
      {
        type: 'heading',
        text: component.name,
        className: 'text-white drop-shadow-lg',
      },
      {
        type: 'paragraph',
        text: component.description,
        className: 'text-white/80 text-center max-w-md mt-4 drop-shadow-md',
      },
      {
        type: 'button',
        text: 'Get This Component',
        href: `/components/${component.slug}`,
        variant: 'primary',
        className: 'mt-6',
      },
    ],
  },

  // Button components - centered with 2-3 variants
  buttons: {
    containerClass: 'min-h-[500px] w-full flex flex-col items-center justify-center gap-6 p-8',
    backgroundClass: 'bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950',
    layout: 'centered',
    showVariants: true,
    variantCount: 3,
  },

  // Card components - grid layout with 2-3 cards
  cards: {
    containerClass: 'min-h-[600px] w-full flex items-center justify-center gap-6 p-8',
    backgroundClass: 'bg-gradient-to-br from-neutral-100 via-neutral-50 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950',
    layout: 'grid',
    gridColumns: 2,
  },

  // Cursor components - full with interaction hint
  cursor: {
    containerClass: 'h-[600px] w-full relative border border-border/50 rounded-lg overflow-hidden',
    layout: 'full',
    interactionHint: 'Move your cursor or click to interact',
    overlayPosition: 'overlay',
    defaultOverlays: (component) => [
      {
        type: 'paragraph',
        text: 'Click anywhere to interact',
        className: 'text-muted-foreground text-lg',
      },
    ],
  },

  // Animation components - centered
  animations: {
    containerClass: 'min-h-[500px] w-full flex items-center justify-center p-8',
    layout: 'centered',
  },

  // Default fallback for other categories
  other: {
    containerClass: 'min-h-[500px] w-full flex items-center justify-center p-8',
    layout: 'centered',
  },
};

// Map Prisma enum to template key
export const getCategoryTemplate = (category: ComponentCategory | string): CategoryTemplate => {
  const key = String(category).toLowerCase();
  return CATEGORY_TEMPLATES[key] || CATEGORY_TEMPLATES.other;
};

// =============================================================================
// OFFICIAL COMPONENTS (OonkooUI Team)
// =============================================================================

// List of component slugs created by the OonkooUI Team
export const OFFICIAL_COMPONENTS = [
  // Pro Components
  'liquid-ether',

  // Free Components - Backgrounds
  'flow-threads',

  // Free Components - Buttons
  'pulse-button',
  'shimmer-button',
  'ripple-button',
  'noise-trail',
  'hover-border-trail',
  'stateful-button',

  // Free Components - Cards
  'magnet-card',
  'border-beam',

  // Free Components - Cursor
  'spark-cursor',
] as const;

export type OfficialComponentSlug = typeof OFFICIAL_COMPONENTS[number];

// Check if a component is official (created by OonkooUI Team)
export const isOfficialComponent = (slug: string): boolean => {
  return OFFICIAL_COMPONENTS.includes(slug as OfficialComponentSlug);
};

// =============================================================================
// COMPONENT PATH UTILITIES
// =============================================================================

// Convert slug to PascalCase for component file naming
export const toPascalCase = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

// Generate component path from slug
export const generateComponentPath = (slug: string): string => {
  return `@/components/ui/${toPascalCase(slug)}`;
};

// =============================================================================
// DEFAULT CONTROL CONFIGS BY CATEGORY
// =============================================================================

export const DEFAULT_CONTROLS_BY_CATEGORY: Record<string, ControlDefinition[]> = {
  buttons: [
    { name: 'disabled', type: 'checkbox', label: 'Disabled', defaultValue: false },
  ],
  cards: [
    { name: 'className', type: 'text', label: 'Additional Classes' },
  ],
  background: [
    { name: 'className', type: 'text', label: 'Additional Classes' },
  ],
};

// =============================================================================
// EXAMPLE CONTENT FOR PREVIEWS
// =============================================================================

export const EXAMPLE_CARD_CONTENT = [
  {
    title: 'Premium Design',
    description: 'Beautiful shadows and subtle borders for a refined look',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
  },
  {
    title: 'Minimal Style',
    description: 'Clean, modern aesthetic that fits any project',
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=300&fit=crop',
  },
  {
    title: 'Dark Mode Ready',
    description: 'Seamlessly adapts to your preferred color scheme',
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&h=300&fit=crop',
  },
];

export const EXAMPLE_BUTTON_LABELS = [
  { text: 'Get Started', icon: 'Sparkles' },
  { text: 'Learn More', icon: 'ArrowRight' },
  { text: 'Try it Free', icon: 'Zap' },
];
