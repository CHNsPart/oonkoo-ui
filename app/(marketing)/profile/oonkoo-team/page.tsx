import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Globe, Blocks, Heart, Sparkles, ArrowUpRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedVerifiedBadge } from "@/components/ui/animated-verified-badge";

export const metadata = {
  title: "OonkooUI Team",
  description: "The official OonkooUI team - creators of premium UI components for modern web applications.",
};

export default async function OonkooTeamProfilePage() {
  // Get stats for official components (FREE and PRO tier)
  const [componentStats, totalUpvotes, totalDownloads] = await Promise.all([
    prisma.component.count({
      where: {
        tier: { in: ["FREE", "PRO"] },
        status: "PUBLISHED",
      },
    }),
    prisma.upvote.count({
      where: {
        component: {
          tier: { in: ["FREE", "PRO"] },
          status: "PUBLISHED",
        },
      },
    }),
    prisma.component.aggregate({
      where: {
        tier: { in: ["FREE", "PRO"] },
        status: "PUBLISHED",
      },
      _sum: {
        downloads: true,
      },
    }),
  ]);

  // Get official components
  const officialComponents = await prisma.component.findMany({
    where: {
      tier: { in: ["FREE", "PRO"] },
      status: "PUBLISHED",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      tier: true,
      category: true,
      downloads: true,
      _count: {
        select: { upvotes: true },
      },
    },
    orderBy: { downloads: "desc" },
    take: 12,
  });

  const tierColors: Record<string, string> = {
    FREE: "bg-green-500/10 text-green-600 border-green-500/20",
    PRO: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Picture with Green Gradient Border */}
          <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full bg-gradient-to-br from-[#3CB371] to-[#2D8B56] p-1 shadow-lg shadow-[#3CB371]/20">
            <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
              <Image
                src="/oonkoo-ui-icon.svg"
                alt="OonkooUI"
                width={80}
                height={80}
                className="h-16 w-16 md:h-20 md:w-20 dark:hidden"
              />
              <Image
                src="/oonkoo-ui-icon-darkmode.svg"
                alt="OonkooUI"
                width={80}
                height={80}
                className="h-16 w-16 md:h-20 md:w-20 hidden dark:block"
              />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">OonkooUI Team</h1>
                <div className="flex items-center gap-2">
                  <Image
                    src="/pro-plan-badge.svg"
                    alt="Pro"
                    width={28}
                    height={28}
                    className="h-7 w-7"
                  />
                  <AnimatedVerifiedBadge />
                </div>
              </div>
              <p className="mt-2 text-muted-foreground">
                The official OonkooUI team - creators of premium, production-ready UI components
                for modern web applications. We build beautiful, accessible, and performant
                components that integrate seamlessly with shadcn/ui and the React ecosystem.
              </p>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2">
              {["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js", "GSAP"].map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-3 flex-wrap">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/oonkoo-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://twitter.com/oonkoo_ui"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://ui.oonkoo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Website
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Blocks className="h-4 w-4" />
                Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{componentStats}</p>
              <p className="text-xs text-muted-foreground">Official components</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Upvotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalUpvotes}</p>
              <p className="text-xs text-muted-foreground">Community love</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {(totalDownloads._sum.downloads ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total installs</p>
            </CardContent>
          </Card>
        </div>

        {/* Components Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Official Components</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/components?tier=official">
                View All
              </Link>
            </Button>
          </div>

          {officialComponents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Blocks className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Official components coming soon...
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {officialComponents.map((component) => (
                <Link key={component.id} href={`/components/${component.slug}`}>
                  <Card className="h-full hover:border-[#3CB371]/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">{component.name}</h3>
                            <Badge className={tierColors[component.tier]} variant="outline">
                              {component.tier}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {component.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {component._count.upvotes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          {component.downloads.toLocaleString()} downloads
                        </span>
                        <span className="capitalize">
                          {component.category.toLowerCase().replace("_", " ")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* OonkoO Agency Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-[#3CB371]/20 bg-gradient-to-br from-[#3CB371]/5 via-background to-[#3CB371]/10 dark:from-[#3CB371]/10 dark:via-background dark:to-[#3CB371]/5">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3CB371]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#3CB371]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
              {/* Content */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#3CB371] uppercase tracking-wider">
                    Powered by
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Image
                    src="/oonkoo_logo.svg"
                    alt="OonkoO"
                    width={160}
                    height={48}
                    className="h-10 w-auto dark:invert"
                  />
                </div>

                <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                  OonkooUI is brought to you by{" "}
                  <span className="text-foreground font-medium">OonkoO</span> - a digital innovation
                  agency with 6+ years of experience delivering digital excellence through creativity
                  and technical mastery.
                </p>

                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#3CB371]" />
                    <span>6+ Years Experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#3CB371]" />
                    <span>25+ Team Members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#3CB371]" />
                    <span>65+ Projects Delivered</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="shrink-0">
                <Button
                  size="lg"
                  className="bg-[#3CB371] hover:bg-[#2D8B56] text-white shadow-lg shadow-[#3CB371]/25 group"
                  asChild
                >
                  <a
                    href="https://oonkoo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit OonkoO
                    <ArrowUpRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
