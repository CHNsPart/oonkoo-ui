"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Control {
  name: string;
  type: "select" | "radio" | "checkbox";
  options?: string[];
  defaultValue?: string | boolean;
}

interface ComponentControlsProps {
  controls: Control[];
  onControlChange: (name: string, value: any) => void;
  className?: string;
}

export function ComponentControls({
  controls,
  onControlChange,
  className,
}: ComponentControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "sticky bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex flex-wrap gap-4">
        {controls.map((control) => (
          <div key={control.name} className="flex flex-col gap-2">
            <label className="text-sm font-medium capitalize">
              {control.name}
            </label>
            {control.type === "select" && (
              <select
                className="rounded-md border bg-background px-3 py-1.5 text-sm"
                defaultValue={control.defaultValue as string}
                onChange={(e) => onControlChange(control.name, e.target.value)}
              >
                {control.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {control.type === "radio" && (
              <div className="flex gap-2">
                {control.options?.map((option) => (
                  <label key={option} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={control.name}
                      value={option}
                      defaultChecked={option === control.defaultValue}
                      onChange={(e) =>
                        onControlChange(control.name, e.target.value)
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
