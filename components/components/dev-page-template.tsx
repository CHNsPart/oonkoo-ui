"use client";

import { useState, ReactNode, useMemo } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { DevLayout, type ComponentMetadata } from "./dev-layout";
import { AutoControls } from "./auto-controls";
import { CategoryPreview } from "./category-previews";
import { getCategoryTemplate, type ControlDefinition } from "@/lib/component-config";

// =============================================================================
// TYPES
// =============================================================================

interface DevPageTemplateProps {
  /** Path to the component file, e.g., "components/ui/shimmer-button.tsx" */
  componentPath: string;
  /** Default metadata for the component */
  defaultMetadata: ComponentMetadata;
  /** Default prop values for the component */
  defaultConfig: Record<string, any>;
  /** Control definitions for the sidebar */
  controlsConfig: ControlDefinition[];
  /** Optional custom preview render function */
  customPreview?: (props: {
    Component: React.ComponentType<any>;
    config: Record<string, any>;
    metadata: ComponentMetadata;
  }) => ReactNode;
  /** Optional: Override the dynamic component loader */
  componentLoader?: () => Promise<{ default: React.ComponentType<any> }>;
}

// =============================================================================
// LOADING SPINNER
// =============================================================================

const LoadingSpinner = () => (
  <div className="h-[600px] flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// =============================================================================
// DEV PAGE TEMPLATE
// =============================================================================

export function DevPageTemplate({
  componentPath,
  defaultMetadata,
  defaultConfig,
  controlsConfig,
  customPreview,
  componentLoader,
}: DevPageTemplateProps) {
  const [metadata, setMetadata] = useState<ComponentMetadata>(defaultMetadata);
  const [config, setConfig] = useState<Record<string, any>>(defaultConfig);

  // Dynamically load the component
  const Component = useMemo(() => {
    if (componentLoader) {
      return dynamic(componentLoader, { ssr: false, loading: LoadingSpinner });
    }

    // Default: construct path from componentPath
    // Note: This requires the path to be resolvable at build time
    return dynamic(
      () => import(`@/${componentPath}`).then((mod) => ({ default: mod.default || Object.values(mod)[0] })),
      { ssr: false, loading: LoadingSpinner }
    );
  }, [componentPath, componentLoader]);

  // Handle publish
  async function handlePublish(updatedMetadata: ComponentMetadata) {
    // 1. Read component source code
    const response = await fetch("/api/dev/read-file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: componentPath }),
    });

    const { content: componentCode } = await response.json();

    // 2. Build preview config from category template
    const template = getCategoryTemplate(updatedMetadata.category);
    const previewConfig = {
      containerClass: template.containerClass,
      layout: template.layout,
      exampleProps: config,
    };

    // 3. Publish
    const publishRes = await fetch("/api/dev/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        folder: updatedMetadata.slug,
        meta: {
          ...updatedMetadata,
          controls: controlsConfig,
        },
        code: componentCode,
        previewConfig,
      }),
    });

    const result = await publishRes.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to publish");
    }

    console.log("[Publish] Component published:", {
      action: result.action,
      hasComplexDeps: result.hasComplexDeps,
      componentPath: result.componentPath,
    });
  }

  // Build controls
  const controls = (
    <AutoControls
      controls={controlsConfig}
      values={config}
      onChange={setConfig}
    />
  );

  // Get category template
  const template = getCategoryTemplate(metadata.category);

  return (
    <DevLayout
      metadata={metadata}
      onMetadataChange={setMetadata}
      onPublish={handlePublish}
      controls={controls}
    >
      {customPreview ? (
        customPreview({ Component, config, metadata })
      ) : (
        <CategoryPreview
          Component={Component}
          template={template}
          component={{
            name: metadata.name,
            slug: metadata.slug,
            description: metadata.description,
            tags: metadata.tags,
          }}
          props={config}
        />
      )}
    </DevLayout>
  );
}

// =============================================================================
// SIMPLE DEV PAGE WRAPPER
// For components that just need a basic preview
// =============================================================================

interface SimpleDevPageProps {
  metadata: ComponentMetadata;
  componentLoader: () => Promise<{ default: React.ComponentType<any> }>;
  defaultProps?: Record<string, any>;
  controlsConfig?: ControlDefinition[];
}

export function SimpleDevPage({
  metadata: defaultMetadata,
  componentLoader,
  defaultProps = {},
  controlsConfig = [],
}: SimpleDevPageProps) {
  const [metadata, setMetadata] = useState<ComponentMetadata>(defaultMetadata);
  const [config, setConfig] = useState<Record<string, any>>(defaultProps);

  const Component = useMemo(
    () => dynamic(componentLoader, { ssr: false, loading: LoadingSpinner }),
    [componentLoader]
  );

  async function handlePublish(updatedMetadata: ComponentMetadata) {
    // For simple components, we just need minimal config
    const previewConfig = {
      layout: "centered" as const,
      exampleProps: config,
    };

    const publishRes = await fetch("/api/dev/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        folder: updatedMetadata.slug,
        meta: updatedMetadata,
        code: "// Code loaded from file",
        previewConfig,
      }),
    });

    const result = await publishRes.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to publish");
    }
  }

  const controls =
    controlsConfig.length > 0 ? (
      <AutoControls controls={controlsConfig} values={config} onChange={setConfig} />
    ) : (
      <div className="text-xs text-muted-foreground">
        No controls available.
      </div>
    );

  return (
    <DevLayout
      metadata={metadata}
      onMetadataChange={setMetadata}
      onPublish={handlePublish}
      controls={controls}
    >
      <div className="min-h-[500px] flex items-center justify-center p-8">
        <Component {...config} />
      </div>
    </DevLayout>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export type { DevPageTemplateProps, SimpleDevPageProps };
