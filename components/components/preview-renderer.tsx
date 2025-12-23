"use client";

import dynamic from 'next/dynamic';
import { Loader2, Sparkles, ArrowRight, Zap, ExternalLink, Send, Download, Heart, ShoppingCart, MousePointer2 } from 'lucide-react';
import { COMPONENT_REGISTRY } from '@/lib/component-registry';

// =============================================================================
// TYPES - Preview Configuration Schema
// =============================================================================

/** Overlay element types for preview customization */
export type OverlayType = 'heading' | 'subheading' | 'paragraph' | 'badge' | 'button' | 'divider';

/** Individual overlay element configuration */
export interface OverlayElement {
  type: OverlayType;
  text?: string;
  className?: string;
  href?: string; // For button links
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

/** Component instance configuration for multi-instance previews */
export interface ComponentInstance {
  props?: Record<string, any>;
  className?: string;
  children?: string;
}

/** Main preview configuration stored in database */
export interface PreviewConfig {
  // Container styling
  containerClass?: string;
  wrapperStyle?: React.CSSProperties;

  // Layout options
  layout?: 'full' | 'centered' | 'grid' | 'split';

  // Overlay elements (titles, descriptions, CTAs)
  overlays?: OverlayElement[];
  overlayPosition?: 'above' | 'below' | 'overlay'; // Position relative to component

  // Component instances (for multi-instance previews)
  instances?: ComponentInstance[];

  // Single instance (backward compatible)
  exampleProps?: Record<string, any>;
  children?: string;
}

interface PreviewRendererProps {
  slug: string;
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

// Pro Component
const LiquidEther = dynamic(
  () => import('@/components/ui/LiquidEther'),
  { ssr: false, loading: LoadingSpinner }
);

// Free Components
const PulseButton = dynamic(
  () => import('@/components/ui/PulseButton').then(mod => ({ default: mod.PulseButton })),
  { ssr: false, loading: LoadingSpinner }
);

const MagnetCard = dynamic(
  () => import('@/components/ui/MagnetCard').then(mod => ({ default: mod.MagnetCard })),
  { ssr: false, loading: LoadingSpinner }
);

const SparkCursor = dynamic(
  () => import('@/components/ui/SparkCursor').then(mod => ({ default: mod.SparkCursor })),
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

const FlowThreads = dynamic(
  () => import('@/components/ui/flow-threads'),
  { ssr: false, loading: LoadingSpinner }
);

const BorderBeam = dynamic(
  () => import('@/components/ui/border-beam').then(mod => ({ default: mod.BorderBeam })),
  { ssr: false, loading: LoadingSpinner }
);

// Component map - must match registry entries
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  // Pro
  'liquid-ether': LiquidEther,
  // Free
  'pulse-button': PulseButton,
  'magnet-card': MagnetCard,
  'spark-cursor': SparkCursor,
  'shimmer-button': ShimmerButton,
  'ripple-button': RippleButton,
  'noise-trail': NoiseTrail,
  'hover-border-trail': HoverBorderTrail,
  'stateful-button': StatefulButton,
  'flow-threads': FlowThreads,
  'border-beam': BorderBeam,
};

// =============================================================================
// DEFAULT CONFIGURATIONS
// =============================================================================

const DEFAULT_CONFIGS: Record<string, PreviewConfig> = {
  // Pro Component
  'liquid-ether': {
    containerClass: 'h-[600px] w-full relative',
    layout: 'full',
  },
  // Free Components
  'pulse-button': {
    containerClass: 'flex flex-col md:flex-row h-[600px] w-full items-center justify-center gap-6 p-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 rounded-xl',
    layout: 'centered',
  },
  'magnet-card': {
    containerClass: 'flex h-[600px] w-full items-center justify-center gap-8 p-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 rounded-xl',
    layout: 'centered',
  },
  'spark-cursor': {
    containerClass: 'h-[600px] w-full border border-border/50 rounded-lg overflow-hidden',
    layout: 'full',
  },
  'shimmer-button': {
    containerClass: 'flex h-[600px] w-full items-center justify-center gap-4 p-8',
    layout: 'centered',
  },
  'ripple-button': {
    containerClass: 'flex h-[600px] w-full items-center justify-center gap-4 p-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950',
    layout: 'centered',
  },
  'noise-trail': {
    containerClass: 'flex h-[600px] w-full items-center justify-center gap-4 p-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950',
    layout: 'centered',
  },
  'hover-border-trail': {
    containerClass: 'flex h-[600px] w-full items-center justify-center gap-4 p-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950',
    layout: 'centered',
  },
  'stateful-button': {
    containerClass: 'flex h-[600px] w-full items-center justify-center gap-4 p-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950',
    layout: 'centered',
  },
  'flow-threads': {
    containerClass: 'h-[600px] w-full relative rounded-xl overflow-hidden',
    layout: 'full',
  },
  'border-beam': {
    containerClass: 'flex h-[600px] w-full items-center justify-center p-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 rounded-xl',
    layout: 'centered',
  },
};

// =============================================================================
// COMPONENT CHILDREN TEMPLATES
// =============================================================================

/** Pre-built children for components that need rich JSX content */
function getComponentChildren(slug: string, instanceIndex: number, childTemplate?: string): React.ReactNode {
  // MagnetCard example children
  if (slug === 'magnet-card') {
    const variants = [
      {
        gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
        icon: '✨',
        title: 'Premium Card',
        subtitle: 'Hover to see the magic',
      },
      {
        gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
        icon: '🌊',
        title: 'Ocean Vibes',
        subtitle: 'Smooth like water',
      },
      {
        gradient: 'from-orange-500 via-red-500 to-pink-500',
        icon: '🔥',
        title: 'Fire Effect',
        subtitle: 'Feel the heat',
      },
    ];
    const variant = variants[instanceIndex % variants.length];

    return (
      <div className={`rounded-2xl bg-gradient-to-br ${variant.gradient} overflow-hidden w-64`}>
        <div className="h-40 flex items-center justify-center">
          <span className="text-5xl">{variant.icon}</span>
        </div>
        <div className="bg-black/20 backdrop-blur-sm p-4 border-t border-white/10">
          <h3 className="text-white font-semibold">{variant.title}</h3>
          <p className="text-white/70 text-sm">{variant.subtitle}</p>
        </div>
      </div>
    );
  }

  // PulseButton example children
  if (slug === 'pulse-button') {
    const labels = ['Get Started', 'Learn More', 'Subscribe'];
    return labels[instanceIndex % labels.length];
  }

  // SparkCursor children - instructional overlay
  if (slug === 'spark-cursor') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Click anywhere to create sparks</p>
          <p className="text-muted-foreground/60 text-sm mt-2">Try clicking multiple times!</p>
        </div>
      </div>
    );
  }

