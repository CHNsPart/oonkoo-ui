import Link from "next/link";
import Image from "next/image";
import { Upload, Plus, ExternalLink, Eye, Download, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/kinde";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Components",
  description: "Manage your published components",
};

async function getUserComponents(userId: string) {
  const components = await prisma.component.findMany({
    where: {
      authorId: userId,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      tier: true,
      category: true,
      tags: true,
      previewImage: true,
      publishedAt: true,
      _count: {
        select: {
          upvotes: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  return components;
}

export default async function MyComponentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const components = await getUserComponents(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Components</h1>
          <p className="text-muted-foreground mt-1">
            Manage your published components
          </p>
        </div>
        <Button asChild>
          <Link href="/submit-component">
            <Plus className="h-4 w-4 mr-2" />
            Submit New
          </Link>
        </Button>
      </div>

      {components.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Components Yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-4">
              Components you submit and get approved will appear here. Start by submitting your first component!
            </p>
            <Button asChild>
              <Link href="/submit-component">
                <Plus className="h-4 w-4 mr-2" />
                Submit Component
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {components.map((component) => (
            <Card key={component.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Preview Image or Gradient */}
              <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-background relative">
                {component.previewImage && (
                  <Image
                    src={component.previewImage}
                    alt={component.name}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge
                    variant="secondary"
                    className={
                      component.tier === "COMMUNITY_FREE"
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        : component.tier === "COMMUNITY_PAID"
                        ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                        : ""
                    }
                  >
                    {component.tier === "COMMUNITY_FREE"
                      ? "Community"
                      : component.tier === "COMMUNITY_PAID"
                      ? "Paid"
                      : component.tier}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{component.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {component.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{component._count.upvotes} upvotes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {component.publishedAt
                          ? new Date(component.publishedAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {component.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {component.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {component.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{component.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/components/${component.slug}`}>
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
