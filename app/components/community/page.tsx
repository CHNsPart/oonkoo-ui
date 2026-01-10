import Link from "next/link";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import {
  Users,
  ArrowRight,
  Store,
  Sparkles,
  TrendingUp,
  Plus,
  ExternalLink,
  Download,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/kinde";
import { CommunityComponentCard } from "./community-component-card";

export const metadata = {
  title: "Community Components | OonkooUI",
  description: "Browse free components created by the OonkooUI community developers.",
};

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getCommunityComponents() {
  const components = await prisma.component.findMany({
    where: {
      status: "PUBLISHED",
      tier: {
        in: ["COMMUNITY_FREE", "COMMUNITY_PAID"],
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          upvotes: true,
        },
      },
    },
    orderBy: [
      { upvoteCount: "desc" },
      { downloads: "desc" },
    ],
  });

  return components;
}

async function getTopContributors() {
  const contributors = await prisma.user.findMany({
    where: {
      components: {
        some: {
          status: "PUBLISHED",
          tier: {
            in: ["COMMUNITY_FREE", "COMMUNITY_PAID"],
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      avatar: true,
      subscription: {
        select: {
          status: true,
        },
      },
      _count: {
        select: {
          components: {
            where: {
              status: "PUBLISHED",
              tier: {
                in: ["COMMUNITY_FREE", "COMMUNITY_PAID"],
              },
            },
          },
        },
      },
    },
    orderBy: {
      components: {
        _count: "desc",
      },
    },
    take: 6,
  });

  return contributors;
}

export default async function CommunityPage() {
  noStore();

  const user = await getCurrentUser();
  const components = await getCommunityComponents();
  const contributors = await getTopContributors();

  // Get user's upvoted component slugs
  let upvotedSlugs: string[] = [];
  if (user) {
    const upvotes = await prisma.upvote.findMany({
      where: { userId: user.id },
      include: { component: { select: { slug: true } } },
    });
    upvotedSlugs = upvotes.map((u) => u.component.slug);
  }

  const totalDownloads = components.reduce((acc, c) => acc + c.downloads, 0);
  const totalUpvotes = components.reduce((acc, c) => acc + c._count.upvotes, 0);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="space-y-4 mb-10">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Users className="h-3 w-3" />
          Community Components
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">
          Built by the{" "}
          <span className="bg-gradient-to-r from-blue-500 to-primary bg-clip-text text-transparent">
            Community
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Discover free components created by developers like you. Open source, copy-paste ready,
          and built with the same quality standards as official components.
        </p>

        <div className="flex flex-wrap gap-3 pt-4">
          <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600">
            <Link href="/submit-component">
              <Plus className="mr-2 h-4 w-4" />
              Submit Component
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/components/marketplace">
              <Store className="mr-2 h-4 w-4" />
              Marketplace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats - Minimal inline */}
      <div className="flex flex-wrap items-center gap-6 mb-10 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-500">{components.length}</span>
          <span className="text-muted-foreground">Components</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-purple-500">{contributors.length}</span>
          <span className="text-muted-foreground">Contributors</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-muted-foreground" />
          <span className="text-2xl font-bold text-primary">{totalDownloads.toLocaleString()}</span>
          <span className="text-muted-foreground">Downloads</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-muted-foreground" />
          <span className="text-2xl font-bold text-pink-500">{totalUpvotes.toLocaleString()}</span>
          <span className="text-muted-foreground">Upvotes</span>
        </div>
      </div>

      {/* Top Contributors */}
      {contributors.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Top Contributors</h2>
              <p className="text-sm text-muted-foreground">
                Developers making OonkooUI better
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {contributors.map((contributor) => {
              const isPro = contributor.subscription?.status === "ACTIVE";
              return (
                <Link
                  key={contributor.id}
                  href={`/profile/${contributor.id}`}
                  className="group"
                >
                  <div className="flex items-center gap-3 rounded-full border bg-card px-4 py-2 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={contributor.avatar || `https://avatar.vercel.sh/${contributor.id}`}
                        alt={contributor.name || "Contributor"}
                      />
                      <AvatarFallback className="text-xs">
                        {contributor.name?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium group-hover:text-blue-500 transition-colors">
                        {contributor.name || "Anonymous"}
                      </span>
                      <Image
                        src={isPro ? "/pro-plan-badge.svg" : "/free-plan-badge.svg"}
                        alt={isPro ? "Pro" : "Free"}
                        width={16}
                        height={16}
                        className="rounded-sm"
                      />
                      <Badge variant="secondary" className="text-[10px] bg-muted">
                        {contributor._count.components}
                      </Badge>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Components Grid */}
      {components.length > 0 ? (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">All Community Components</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Free and open source, built by the community
              </p>
            </div>
            <Badge variant="outline" className="gap-1.5">
              <TrendingUp className="h-3 w-3" />
              Sorted by popularity
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {components.map((component, index) => (
              <CommunityComponentCard
                key={component.slug}
                slug={component.slug}
                name={component.name}
                description={component.description}
                tier={component.tier}
                downloads={component.downloads}
                upvotes={component._count.upvotes}
                previewImage={component.previewImage}
                author={{
                  id: component.author.id,
                  name: component.author.name,
                  avatar: component.author.avatar,
                }}
                rank={index}
                isUpvoted={upvotedSlugs.includes(component.slug)}
                isAuthenticated={!!user}
              />
            ))}
          </div>
        </section>
      ) : (
        /* Empty State */
        <section className="mb-10">
          <div className="rounded-2xl border-2 border-dashed bg-muted/20 p-12 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 mb-6">
              <Sparkles className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Be the First!</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              No community components yet. Be the first to contribute and share your
              creations with the OonkooUI community!
            </p>
            <Button asChild className="bg-blue-500 hover:bg-blue-600">
              <Link href="/submit-component">
                <Plus className="mr-2 h-4 w-4" />
                Submit Your Component
              </Link>
            </Button>
          </div>
        </section>
      )}

{/* Subtle Footer Banner */}
      <section className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg">
        {/* GIF Background Layer */}
        <div className="absolute inset-0">
          <Image
            src="/clips.gif"
            alt=""
            fill
            className="object-cover bg-right scale-125 opacity-90"
            unoptimized
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 dark:from-black/30 via-transparent to-black/70" />

        {/* Footer Content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3 text-sm">
            <Image
              src="/oonkoo_logo.svg"
              alt="OonkooUI"
              width={36}
              height={36}
            />
            <span className="text-background dark:text-foreground">
              Part of{" "}
              <Link
                href="https://oonkoo.com"
                target="_blank"
                className="text-foreground dark:text-primary font-medium hover:text-foreground/60 dark:hover:text-primary/60 transition-colors"
              >
                oonkoo.com
              </Link>
              {" "}– Software Agency
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="bg-blue-500 hover:bg-blue-600">
              <Link href="/submit-component">
                <Plus className="mr-1.5 h-3 w-3" />
                Submit Component
              </Link>
            </Button>

            <Button asChild size="sm" className="hover:bg-card dark:hover:bg-background text-background dark:text-foreground" variant="ghost">
              <Link href="/docs" target="_blank">
                Read Docs
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