  // ShimmerButton children - sparkles icon with text
  if (slug === 'shimmer-button') {
    const variants = [
      {
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        ),
        text: 'Get Started',
      },
      {
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        ),
        text: 'Try OonkoO',
      },
    ];
    const variant = variants[instanceIndex % variants.length];
    return (
      <span className="flex items-center gap-2">
        {variant.icon}
        {variant.text}
      </span>
    );
  }

  // RippleButton children - icon with text
  if (slug === 'ripple-button') {
    const variants = [
      {
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        text: 'Click Me',
      },
      {
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        ),
        text: 'Try OonkoO',
      },
      {
        icon: null,
        text: 'Primary Action',
      },
    ];
    const variant = variants[instanceIndex % variants.length];
    return (
      <span className="flex items-center gap-2">
        {variant.icon}
        {variant.text}
      </span>
    );
  }

  // NoiseTrail children - button content
  if (slug === 'noise-trail') {
    const variants = [
      {
        content: (
          <button className="flex items-center gap-3 px-6 py-3 bg-[#1F1C1C] rounded-xl text-white font-medium hover:bg-[#2a2626] transition-colors">
            <span>Explore OonkoO</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        ),
      },
      {
        content: (
          <button className="px-5 py-2.5 bg-[#1F1C1C] rounded-xl text-white text-sm font-medium hover:bg-[#2a2626] transition-colors">
            Build Beautiful UIs
          </button>
        ),
      },
      {
        content: (
          <div className="px-6 py-4 bg-[#1F1C1C] rounded-xl text-center">
            <p className="text-white font-medium mb-1">Premium Components</p>
            <p className="text-neutral-400 text-xs">oonkoo.com</p>
          </div>
        ),
      },
    ];
    return variants[instanceIndex % variants.length].content;
  }

  // HoverBorderTrail children - icon with text
  if (slug === 'hover-border-trail') {
    const variants = [
      {
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        ),
        text: 'Get Started',
      },
      {
        icon: (
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        ),
        text: 'Visit oonkoo.com',
      },
      {
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        ),
        text: 'Explore Components',
      },
    ];
    const variant = variants[instanceIndex % variants.length];
    return (
      <span className="flex items-center gap-2 text-sm">
        {instanceIndex === 2 ? variant.text : null}
        {instanceIndex === 2 ? variant.icon : null}
        {instanceIndex !== 2 ? variant.icon : null}
        {instanceIndex !== 2 ? variant.text : null}
      </span>
    );
  }

  // Default: return string children or null
  return childTemplate || null;
}

