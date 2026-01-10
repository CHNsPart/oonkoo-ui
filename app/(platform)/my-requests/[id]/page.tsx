import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Tag,
  Package,
  ExternalLink,
  ImageIcon,
  RefreshCw,
} from "lucide-react";

import { getCurrentUser } from "@/lib/kinde";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getRequest(id: string, userId: string) {
  const request = await prisma.componentRequest.findFirst({
    where: {
      id,
      requesterId: userId,
    },
    include: {
      publishedComponent: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
      files: {
        orderBy: { order: "asc" },
      },
    },
  });

  return request;
}

const statusConfig: Record<string, { color: string; bgColor: string; icon: typeof Clock; label: string }> = {
  PENDING: {
    color: "text-yellow-600",
    bgColor: "bg-yellow-500/10",
    icon: Clock,
    label: "Pending Review",
  },
  IN_REVIEW: {
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    icon: Eye,
    label: "In Review",
  },
  TESTING: {
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    icon: AlertCircle,
    label: "Testing",
  },
  APPROVED: {
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    icon: CheckCircle,
    label: "Approved",
  },
  REJECTED: {
    color: "text-red-600",
    bgColor: "bg-red-500/10",
    icon: XCircle,
    label: "Rejected",
  },
  CANCELLED: {
    color: "text-gray-600",
    bgColor: "bg-gray-500/10",
    icon: XCircle,
    label: "Cancelled",
  },
};

export default async function RequestDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/api/auth/login");
  }

  const { id } = await params;
  const request = await getRequest(id, user.id);

  if (!request) {
    notFound();
  }

  const status = statusConfig[request.status];
  const StatusIcon = status?.icon || Clock;

  return (
    <div className="space-y-6">
      {/* Back button & header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/my-requests">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{request.name}</h1>
            <Badge className={`${status?.bgColor} ${status?.color}`} variant="secondary">
              <StatusIcon className="h-3 w-3 mr-1" />
              {status?.label}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Submitted {new Date(request.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        {request.status === "REJECTED" && (
          <Button asChild>
            <Link href={`/my-requests/${request.id}/edit`}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Edit & Resubmit
            </Link>
          </Button>
        )}
      </div>

      {/* Rejection Reason Banner */}
      {request.status === "REJECTED" && request.rejectionReason && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Rejection Feedback
            </CardTitle>
            <CardDescription>
              Please address this feedback before resubmitting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {request.rejectionReason}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {request.description}
              </p>
            </CardContent>
          </Card>

          {/* Preview Section */}
          {request.publishedComponent ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Component Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/50 overflow-hidden">
                  <iframe
                    src={`/preview/${request.publishedComponent.slug}`}
                    className="w-full h-[400px] border-0"
                    title={`Preview of ${request.name}`}
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/components/${request.publishedComponent.slug}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Full Page
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/preview/${request.publishedComponent.slug}`} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Preview
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : request.previewImage ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Preview Screenshot
                </CardTitle>
                <CardDescription>
                  Preview will be available once your component is published
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                  <Image
                    src={request.previewImage}
                    alt={`Preview of ${request.name}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Preview will be available once your component is reviewed and published.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Published Component Link */}
          {request.publishedComponent && (
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Published
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Your component has been published to the registry!
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/components/${request.publishedComponent.slug}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Component
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {request.type.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {request.category.toLowerCase().replace("_", " ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tier</p>
                  <Badge variant="outline" className="mt-1">
                    {request.tier === "COMMUNITY_PAID" ? "Community Paid" : "Community Free"}
                  </Badge>
                </div>
              </div>

              {request.tier === "COMMUNITY_PAID" && request.price && (
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">$</span>
                  <div>
                    <p className="text-sm font-medium">Price</p>
                    <p className="text-sm text-muted-foreground">
                      ${Number(request.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {request.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {request.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(request.dependencies) && request.dependencies.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Dependencies</p>
                  <div className="flex flex-wrap gap-1">
                    {(request.dependencies as string[]).map((dep) => (
                      <Badge key={dep} variant="outline" className="text-xs font-mono">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Submitted</p>
                  <p className="text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {request.reviewedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-muted-foreground">
                      {new Date(request.reviewedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
