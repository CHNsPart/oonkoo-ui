import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Blocks, Code2, Sparkles, Zap, Terminal, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CliCommand } from "@/components/cli-command";
import LiquidEther from "@/components/ui/LiquidEther";
import FlowingMenu from "@/components/ui/FlowingMenu";
import { BorderBeam } from "@/components/ui/BorderBeam";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 min-h-[600px]">
        {/* Liquid Ether Background - Light Mode */}
        <div className="absolute inset-0 -z-10 dark:hidden" style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <LiquidEther
            colors={['#3CB371', '#60D394', '#2ECC71']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            dt={0.014}
            BFECC={true}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        {/* Liquid Ether Background - Dark Mode */}
        <div className="absolute inset-0 -z-10 hidden dark:block" style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <LiquidEther
            colors={['#4ADE80', '#34D399', '#10B981']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            dt={0.014}
            BFECC={true}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        {/* Subtle gradient overlay for text readability */}
        <div className="absolute inset-0 -z-[5] bg-gradient-to-b from-background/30 via-background/60 to-background" />

        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="relative inline-block mb-4">
              <Badge variant="secondary" className="relative overflow-hidden">
                <Image src="/free-plan-badge.svg" alt="OonkooUI" width={14} height={14} className="mr-1.5" />
                v1.1.2 • Available on npm
                <BorderBeam
                  size={80}
                  initialOffset={10}
                  duration={8}
                  borderWidth={1.5}
                  className="from-transparent via-primary to-transparent"
                />
              </Badge>
            </div>

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
                <Link href="/components/installation">
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

      {/* Features Section - Full Width FlowingMenu */}
      <section className="border-t">
        <div className="container py-16">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Premium Quality
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Production-Grade Components
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Built with industry-leading animation libraries and 3D engines. Ship stunning,
              performant interfaces that compete with top-tier agencies.
            </p>
          </div>
        </div>

        {/* Full Width Interactive FlowingMenu */}
        <div className="w-full overflow-hidden border-y" style={{ height: '500px' }}>
          <FlowingMenu
            items={[
              {
                link: "/components",
                text: "Three.js 3D Components",
                image: "/oonkoo-ui-icon.svg"
              },
              {
                link: "/components",
                text: "GSAP Powered Animations",
                image: "/oonkoo-ui-icon.svg"
              },
              {
                link: "/components",
                text: "Framer Motion Interactions",
                image: "/oonkoo-ui-icon.svg"
              },
              {
                link: "/components",
                text: "Ready-to-Ship Sections",
                image: "/oonkoo-ui-icon.svg"
              }
            ]}
          />
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
  iconDark,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconDark?: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
        {iconDark}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
