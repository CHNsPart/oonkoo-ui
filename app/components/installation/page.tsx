import Link from "next/link";
import { ArrowRight, Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/components/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Installation - OonkooUI",
  description: "How to install OonkooUI in your Next.js or React project.",
};

export default function InstallationPage() {
  return (
    <div className="py-8 px-6 lg:px-10 max-w-4xl">
      {/* Header */}
      <div className="space-y-4 mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Installation</h1>
        <p className="text-xl text-muted-foreground">
          Get started with OonkooUI in your Next.js or React project.
        </p>
      </div>

      {/* Framework Selection */}
      <Tabs defaultValue="nextjs" className="mb-10">
        <TabsList className="mb-6">
          <TabsTrigger value="nextjs">Next.js</TabsTrigger>
          <TabsTrigger value="react">React</TabsTrigger>
        </TabsList>

        {/* Next.js Installation */}
        <TabsContent value="nextjs" className="space-y-8">
          {/* Step 1 */}
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
              Create a new Next.js project
            </h2>
            <p className="text-muted-foreground mb-4">
              Run the following command to create a new Next.js project with Tailwind CSS:
            </p>
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                <span className="text-sm text-muted-foreground">Terminal</span>
                <CopyButton text="npx create-next-app@latest my-app --typescript --tailwind --eslint --app" variant="ghost" size="sm" />
              </div>
              <div className="bg-zinc-900 p-4 overflow-x-auto">
                <code className="text-sm font-mono text-zinc-300">
                  npx create-next-app@latest my-app --typescript --tailwind --eslint --app
                </code>
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
              Initialize OonkooUI
            </h2>
            <p className="text-muted-foreground mb-4">
              Navigate to your project and run the init command:
            </p>
            <div className="space-y-3">
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Terminal</span>
                  <CopyButton text="cd my-app" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">cd my-app</code>
                </div>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Terminal</span>
                  <CopyButton text="npx oonkoo init" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4">
                  <code className="text-sm font-mono text-primary">npx oonkoo init</code>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              This will create an <code className="bg-muted px-1.5 py-0.5 rounded text-xs">oonkoo.config.json</code> file and set up your project.
            </p>
          </section>

          {/* Step 3 */}
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
              Add components
            </h2>
            <p className="text-muted-foreground mb-4">
              Start adding components to your project:
            </p>
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                <span className="text-sm text-muted-foreground">Terminal</span>
                <CopyButton text="npx oonkoo add hero-gradient" variant="ghost" size="sm" />
              </div>
              <div className="bg-zinc-900 p-4">
                <code className="text-sm font-mono text-primary">npx oonkoo add hero-gradient</code>
              </div>
            </div>
          </section>
        </TabsContent>

        {/* React Installation */}
        <TabsContent value="react" className="space-y-8">
          {/* Step 1 */}
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
              Create a new React project
            </h2>
            <p className="text-muted-foreground mb-4">
              Create a new React project with Vite:
            </p>
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                <span className="text-sm text-muted-foreground">Terminal</span>
                <CopyButton text="npm create vite@latest my-app -- --template react-ts" variant="ghost" size="sm" />
              </div>
              <div className="bg-zinc-900 p-4 overflow-x-auto">
                <code className="text-sm font-mono text-zinc-300">
                  npm create vite@latest my-app -- --template react-ts
                </code>
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
              Install Tailwind CSS
            </h2>
            <p className="text-muted-foreground mb-4">
              Install and configure Tailwind CSS:
            </p>
            <div className="space-y-3">
              <div className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">Terminal</span>
                  <CopyButton text="cd my-app && npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p" variant="ghost" size="sm" />
                </div>
                <div className="bg-zinc-900 p-4 overflow-x-auto">
                  <code className="text-sm font-mono text-zinc-300">
                    cd my-app && npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
              Initialize OonkooUI
            </h2>
            <p className="text-muted-foreground mb-4">
              Run the init command:
            </p>
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                <span className="text-sm text-muted-foreground">Terminal</span>
                <CopyButton text="npx oonkoo init" variant="ghost" size="sm" />
              </div>
              <div className="bg-zinc-900 p-4">
                <code className="text-sm font-mono text-primary">npx oonkoo init</code>
              </div>
            </div>
          </section>

          {/* Step 4 */}
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
              Add components
            </h2>
            <p className="text-muted-foreground mb-4">
              Start adding components to your project:
            </p>
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                <span className="text-sm text-muted-foreground">Terminal</span>
                <CopyButton text="npx oonkoo add hero-gradient" variant="ghost" size="sm" />
              </div>
              <div className="bg-zinc-900 p-4">
                <code className="text-sm font-mono text-primary">npx oonkoo add hero-gradient</code>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>

      {/* What init does */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">What does init do?</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-muted-foreground">
            <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
            <span>Creates an <code className="bg-muted px-1.5 py-0.5 rounded text-xs">oonkoo.config.json</code> configuration file</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
            <span>Sets up the component directories</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
            <span>Detects your project configuration (aliases, paths)</span>
          </li>
        </ul>
      </section>

      {/* Next Steps */}
      <section className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
        <h2 className="text-xl font-bold mb-2">Next Steps</h2>
        <p className="text-muted-foreground mb-4">
          Learn about the CLI commands or start browsing components.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/components/cli">
              <Terminal className="mr-2 h-4 w-4" />
              CLI Reference
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/components/hero-gradient">
              Browse Components
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
