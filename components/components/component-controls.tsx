"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

export interface ControlConfig {
  name: string;
  label: string;
  type: "number" | "color" | "text" | "select" | "range";
  defaultValue: string | number;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

interface ComponentControlsProps {
  controls?: ControlConfig[];
  onControlsChange?: (values: Record<string, any>) => void;
}

export function ComponentControls({ controls = [], onControlsChange }: ComponentControlsProps) {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    controls.forEach((control) => {
      initial[control.name] = control.defaultValue;
    });
    return initial;
  });

  const handleChange = (name: string, value: any) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    onControlsChange?.(newValues);
  };

  if (!controls || controls.length === 0) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Controls
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Component Controls</SheetTitle>
          <SheetDescription>
            Adjust component properties
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 px-4 space-y-6">
          {controls.map((control) => (
            <div key={control.name} className="space-y-2">
              <Label htmlFor={control.name}>{control.label}</Label>

              {control.type === "range" && (
                <div className="space-y-2">
                  <Slider
                    id={control.name}
                    min={control.min ?? 0}
                    max={control.max ?? 100}
                    step={control.step ?? 1}
                    value={[values[control.name] as number]}
                    onValueChange={(val) => handleChange(control.name, val[0])}
                  />
                  <div className="text-sm text-muted-foreground text-right">
                    {values[control.name]}
                  </div>
                </div>
              )}

              {control.type === "color" && (
                <div className="flex gap-2">
                  <Input
                    id={control.name}
                    type="color"
                    value={values[control.name] as string}
                    onChange={(e) => handleChange(control.name, e.target.value)}
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={values[control.name] as string}
                    onChange={(e) => handleChange(control.name, e.target.value)}
                    className="flex-1 font-mono"
                  />
                </div>
              )}

              {control.type === "text" && (
                <Input
                  id={control.name}
                  type="text"
                  value={values[control.name] as string}
                  onChange={(e) => handleChange(control.name, e.target.value)}
                />
              )}

              {control.type === "number" && (
                <Input
                  id={control.name}
                  type="number"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={values[control.name] as number}
                  onChange={(e) => handleChange(control.name, Number(e.target.value))}
                />
              )}

              {control.type === "select" && control.options && (
                <select
                  id={control.name}
                  value={values[control.name] as string}
                  onChange={(e) => handleChange(control.name, e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  {control.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
