"use client";

import { useState, ComponentProps } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CopyButtonProps extends Omit<ComponentProps<typeof Button>, "onClick"> {
  text: string;
  successMessage?: string;
}

export function CopyButton({
  text,
  successMessage = "Copied to clipboard",
  children,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(successMessage);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button onClick={copy} {...props}>
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        children || <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
