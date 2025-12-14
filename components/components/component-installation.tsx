"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Terminal, FileCode } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeHighlighter } from "./code-highlighter";

interface ComponentInstallationProps {
  slug: string;
  code: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  cssSetup?: string;
  isPro: boolean;
}

// Remove Preview wrapper - users only get the actual component
function stripPreviewCode(code: string): string {
  // Remove the entire Preview function (export default function Preview...)
  let cleaned = code.replace(/\/\/\s*Preview wrapper.*?\n/g, "");
  cleaned = cleaned.replace(/export\s+default\s+function\s+Preview\s*\([^)]*\)\s*{[\s\S]*$/m, "");

  // If there's a simpler pattern, match the last export default function
  const lines = cleaned.split("\n");
  const lastExportIndex = lines.findIndex(line => /export\s+default\s+function\s+Preview/.test(line));

  if (lastExportIndex !== -1) {
    cleaned = lines.slice(0, lastExportIndex).join("\n");
  }

  return cleaned.trim();
}

export function ComponentInstallation({
  slug,
  code,
  dependencies = [],
  devDependencies = [],
  registryDependencies = [],
  cssSetup,
  isPro,
}: ComponentInstallationProps) {
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedManual, setCopiedManual] = useState(false);
  const [copiedDeps, setCopiedDeps] = useState(false);
  const [packageManager, setPackageManager] = useState<"oonkoo" | "npm" | "yarn" | "bun" | "pnpm" | "shadcn">("oonkoo");

  // Strip Preview code - only show the actual component
  const cleanedCode = useMemo(() => stripPreviewCode(code), [code]);

  // Generate commands for different package managers
  const commands = {
    oonkoo: `npx oonkoo add ${slug}`,
    npm: `npx oonkoo add ${slug}`,
    yarn: `yarn dlx oonkoo add ${slug}`,
    bun: `bunx --bun oonkoo add ${slug}`,
    pnpm: `pnpm dlx oonkoo add ${slug}`,
    shadcn: `npx shadcn@latest add @oonkoo/${slug}`,
  };

  const depsCommands = {
    npm: dependencies.length > 0 ? `npm install ${dependencies.join(" ")}` : "",
    yarn: dependencies.length > 0 ? `yarn add ${dependencies.join(" ")}` : "",
    bun: dependencies.length > 0 ? `bun add ${dependencies.join(" ")}` : "",
    pnpm: dependencies.length > 0 ? `pnpm add ${dependencies.join(" ")}` : "",
  };

  const currentCommand = commands[packageManager];
  const currentDepsCommand = packageManager === "oonkoo" || packageManager === "shadcn"
    ? ""
    : depsCommands[packageManager as keyof typeof depsCommands];

  const handleCopyCli = async () => {
    await navigator.clipboard.writeText(currentCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleCopyManual = async () => {
    if (isPro && !code) return;
    await navigator.clipboard.writeText(cleanedCode);
    setCopiedManual(true);
    setTimeout(() => setCopiedManual(false), 2000);
  };

  const handleCopyDeps = async () => {
    await navigator.clipboard.writeText(currentDepsCommand);
    setCopiedDeps(true);
    setTimeout(() => setCopiedDeps(false), 2000);
  };

  const handleOpenInClaude = () => {
    const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(`Help me integrate this component into my project:\n\n${currentCommand}\n\nComponent: ${slug}`)}`;
    window.open(claudeUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Installation</h2>

        <Tabs defaultValue="cli" className="w-full">
          <TabsList>
            <TabsTrigger value="cli" className="gap-1.5">
              <Terminal className="h-4 w-4" />
              CLI
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-1.5">
              <FileCode className="h-4 w-4" />
              Manual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cli" className="mt-4 space-y-4">
            {/* Package Manager Selector */}
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                {/* CLI Tools Group */}
                <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                  {(["oonkoo", "shadcn"] as const).map((pm) => (
                    <button
                      key={pm}
                      onClick={() => setPackageManager(pm)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        packageManager === pm
                          ? "bg-background text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>

                {/* Package Managers Group */}
                <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                  {(["npm", "yarn", "bun", "pnpm"] as const).map((pm) => (
                    <button
                      key={pm}
                      onClick={() => setPackageManager(pm)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        packageManager === pm
                          ? "bg-background text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleOpenInClaude}
                variant="outline"
                size="sm"
                className="gap-2 shrink-0"
              >
                <Image
                  src="/claude.png"
                  alt="Claude AI"
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
                Open in Claude
              </Button>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Run the following command:
              </p>
              <div className="flex items-center gap-2 bg-muted rounded-lg border">
                <code className="flex-1 px-4 py-3 font-mono text-sm text-primary">
                  {currentCommand}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyCli}
                  className="mr-2 h-8 w-8"
                >
                  {copiedCli ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {currentDepsCommand && (
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Install dependencies:
                </p>
                <div className="flex items-center gap-2 bg-muted rounded-lg border">
                  <code className="flex-1 px-4 py-3 font-mono text-sm">
                    {currentDepsCommand}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyDeps}
                    className="mr-2 h-8 w-8"
                  >
                    {copiedDeps ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {packageManager === "oonkoo" && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Recommended:</span> The oonkoo CLI automatically handles dependencies and setup. No manual installation needed!
                </p>
              </div>
            )}

            {packageManager === "shadcn" && (
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Note:</span> Using shadcn CLI requires adding OonkooUI registry to your components.json. See the <a href="/components/cli" className="text-primary hover:underline">CLI documentation</a> for setup.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual" className="mt-4 space-y-4">
            {code ? (
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Copy the following code to{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                    components/oonkoo/{slug}.tsx
                  </code>
                </p>
                <CodeHighlighter
                  code={cleanedCode}
                  language="tsx"
                  filename={`${slug}.tsx`}
                  maxLines={25}
                  showLineNumbers={true}
                />
              </div>
            ) : (
              <div className="rounded-lg border bg-card p-8 text-center">
                <p className="text-muted-foreground">
                  Upgrade to Pro to access the source code.
                </p>
              </div>
            )}

            {dependencies.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Install required dependencies:
                </p>
                <div className="flex items-center gap-2 bg-muted rounded-lg border">
                  <code className="flex-1 px-4 py-3 font-mono text-sm">
                    npm install {dependencies.join(" ")}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(`npm install ${dependencies.join(" ")}`);
                      setCopiedDeps(true);
                      setTimeout(() => setCopiedDeps(false), 2000);
                    }}
                    className="mr-2 h-8 w-8"
                  >
                    {copiedDeps ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {registryDependencies && registryDependencies.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Required Components</h3>
          <p className="text-sm text-muted-foreground mb-2">
            This component requires the following OonkooUI components:
          </p>
          <div className="flex flex-wrap gap-2">
            {registryDependencies.map((dep) => (
              <a
                key={dep}
                href={`/components/${dep}`}
                className="inline-flex items-center px-3 py-1 rounded-md bg-muted hover:bg-muted/80 text-sm font-mono transition-colors"
              >
                {dep}
              </a>
            ))}
          </div>
        </div>
      )}

      {cssSetup && (
        <div>
          <h3 className="font-medium mb-3">Additional CSS Setup</h3>
          <p className="text-sm text-muted-foreground mb-3">
            This component requires additional CSS. Add the following to your <code className="bg-muted px-1.5 py-0.5 rounded text-xs">globals.css</code> file:
          </p>
          <CodeHighlighter
            code={cssSetup}
            language="css"
            filename="globals.css"
            maxLines={20}
            showLineNumbers={false}
          />
        </div>
      )}
    </div>
  );
}
