import fs from "fs-extra";
import path from "path";
import { getConfig, ProjectConfig } from "./config.js";

export async function resolveAlias(
  alias: string,
  config: ProjectConfig
): Promise<string> {
  // Map common aliases to their paths
  const aliasMap: Record<string, string> = {
    "@/components": config.aliases.components,
    "@/components/ui": config.aliases.ui,
    "@/lib/utils": config.aliases.utils,
    "@/hooks": config.aliases.hooks,
  };

  // Check if the alias starts with any of our mapped aliases
  for (const [key, value] of Object.entries(aliasMap)) {
    if (alias.startsWith(key)) {
      const resolved = alias.replace(key, value);
      // Convert alias path to actual file path
      return resolved.replace(/^@\//, "");
    }
  }

  return alias;
}

export async function writeComponentFile(
  componentSlug: string,
  code: string,
  config: ProjectConfig
): Promise<string> {
  // Determine the output directory based on config
  const uiDir = config.aliases.ui.replace(/^@\//, "");
  const outputDir = path.resolve(process.cwd(), uiDir);

  // Ensure directory exists
  await fs.ensureDir(outputDir);

  // Write the file
  const fileName = `${componentSlug}.tsx`;
  const filePath = path.join(outputDir, fileName);

  await fs.writeFile(filePath, code, "utf-8");

  return filePath;
}

export async function writeBlockFile(
  componentSlug: string,
  code: string,
  config: ProjectConfig
): Promise<string> {
  // Blocks go to components directory (not ui)
  const componentsDir = config.aliases.components.replace(/^@\//, "");
  const outputDir = path.resolve(process.cwd(), componentsDir, "blocks");

  // Ensure directory exists
  await fs.ensureDir(outputDir);

  // Write the file
  const fileName = `${componentSlug}.tsx`;
  const filePath = path.join(outputDir, fileName);

  await fs.writeFile(filePath, code, "utf-8");

  return filePath;
}

export async function fileExists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath);
}

export async function getExistingFiles(
  componentSlugs: string[],
  config: ProjectConfig
): Promise<string[]> {
  const existing: string[] = [];

  for (const slug of componentSlugs) {
    const uiPath = path.resolve(
      process.cwd(),
      config.aliases.ui.replace(/^@\//, ""),
      `${slug}.tsx`
    );
    const blockPath = path.resolve(
      process.cwd(),
      config.aliases.components.replace(/^@\//, ""),
      "blocks",
      `${slug}.tsx`
    );

    if (await fileExists(uiPath)) {
      existing.push(slug);
    } else if (await fileExists(blockPath)) {
      existing.push(slug);
    }
  }

  return existing;
}

export function detectPackageManager(): "npm" | "yarn" | "pnpm" | "bun" {
  const cwd = process.cwd();

  if (fs.existsSync(path.join(cwd, "bun.lockb"))) {
    return "bun";
  }
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm";
  }
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
    return "yarn";
  }

  return "npm";
}

export function getInstallCommand(
  packageManager: "npm" | "yarn" | "pnpm" | "bun",
  packages: string[],
  isDev = false
): string {
  const packagesStr = packages.join(" ");

  switch (packageManager) {
    case "yarn":
      return `yarn add ${isDev ? "-D " : ""}${packagesStr}`;
    case "pnpm":
      return `pnpm add ${isDev ? "-D " : ""}${packagesStr}`;
    case "bun":
      return `bun add ${isDev ? "-d " : ""}${packagesStr}`;
    default:
      return `npm install ${isDev ? "-D " : ""}${packagesStr}`;
  }
}
