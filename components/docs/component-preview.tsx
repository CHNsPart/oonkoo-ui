"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface ComponentPreviewProps {
  children: React.ReactNode;
  className?: string;
}

export function ComponentPreview({
  children,
  className,
}: ComponentPreviewProps) {
  return (
    <div className="relative my-4 flex min-h-[350px] w-full items-center justify-center rounded-lg border bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
