import { z } from "zod";
import { getApiKey, getConfig, getBaseUrl } from "./config.js";

const componentSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  type: z.enum(["BLOCK", "ELEMENT", "TEMPLATE", "ANIMATION"]),
  tier: z.enum(["FREE", "PRO", "COMMUNITY_FREE", "COMMUNITY_PAID"]),
  category: z.string(),
  code: z.string(),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  registryDeps: z.array(z.string()).default([]),
  files: z
    .array(
      z.object({
        name: z.string(),
        content: z.string(),
      })
    )
    .optional(),
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
  slug: string
): Promise<RegistryComponent | null> {
  try {
    const response = await fetchFromRegistry(`/${slug}`);

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
