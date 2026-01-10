import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileQuestion,
  Plus,
  ExternalLink,
  MoreHorizontal,
  Trash2,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

import { getCurrentUser } from "@/lib/kinde";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CancelRequestButton } from "./cancel-request-button";

export const metadata = {
  title: "My Requests",
  description: "Track your component submissions",
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

async function getUserRequests(userId: string, status?: string) {
  const where: any = { requesterId: userId };

  if (status && status !== "all") {
    where.status = status.toUpperCase();
  }

  const [requests, statusCounts] = await Promise.all([
    prisma.componentRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        publishedComponent: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    }),
    prisma.componentRequest.groupBy({
      by: ["status"],
      where: { requesterId: userId },
      _count: true,
    }),
  ]);

  const counts = statusCounts.reduce((acc, item) => {
    acc[item.status] = item._count;
    return acc;
  }, {} as Record<string, number>);

  return { requests, counts };
}

const statusConfig: Record<string, { color: string; icon: typeof Clock; label: string; description: string }> = {
  PENDING: {
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    icon: Clock,
    label: "Pending",
    description: "Awaiting review",
  },
  IN_REVIEW: {
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: Eye,
    label: "In Review",
    description: "Being reviewed by our team",
  },
  TESTING: {
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    icon: AlertCircle,
    label: "Testing",
    description: "Testing in progress",
  },
  APPROVED: {
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: CheckCircle,
    label: "Approved",
    description: "Published to registry",
  },
  REJECTED: {
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    icon: XCircle,
    label: "Rejected",
    description: "See feedback below",
  },
  CANCELLED: {
    color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    icon: XCircle,
    label: "Cancelled",
    description: "Cancelled by you",
  },
};

export default async function MyRequestsPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const params = await searchParams;
  const currentStatus = params.status || "all";
  const { requests, counts } = await getUserRequests(user.id, currentStatus);

  const totalAll = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Requests</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of your component submissions
          </p>
        </div>
        <Button asChild>
          <Link href="/submit-component">
            <Plus className="h-4 w-4 mr-2" />
            Submit Component
          </Link>
        </Button>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue={currentStatus} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="all" asChild>
            <Link href="/my-requests?status=all">
              All ({totalAll})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="pending" asChild>
            <Link href="/my-requests?status=pending">
              Pending ({counts.PENDING || 0})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="in_review" asChild className="hidden lg:flex">
            <Link href="/my-requests?status=in_review">
              In Review ({counts.IN_REVIEW || 0})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="testing" asChild className="hidden lg:flex">
            <Link href="/my-requests?status=testing">
              Testing ({counts.TESTING || 0})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="approved" asChild>
            <Link href="/my-requests?status=approved">
              Approved ({counts.APPROVED || 0})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="rejected" asChild>
            <Link href="/my-requests?status=rejected">
              Rejected ({counts.REJECTED || 0})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="cancelled" asChild className="hidden lg:flex">
            <Link href="/my-requests?status=cancelled">
              Cancelled ({counts.CANCELLED || 0})
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Requests List */}
      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileQuestion className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No requests found</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-4">
              {totalAll === 0
                ? "You haven't submitted any components yet. Share your work with the community!"
                : `No ${currentStatus === "all" ? "" : currentStatus.replace("_", " ")} requests found.`}
            </p>
            {totalAll === 0 && (
              <Button asChild>
                <Link href="/submit-component">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Your First Component
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const status = statusConfig[request.status];
            const StatusIcon = status?.icon || Clock;

            return (
              <Card key={request.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {request.name}
                        <Badge className={status?.color} variant="outline">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status?.label}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Submitted {new Date(request.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {" · "}
                        <span className="capitalize">{request.type.toLowerCase()}</span>
                        {" · "}
                        <span className="capitalize">{request.category.toLowerCase().replace("_", " ")}</span>
                      </CardDescription>
                    </div>
                    {request.status === "PENDING" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <CancelRequestButton requestId={request.id} requestName={request.name} />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {request.description}
                  </p>

                  {/* Rejection Reason */}
                  {request.status === "REJECTED" && request.rejectionReason && (
                    <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 mb-4">
                      <p className="text-sm font-medium text-red-600 mb-1">Rejection Feedback:</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{request.rejectionReason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Rejected - Resubmit Button */}
                    {request.status === "REJECTED" && (
                      <Button variant="default" size="sm" asChild>
                        <Link href={`/my-requests/${request.id}/edit`}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Edit & Resubmit
                        </Link>
                      </Button>
                    )}

                    {/* Published Component Link */}
                    {request.status === "APPROVED" && request.publishedComponent && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/components/${request.publishedComponent.slug}`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Published
                        </Link>
                      </Button>
                    )}

                    {/* View Details Link */}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/my-requests/${request.id}`}>
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>

                  {/* Status Description */}
                  {!["APPROVED", "REJECTED", "CANCELLED"].includes(request.status) && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {status?.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent>
          <h3 className="font-semibold mb-2">How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 shrink-0">
                1
              </Badge>
              <div>
                <p className="font-medium text-foreground">Submit</p>
                <p>Your component enters the review queue</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 shrink-0">
                2
              </Badge>
              <div>
                <p className="font-medium text-foreground">Review</p>
                <p>Our team reviews code quality & security</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20 shrink-0">
                3
              </Badge>
              <div>
                <p className="font-medium text-foreground">Testing</p>
                <p>Component is tested in our playground</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 shrink-0">
                4
              </Badge>
              <div>
                <p className="font-medium text-foreground">Published</p>
                <p>Available in the component registry</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
