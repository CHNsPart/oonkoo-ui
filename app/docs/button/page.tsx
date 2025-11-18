"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/docs/component-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentControls } from "@/components/docs/component-controls";
import { CopyButton } from "@/components/docs/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ButtonDocs() {
  const [variant, setVariant] = React.useState("default");
  const [size, setSize] = React.useState("default");

  const buttonCode = `<Button variant="${variant}" size="${size}">
  Click me
</Button>`;

  const installCode = `npx shadcn@latest add "https://ui.oonkoo.com/r/button.json"`;

  const manualCode = `"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glow: "bg-primary text-primary-foreground shadow-lg shadow-primary/50 hover:shadow-primary/70 hover:shadow-xl",
        gradient: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg",
        shine: "relative bg-primary text-primary-foreground overflow-hidden",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };`;

  return (
    <div className="max-w-4xl space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Button</h1>
        <p className="text-lg text-muted-foreground">
          A beautifully animated button component with Framer Motion. Multiple
          variants and sizes with smooth spring animations.
        </p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>

        <Tabs defaultValue="cli" className="w-full">
          <TabsList>
            <TabsTrigger value="cli">CLI</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>

          <TabsContent value="cli" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Install the component via the shadcn CLI. This will add the
              component to your project with all dependencies.
            </p>
            <CodeBlock code={installCode} language="bash" />
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Copy and paste the component code into your project. Make sure you
              have the required dependencies installed.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium">Dependencies:</p>
              <CodeBlock
                code="npm install framer-motion class-variance-authority clsx tailwind-merge"
                language="bash"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  components/ui/button.tsx
                </p>
                <CopyButton text={manualCode} />
              </div>
              <CodeBlock code={manualCode} showLineNumbers />
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Interactive Preview */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Preview</h2>
        <ComponentPreview>
          <Button variant={variant as any} size={size as any}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)} Button
          </Button>
        </ComponentPreview>

        <ComponentControls
          controls={[
            {
              name: "variant",
              type: "select",
              options: [
                "default",
                "secondary",
                "destructive",
                "outline",
                "ghost",
                "link",
                "glow",
                "gradient",
                "shine",
              ],
              defaultValue: "default",
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "default", "lg", "xl"],
              defaultValue: "default",
            },
          ]}
          onControlChange={(name, value) => {
            if (name === "variant") setVariant(value);
            if (name === "size") setSize(value);
          }}
        />
      </section>

      {/* Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Examples</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Variants</h3>
          <ComponentPreview>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </ComponentPreview>
          <CodeBlock
            code={`<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Animated Variants</h3>
          <ComponentPreview className="bg-zinc-950">
            <div className="flex flex-wrap gap-4">
              <Button variant="glow">Glow Effect</Button>
              <Button variant="gradient">Gradient</Button>
              <Button variant="shine">Shine Effect</Button>
            </div>
          </ComponentPreview>
          <CodeBlock
            code={`<Button variant="glow">Glow Effect</Button>
<Button variant="gradient">Gradient</Button>
<Button variant="shine">Shine Effect</Button>`}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Sizes</h3>
          <ComponentPreview>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </ComponentPreview>
          <CodeBlock
            code={`<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>`}
          />
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <CodeBlock
          code={`import { Button } from "@/components/ui/button";

export default function MyComponent() {
  return (
    <div>
      <Button>Click me</Button>
      <Button variant="glow">Glowing Button</Button>
      <Button variant="gradient" size="lg">
        Large Gradient
      </Button>
    </div>
  );
}`}
        />
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Props</h2>
        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">Prop</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Default</th>
                <th className="text-left p-4 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-4 font-mono text-xs">variant</td>
                <td className="p-4 font-mono text-xs">
                  "default" | "destructive" | "outline" | "secondary" | "ghost"
                  | "link" | "glow" | "gradient" | "shine"
                </td>
                <td className="p-4">&quot;default&quot;</td>
                <td className="p-4">The visual style of the button</td>
              </tr>
              <tr className="border-t">
                <td className="p-4 font-mono text-xs">size</td>
                <td className="p-4 font-mono text-xs">
                  "default" | "sm" | "lg" | "xl" | "icon"
                </td>
                <td className="p-4">&quot;default&quot;</td>
                <td className="p-4">The size of the button</td>
              </tr>
              <tr className="border-t">
                <td className="p-4 font-mono text-xs">asChild</td>
                <td className="p-4 font-mono text-xs">boolean</td>
                <td className="p-4">false</td>
                <td className="p-4">
                  Render as a child component (for use with Link, etc.)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
