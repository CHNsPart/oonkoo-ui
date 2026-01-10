"use client";

import { useRef, useState } from "react";
import Editor, { OnMount, OnChange, BeforeMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Copy, Check, Maximize2, Minimize2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  showCopyButton?: boolean;
  showFullscreenButton?: boolean;
  className?: string;
  filename?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = "typescript",
  readOnly = false,
  height = "400px",
  minHeight,
  maxHeight,
  showCopyButton = true,
  showFullscreenButton = true,
  className,
  filename,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Disable all validation before Monaco loads
  const handleBeforeMount: BeforeMount = (monaco) => {
    // Disable TypeScript diagnostics (no red underlines for type errors)
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    // Also disable for JavaScript
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    // Set compiler options to be lenient with JSX
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
      skipLibCheck: true,
      allowSyntheticDefaultImports: true,
    });
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleChange: OnChange = (value) => {
    if (onChange && value !== undefined) {
      onChange(value);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const editorOptions = {
    readOnly,
    minimap: { enabled: !readOnly && value.split("\n").length > 50 },
    fontSize: 13,
    lineNumbers: "on" as const,
    scrollBeyondLastLine: false,
    wordWrap: "on" as const,
    automaticLayout: true,
    tabSize: 2,
    folding: true,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    padding: { top: 12, bottom: 12 },
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
    renderLineHighlight: readOnly ? "none" as const : "line" as const,
    cursorStyle: readOnly ? "line-thin" as const : "line" as const,
  };

  const containerStyles = isFullscreen
    ? "fixed inset-0 z-50 bg-background"
    : "";

  // Check if height is percentage-based (needs flex layout)
  const isFlexHeight = height === "100%" || height === "100vh";

  return (
    <div
      className={cn(
        "relative border overflow-hidden",
        isFlexHeight && "flex flex-col",
        containerStyles,
        className
      )}
      style={{
        minHeight: isFullscreen ? undefined : minHeight,
        maxHeight: isFullscreen ? undefined : maxHeight,
        height: isFullscreen ? "100vh" : typeof height === "number" ? `${height}px` : height,
      }}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50 shrink-0">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-xs font-mono text-muted-foreground">
              {filename}
            </span>
          )}
          {!filename && (
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {language}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {showCopyButton && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
          {showFullscreenButton && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className={cn(isFlexHeight && "flex-1 min-h-0")}>
        <Editor
          height={isFlexHeight ? "100%" : (isFullscreen ? "calc(100vh - 44px)" : (minHeight || maxHeight ? "100%" : height))}
          language={language === "tsx" ? "typescript" : language}
          value={value}
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          onChange={handleChange}
          beforeMount={handleBeforeMount}
          onMount={handleEditorMount}
          options={editorOptions}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground text-sm">Loading editor...</div>
            </div>
          }
        />
      </div>
    </div>
  );
}
