// Registry Schema Types - Compatible with shadcn/ui CLI patterns

export interface ControlConfig {
  name: string;
  label: string;
  type: "number" | "color" | "text" | "select" | "range";
  defaultValue: string | number;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export interface RegistryComponent {
  name: string;
  slug: string;
  description: string;
  type: "block" | "element" | "template" | "animation";
  tier: "free" | "pro" | "community_free" | "community_paid";
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
  };
  // Files to install
  files: RegistryFile[];
  // npm dependencies
  dependencies?: string[];
  devDependencies?: string[];
  // Other oonkoo components required
  registryDependencies?: string[];
  // Additional CSS setup instructions
  cssSetup?: string;
  // Preview
  previewUrl?: string;
  previewImage?: string;
  // Interactive controls for live preview
  controls?: ControlConfig[];
  // Stats
  downloads: number;
  upvotes: number;
  // Pricing (for paid community components)
  price?: number;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface RegistryFile {
  name: string;
  path: string; // Target path relative to project root (e.g., "components/ui/hero.tsx")
  content: string;
  type: "component" | "hook" | "util" | "style";
}

export interface RegistryIndex {
  name: string;
  version: string;
  components: RegistryIndexItem[];
}

export interface RegistryIndexItem {
  name: string;
  slug: string;
  description: string;
  type: "block" | "element" | "template" | "animation";
  tier: "free" | "pro" | "community_free" | "community_paid";
  category: string;
  tags: string[];
  downloads: number;
  upvotes: number;
  price?: number;
  previewImage?: string;
  badge?: "default" | "new" | "updated";
  author: {
    id: string;
    name: string;
  };
}

export interface RegistrySearchParams {
  query?: string;
  type?: string;
  tier?: string;
  category?: string;
  tags?: string[];
  sort?: "downloads" | "upvotes" | "newest" | "name";
  page?: number;
  limit?: number;
}

export interface RegistryResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// CLI Config file schema (oonkoo.json)
export interface OonkooConfig {
  $schema: string;
  style: "default" | "new-york";
  tailwind: {
    config: string;
    css: string;
    baseColor: string;
  };
  aliases: {
    components: string;
    utils: string;
    hooks: string;
  };
  typescript: boolean;
}
