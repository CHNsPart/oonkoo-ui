"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ControlDefinition } from "@/lib/component-config";

// =============================================================================
// TYPES
// =============================================================================

interface AutoControlsProps {
  controls: ControlDefinition[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  className?: string;
}

// =============================================================================
// INDIVIDUAL CONTROL COMPONENTS
// =============================================================================

interface ControlProps {
  control: ControlDefinition;
  value: any;
  onChange: (value: any) => void;
}

function SliderControl({ control, value, onChange }: ControlProps) {
  const numValue = typeof value === "number" ? value : control.min || 0;

  return (
    <div className="space-y-2">
      <Label htmlFor={control.name} className="text-xs">
        {control.label}
      </Label>
      <Slider
        id={control.name}
        min={control.min || 0}
        max={control.max || 100}
        step={control.step || 1}
        value={[numValue]}
        onValueChange={(val) => onChange(val[0])}
      />
      <div className="text-xs text-muted-foreground text-right">
        {typeof numValue === "number" && numValue % 1 !== 0 ? numValue.toFixed(2) : numValue}
      </div>
    </div>
  );
}

function ColorControl({ control, value, onChange }: ControlProps) {
  const strValue = typeof value === "string" ? value : "#000000";

  return (
    <div className="space-y-2">
      <Label htmlFor={control.name} className="text-xs">
        {control.label}
      </Label>
      <div className="flex gap-2">
        <Input
          id={control.name}
          type="color"
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 p-1 cursor-pointer"
        />
        <Input
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-8 text-xs font-mono"
        />
      </div>
    </div>
  );
}

function TextControl({ control, value, onChange }: ControlProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={control.name} className="text-xs">
        {control.label}
      </Label>
      <Input
        id={control.name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={control.label}
        className="h-8 text-xs"
      />
    </div>
  );
}

function CheckboxControl({ control, value, onChange }: ControlProps) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={control.name} className="text-xs">
        {control.label}
      </Label>
      <input
        id={control.name}
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
    </div>
  );
}

function SelectControl({ control, value, onChange }: ControlProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={control.name} className="text-xs">
        {control.label}
      </Label>
      <select
        id={control.name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 px-3 rounded-md border border-input bg-background text-xs"
      >
        {control.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// =============================================================================
// MAIN AUTO CONTROLS COMPONENT
// =============================================================================

export function AutoControls({ controls, values, onChange, className }: AutoControlsProps) {
  const handleChange = (name: string, value: any) => {
    onChange({ ...values, [name]: value });
  };

  if (!controls || controls.length === 0) {
    return (
      <div className={cn("text-xs text-muted-foreground", className)}>
        No controls available for this component.
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {controls.map((control) => {
        const value = values[control.name] ?? control.defaultValue;
        const controlProps = {
          control,
          value,
          onChange: (v: any) => handleChange(control.name, v),
        };

        switch (control.type) {
          case "slider":
            return <SliderControl key={control.name} {...controlProps} />;
          case "color":
            return <ColorControl key={control.name} {...controlProps} />;
          case "text":
            return <TextControl key={control.name} {...controlProps} />;
          case "checkbox":
            return <CheckboxControl key={control.name} {...controlProps} />;
          case "select":
            return <SelectControl key={control.name} {...controlProps} />;
          default:
            return <TextControl key={control.name} {...controlProps} />;
        }
      })}
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export { SliderControl, ColorControl, TextControl, CheckboxControl, SelectControl };
