"use client";

import { useState, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeHighlighterProps {
  code: string;
  language?: string;
  filename?: string;
  maxLines?: number;
  showLineNumbers?: boolean;
}

export function CodeHighlighter({
  code,
  language = "tsx",
  filename,
  maxLines = 25,
  showLineNumbers = true,
}: CodeHighlighterProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const lineCount = useMemo(() => code.split("\n").length, [code]);
  const shouldTruncate = lineCount > maxLines;
  const displayCode = expanded || !shouldTruncate ? code : code.split("\n").slice(0, maxLines).join("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/50">
        {filename && (
          <span className="text-sm font-medium text-zinc-400">
            {filename}
          </span>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 gap-1.5 text-zinc-400 hover:text-white"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Code Display */}
      <div className="relative">
        <div
          className="overflow-auto"
          style={{ maxHeight: expanded ? "none" : shouldTruncate ? `${maxLines * 1.5}rem` : "none" }}
        >
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            showLineNumbers={showLineNumbers}
            customStyle={{
              margin: 0,
              padding: "1rem",
              background: "#0d1117",
              fontSize: "0.875rem",
            }}
            lineNumberStyle={{
              minWidth: "3em",
              paddingRight: "1em",
              color: "#6e7681",
              userSelect: "none",
            }}
          >
            {displayCode}
          </SyntaxHighlighter>
        </div>

        {/* Gradient Overlay for Truncated Code */}
        {shouldTruncate && !expanded && (
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent, #0d1117 90%)",
            }}
          />
        )}
      </div>

      {/* Expand/Collapse Button */}
      {shouldTruncate && (
        <div className="border-t border-zinc-800 bg-zinc-900/30 px-4 py-2 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="gap-2 text-xs text-zinc-400 hover:text-white"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Expand snippet ({lineCount} lines)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
