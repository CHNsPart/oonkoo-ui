"use client";

import { useState } from "react";
import { Copy, Check, Eye, Code2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveComponentPreview } from "./live-component-preview";
import { CodeHighlighter } from "./code-highlighter";
import { CodeVariantSelector } from "./code-variant-selector";
import { ComponentControls, type ControlConfig } from "./component-controls";
import Image from "next/image";

interface ComponentPreviewProps {
  name: string;
  slug: string;
  code: string;
  highlightedCode: string;
  isPro: boolean;
  previewImage?: string;
  controls?: ControlConfig[];
}

export function ComponentPreview({
  name,
  slug,
  code,
  highlightedCode,
  isPro,
  controls = [],
}: ComponentPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<"js" | "ts">("ts");
  const [styling, setStyling] = useState<"css" | "tailwind">("tailwind");
  const [controlValues, setControlValues] = useState<Record<string, any>>({});

  const handleCopy = async () => {
    if (isPro && !code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine file extension based on language
  const fileExtension = language === "ts" ? "tsx" : "jsx";

  return (
    <div className="space-y-4">
      <Tabs defaultValue="preview" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="preview" className="gap-1.5">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-1.5">
              <Code2 className="h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {controls && controls.length > 0 && (
              <ComponentControls
                controls={controls}
                onControlsChange={setControlValues}
              />
            )}
            {code && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy code
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="preview" className="mt-4">
          {/* Preview is visible to ALL users, even for Pro components */}
          <LiveComponentPreview
            slug={slug}
            name={name}
            controlValues={controlValues}
          />
        </TabsContent>

        <TabsContent value="code" className="mt-4">
          {code ? (
            <div className="space-y-4">
              <CodeVariantSelector
                language={language}
                styling={styling}
                onLanguageChange={setLanguage}
                onStylingChange={setStyling}
                availableVariants={{
                  languages: ["ts"], // Only TypeScript for now
                  stylings: ["tailwind"], // Only Tailwind for now
                }}
              />
              <CodeHighlighter
                code={code}
                language={fileExtension}
                filename={`${slug}.${fileExtension}`}
                maxLines={30}
                showLineNumbers={true}
              />
            </div>
          ) : (
            <div className="relative rounded-xl border border-[#252525] bg-[#0D0A0A] p-12 text-center">
              <Image
                src="/pro-plan-badge.svg"
                alt="Pro Badge"
                width={24}
                height={24}
                className="mx-auto size-12 mb-4 z-50 shadow-2xl shadow-amber-200/40 rounded-lg border-2"
              />
              <h3 className="text-xl font-semibold mb-2">Pro Component</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                This component requires an OonkooUI Pro subscription to view the source code.
              </p>
              <Button asChild>
                <a href="/pricing">Upgrade to Pro</a>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