// =============================================================================
// COMPONENT SHOWCASES - Full preview layouts matching dev pages
// =============================================================================

interface ShowcaseProps {
  Component: React.ComponentType<any>;
  componentProps: Record<string, any>;
}

/** Renders full showcase layout for shimmer-button matching dev page */
function ShimmerButtonShowcase({ Component, componentProps }: ShowcaseProps) {
  return (
    <div className="min-h-[600px] w-full relative flex flex-col items-center justify-center gap-8 rounded-xl p-8">
      <p className="text-xs text-neutral-500 absolute top-4 left-4">
        Built with OonkoO UI
      </p>
      <div className="flex flex-col items-center gap-6">
        <Component {...componentProps}>
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Get Started
          </span>
        </Component>
        <Component {...componentProps} shimmerColor="#ffffff" className="text-sm">
          <span className="flex items-center gap-2">
            Visit oonkoo.com
            <ArrowRight className="h-4 w-4" />
          </span>
        </Component>
      </div>
      <p className="text-[10px] text-neutral-600 absolute bottom-4">
        @oonkoohq
      </p>
    </div>
  );
}

/** Renders full showcase layout for ripple-button matching dev page */
function RippleButtonShowcase({ Component, componentProps }: ShowcaseProps) {
  return (
    <div className="h-[600px] w-full relative flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-8 overflow-hidden">
      <div className="absolute top-4 left-4 flex items-center gap-1.5 text-neutral-500">
        <MousePointer2 className="h-3 w-3" />
        <span className="text-[10px]">Click to see the ripple</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Component {...componentProps}>
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Click Me
          </span>
        </Component>
        <Component {...componentProps} rippleColor="#4ADE80">
          <span className="flex items-center gap-2">
            Try OonkoO
            <ExternalLink className="h-4 w-4" />
          </span>
        </Component>
        <Component
          {...componentProps}
          rippleColor="#ffffff"
          className="bg-[#3CB270] border-[#3CB270] text-white"
        >
          Primary Action
        </Component>
      </div>
      <p className="text-[10px] text-neutral-600 absolute bottom-4">
        oonkoo.com • 2025
      </p>
    </div>
  );
}

/** Renders full showcase layout for noise-trail matching dev page */
function NoiseTrailShowcase({ Component, componentProps }: ShowcaseProps) {
  return (
    <div className="h-[600px] w-full relative flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 rounded-xl p-8">
      <div className="flex flex-col items-center gap-6">
        <Component {...componentProps} containerClassName="p-1">
          <button className="flex items-center gap-3 px-6 py-3 bg-[#1F1C1C] rounded-xl text-white font-medium hover:bg-[#2a2626] transition-colors">
            <span>Explore OonkoO</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </Component>
        <Component {...componentProps} containerClassName="p-1">
          <button className="px-5 py-2.5 bg-[#1F1C1C] rounded-xl text-white text-sm font-medium hover:bg-[#2a2626] transition-colors">
            Build Beautiful UIs
          </button>
        </Component>
      </div>
      <p className="text-[10px] text-neutral-600 absolute bottom-4">
        oonkoo.com
      </p>
    </div>
  );
}

/** Renders full showcase layout for hover-border-trail matching dev page */
function HoverBorderTrailShowcase({ Component, componentProps }: ShowcaseProps) {
  return (
    <div className="h-[600px] w-full relative flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 rounded-xl p-8">
      <p className="text-xs text-neutral-500 absolute top-4 left-4">
        Hover over the buttons
      </p>
      <div className="flex flex-col items-center gap-5">
        <Component {...componentProps}>
          <span className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4" />
            Get Started
          </span>
        </Component>
        <Component {...componentProps} as="a">
          <span className="flex items-center gap-2 text-sm">
            Visit oonkoo.com
            <ExternalLink className="h-3.5 w-3.5" />
          </span>
        </Component>
      </div>
      <p className="text-[10px] text-neutral-600 absolute bottom-4">
        oonkoo.com
      </p>
    </div>
  );
}

