"use client";

import { Code2, Palette } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CodeVariantSelectorProps {
  language: "js" | "ts";
  styling: "css" | "tailwind";
  onLanguageChange: (language: "js" | "ts") => void;
  onStylingChange: (styling: "css" | "tailwind") => void;
  availableVariants?: {
    languages: Array<"js" | "ts">;
    stylings: Array<"css" | "tailwind">;
  };
}

export function CodeVariantSelector({
  language,
  styling,
  onLanguageChange,
  onStylingChange,
  availableVariants = {
    languages: ["js", "ts"],
    stylings: ["css", "tailwind"],
  },
}: CodeVariantSelectorProps) {
  const hasMultipleLanguages = availableVariants.languages.length > 1;
  const hasMultipleStylings = availableVariants.stylings.length > 1;

  // If only one option for each, don't show the selectors
  if (!hasMultipleLanguages && !hasMultipleStylings) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 mb-4">
      {hasMultipleLanguages && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Language:</label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-40 h-9">
              <Code2 className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableVariants.languages.includes("js") && (
                <SelectItem value="js">JavaScript</SelectItem>
              )}
              {availableVariants.languages.includes("ts") && (
                <SelectItem value="ts">TypeScript</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {hasMultipleStylings && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Styling:</label>
          <Select value={styling} onValueChange={onStylingChange}>
            <SelectTrigger className="w-40 h-9">
              <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableVariants.stylings.includes("tailwind") && (
                <SelectItem value="tailwind">Tailwind CSS</SelectItem>
              )}
              {availableVariants.stylings.includes("css") && (
                <SelectItem value="css">CSS Modules</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
