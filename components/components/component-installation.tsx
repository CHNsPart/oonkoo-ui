"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Terminal, FileCode } from "lucide-react";
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

  // Strip Preview code - only show the actual component
  const cleanedCode = useMemo(() => stripPreviewCode(code), [code]);

  const cliCommand = `npx oonkoo add ${slug}`;
  const depsCommand = dependencies.length > 0 ? `npm install ${dependencies.join(" ")}` : "";

  const handleCopyCli = async () => {
    await navigator.clipboard.writeText(cliCommand);
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
    await navigator.clipboard.writeText(depsCommand);
    setCopiedDeps(true);
    setTimeout(() => setCopiedDeps(false), 2000);
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
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Run the following command:
              </p>
              <div className="flex items-center gap-2 bg-muted rounded-lg border">
                <code className="flex-1 px-4 py-3 font-mono text-sm text-primary">
                  {cliCommand}
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

            {dependencies.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Install dependencies:
                </p>
                <div className="flex items-center gap-2 bg-muted rounded-lg border">
                  <code className="flex-1 px-4 py-3 font-mono text-sm">
                    {depsCommand}
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
                    {depsCommand}
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
