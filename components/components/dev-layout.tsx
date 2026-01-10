"use client";

import { useState, useEffect, ReactNode } from "react";
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
  BadgeCheck,
  FileDown,
  Users,
  AlertTriangle,
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
import { isOfficialComponent } from "@/lib/component-config";

// Category icons
const categoryIcons: Record<string, typeof Palette> = {
  background: Palette,
  cards: Layers,
  cursor: MousePointer2,
  buttons: RectangleHorizontal,
  animations: Tag,
  other: Component,
};

// Component entry type
interface DevComponent {
  slug: string;
  name: string;
  tier: string;
  category: string;
  isOfficial?: boolean;
}

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
  tier: "free" | "pro" | "community_free" | "community_paid";
  category: string;
  tags: string[];
  dependencies: string[];
  registryDependencies: string[];
  badge?: "default" | "new" | "updated";
  authorId?: string;
  authorName?: string;
}

interface Author {
  id: string;
  name: string | null;
  image: string | null;
}

interface ApprovedRequest {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  tier: string;
  category: string;
  tags: string[];
  dependencies: string[];
  author: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
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

  // Dynamic component list from API
  const [devComponents, setDevComponents] = useState<DevComponent[]>([]);
  const [loadingComponents, setLoadingComponents] = useState(true);

  // Authors for community components
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(false);

