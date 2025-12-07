import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, Heart, Users, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "About",
  description: "Learn about OonkooUI and our mission",
};

const values = [
  {
    icon: <Code2 className="h-6 w-6" />,
    title: "Developer First",
    description:
      "We build tools that developers actually want to use. Clean code, great DX, and no unnecessary complexity.",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Quality Over Quantity",
    description:
      "Every component is carefully crafted and tested. We focus on getting things right rather than shipping fast.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community Driven",
    description:
      "Our marketplace empowers creators to share and monetize their work while helping others build faster.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Modern Standards",
    description:
      "Built with the latest technologies: React 18, TypeScript, Tailwind CSS, and Framer Motion.",
  },
];

const stats = [
  { value: "50+", label: "Components" },
  { value: "10k+", label: "Downloads" },
  { value: "500+", label: "Developers" },
  { value: "99%", label: "Satisfaction" },
];

export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="container">
        {/* Hero */}
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-4">
            About Us
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl max-w-3xl mx-auto">
            Building the future of UI components
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            OonkooUI is a modern React component library and marketplace,
            designed to help developers build beautiful applications faster.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                OonkooUI was born from a simple observation: developers spend too
                much time building the same UI components over and over again.
                We wanted to change that.
              </p>
              <p>
                Inspired by the success of shadcn/ui and the open-source
                community, we created a platform that combines high-quality
                components with a thriving marketplace where creators can share
                their work.
              </p>
              <p>
                Our goal is to make beautiful, accessible, and performant UI
                components available to every developer, whether they&apos;re building
                a side project or an enterprise application.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border flex items-center justify-center">
              <Image
                src="/oonkoo_logo.svg"
                alt="OonkooUI"
                width={200}
                height={200}
                className="w-1/2 h-auto"
              />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Values</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at OonkooUI.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {value.icon}
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-muted/50 rounded-2xl p-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Built With Modern Tech</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              We use the best tools to deliver the best experience.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Next.js",
              "React",
              "TypeScript",
              "Tailwind CSS",
              "Framer Motion",
              "Prisma",
              "PostgreSQL",
              "Stripe",
            ].map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm py-2 px-4">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-primary/10 via-background to-background rounded-2xl p-12 border">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of developers building with OonkooUI. Start for free
            and upgrade when you&apos;re ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/components">
                Browse Components
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
