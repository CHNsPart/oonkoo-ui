import { Suspense } from "react";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { PlaygroundClient } from "./playground-client";

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
}

interface DevComponent {
  folder: string;
  meta: ComponentMeta;
  code: string;
}

function getDevComponents(): DevComponent[] {
  const devPath = join(process.cwd(), "registry", "dev");

  if (!existsSync(devPath)) {
    return [];
  }

  const folders = readdirSync(devPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const components: DevComponent[] = [];

  for (const folder of folders) {
    const metaPath = join(devPath, folder, "meta.json");
    const componentPath = join(devPath, folder, "component.tsx");

    if (existsSync(metaPath) && existsSync(componentPath)) {
      try {
        const meta = JSON.parse(readFileSync(metaPath, "utf-8"));
        const code = readFileSync(componentPath, "utf-8");
        components.push({ folder, meta, code });
      } catch (error) {
        console.error(`Error reading component ${folder}:`, error);
      }
    }
  }

  return components;
}

export default function PlaygroundPage() {
  const components = getDevComponents();

  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <PlaygroundClient components={components} />
    </Suspense>
  );
}
