import Conf from "conf";
import fs from "fs-extra";
import path from "path";
import { z } from "zod";

// CLI persistent config (stored in user's home directory)
const store = new Conf({
  projectName: "oonkoo",
  schema: {
    apiKey: { type: "string" },
    userId: { type: "string" },
  },
});

export function getApiKey(): string | undefined {
  return store.get("apiKey") as string | undefined;
}

export function setApiKey(key: string): void {
  store.set("apiKey", key);
}

export function clearApiKey(): void {
  store.delete("apiKey");
}

export function getUserId(): string | undefined {
  return store.get("userId") as string | undefined;
}

export function setUserId(id: string): void {
  store.set("userId", id);
}

// Get base URL for API calls (can be overridden for development)
// Set OONKOO_API_URL=http://localhost:3000 for local development
export function getBaseUrl(): string {
  return process.env.OONKOO_API_URL || "https://ui.oonkoo.com";
}

// Project config schema (oonkoo.config.json)
export const projectConfigSchema = z.object({
  $schema: z.string().optional(),
  style: z.enum(["default", "new-york"]).default("default"),
  tailwind: z.object({
    config: z.string().default("tailwind.config.js"),
    css: z.string().default("app/globals.css"),
    baseColor: z.string().default("slate"),
    cssVariables: z.boolean().default(true),
  }),
  aliases: z.object({
    components: z.string().default("@/components"),
    utils: z.string().default("@/lib/utils"),
    ui: z.string().default("@/components/ui"),
    hooks: z.string().default("@/hooks"),
  }),
  registryUrl: z.string().default("https://ui.oonkoo.com/api/registry"),
});

export type ProjectConfig = z.infer<typeof projectConfigSchema>;

const CONFIG_FILE = "oonkoo.config.json";

export function getConfigPath(): string {
  return path.resolve(process.cwd(), CONFIG_FILE);
}

export function configExists(): boolean {
  return fs.existsSync(getConfigPath());
}

export async function getConfig(): Promise<ProjectConfig | null> {
  const configPath = getConfigPath();

  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const content = await fs.readJson(configPath);
    return projectConfigSchema.parse(content);
  } catch {
    return null;
  }
}

export async function writeConfig(config: ProjectConfig): Promise<void> {
  const configPath = getConfigPath();
  await fs.writeJson(configPath, config, { spaces: 2 });
}

export function getDefaultConfig(): ProjectConfig {
  return {
    style: "default",
    tailwind: {
      config: "tailwind.config.js",
      css: "app/globals.css",
      baseColor: "slate",
      cssVariables: true,
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      hooks: "@/hooks",
    },
    registryUrl: "https://ui.oonkoo.com/api/registry",
  };
}
