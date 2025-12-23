"use client";

import { useState, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  Upload,
  Check,
  Loader2,
  AlertCircle,
  Tag,
  Package,
  Layers,
  FolderOpen,
  Settings2,
  FileText,
  ChevronDown,
  MousePointer2,
  Palette,
  RectangleHorizontal,
  Component,
  Crown,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Category icons
const categoryIcons = {
  background: Palette,
  cards: Layers,
  cursor: MousePointer2,
  buttons: RectangleHorizontal,
};

// Dev components list for navigation - grouped by tier and category
const devComponents = [
  // Pro Component
  { slug: "liquid-ether", name: "Liquid Ether", tier: "pro", category: "background" },
  // Free Components
  { slug: "flow-threads", name: "Flow Threads", tier: "free", category: "background" },
  { slug: "magnet-card", name: "Magnet Card", tier: "free", category: "cards" },
  { slug: "border-beam", name: "Border Beam", tier: "free", category: "cards" },
  { slug: "spark-cursor", name: "Spark Cursor", tier: "free", category: "cursor" },
  { slug: "pulse-button", name: "Pulse Button", tier: "free", category: "buttons" },
  { slug: "shimmer-button", name: "Shimmer Button", tier: "free", category: "buttons" },
  { slug: "ripple-button", name: "Ripple Button", tier: "free", category: "buttons" },
  { slug: "noise-trail", name: "Noise Trail", tier: "free", category: "buttons" },
  { slug: "hover-border-trail", name: "Hover Border Trail", tier: "free", category: "buttons" },
  { slug: "stateful-button", name: "Stateful Button", tier: "free", category: "buttons" },
];

// Group components by tier
const proComponents = devComponents.filter(c => c.tier === "pro");
const freeComponents = devComponents.filter(c => c.tier === "free");

type ViewportSize = "desktop" | "tablet" | "mobile";

const viewportSizes: Record<ViewportSize, { width: string; label: string }> = {
  desktop: { width: "100%", label: "Desktop" },
  tablet: { width: "768px", label: "Tablet" },
  mobile: { width: "375px", label: "Mobile" },
};

export interface ComponentMetadata {
  name: string;
  slug: string;
  description: string;
  type: "block" | "element" | "template" | "animation";
  tier: "free" | "pro";
  category: string;
  tags: string[];
  dependencies: string[];
  registryDependencies: string[];
  badge?: "default" | "new" | "updated";
}

interface DevLayoutProps {
  metadata: ComponentMetadata;
  onMetadataChange: (metadata: ComponentMetadata) => void;
  onPublish: (metadata: ComponentMetadata) => Promise<void>;
  controls: ReactNode;
  children: ReactNode;
}

export function DevLayout({
  metadata,
  onMetadataChange,
  onPublish,
  controls,
  children,
}: DevLayoutProps) {
  const pathname = usePathname();
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Get current component from pathname
  const currentSlug = pathname?.split('/').pop() || '';
  const currentComponent = devComponents.find(c => c.slug === currentSlug);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handlePublish = async () => {
    setPublishing(true);
    setPublishResult(null);

    try {
      await onPublish(metadata);
      setPublishResult({
        success: true,
        message: `Published "${metadata.name}" successfully!`,
      });
      setTimeout(() => setPublishResult(null), 3000);
    } catch (error: any) {
      setPublishResult({
        success: false,
        message: error.message || "Failed to publish",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(t => t.trim()).filter(Boolean);
    onMetadataChange({ ...metadata, tags });
  };

  const handleDependenciesChange = (value: string) => {
    const dependencies = value.split(',').map(d => d.trim()).filter(Boolean);
    onMetadataChange({ ...metadata, dependencies });
  };

  const handleRegistryDependenciesChange = (value: string) => {
    const registryDependencies = value.split(',').map(d => d.trim()).filter(Boolean);
    onMetadataChange({ ...metadata, registryDependencies });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background px-4 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          {/* Logo + Dev Badge */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/oonkoo-ui-icon-darkmode.svg"
              alt="OonkooUI"
              width={28}
              height={28}
              className="size-7 hidden dark:block"
            />
            <Image
              src="/oonkoo-ui-icon.svg"
              alt="OonkooUI"
              width={28}
              height={28}
              className="size-7 block dark:hidden"
            />
            <Badge variant="secondary" className="font-medium">
              Dev
            </Badge>
          </Link>

          {/* Divider */}
          <div className="h-6 w-px bg-border" />

          {/* Component Dropdown Navigation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 gap-2 px-3">
                <Component className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-sm">{metadata.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {/* Pro Components */}
              <DropdownMenuLabel className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                <Crown className="h-3.5 w-3.5" />
                Pro Components
              </DropdownMenuLabel>
              {proComponents.map((component) => {
                const CategoryIcon = categoryIcons[component.category as keyof typeof categoryIcons] || Component;
                const isActive = component.slug === currentSlug;
                return (
                  <DropdownMenuItem key={component.slug} asChild>
                    <Link
                      href={`/dev/${component.slug}`}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isActive && "bg-accent"
                      )}
                    >
                      <Component className={cn(
                        "h-3.5 w-3.5",
                        isActive ? "text-purple-500" : "text-muted-foreground"
                      )} />
                      <span className={cn("flex-1", isActive && "font-medium")}>
                        {component.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <CategoryIcon className="h-3 w-3 text-muted-foreground/60" />
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {component.category}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}

              <DropdownMenuSeparator />

              {/* Free Components */}
              <DropdownMenuLabel className="flex items-center gap-2 text-xs text-primary">
                <Gift className="h-3.5 w-3.5" />
                Free Components
              </DropdownMenuLabel>
              {freeComponents.map((component) => {
                const CategoryIcon = categoryIcons[component.category as keyof typeof categoryIcons] || Component;
                const isActive = component.slug === currentSlug;
                return (
                  <DropdownMenuItem key={component.slug} asChild>
                    <Link
                      href={`/dev/${component.slug}`}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isActive && "bg-accent"
                      )}
                    >
                      <Component className={cn(
                        "h-3.5 w-3.5",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className={cn("flex-1", isActive && "font-medium")}>
                        {component.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <CategoryIcon className="h-3 w-3 text-muted-foreground/60" />
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {component.category}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport Switcher */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewport === "desktop" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewport("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={viewport === "tablet" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewport("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={viewport === "mobile" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewport("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          {/* Refresh Button */}
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Publish Button */}
          <Button onClick={handlePublish} disabled={publishing} className="h-9 gap-2">
            {publishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Publish
          </Button>
        </div>
      </header>

      {/* Toast */}
      {publishResult && (
        <div
          className={cn(
            "fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm",
            publishResult.success ? "bg-green-500 text-white" : "bg-red-500 text-white"
          )}
        >
          {publishResult.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {publishResult.message}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex">
        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-zinc-950 p-4">
          <div className="h-full flex justify-center">
            <div
              key={refreshKey}
              className="h-full w-full transition-all duration-300 bg-background rounded-lg border overflow-hidden"
              style={{ maxWidth: viewportSizes[viewport].width }}
            >
              {children}
            </div>
          </div>
        </div>

        {/* Metadata Sidebar */}
        <div className="w-80 border-l bg-background overflow-auto shrink-0">
          <div className="p-4 space-y-6">
            {/* Component Info */}
            <div>
              <h3 className="font-semibold text-lg mb-3">{metadata.name}</h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant={metadata.tier === "pro" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {metadata.tier}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {metadata.category}
                </Badge>
                {metadata.badge && metadata.badge !== "default" && (
                  <Badge variant="outline" className="capitalize">
                    {metadata.badge}
                  </Badge>
                )}
              </div>
            </div>

            {/* Controls Section */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-4">
                <Settings2 className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">Controls</h4>
              </div>
              {controls}
            </div>

            {/* Editable Metadata */}
            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">Metadata</h4>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs">
                  Name
                </Label>
                <Input
                  id="name"
                  value={metadata.name}
                  onChange={(e) => onMetadataChange({ ...metadata, name: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-xs">
                  Slug
                </Label>
                <Input
                  id="slug"
                  value={metadata.slug}
                  onChange={(e) => onMetadataChange({ ...metadata, slug: e.target.value })}
                  className="h-8 text-xs font-mono"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={metadata.description}
                  onChange={(e) => onMetadataChange({ ...metadata, description: e.target.value })}
                  className="text-xs min-h-[60px]"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-xs">
                  Type
                </Label>
                <select
                  id="type"
                  value={metadata.type}
                  onChange={(e) => onMetadataChange({ ...metadata, type: e.target.value as any })}
                  className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs"
                >
                  <option value="element">Element</option>
                  <option value="block">Block</option>
                  <option value="template">Template</option>
                  <option value="animation">Animation</option>
                </select>
              </div>

              {/* Tier */}
              <div className="space-y-2">
                <Label htmlFor="tier" className="text-xs">
                  Tier
                </Label>
                <select
                  id="tier"
                  value={metadata.tier}
                  onChange={(e) => onMetadataChange({ ...metadata, tier: e.target.value as any })}
                  className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                </select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs">
                  Category
                </Label>
                <Input
                  id="category"
                  value={metadata.category}
                  onChange={(e) => onMetadataChange({ ...metadata, category: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>

              {/* Badge Status */}
              <div className="space-y-2">
                <Label htmlFor="badge" className="text-xs">
                  Badge Status
                </Label>
                <select
                  id="badge"
                  value={metadata.badge || "default"}
                  onChange={(e) => onMetadataChange({ ...metadata, badge: e.target.value as any })}
                  className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs capitalize"
                >
                  <option value="default">Default (No Badge)</option>
                  <option value="new">New</option>
                  <option value="updated">Updated</option>
                </select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-xs">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="tags"
                  value={metadata.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="animation, interactive, 3d"
                  className="h-8 text-xs"
                />
                {metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {metadata.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Dependencies */}
              <div className="space-y-2">
                <Label htmlFor="dependencies" className="text-xs">
                  Dependencies (comma-separated)
                </Label>
                <Input
                  id="dependencies"
                  value={metadata.dependencies.join(', ')}
                  onChange={(e) => handleDependenciesChange(e.target.value)}
                  placeholder="framer-motion, three"
                  className="h-8 text-xs font-mono"
                />
                {metadata.dependencies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {metadata.dependencies.map((dep) => (
                      <Badge key={dep} variant="secondary" className="text-xs font-mono">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Registry Dependencies */}
              <div className="space-y-2">
                <Label htmlFor="registryDependencies" className="text-xs">
                  Registry Dependencies (comma-separated)
                </Label>
                <Input
                  id="registryDependencies"
                  value={metadata.registryDependencies.join(', ')}
                  onChange={(e) => handleRegistryDependenciesChange(e.target.value)}
                  placeholder="button, card"
                  className="h-8 text-xs font-mono"
                />
                {metadata.registryDependencies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {metadata.registryDependencies.map((dep) => (
                      <Badge key={dep} variant="secondary" className="text-xs font-mono">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* File Path */}
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-1">Dev Page</p>
              <code className="text-xs text-muted-foreground break-all">
                /dev/{metadata.slug}
              </code>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
