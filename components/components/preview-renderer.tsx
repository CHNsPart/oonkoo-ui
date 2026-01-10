"use client";

import dynamic from 'next/dynamic';
import { Loader2, Sparkles, ArrowRight, Zap, MousePointer2, Send, Download, Heart, ShoppingCart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  MinimalCardImage,
  MinimalCardTitle,
  MinimalCardDescription,
} from '@/components/ui/minimal-card';

// =============================================================================
// TYPES - Preview Configuration Schema
// =============================================================================

export type OverlayType = 'heading' | 'subheading' | 'paragraph' | 'badge' | 'button' | 'divider';

export interface OverlayElement {
  type: OverlayType;
  text?: string;
  className?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export interface PreviewConfig {
  containerClass?: string;
  wrapperStyle?: React.CSSProperties;
  layout?: 'full' | 'centered' | 'grid' | 'split';
  overlays?: OverlayElement[];
  overlayPosition?: 'above' | 'below' | 'overlay';
  exampleProps?: Record<string, any>;
  children?: string;
}

interface PreviewRendererProps {
  slug: string;
  category?: string;
  name?: string;
  description?: string;
  tags?: string[];
  previewConfig?: PreviewConfig | null;
  controlValues?: Record<string, any>;
}

// =============================================================================
// LOADING COMPONENT
// =============================================================================

const LoadingSpinner = () => (
  <div className="h-full min-h-[600px] flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// =============================================================================
// DYNAMIC COMPONENT IMPORTS
// =============================================================================

// Pro Components
const LiquidEther = dynamic(
  () => import('@/components/ui/LiquidEther'),
  { ssr: false, loading: LoadingSpinner }
);

// Free Components - Backgrounds
const FlowThreads = dynamic(
  () => import('@/components/ui/flow-threads'),
  { ssr: false, loading: LoadingSpinner }
);

// Free Components - Buttons
const PulseButton = dynamic(
  () => import('@/components/ui/PulseButton').then(mod => ({ default: mod.PulseButton })),
  { ssr: false, loading: LoadingSpinner }
);

const ShimmerButton = dynamic(
  () => import('@/components/ui/shimmer-button').then(mod => ({ default: mod.ShimmerButton })),
  { ssr: false, loading: LoadingSpinner }
);

const RippleButton = dynamic(
  () => import('@/components/ui/ripple-button').then(mod => ({ default: mod.RippleButton })),
  { ssr: false, loading: LoadingSpinner }
);

const NoiseTrail = dynamic(
  () => import('@/components/ui/noise-trail').then(mod => ({ default: mod.NoiseTrail })),
  { ssr: false, loading: LoadingSpinner }
);

const HoverBorderTrail = dynamic(
  () => import('@/components/ui/hover-border-trail').then(mod => ({ default: mod.HoverBorderTrail })),
  { ssr: false, loading: LoadingSpinner }
);

const StatefulButton = dynamic(
  () => import('@/components/ui/stateful-button').then(mod => ({ default: mod.StatefulButton })),
  { ssr: false, loading: LoadingSpinner }
);

// Free Components - Cards
const MagnetCard = dynamic(
  () => import('@/components/ui/MagnetCard').then(mod => ({ default: mod.MagnetCard })),
  { ssr: false, loading: LoadingSpinner }
);

const BorderBeam = dynamic(
  () => import('@/components/ui/border-beam').then(mod => ({ default: mod.BorderBeam })),
  { ssr: false, loading: LoadingSpinner }
);

const MinimalCard = dynamic(
  () => import('@/components/ui/minimal-card').then(mod => ({ default: mod.MinimalCard })),
  { ssr: false, loading: LoadingSpinner }
);

// Free Components - Cursor
const SparkCursor = dynamic(
  () => import('@/components/ui/SparkCursor').then(mod => ({ default: mod.SparkCursor })),
  { ssr: false, loading: LoadingSpinner }
);

// =============================================================================
// COMPONENT REGISTRY
// =============================================================================

interface ComponentEntry {
  component: React.ComponentType<any>;
  type: 'background' | 'button' | 'card' | 'wrapper' | 'cursor';
}

const COMPONENT_MAP: Record<string, ComponentEntry> = {
  // Pro - Background
  'liquid-ether': { component: LiquidEther, type: 'background' },

  // Free - Backgrounds
  'flow-threads': { component: FlowThreads, type: 'background' },

  // Free - Buttons
  'pulse-button': { component: PulseButton, type: 'button' },
  'shimmer-button': { component: ShimmerButton, type: 'button' },
  'ripple-button': { component: RippleButton, type: 'button' },
  'noise-trail': { component: NoiseTrail, type: 'wrapper' },
  'hover-border-trail': { component: HoverBorderTrail, type: 'wrapper' },
  'stateful-button': { component: StatefulButton, type: 'button' },

  // Free - Cards
  'magnet-card': { component: MagnetCard, type: 'wrapper' },
  'border-beam': { component: BorderBeam, type: 'wrapper' },
  'minimal-card': { component: MinimalCard, type: 'card' },

  // Free - Cursor
  'spark-cursor': { component: SparkCursor, type: 'cursor' },
};

function getComponentEntry(slug: string): ComponentEntry | null {
  return COMPONENT_MAP[slug] || null;
}

// =============================================================================
// PER-COMPONENT SHOWCASE RENDERERS
// Each component gets its specific showcase layout that matches /dev page
// =============================================================================

// Border Beam - Shows the beam effect wrapping a demo card
function BorderBeamShowcase({ Component, props }: { Component: React.ComponentType<any>; props: Record<string, any> }) {
  const colors = {
    from: props.colorFrom || "#46CB76",
    to: props.colorTo || "#f2ff40",
  };

  return (
    <div className="h-[600px] w-full relative flex items-center justify-center p-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 rounded-xl">
      <div className="relative w-80 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm p-6 overflow-hidden">
        <Component {...props} />
        <div className="space-y-4">
          <div
            className="h-12 w-12 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
          >
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Border Beam</h3>
            <p className="text-sm text-neutral-400 mt-1">
              A beautiful animated beam that follows the border of your component.
            </p>
          </div>
          <div className="flex gap-2">
            <span
              className="px-2 py-1 text-xs rounded-full border"
              style={{
                backgroundColor: `${colors.from}20`,
                color: colors.from,
                borderColor: `${colors.from}30`
              }}
            >
              Animation
            </span>
            <span
              className="px-2 py-1 text-xs rounded-full border"
              style={{
                backgroundColor: `${colors.to}20`,
                color: colors.to,
                borderColor: `${colors.to}30`
              }}
            >
              Motion
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Magnet Card - Shows 3 card variants with gradients
function MagnetCardShowcase({ Component, props }: { Component: React.ComponentType<any>; props: Record<string, any> }) {
  const cardVariants = [
    { gradient: 'from-violet-500 via-purple-500 to-fuchsia-500', icon: 'sparkle', title: 'Premium Card', subtitle: 'Hover to see the magic' },
    { gradient: 'from-cyan-500 via-blue-500 to-indigo-500', icon: 'wave', title: 'Ocean Vibes', subtitle: 'Smooth like water' },
    { gradient: 'from-orange-500 via-red-500 to-pink-500', icon: 'fire', title: 'Fire Effect', subtitle: 'Feel the heat' },
  ];

  return (
    <div className="h-[600px] w-full flex items-center justify-center gap-8 p-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 rounded-xl">
      {cardVariants.map((variant, index) => (
        <Component key={index} {...props}>
          <div className={`rounded-2xl bg-gradient-to-br ${variant.gradient} overflow-hidden w-64`}>
            <div className="h-40 flex items-center justify-center">
              <span className="text-5xl">
                {variant.icon === 'sparkle' ? '✨' : variant.icon === 'wave' ? '🌊' : '🔥'}
              </span>
            </div>
            <div className="bg-black/20 backdrop-blur-sm p-4 border-t border-white/10">
              <h3 className="text-white font-semibold">{variant.title}</h3>
              <p className="text-white/70 text-sm">{variant.subtitle}</p>
            </div>
          </div>
        </Component>
      ))}
    </div>
  );
}

// Noise Trail - Shows wrapper around buttons
function NoiseTrailShowcase({ Component, props }: { Component: React.ComponentType<any>; props: Record<string, any> }) {
  return (
    <div className="min-h-[600px] w-full relative flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 rounded-xl p-8">
      <div className="flex flex-col items-center gap-6">
        <Component {...props} containerClassName="p-1">
          <button className="flex items-center gap-3 px-6 py-3 bg-[#1F1C1C] rounded-xl text-white font-medium hover:bg-[#2a2626] transition-colors">
            <Sparkles className="h-4 w-4" />
            Get Started
            <ArrowRight className="h-4 w-4" />
          </button>
        </Component>

        <Component {...props} containerClassName="p-1">
          <button className="px-5 py-2.5 bg-[#1F1C1C] rounded-xl text-white text-sm font-medium hover:bg-[#2a2626] transition-colors">
            Build Beautiful UIs
          </button>
        </Component>

        <Component {...props} containerClassName="p-1">
          <div className="px-6 py-4 bg-[#1F1C1C] rounded-xl text-center">
            <p className="text-white font-medium mb-1">Premium Components</p>
            <p className="text-neutral-400 text-xs">oonkoo.com</p>
          </div>
        </Component>
      </div>

      <p className="text-[10px] text-neutral-600 absolute bottom-4">
        @oonkoohq
      </p>
    </div>
  );
}

// Hover Border Trail - Shows wrapper around a button
function HoverBorderTrailShowcase({ Component, props }: { Component: React.ComponentType<any>; props: Record<string, any> }) {
  return (
    <div className="min-h-[600px] w-full flex flex-col items-center justify-center gap-6 p-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 rounded-xl">
      <p className="text-xs text-neutral-500 absolute top-4 left-4">
        Built with OonkoO UI
      </p>

      <Component {...props}>
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Hover Me
        </span>
      </Component>

      <Component {...props}>
        <span className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Interactive Trail
        </span>
      </Component>

      <p className="text-[10px] text-neutral-600 absolute bottom-4">
        @oonkoohq
      </p>
    </div>
  );
}

// Minimal Card - Shows 3 cards in a grid using the proper sub-components
function MinimalCardShowcase({ Component, props }: { Component: React.ComponentType<any>; props: Record<string, any> }) {
  const cards = [
    { title: "Modern Design", description: "How to design with gestures and motion that feel intuitive and natural.", image: "/claude.png" },
    { title: "Clean Interface", description: "Creating minimal yet impactful user experiences with subtle shadows.", image: "/claude.png" },
    { title: "Smooth Shadows", description: "Layered shadow techniques for depth without heaviness.", image: "/claude.png" },
  ];

  return (
    <div className="min-h-[600px] w-full flex items-center justify-center p-8 bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 rounded-xl">
      <div className="w-full max-w-4xl">
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Component key={index} {...props}>
              <MinimalCardImage src={"/free-plan-badge.svg"} alt={card.title} />
              <MinimalCardTitle>{card.title}</MinimalCardTitle>
              <MinimalCardDescription>{card.description}</MinimalCardDescription>
            </Component>
          ))}
        </div>
      </div>
    </div>
  );
}

// Liquid Ether - Full background with WebGL overlay (green theme)
function LiquidEtherShowcase({ Component, props }: { Component: React.ComponentType<any>; props: Record<string, any> }) {
  return (
    <div className="h-[600px] w-full relative">
      <Component {...props} />
      {/* Overlay content matching dev page */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
          WebGL Powered
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
          Liquid Ether
        </h1>
        <p className="text-base md:text-lg text-white/80 text-center max-w-md mt-4 drop-shadow-md">
          A mesmerizing fluid simulation that responds to your every move. Built with Three.js for buttery smooth performance.
        </p>
        <a
          href="#"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors pointer-events-auto mt-6"
          onClick={(e) => e.preventDefault()}
        >
          Get This Component
        </a>
      </div>
    </div>
  );
}

// Flow Threads - Full background with Interactive WebGL overlay (blue theme)
function FlowThreadsShowcase({ Component, props }: { Component: React.ComponentType<any>; props: Record<string, any> }) {
  return (
    <div className="h-[600px] w-full relative bg-black rounded-xl overflow-hidden">
      <Component {...props} />
      {/* Overlay content matching dev page */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4 backdrop-blur-sm">
          Interactive WebGL
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
          Flow Threads
        </h1>
        <p className="text-base md:text-lg text-white/80 text-center max-w-md mt-4 drop-shadow-md px-4">
          Mesmerizing animated threads that dance and flow with your cursor. Powered by OGL for silky smooth WebGL performance.
        </p>
        <a
          href="#"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors pointer-events-auto mt-6 shadow-lg shadow-blue-500/25"
          onClick={(e) => e.preventDefault()}
        >
          Get This Component
        </a>
      </div>
    </div>
  );
}

// Stateful Button - Shows 4 specific button variants with icons
function StatefulButtonShowcase({ Component, props }: { Component: React.ComponentType<any>; props: Record<string, any> }) {
  const simulateAction = () => new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <div className="min-h-[600px] w-full relative flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 rounded-xl p-8">
      {/* Click hint */}
      <p className="text-xs text-neutral-500 absolute top-4 left-4">
        Click to see the magic
      </p>

      {/* Main showcase - 4 button variants */}
      <div className="flex flex-col items-center gap-5">
        <Component onClick={simulateAction} {...props}>
          <Send className="h-4 w-4" />
          Submit Form
        </Component>

        <Component onClick={simulateAction} {...props}>
          <Download className="h-4 w-4" />
          Download
        </Component>

        <Component
          onClick={simulateAction}
          className="bg-rose-500 hover:ring-rose-500"
          {...props}
        >
          <Heart className="h-4 w-4" />
          Like
        </Component>

        <Component onClick={simulateAction} {...props}>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Component>
      </div>

      {/* Subtle branding */}
      <p className="text-[10px] text-neutral-600 absolute bottom-4">
        Built by OonkoO
      </p>
    </div>
  );
}

// Ripple Button - Shows 3 color variants
function RippleButtonShowcase({ Component, props }: { Component: React.ComponentType<any>; props: Record<string, any> }) {
  return (
    <div className="h-[600px] w-full relative flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 rounded-xl p-8 overflow-hidden">
      {/* Subtle hint */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 text-neutral-500">
        <MousePointer2 className="h-3 w-3" />
        <span className="text-[10px]">Click to see the ripple</span>
      </div>

      {/* Main showcase - 3 variants */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Component {...props}>
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Click Me
          </span>
        </Component>

        <Component {...props} rippleColor="#4ADE80">
          <span className="flex items-center gap-2">
            Try OonkoO
            <ExternalLink className="h-4 w-4" />
          </span>
        </Component>

        <Component
          {...props}
          rippleColor="#ffffff"
          className="bg-[#3CB270] border-[#3CB270] text-white"
        >
          Primary Action
        </Component>
      </div>
    </div>
  );
}

// Button showcase - Shows button variants
function ButtonShowcase({ Component, name, props }: { Component: React.ComponentType<any>; name: string; props: Record<string, any> }) {
  const icons = [Sparkles, ArrowRight, Zap];
  const labels = ['Get Started', 'Learn More', 'Try it Free'];

  return (
    <div className="min-h-[600px] w-full flex flex-col items-center justify-center gap-5 p-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 rounded-xl">
      <p className="text-xs text-neutral-500 absolute top-4 left-4">
        Built with OonkoO UI
      </p>

      {[0, 1, 2].map((index) => {
        const Icon = icons[index];
        return (
          <Component key={index} {...props}>
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {labels[index]}
            </span>
          </Component>
        );
      })}

      <p className="text-[10px] text-neutral-600 absolute bottom-4 left-1/2 -translate-x-1/2">
        @oonkoohq
      </p>
    </div>
  );
}

// Background showcase - Full container
function BackgroundShowcase({
  Component,
  name,
  description,
  props
}: {
  Component: React.ComponentType<any>;
  name: string;
  description: string;
  props: Record<string, any>;
}) {
  return (
    <div className="h-[600px] w-full relative">
      <Component {...props} />

      {/* Overlay content */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
        <span className="inline-flex items-center px-3 py-1 rounded-b-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
          Interactive
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
          {name}
        </h1>
        <p className="text-white/80 text-center max-w-md mt-4 drop-shadow-md">
          {description}
        </p>
      </div>
    </div>
  );
}

// Cursor showcase - Full container with interaction hint
function CursorShowcase({ Component, props }: { Component: React.ComponentType<any>; props: Record<string, any> }) {
  return (
    <div className="h-[600px] w-full relative border border-border/50 rounded-lg overflow-hidden bg-background">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-muted-foreground pointer-events-none">
        <MousePointer2 className="h-4 w-4" />
        <span className="text-xs">Move your cursor or click to interact</span>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
        <p className="text-muted-foreground text-lg">Click anywhere to interact</p>
      </div>

      <Component {...props} />
    </div>
  );
}

// =============================================================================
// MAIN PREVIEW RENDERER
// =============================================================================

export function PreviewRenderer({
  slug,
  name = '',
  description = '',
  previewConfig,
  controlValues = {},
}: PreviewRendererProps) {
  const entry = getComponentEntry(slug);

  if (!entry) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">Component preview not available</p>
          <p className="text-sm text-muted-foreground/70">
            Component &quot;{slug}&quot; is not registered in the preview system
          </p>
        </div>
      </div>
    );
  }

  const { component: Component, type } = entry;

  // Merge database config with control values
  const componentProps = {
    ...previewConfig?.exampleProps,
    ...controlValues,
  };

  // Use component-specific showcase based on slug
  switch (slug) {
    case 'border-beam':
      return <BorderBeamShowcase Component={Component} props={componentProps} />;
    case 'magnet-card':
      return <MagnetCardShowcase Component={Component} props={componentProps} />;
    case 'noise-trail':
      return <NoiseTrailShowcase Component={Component} props={componentProps} />;
    case 'hover-border-trail':
      return <HoverBorderTrailShowcase Component={Component} props={componentProps} />;
    case 'minimal-card':
      return <MinimalCardShowcase Component={Component} props={componentProps} />;
    case 'liquid-ether':
      return <LiquidEtherShowcase Component={Component} props={componentProps} />;
    case 'flow-threads':
      return <FlowThreadsShowcase Component={Component} props={componentProps} />;
    case 'stateful-button':
      return <StatefulButtonShowcase Component={Component} props={componentProps} />;
    case 'ripple-button':
      return <RippleButtonShowcase Component={Component} props={componentProps} />;
    default:
      // Fallback to type-based showcase
      switch (type) {
        case 'background':
          return (
            <BackgroundShowcase
              Component={Component}
              name={name || slug}
              description={description}
              props={componentProps}
            />
          );
        case 'button':
          return (
            <ButtonShowcase
              Component={Component}
              name={name || slug}
              props={componentProps}
            />
          );
        case 'cursor':
          return <CursorShowcase Component={Component} props={componentProps} />;
        default:
          return (
            <ButtonShowcase
              Component={Component}
              name={name || slug}
              props={componentProps}
            />
          );
      }
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export { COMPONENT_MAP, getComponentEntry };