/** Renders full showcase layout for stateful-button matching dev page */
function StatefulButtonShowcase({ Component, componentProps }: ShowcaseProps) {
  // Simulate async action for onClick
  const simulateAction = () => new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <div className="h-[600px] w-full relative flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-8">
      <p className="text-xs text-neutral-500 absolute top-4 left-4">
        Click to see the magic ✨
      </p>
      <div className="flex flex-col items-center gap-5">
        <Component {...componentProps} onClick={simulateAction}>
          <Send className="h-4 w-4" />
          Submit Form
        </Component>
        <Component className={"bg-blue-500"} {...componentProps} onClick={simulateAction}>
          Add to Cart
          <ShoppingCart className="h-4 w-4" />
        </Component>
      </div>
    </div>
  );
}

/** Renders full showcase layout for flow-threads with modern CTA overlay */
function FlowThreadsShowcase({ Component, componentProps }: ShowcaseProps) {
  return (
    <div className="h-[600px] w-full relative bg-black overflow-hidden">
      {/* CTA Overlay */}
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
          href="/components/flow-threads"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors pointer-events-auto mt-6 shadow-lg shadow-blue-500/25"
        >
          Get This Component
        </a>
      </div>
      {/* Background component */}
      <Component {...componentProps} />
    </div>
  );
}

/** Renders full showcase layout for liquid-ether with modern CTA overlay */
function LiquidEtherShowcase({ Component, componentProps }: ShowcaseProps) {
  return (
    <div className="h-[600px] w-full relative">
      {/* CTA Overlay */}
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
          href="/components/liquid-ether"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors pointer-events-auto mt-6"
        >
          Get This Component
        </a>
      </div>
      {/* Background component */}
      <Component {...componentProps} />
    </div>
  );
}

