import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Info, Star, Download, GitFork, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/components/copy-button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "CLI - OonkooUI",
  description: "Install components with the OonkooUI CLI - auto-setup, dependency management, and Pro access included.",
};

export default function CLIPage() {
  const configExample = `{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "hooks": "@/hooks"
  },
  "registryUrl": "https://ui.oonkoo.com/api/registry"
}`;

  const shadcnConfigExample = `{
  "registries": {
    "@oonkoo": "https://ui.oonkoo.com/r/{name}.json"
  }
}`;

  return (
    <div className="w-full max-w-6xl">
      {/* Header */}
      <div className="space-y-4 mb-10">
        <h1 className="text-4xl font-bold tracking-tight">CLI</h1>
        <p className="text-xl text-muted-foreground">
          Install OonkooUI components with zero configuration. The CLI handles setup, dependencies, and authentication automatically.
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href="https://github.com/CHNsPart/oonkoo-ui"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://img.shields.io/github/stars/CHNsPart/oonkoo-ui?style=social"
              alt="GitHub Stars"
              width={100}
              height={20}
              className="h-5 w-auto"
            />
          </Link>
          {/* <Link
            href="https://github.com/CHNsPart/oonkoo-ui/fork"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://img.shields.io/github/forks/CHNsPart/oonkoo-ui?style=social"
              alt="GitHub Forks"
              width={100}
              height={20}
              className="h-5 w-auto"
            />
          </Link> */}
          <Link
            href="https://www.npmjs.com/package/oonkoo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://img.shields.io/npm/v/oonkoo?style=flat-square&logo=npm&color=CB3837"
              alt="npm version"
              width={100}
              height={20}
              className="h-5 w-auto"
            />
          </Link>
          <Link
            href="https://www.npmjs.com/package/oonkoo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://img.shields.io/npm/dm/oonkoo?style=flat-square&logo=npm&color=CB3837"
              alt="npm downloads"
              width={120}
              height={20}
              className="h-5 w-auto"
            />
          </Link>
          <Link
            href="https://github.com/CHNsPart/oonkoo-ui/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://img.shields.io/github/license/CHNsPart/oonkoo-ui?style=flat-square"
              alt="License"
              width={80}
              height={20}
              className="h-5 w-auto"
            />
          </Link>
        </div>
      </div>

      {/* About */}
      <section className="mb-10">
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">
              OonkooUI uses <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">shadcn/ui</a> as the foundation for base UI primitives (Button, Card, Dialog, etc.).
              The OonkooUI components are higher-level blocks built on top of these primitives, giving you production-ready sections like Hero, Pricing, Features, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Installation Methods */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Installation Methods</h2>
        <p className="text-muted-foreground mb-6">
          Choose the method that works best for your workflow. Both methods install the same components.
        </p>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* OonkooUI CLI Card */}
          <div className="rounded-xl border-2 border-primary/50 bg-card p-6 relative">
            <Badge variant="default" className="absolute -top-3 left-4 text-xs">Recommended</Badge>
            <div className="flex items-center gap-3 mb-3 mt-2">
              <Image
                src="/oonkoo-ui-icon.svg"
                alt="OonkooUI"
                width={52}
                height={52}
                className="block dark:hidden"
              />
              <Image
                src="/oonkoo-ui-icon-darkmode.svg"
                alt="OonkooUI"
                width={52}
                height={52}
                className="hidden dark:block"
              />
              <h3 className="font-semibold">OonkooUI CLI</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Complete standalone solution with zero configuration required.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>✓ Auto-creates lib/utils.ts</li>
              <li>✓ Auto-installs dependencies</li>
              <li>✓ Interactive component picker</li>
              <li>✓ Component updates & sync</li>
              <li>✓ Pro component access</li>
              <li>✓ Download tracking</li>
              <li>✓ npm, yarn, pnpm, bun support</li>
            </ul>
          </div>

          {/* shadcn CLI Card */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="https://avatars.githubusercontent.com/u/139895814?s=280&v=4"
                alt="shadcn/ui"
                width={28}
                height={28}
                className="rounded-md"
              />
              <h3 className="font-semibold">shadcn CLI</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Use shadcn CLI if you already have components.json configured.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>✓ Works with existing shadcn setup</li>
              <li>✓ Download tracking</li>
              <li>✓ Free components only</li>
              <li className="text-muted-foreground/60">✗ Requires components.json</li>
              <li className="text-muted-foreground/60">✗ No Pro access</li>
              <li className="text-muted-foreground/60">✗ No auto-setup</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Method 1: shadcn CLI */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Image
            src="https://avatars.githubusercontent.com/u/139895814?s=280&v=4"
            alt="shadcn/ui"
            width={32}
            height={32}
            className="rounded-md"
          />
          Using shadcn CLI
        </h2>

        <div className="space-y-6">
          {/* Step 1: Add Registry */}
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Add OonkooUI Registry</h3>
            <p className="text-muted-foreground mb-4">
              <strong>First</strong>, add the OonkooUI registry to your existing <code className="bg-muted px-1.5 py-0.5 rounded text-xs">components.json</code> file:
            </p>
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                <span className="text-sm font-mono text-muted-foreground">components.json</span>
                <CopyButton text={shadcnConfigExample} variant="ghost" size="sm" />
              </div>
              <div className="bg-zinc-900 p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-zinc-300">{shadcnConfigExample}</pre>
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This method only works if you have <code className="bg-muted px-1 py-0.5 rounded text-xs">components.json</code> configured. If you get a registry error, use the OonkooUI CLI instead.
              </p>
            </div>
          </div>

          {/* Step 2: Install Components */}
          <div>
            <h3 className="text-lg font-semibold mb-2">2. Install Components (Method A: Registry)</h3>
            <p className="text-muted-foreground mb-4">
              <strong>Then</strong>, install OonkooUI components using the registry prefix:
            </p>
            <div className="space-y-3">
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Install a component</span>
                  <CopyButton text="npx shadcn@latest add @oonkoo/pulse-button" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx shadcn@latest add @oonkoo/pulse-button</code>
                </div>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Install multiple components</span>
                  <CopyButton text="npx shadcn@latest add @oonkoo/pulse-button @oonkoo/spark-cursor" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx shadcn@latest add @oonkoo/pulse-button @oonkoo/spark-cursor</code>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Or Use Direct URL */}
          <div>
            <h3 className="text-lg font-semibold mb-2">2. Install Components (Method B: Direct URL)</h3>
            <p className="text-muted-foreground mb-4">
              <strong>Alternatively</strong>, install components using the direct URL (no registry config needed):
            </p>
            <div className="space-y-3">
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Install via URL</span>
                  <CopyButton text='npx shadcn@latest add "https://ui.oonkoo.com/r/pulse-button"' variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx shadcn@latest add &quot;https://ui.oonkoo.com/r/pulse-button&quot;</code>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-green-500/20 bg-green-500/5 p-3">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> Use this method if you don&apos;t want to configure the registry. Works without <code className="bg-muted px-1 py-0.5 rounded text-xs">components.json</code> changes!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Method 2: OonkooUI CLI */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Image
            src="/free-plan-badge.svg"
            alt="OonkooUI"
            width={32}
            height={32}
          />
          Using OonkooUI CLI
        </h2>

        {/* Commands */}
        <div className="space-y-8">
          {/* init */}
          <div>
            <h3 className="text-lg font-semibold mb-2">init</h3>
            <p className="text-muted-foreground mb-4">
              Initialize OonkooUI in your project with zero configuration. Automatically creates config, directories, and required utilities.
            </p>
            <div className="rounded-lg border overflow-hidden mb-3">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                <span className="text-sm text-muted-foreground">Terminal</span>
                <CopyButton text="npx oonkoo init" variant="ghost" size="sm" />
              </div>
              <div className="bg-zinc-900 p-4">
                <code className="text-sm font-mono text-primary">npx oonkoo init</code>
              </div>
            </div>
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 mb-3">
              <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">What init does:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Creates oonkoo.config.json</li>
                <li>✓ Sets up component directories</li>
                <li>✓ Auto-creates lib/utils.ts with cn() helper</li>
                <li>✓ Installs clsx & tailwind-merge dependencies</li>
                <li>✓ Detects your package manager (npm/yarn/pnpm/bun)</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              Options: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">-y, --yes</code> - Skip prompts and use defaults
            </p>
          </div>

          {/* add */}
          <div>
            <h3 className="text-lg font-semibold mb-2">add</h3>
            <p className="text-muted-foreground mb-4">
              Add components to your project. Automatically fetches code, installs dependencies, and tracks downloads.
            </p>
            <div className="space-y-3 mb-3">
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Add a component</span>
                  <CopyButton text="npx oonkoo add pulse-button" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx oonkoo add pulse-button</code>
                </div>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Add multiple components</span>
                  <CopyButton text="npx oonkoo add pulse-button spark-cursor" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx oonkoo add pulse-button spark-cursor</code>
                </div>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Interactive component picker</span>
                  <CopyButton text="npx oonkoo add" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx oonkoo add</code>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 mb-3">
              <p className="text-sm text-muted-foreground">
                <strong>Available components:</strong> pulse-button, spark-cursor — <Link href="/components" className="text-primary hover:underline">Browse all</Link>
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Options: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">-a, --all</code> Add all components | <code className="bg-muted px-1.5 py-0.5 rounded text-xs">-o, --overwrite</code> Overwrite existing | <code className="bg-muted px-1.5 py-0.5 rounded text-xs">-y, --yes</code> Skip confirmations
            </p>
            <p className="text-xs text-muted-foreground/70">
              Works with: npm, yarn, pnpm, bun (auto-detected)
            </p>
          </div>

          {/* list */}
          <div>
            <h3 className="text-lg font-semibold mb-2">list</h3>
            <p className="text-muted-foreground mb-4">
              List all available components from the registry with filtering options.
            </p>
            <div className="space-y-3 mb-3">
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">List all components</span>
                  <CopyButton text="npx oonkoo list" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx oonkoo list</code>
                </div>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Filter by category</span>
                  <CopyButton text="npx oonkoo list --category buttons" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx oonkoo list --category buttons</code>
                </div>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Filter by tier</span>
                  <CopyButton text="npx oonkoo list --tier free" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx oonkoo list --tier free</code>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs font-mono text-muted-foreground mb-2">Example output:</p>
              <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
{`buttons
  pulse-button              free [element]
  An animated button with pulsating effect

other
  spark-cursor              free [element]
  Spark cursor effect on click`}
              </pre>
            </div>
          </div>

          {/* auth */}
          <div>
            <h3 className="text-lg font-semibold mb-2">auth</h3>
            <p className="text-muted-foreground mb-4">
              Authenticate with OonkooUI to access Pro components. Supports browser-based login (recommended) or API key authentication.
            </p>
            <div className="space-y-3 mb-3">
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Login (opens browser)</span>
                  <CopyButton text="npx oonkoo auth" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx oonkoo auth</code>
                </div>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Login with API key</span>
                  <CopyButton text="npx oonkoo auth --api-key" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx oonkoo auth --api-key</code>
                </div>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Logout</span>
                  <CopyButton text="npx oonkoo auth --logout" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx oonkoo auth --logout</code>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              You can also use <code className="bg-muted px-1.5 py-0.5 rounded text-xs">npx oonkoo login</code> as an alias for auth.
            </p>
          </div>

          {/* update */}
          <div>
            <h3 className="text-lg font-semibold mb-2">update</h3>
            <p className="text-muted-foreground mb-4">
              Check for and apply updates to installed components.
            </p>
            <div className="space-y-3 mb-3">
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Interactive update</span>
                  <CopyButton text="npx oonkoo update" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx oonkoo update</code>
                </div>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Update all</span>
                  <CopyButton text="npx oonkoo update --all" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx oonkoo update --all</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Configuration */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">OonkooUI CLI Configuration</h2>
        <p className="text-muted-foreground mb-4">
          The <code className="bg-muted px-1.5 py-0.5 rounded text-xs">oonkoo.config.json</code> file in your project root (created by <code className="bg-muted px-1.5 py-0.5 rounded text-xs">npx oonkoo init</code>):
        </p>
        <div className="rounded-lg border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
            <span className="text-sm font-mono text-muted-foreground">oonkoo.config.json</span>
            <CopyButton text={configExample} variant="ghost" size="sm" />
          </div>
          <div className="bg-zinc-900 p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-zinc-300">{configExample}</pre>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Requirements</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-3">System Requirements</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Node.js 18+ (LTS recommended)</li>
              <li>✓ npm, yarn, pnpm, or bun</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Project Requirements</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ React 18+ (React 19 supported)</li>
              <li>✓ Tailwind CSS 3+ (v4 supported)</li>
              <li>✓ TypeScript (recommended)</li>
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Supported Frameworks</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Next.js 14+</Badge>
            <Badge variant="secondary">Vite + React</Badge>
            <Badge variant="secondary">Remix</Badge>
            <Badge variant="secondary">Create React App</Badge>
            <Badge variant="secondary">Astro</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Works with any React framework that supports Tailwind CSS.
          </p>
        </div>
      </section>

      {/* Next Steps */}
      <section className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
        <h2 className="text-xl font-bold mb-2">Start Building</h2>
        <p className="text-muted-foreground mb-4">
          Browse the component library and start adding to your project.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/components">
              Browse Components
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/components/installation">
              Installation Guide
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
