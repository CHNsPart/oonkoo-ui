"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CliCommandProps {
  command: string;
  className?: string;
  showIcon?: boolean;
}

export function CliCommand({ command, className, showIcon = true }: CliCommandProps) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copyToClipboard}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 font-mono text-sm transition-colors hover:bg-muted/80",
        className
      )}
    >
      {showIcon && <Terminal className="h-4 w-4 text-muted-foreground" />}
      <span>{command}</span>
      <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded bg-background/50 text-muted-foreground transition-colors group-hover:text-foreground">
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </span>
    </button>
  );
}

interface CliInstallBlockProps {
  componentSlug?: string;
  className?: string;
}

export function CliInstallBlock({ componentSlug, className }: CliInstallBlockProps) {
  const command = componentSlug
    ? `npx oonkoo add ${componentSlug}`
    : "npx oonkoo init";

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs text-muted-foreground">
        {componentSlug ? "Install via CLI:" : "Get started:"}
      </p>
      <CliCommand command={command} />
    </div>
  );
}