  // Approved requests for "Load from Request" feature
  const [approvedRequests, setApprovedRequests] = useState<ApprovedRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadedFromRequest, setLoadedFromRequest] = useState(false);

  // Fetch components from API on mount
  useEffect(() => {
    async function fetchComponents() {
      try {
        const res = await fetch('/api/dev/components');
        const data = await res.json();
        if (data.components) {
          setDevComponents(data.components);
        }
      } catch (error) {
        console.error('Failed to fetch dev components:', error);
      } finally {
        setLoadingComponents(false);
      }
    }
    fetchComponents();
  }, []);

  // Fetch authors when tier is community
  useEffect(() => {
    const isCommunityTier = metadata.tier === 'community_free' || metadata.tier === 'community_paid';
    if (isCommunityTier && authors.length === 0) {
      setLoadingAuthors(true);
      fetch('/api/admin/users')
        .then(res => res.json())
        .then(data => {
          if (data.users) {
            setAuthors(data.users);
          }
        })
        .catch(error => {
          console.error('Failed to fetch authors:', error);
        })
        .finally(() => {
          setLoadingAuthors(false);
        });
    }
  }, [metadata.tier, authors.length]);

  // Fetch approved requests on mount
  useEffect(() => {
    setLoadingRequests(true);
    fetch('/api/dev/requests')
      .then(res => res.json())
      .then(data => {
        if (data.requests) {
          setApprovedRequests(data.requests);
        }
      })
      .catch(error => {
        console.error('Failed to fetch approved requests:', error);
      })
      .finally(() => {
        setLoadingRequests(false);
      });
  }, []);

  // Handle loading metadata from an approved request
  const handleLoadFromRequest = (request: ApprovedRequest) => {
    onMetadataChange({
      ...metadata,
      name: request.name,
      slug: request.slug,
      description: request.description,
      type: request.type as any,
      tier: request.tier as any,
      category: request.category,
      tags: request.tags,
      dependencies: request.dependencies as string[],
      authorId: request.author.id,
      authorName: request.author.name || request.author.email,
    });
    setLoadedFromRequest(true);
  };

  // Group components by tier
  const proComponents = devComponents.filter(c => c.tier === "pro" || c.tier === "PRO");
  const freeComponents = devComponents.filter(c => c.tier === "free" || c.tier === "FREE");
  const communityComponents = devComponents.filter(c =>
    c.tier === "community_free" || c.tier === "COMMUNITY_FREE" ||
    c.tier === "community_paid" || c.tier === "COMMUNITY_PAID"
  );

  // Get current component from pathname
  const currentSlug = pathname?.split('/').pop() || '';
  const currentComponent = devComponents.find(c => c.slug === currentSlug);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handlePublish = async () => {
    // Validate: Community tier requires an author
    const isCommunityTier = metadata.tier === 'community_free' || metadata.tier === 'community_paid';
    if (isCommunityTier && !metadata.authorId) {
      setPublishResult({
        success: false,
        message: "Community components require an author. Use 'Load from Request' or select an author below.",
      });
      return;
    }

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
                <Image src="/pro-plan-badge.svg" alt="Pro" width={14} height={14} className="h-3.5 w-3.5" />
                Pro Components
              </DropdownMenuLabel>
              {proComponents.map((component) => {
                const CategoryIcon = categoryIcons[component.category?.toLowerCase()] || Component;
                const isActive = component.slug === currentSlug;
                const isOfficial = isOfficialComponent(component.slug);
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
                      {isOfficial && (
                        <Badge variant="outline" className="text-[8px] px-1 py-0 h-4 bg-primary/10 text-primary border-primary/20">
                          Official
                        </Badge>
                      )}
                      <div className="flex items-center gap-1.5">
                        <CategoryIcon className="h-3 w-3 text-muted-foreground/60" />
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {component.category?.toLowerCase()}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}

              <DropdownMenuSeparator />

              {/* Free Components */}
              <DropdownMenuLabel className="flex items-center gap-2 text-xs text-primary">
                <Image src="/free-plan-badge.svg" alt="Free" width={14} height={14} className="h-3.5 w-3.5" />
                Free Components
              </DropdownMenuLabel>
              {freeComponents.map((component) => {
                const CategoryIcon = categoryIcons[component.category?.toLowerCase()] || Component;
                const isActive = component.slug === currentSlug;
                const isOfficial = isOfficialComponent(component.slug);
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
                      {isOfficial && (
                        <Badge variant="outline" className="text-[8px] px-1 py-0 h-4 bg-primary/10 text-primary border-primary/20">
                          Official
                        </Badge>
                      )}
                      <div className="flex items-center gap-1.5">
                        <CategoryIcon className="h-3 w-3 text-muted-foreground/60" />
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {component.category?.toLowerCase()}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}

              {/* Community Components (if any) */}
              {communityComponents.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                    <Package className="h-3.5 w-3.5" />
                    Community
                  </DropdownMenuLabel>
                  {communityComponents.map((component) => {
                    const CategoryIcon = categoryIcons[component.category?.toLowerCase()] || Component;
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
                            isActive ? "text-blue-500" : "text-muted-foreground"
                          )} />
                          <span className={cn("flex-1", isActive && "font-medium")}>
                            {component.name}
                          </span>
                          <Badge variant="outline" className="text-[8px] px-1 py-0 h-4 bg-blue-500/10 text-blue-500 border-blue-500/20">
                            Community
                          </Badge>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </>
              )}

              {/* Loading state */}
              {loadingComponents && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Load from Request - for community components */}
          {approvedRequests.length > 0 && (
            <>
              <div className="h-6 w-px bg-border" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-2">
                    <FileDown className="h-4 w-4 text-blue-500" />
                    <span className="text-xs">Load from Request</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 h-4 bg-blue-500/10 text-blue-500">
                      {approvedRequests.length}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72">
                  <DropdownMenuLabel className="flex items-center gap-2 text-xs">
                    <Users className="h-3.5 w-3.5 text-blue-500" />
                    Approved Requests (Ready to Publish)
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {approvedRequests.map((request) => (
                    <DropdownMenuItem
                      key={request.id}
                      onClick={() => handleLoadFromRequest(request)}
                      className="flex flex-col items-start gap-1 cursor-pointer py-2"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className="font-medium text-sm">{request.name}</span>
                        <Badge variant="outline" className="text-[8px] px-1 py-0 h-4 capitalize">
                          {request.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>by {request.author.name || request.author.email}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {loadingRequests && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Loaded from Request indicator */}
          {loadedFromRequest && (
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1">
              <Users className="h-3 w-3" />
              Loaded from Request
            </Badge>
          )}

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
          <div className="min-h-full flex justify-center items-start">
            <div
              key={refreshKey}
              className="w-full transition-all duration-300 bg-background rounded-lg border overflow-hidden"
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
                  <option value="community_free">Community (Free)</option>
                  <option value="community_paid">Community (Paid)</option>
                </select>
              </div>

              {/* Author - Only for community tiers */}
              {(metadata.tier === 'community_free' || metadata.tier === 'community_paid') && (
                <div className="space-y-2">
                  <Label htmlFor="authorId" className="text-xs flex items-center gap-2">
                    <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
                    Component Author
                  </Label>
                  {loadingAuthors ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading users...
                    </div>
                  ) : (
                    <select
                      id="authorId"
                      value={metadata.authorId || ''}
                      onChange={(e) => {
                        const selectedAuthor = authors.find(a => a.id === e.target.value);
                        onMetadataChange({
                          ...metadata,
                          authorId: e.target.value || undefined,
                          authorName: selectedAuthor?.name || undefined
                        });
                      }}
                      className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs"
                    >
                      <option value="">Select author...</option>
                      {authors.map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.name || 'Unknown User'}
                        </option>
                      ))}
                    </select>
                  )}
                  {metadata.authorId && metadata.authorName && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {metadata.authorName}
                    </p>
                  )}
                </div>
              )}

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
