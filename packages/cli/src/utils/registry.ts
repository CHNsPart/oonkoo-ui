import { z } from "zod";
import { getApiKey, getConfig, getBaseUrl } from "./config.js";

const componentSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  type: z.enum(["block", "element", "template", "animation"]),
  tier: z.enum(["free", "pro", "community_free", "community_paid"]),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  author: z.object({
    id: z.string(),
    name: z.string(),
  }),
  files: z.array(
    z.object({
      name: z.string(),
      path: z.string(),
      content: z.string(),
      type: z.string(),
    })
  ),
  dependencies: z.array(z.string()).optional().default([]),
  devDependencies: z.array(z.string()).optional().default([]),
  registryDependencies: z.array(z.string()).optional().default([]),
  cssSetup: z.string().optional(),
  previewUrl: z.string().optional(),
  previewImage: z.string().optional(),
  downloads: z.number(),
  upvotes: z.number(),
  price: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RegistryComponent = z.infer<typeof componentSchema>;

const registryIndexSchema = z.object({
  components: z.array(
    z.object({
      name: z.string(),
      slug: z.string(),
      description: z.string(),
      type: z.string(),
      tier: z.string(),
      category: z.string(),
    })
  ),
});

export type RegistryIndex = z.infer<typeof registryIndexSchema>;

async function fetchFromRegistry(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const config = await getConfig();
  // Environment variable takes precedence for development
  const envUrl = process.env.OONKOO_API_URL;
  const baseUrl = envUrl
    ? `${envUrl}/api/registry`
    : (config?.registryUrl ?? `${getBaseUrl()}/api/registry`);
  const apiKey = getApiKey();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}

export async function getRegistryIndex(): Promise<RegistryIndex | null> {
  try {
    const response = await fetchFromRegistry("");

    if (!response.ok) {
      return null;
    }

    const json = await response.json();

    if (!json.success) {
      return null;
    }

    return registryIndexSchema.parse(json.data);
  } catch {
    return null;
  }
}

export async function getComponent(
  slug: string,
  trackDownload = false
): Promise<RegistryComponent | null> {
  try {
    const endpoint = trackDownload ? `/${slug}?download=true` : `/${slug}`;
    const response = await fetchFromRegistry(endpoint);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
      }
      if (response.status === 403) {
        throw new Error("PRO_REQUIRED");
      }
      return null;
    }

    const json = await response.json();

    if (!json.success) {
      return null;
    }

    return componentSchema.parse(json.data);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    return null;
  }
}

export async function getMultipleComponents(
  slugs: string[]
): Promise<Map<string, RegistryComponent | null>> {
  const results = new Map<string, RegistryComponent | null>();

  await Promise.all(
    slugs.map(async (slug) => {
      try {
        const component = await getComponent(slug);
        results.set(slug, component);
      } catch {
        results.set(slug, null);
      }
    })
  );

  return results;
}

export function filterComponents(
  components: RegistryIndex["components"],
  options: {
    category?: string;
    tier?: string;
    search?: string;
  }
): RegistryIndex["components"] {
  let filtered = [...components];

  if (options.category) {
    filtered = filtered.filter(
      (c) => c.category.toLowerCase() === options.category?.toLowerCase()
    );
  }

  if (options.tier) {
    const tierMap: Record<string, string[]> = {
      free: ["FREE", "COMMUNITY_FREE"],
      pro: ["PRO"],
      community: ["COMMUNITY_FREE", "COMMUNITY_PAID"],
    };
    const allowedTiers = tierMap[options.tier.toLowerCase()] ?? [options.tier];
    filtered = filtered.filter((c) => allowedTiers.includes(c.tier));
  }

  if (options.search) {
    const search = options.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.slug.toLowerCase().includes(search)
    );
  }

  return filtered;
}
