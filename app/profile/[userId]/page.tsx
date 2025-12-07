import { notFound } from "next/navigation";
import Link from "next/link";
import { Github, Twitter, Globe, Calendar, Blocks, Heart } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PublicProfilePageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: PublicProfilePageProps) {
  const { userId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, bio: true },
  });

  if (!user) {
    return { title: "User Not Found" };
  }

  return {
    title: user.name ?? "User Profile",
    description: user.bio ?? `View ${user.name}'s profile on OonkooUI`,
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
      githubUrl: true,
      twitterUrl: true,
      websiteUrl: true,
      techStack: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          components: { where: { status: "PUBLISHED" } },
          upvotes: true,
        },
      },
    },
  });

  if (!user || !user.name) {
    notFound();
  }

  const isPro = user.role === "CONTRIBUTOR" || user.role === "SELLER" || user.role === "ADMIN";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={user.avatar ?? undefined} />
              <AvatarFallback className="text-3xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  {isPro && <Badge>Pro</Badge>}
                </div>
                {user.bio && (
                  <p className="mt-2 text-muted-foreground">{user.bio}</p>
                )}
              </div>

              {/* Tech Stack */}
              {user.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {user.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Social Links */}
              <div className="flex gap-3">
                {user.githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={user.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {user.twitterUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={user.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </a>
                  </Button>
                )}
                {user.websiteUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={user.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>

              {/* Join Date */}
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Blocks className="h-4 w-4" />
                  Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{user._count.components}</p>
                <p className="text-xs text-muted-foreground">Published</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Upvotes Given
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{user._count.upvotes}</p>
                <p className="text-xs text-muted-foreground">Components liked</p>
              </CardContent>
            </Card>
          </div>

          {/* Components Section Placeholder */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Published Components</h2>
            {user._count.components === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Blocks className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No published components yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <p className="text-muted-foreground">
                Component list coming soon...
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
