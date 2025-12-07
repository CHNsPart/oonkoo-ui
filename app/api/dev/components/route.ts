import { NextResponse } from "next/server";
import { readdirSync, readFileSync, existsSync, statSync } from "fs";
import { join } from "path";
import { prisma } from "@/lib/prisma";

// Only allow in development
const isDev = process.env.NODE_ENV === "development";

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
  badge?: "default" | "new" | "updated";
}

interface DevComponent {
  folder: string;
  meta: ComponentMeta;
  code: string;
  lastModified: number;
}

async function getDevComponents(): Promise<{ components: DevComponent[]; hash: string }> {
  const devPath = join(process.cwd(), "registry", "dev");

  if (!existsSync(devPath)) {
    return { components: [], hash: "empty" };
  }

  const folders = readdirSync(devPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const components: DevComponent[] = [];
  let combinedMtime = 0;

  // Fetch all component badges from database
  const dbComponents = await prisma.component.findMany({
    select: {
      slug: true,
      badge: true,
    },
  });

  const badgeMap = new Map(
    dbComponents.map((c) => [c.slug, c.badge.toLowerCase() as "default" | "new" | "updated"])
  );

  for (const folder of folders) {
    const metaPath = join(devPath, folder, "meta.json");
    const componentPath = join(devPath, folder, "component.tsx");

    if (existsSync(metaPath) && existsSync(componentPath)) {
      try {
        const meta = JSON.parse(readFileSync(metaPath, "utf-8"));
        const code = readFileSync(componentPath, "utf-8");
        const componentStats = statSync(componentPath);
        const metaStats = statSync(metaPath);
        // Track both component and meta file changes
        const lastModified = Math.max(componentStats.mtimeMs, metaStats.mtimeMs);
        combinedMtime += lastModified;

        // Merge badge from database
        if (badgeMap.has(meta.slug)) {
          meta.badge = badgeMap.get(meta.slug);
        }

        components.push({ folder, meta, code, lastModified });
      } catch (error) {
        console.error(`Error reading component ${folder}:`, error);
      }
    }
  }

  return {
    components,
    hash: combinedMtime.toString()
  };
}

export async function GET() {
  if (!isDev) {
    return NextResponse.json(
      { error: "Only available in development" },
      { status: 403 }
    );
  }

  const { components, hash } = await getDevComponents();

  return NextResponse.json({ components, hash });
}
