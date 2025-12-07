import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Blocks, Code2, Sparkles, Zap, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CliCommand } from "@/components/cli-command";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Now in Public Beta
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Beautiful React Components for{" "}
              <span className="text-primary">Modern Apps</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              A curated collection of stunning UI components built with React,
              Tailwind CSS, and Framer Motion. Free and premium components
              compatible with shadcn/ui.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/components">
                  Browse Components
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">
                  <Code2 className="mr-2 h-4 w-4" />
                  View Documentation
                </Link>
              </Button>
            </div>

            {/* CLI Command */}
            <div className="mt-8 flex justify-center">
              <CliCommand command="npx oonkoo init" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose OonkooUI?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for developers who want beautiful, production-ready
              components without the hassle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Blocks className="h-6 w-6" />}
              title="50+ Components"
              description="A growing library of free and premium components for every use case."
            />
            <FeatureCard
              icon={<Code2 className="h-6 w-6" />}
              title="Copy & Paste"
              description="No package to install. Just copy the code and customize it to your needs."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="CLI Support"
              description="Use our CLI to add components directly to your project with one command."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Framer Motion"
              description="Smooth animations and transitions powered by Framer Motion."
            />
          </div>
        </div>
      </section>

      {/* CLI Section */}
      <section className="py-20 border-t">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <Terminal className="mr-1 h-3 w-3" />
                Now on npm
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Install components with one command
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Use our CLI to add components directly to your project.
                No manual copy-pasting required.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 md:p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">1.</span>
                  Initialize OonkooUI in your project
                </div>
                <CliCommand command="npx oonkoo init" className="w-full justify-start" />

                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
                  <span className="font-medium text-foreground">2.</span>
                  Add any component you need
                </div>
                <CliCommand command="npx oonkoo add hero-gradient" className="w-full justify-start" />

                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
                  <span className="font-medium text-foreground">3.</span>
                  Browse all available components
                </div>
                <CliCommand command="npx oonkoo list" className="w-full justify-start" />
              </div>

              <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Pro tip: Authenticate with <code className="text-primary">npx oonkoo auth</code> to access premium components.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="https://www.npmjs.com/package/oonkoo" target="_blank" rel="noopener">
                    View on npm
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to build something amazing?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started with our free components or unlock premium features
              with OonkooUI Pro.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
