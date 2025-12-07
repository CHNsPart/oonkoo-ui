"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  Upload,
  Check,
  Loader2,
  AlertCircle,
  Circle,
  Tag,
  Package,
  Layers,
  FolderOpen,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LivePreview } from "./live-preview";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ControlConfig {
  name: string;
  label: string;
  type: "number" | "color" | "text" | "select" | "range";
  defaultValue: string | number;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

interface ComponentMeta {
  name: string;
  slug: string;
  description: string;
  type: "block" | "element" | "template" | "animation";
  tier: "free" | "pro";
  category: string;
  tags: string[];
  dependencies: string[];
  registryDependencies: string[];
  controls?: ControlConfig[];
  badge?: "default" | "new" | "updated";
}

interface DevComponent {
  folder: string;
  meta: ComponentMeta;
  code: string;
  lastModified?: number;
}

interface PlaygroundClientProps {
  components: DevComponent[];
}

type ViewportSize = "desktop" | "tablet" | "mobile";

const viewportSizes: Record<ViewportSize, { width: string; label: string }> = {
  desktop: { width: "100%", label: "Desktop" },
  tablet: { width: "768px", label: "Tablet" },
  mobile: { width: "375px", label: "Mobile" },
};

const POLL_INTERVAL = 1000; // Check for changes every second

export function PlaygroundClient({ components: initialComponents }: PlaygroundClientProps) {
  const [components, setComponents] = useState<DevComponent[]>(initialComponents);
  const [selectedFolder, setSelectedFolder] = useState<string>(
    initialComponents[0]?.folder || ""
  );
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const lastHashRef = useRef<string>("");
  const [controlValues, setControlValues] = useState<Record<string, any>>({});
  const [updatingBadge, setUpdatingBadge] = useState(false);

  const selectedComponent = components.find((c) => c.folder === selectedFolder);

  // Initialize control values from defaults
  useEffect(() => {
    if (selectedComponent?.meta.controls) {
      const initial: Record<string, any> = {};
      selectedComponent.meta.controls.forEach((control) => {
        initial[control.name] = control.defaultValue;
      });
      setControlValues(initial);
    } else {
      setControlValues({});
    }
  }, [selectedComponent?.meta.slug]);

  // Poll for file changes
  useEffect(() => {
    let isMounted = true;

    const checkForChanges = async () => {
      try {
        const response = await fetch("/api/dev/components");
        if (!response.ok) return;

        const data = await response.json();

        if (isMounted) {
          setIsConnected(true);

          // Check if files changed
          if (lastHashRef.current && lastHashRef.current !== data.hash) {
            setComponents(data.components);
            setRefreshKey((prev) => prev + 1);
          }
          lastHashRef.current = data.hash;

          // Update selected folder if it no longer exists
          if (data.components.length > 0 && !data.components.find((c: DevComponent) => c.folder === selectedFolder)) {
            setSelectedFolder(data.components[0].folder);
          }
        }
      } catch {
        if (isMounted) setIsConnected(false);
      }
    };

    // Initial fetch
    checkForChanges();

    // Set up polling
    const interval = setInterval(checkForChanges, POLL_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedFolder]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleControlChange = (name: string, value: any) => {
    setControlValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBadgeChange = async (badge: string) => {
    if (!selectedComponent) return;

    setUpdatingBadge(true);
    try {
      const response = await fetch("/api/dev/update-badge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: selectedComponent.meta.slug,
          badge: badge.toUpperCase(),
        }),
      });

      if (response.ok) {
        // Update local state to reflect the change
        setComponents((prev) =>
          prev.map((c) =>
            c.meta.slug === selectedComponent.meta.slug
              ? { ...c, meta: { ...c.meta, badge: badge as any } }
              : c
          )
        );
      }
    } catch (error) {
      console.error("Failed to update badge:", error);
    } finally {
      setUpdatingBadge(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedComponent) return;

    setPublishing(true);
    setPublishResult(null);

    try {
      const response = await fetch("/api/dev/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: selectedComponent.folder,
          meta: selectedComponent.meta,
          code: selectedComponent.code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPublishResult({
          success: true,
          message: `Published "${selectedComponent.meta.name}" successfully!`,
        });
        setTimeout(() => setPublishResult(null), 3000);
      } else {
        setPublishResult({
          success: false,
          message: data.error || "Failed to publish",
        });
      }
    } catch (error) {
      setPublishResult({
        success: false,
        message: "Network error",
      });
    } finally {
      setPublishing(false);
    }
  };

  if (components.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold mb-2">No Components</h1>
          <p className="text-muted-foreground text-sm mb-4">
            Create a folder in <code className="bg-muted px-1.5 py-0.5 rounded">/registry/dev/</code>
          </p>
          <pre className="text-left bg-muted rounded-lg p-4 text-xs">
{`/registry/dev/my-component/
  component.tsx
  meta.json`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background px-4 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          {/* Logo + Playground Badge */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/oonkoo-ui-icon-darkmode.svg"
              alt="OonkooUI"
              width={28}
              height={28}
              className="size-28 hidden dark:block"
            />
            <Image
              src="/oonkoo-ui-icon.svg"
              alt="OonkooUI"
              width={28}
              height={28}
              className="size-28 block dark:hidden"
            />
            <Badge variant="secondary" className="font-medium">
              Playground
            </Badge>
          </Link>

          {/* Divider */}
          <div className="h-6 w-px bg-border" />

          {/* Component Selector */}
          <Select value={selectedFolder} onValueChange={setSelectedFolder}>
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {components.map((comp) => (
                <SelectItem key={comp.folder} value={comp.folder}>
                  {comp.meta.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Hot Reload Status */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Circle
              className={cn(
                "h-2 w-2 fill-current",
                isConnected ? "text-green-500" : "text-red-500"
              )}
            />
            <span className="hidden sm:inline">
              {isConnected ? "Live" : "Disconnected"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport */}
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

          <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>

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
              className="h-full w-full transition-all duration-300 bg-background rounded-lg border overflow-hidden"
              style={{ maxWidth: viewportSizes[viewport].width }}
            >
              {selectedComponent && (
                <LivePreview
                  key={`${selectedFolder}-${refreshKey}`}
                  code={selectedComponent.code}
                  controlValues={controlValues}
                />
              )}
            </div>
          </div>
        </div>

        {/* Metadata Sidebar */}
        {selectedComponent && (
          <div className="w-72 border-l bg-background overflow-auto shrink-0">
            <div className="p-4 space-y-6">
              {/* Component Info */}
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {selectedComponent.meta.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedComponent.meta.description}
                </p>
              </div>

              {/* Controls Section */}
              {selectedComponent.meta.controls && selectedComponent.meta.controls.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">Controls</h4>
                  </div>
                  <div className="space-y-4">
                    {selectedComponent.meta.controls.map((control) => (
                      <div key={control.name} className="space-y-2">
                        <Label htmlFor={control.name} className="text-xs">
                          {control.label}
                        </Label>

                        {control.type === "range" && (
                          <div className="space-y-2">
                            <Slider
                              id={control.name}
                              min={control.min ?? 0}
                              max={control.max ?? 100}
                              step={control.step ?? 1}
                              value={[controlValues[control.name] as number]}
                              onValueChange={(val) => handleControlChange(control.name, val[0])}
                            />
                            <div className="text-xs text-muted-foreground text-right">
                              {controlValues[control.name]}
                            </div>
                          </div>
                        )}

                        {control.type === "color" && (
                          <div className="flex gap-2">
                            <Input
                              id={control.name}
                              type="color"
                              value={(controlValues[control.name] ?? control.defaultValue) as string}
                              onChange={(e) => handleControlChange(control.name, e.target.value)}
                              className="h-9 w-16 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={(controlValues[control.name] ?? control.defaultValue) as string}
                              onChange={(e) => handleControlChange(control.name, e.target.value)}
                              className="flex-1 font-mono text-xs h-9"
                            />
                          </div>
                        )}

                        {control.type === "text" && (
                          <Input
                            id={control.name}
                            type="text"
                            value={(controlValues[control.name] ?? control.defaultValue) as string}
                            onChange={(e) => handleControlChange(control.name, e.target.value)}
                            className="text-xs h-9"
                          />
                        )}

                        {control.type === "number" && (
                          <Input
                            id={control.name}
                            type="number"
                            min={control.min}
                            max={control.max}
                            step={control.step}
                            value={(controlValues[control.name] ?? control.defaultValue) as number}
                            onChange={(e) => handleControlChange(control.name, Number(e.target.value))}
                            className="text-xs h-9"
                          />
                        )}

                        {control.type === "select" && control.options && (
                          <select
                            id={control.name}
                            value={(controlValues[control.name] ?? control.defaultValue) as string}
                            onChange={(e) => handleControlChange(control.name, e.target.value)}
                            className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs"
                          >
                            {control.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta Details */}
              <div className="space-y-4 pt-4 border-t">
                {/* Slug */}
                <div className="flex items-start gap-3">
                  <FolderOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Slug</p>
                    <code className="text-sm">{selectedComponent.meta.slug}</code>
                  </div>
                </div>

                {/* Type */}
                <div className="flex items-start gap-3">
                  <Layers className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <Badge variant="outline" className="capitalize">
                      {selectedComponent.meta.type}
                    </Badge>
                  </div>
                </div>

                {/* Tier */}
                <div className="flex items-start gap-3">
                  <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tier</p>
                    <Badge
                      variant={selectedComponent.meta.tier === "pro" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {selectedComponent.meta.tier}
                    </Badge>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-start gap-3">
                  <Layers className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <span className="text-sm capitalize">{selectedComponent.meta.category}</span>
                  </div>
                </div>

                {/* Badge Status */}
                <div className="flex items-start gap-3">
                  <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="w-full">
                    <p className="text-xs text-muted-foreground mb-1.5">Badge Status</p>
                    <select
                      value={selectedComponent.meta.badge || "default"}
                      onChange={(e) => handleBadgeChange(e.target.value)}
                      disabled={updatingBadge}
                      className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs capitalize"
                    >
                      <option value="default">Default (No Badge)</option>
                      <option value="new">New</option>
                      <option value="updated">Updated</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                {selectedComponent.meta.tags?.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedComponent.meta.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Dependencies */}
                {selectedComponent.meta.dependencies?.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Dependencies</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedComponent.meta.dependencies.map((dep) => (
                          <Badge key={dep} variant="secondary" className="text-xs font-mono">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Registry Dependencies */}
                {selectedComponent.meta.registryDependencies?.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Registry Deps</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedComponent.meta.registryDependencies.map((dep) => (
                          <Badge key={dep} variant="secondary" className="text-xs font-mono">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* File Path */}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-1">File Path</p>
                <code className="text-xs text-muted-foreground break-all">
                  /registry/dev/{selectedComponent.folder}/
                </code>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
