import Link from "next/link";
import { Clock, CheckCircle, XCircle, Eye } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getPendingReviews() {
  return prisma.component.findMany({
    where: { status: "PENDING_REVIEW" },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
}

export default async function ReviewQueuePage() {
  const pendingComponents = await getPendingReviews();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Review Queue</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve community-submitted components
        </p>
      </div>

      {pendingComponents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              There are no components waiting for review. Check back later when
              community members submit new components.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingComponents.map((component) => (
            <Card key={component.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {component.name}
                      <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending Review
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {component.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Submitted by:</span>{" "}
                      {component.author.name || component.author.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(component.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/components/${component.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Link>
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="destructive" size="sm">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">About the Review Queue</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This queue shows community-submitted components that need approval
            before being published to the registry. Review each submission for:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Code quality and best practices</li>
            <li>Security vulnerabilities</li>
            <li>Proper documentation and description</li>
            <li>Appropriate categorization and tags</li>
            <li>Original content (no plagiarism)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
