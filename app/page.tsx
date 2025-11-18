import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Sparkles, Copy } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 py-24">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-5xl w-full text-center space-y-8">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Built with Next.js, TailwindCSS & Framer Motion
          </div>

          <h1 className="text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl">
            Oonko<span className="text-primary">O</span> UI
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Awesome Tailwind CSS and Framer Motion components for your React
            project. Copy paste the most popular components from the web and use
            them in your project without having to worry about styling and
            animations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/docs">
              <Button variant="default" size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs/button">
              <Button variant="outline" size="lg" className="gap-2">
                <Code2 className="h-4 w-4" />
                View Components
              </Button>
            </Link>
          </div>

          {/* Installation Methods */}
          <div className="mt-16 grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="p-6 border rounded-lg bg-card text-left">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                CLI Installation
              </h3>
              <div className="bg-muted p-3 rounded font-mono text-sm">
                <p className="text-primary">
                  npx shadcn@latest add @oonkoo/button
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Install components directly via CLI with automatic setup
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-left">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Copy className="h-5 w-5 text-primary" />
                Copy & Paste
              </h3>
              <div className="bg-muted p-3 rounded font-mono text-sm">
                <p className="text-muted-foreground">
                  Browse • Copy • Paste • Done
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Manually copy component code and customize as needed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why OonkoO UI?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="p-6 border rounded-lg">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">
            Beautiful Components, Ready to Use
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Every component is built with Framer Motion for smooth animations and
            Tailwind CSS for easy customization
          </p>
          <Link href="/docs/button">
            <Button size="lg" variant="glow">
              Browse Components
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

const features = [
  {
    icon: Sparkles,
    title: "Framer Motion Animations",
    description:
      "Every component comes with smooth, performant animations powered by Framer Motion",
  },
  {
    icon: Code2,
    title: "Own Your Code",
    description:
      "Copy-paste or CLI install. The code lives in your project, fully customizable",
  },
  {
    icon: Copy,
    title: "No Package Dependencies",
    description:
      "No npm bloat. Just clean, well-written TypeScript components you can modify",
  },
];
