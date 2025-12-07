"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface GradientButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GradientButton({ children, className, onClick }: GradientButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white",
        "bg-linear-to-r from-black to-green-500",
        "hover:shadow-lg hover:shadow-purple-500/25 transition-shadow",
        className
      )}
    >
      <Sparkles className="h-4 w-4" />
      {children}
    </motion.button>
  );
}

// Preview wrapper for the playground
export default function Preview() {
  return (
    <div className="min-h-[400px] w-full flex items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center gap-4">
        <GradientButton>Get Started Now</GradientButton>
        <GradientButton className="from-yellow-500 to-green-500">
          Learn Few More
        </GradientButton>
      </div>
    </div>
  );
}