/** Renders full showcase layout for border-beam with a single card */
function BorderBeamShowcase({ Component, componentProps }: ShowcaseProps) {
  return (
    <div className="h-[600px] w-full relative flex items-center justify-center p-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Demo Card with Border Beam */}
      <div className="relative w-80 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm p-6 overflow-hidden">
        <Component {...componentProps} />
        <div className="space-y-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#46CB76] to-[#f2ff40] flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Border Beam</h3>
            <p className="text-sm text-neutral-400 mt-1">
              A beautiful animated beam that follows the border of your component.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 text-xs rounded-full bg-[#46CB76]/20 text-[#46CB76] border border-[#46CB76]/30">
              Animation
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-[#f2ff40]/20 text-[#f2ff40] border border-[#f2ff40]/30">
              Motion
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Map of component slugs to their showcase components */
const COMPONENT_SHOWCASES: Record<string, React.ComponentType<ShowcaseProps>> = {
  'shimmer-button': ShimmerButtonShowcase,
  'ripple-button': RippleButtonShowcase,
  'noise-trail': NoiseTrailShowcase,
  'hover-border-trail': HoverBorderTrailShowcase,
  'stateful-button': StatefulButtonShowcase,
  'flow-threads': FlowThreadsShowcase,
  'liquid-ether': LiquidEtherShowcase,
  'border-beam': BorderBeamShowcase,
};

// =============================================================================
// OVERLAY RENDERER
// =============================================================================

interface OverlayRendererProps {
  overlays: OverlayElement[];
  position: 'above' | 'below' | 'overlay';
}

function OverlayRenderer({ overlays, position }: OverlayRendererProps) {
  if (!overlays || overlays.length === 0) return null;

  const positionClasses = {
    above: 'relative z-10 mb-4',
    below: 'relative z-10 mt-4',
    overlay: 'absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center',
  };

  return (
    <div className={positionClasses[position]}>
      {overlays.map((overlay, index) => (
        <OverlayElement key={index} {...overlay} isOverlay={position === 'overlay'} />
      ))}
    </div>
  );
}

interface OverlayElementProps extends OverlayElement {
  isOverlay?: boolean;
}

function OverlayElement({ type, text, className, href, variant = 'primary', isOverlay }: OverlayElementProps) {
  // Default styles for each overlay type
  const defaultStyles: Record<OverlayType, string> = {
    heading: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground',
    subheading: 'text-xl md:text-2xl font-medium text-foreground/80',
    paragraph: 'text-base md:text-lg text-muted-foreground max-w-2xl',
    badge: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20',
    button: '',
    divider: 'w-16 h-1 bg-primary/50 rounded-full',
  };

  // Button variants
  const buttonVariants: Record<string, string> = {
    primary: 'inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors pointer-events-auto',
    secondary: 'inline-flex items-center justify-center px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors pointer-events-auto',
    outline: 'inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-transparent text-foreground font-medium hover:bg-muted transition-colors pointer-events-auto',
    ghost: 'inline-flex items-center justify-center px-6 py-3 rounded-lg text-foreground font-medium hover:bg-muted transition-colors pointer-events-auto',
  };

  const baseClass = type === 'button' ? buttonVariants[variant] : defaultStyles[type];
  const finalClass = className ? `${baseClass} ${className}` : baseClass;

  switch (type) {
    case 'heading':
      return <h1 className={finalClass}>{text}</h1>;
    case 'subheading':
      return <h2 className={finalClass}>{text}</h2>;
    case 'paragraph':
      return <p className={finalClass}>{text}</p>;
    case 'badge':
      return <span className={finalClass}>{text}</span>;
    case 'button':
      if (href) {
        return (
          <a href={href} className={finalClass} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        );
      }
      return <button className={finalClass}>{text}</button>;
    case 'divider':
      return <div className={finalClass} />;
    default:
      return null;
  }
}

// =============================================================================
// MAIN PREVIEW RENDERER
// =============================================================================

export function PreviewRenderer({ slug, previewConfig, controlValues = {} }: PreviewRendererProps) {
  const Component = COMPONENT_MAP[slug];
  const Showcase = COMPONENT_SHOWCASES[slug];

  if (!Component) {
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

  // Merge database config with defaults
  // DEFAULT_CONFIGS.containerClass takes precedence (maintained in code)
  // Database previewConfig can override other properties like exampleProps
  const defaultConfig = DEFAULT_CONFIGS[slug] || {};
  const config = {
    ...defaultConfig,
    ...previewConfig,
    // Always use containerClass from defaults (code-maintained)
    containerClass: defaultConfig.containerClass || previewConfig?.containerClass,
  };

  // Merge example props with control values (control values take precedence)
  const componentProps = { ...config.exampleProps, ...controlValues };

  // If a showcase exists for this component, use it for a matching dev page layout
  if (Showcase) {
    return (
      <div className="min-h-[600px] bg-background">
        <Showcase Component={Component} componentProps={componentProps} />
      </div>
    );
  }

  // Fallback to generic rendering for components without showcases
  const containerClass = config.containerClass || 'min-h-[600px] w-full relative';
  const wrapperStyle = config.wrapperStyle || {};
  const overlays = config.overlays || [];
  const overlayPosition = config.overlayPosition || 'overlay';
  const instances = config.instances || [{ props: componentProps, children: config.children }];

  return (
    <div className="min-h-[600px] bg-background">
      {overlayPosition === 'above' && (
        <OverlayRenderer overlays={overlays} position="above" />
      )}

      <div className={`${containerClass} relative`} style={wrapperStyle}>
        {overlayPosition === 'overlay' && overlays.length > 0 && (
          <OverlayRenderer overlays={overlays} position="overlay" />
        )}

        {config.layout === 'grid' ? (
          <div className="grid grid-cols-2 gap-4 h-full">
            {instances.map((instance, index) => (
              <Component
                key={index}
                {...componentProps}
                {...instance.props}
                className={instance.className}
              >
                {getComponentChildren(slug, index, instance.children)}
              </Component>
            ))}
          </div>
        ) : instances.length > 1 ? (
          <>
            {instances.map((instance, index) => (
              <Component
                key={index}
                {...componentProps}
                {...instance.props}
                className={instance.className}
              >
                {getComponentChildren(slug, index, instance.children)}
              </Component>
            ))}
          </>
        ) : (
          <Component {...componentProps} className={instances[0]?.className}>
            {getComponentChildren(slug, 0, instances[0]?.children)}
          </Component>
        )}
      </div>

      {overlayPosition === 'below' && (
        <OverlayRenderer overlays={overlays} position="below" />
      )}
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export { COMPONENT_MAP, DEFAULT_CONFIGS };
