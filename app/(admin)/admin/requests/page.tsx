import Link from "next/link";
import {
  Clock,
  Eye,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileQuestion,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

async function getRequests(status?: string, page: number = 1) {
  const where: any = {};

  if (status && status !== "all") {
    where.status = status.toUpperCase();
  }

  const pageSize = 20;

  const [requests, total, statusCounts] = await Promise.all([
    prisma.componentRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.componentRequest.count({ where }),
    // Get counts for each status
    prisma.componentRequest.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const counts = statusCounts.reduce((acc, item) => {
    acc[item.status] = item._count;
    return acc;
  }, {} as Record<string, number>);

  return {
    requests,
    total,
    counts,
    hasMore: page * pageSize < total,
  };
}

const statusConfig: Record<string, { color: string; icon: typeof Clock; label: string }> = {
  PENDING: {
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    icon: Clock,
    label: "Pending",
  },
  IN_REVIEW: {
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: Eye,
    label: "In Review",
  },
  TESTING: {
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    icon: AlertCircle,
    label: "Testing",
  },
  APPROVED: {
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: CheckCircle,
    label: "Approved",
  },
  REJECTED: {
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    icon: XCircle,
    label: "Rejected",
  },
  CANCELLED: {
    color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    icon: XCircle,
    label: "Cancelled",
  },
};

const tierColors: Record<string, string> = {
  COMMUNITY_FREE: "bg-blue-500/10 text-blue-600",
  COMMUNITY_PAID: "bg-amber-500/10 text-amber-600",
};

export default async function AdminRequestsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentStatus = params.status || "all";
  const currentPage = parseInt(params.page || "1");

  const { requests, total, counts, hasMore } = await getRequests(currentStatus, currentPage);

  const totalAll = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Component Requests</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage user-submitted component requests
        </p>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue={currentStatus} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all" asChild>
            <Link href="/admin/requests?status=all">
              All ({totalAll})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="pending" asChild>
            <Link href="/admin/requests?status=pending">
              Pending ({counts.PENDING || 0})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="in_review" asChild>
            <Link href="/admin/requests?status=in_review">
              In Review ({counts.IN_REVIEW || 0})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="testing" asChild>
            <Link href="/admin/requests?status=testing">
              Testing ({counts.TESTING || 0})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="approved" asChild>
            <Link href="/admin/requests?status=approved">
              Approved ({counts.APPROVED || 0})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="rejected" asChild>
            <Link href="/admin/requests?status=rejected">
              Rejected ({counts.REJECTED || 0})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="cancelled" asChild>
            <Link href="/admin/requests?status=cancelled">
              Cancelled ({counts.CANCELLED || 0})
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Requests Table */}
      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileQuestion className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No requests found</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              {currentStatus === "pending"
                ? "There are no pending requests to review. Check back later!"
                : `No ${currentStatus === "all" ? "" : currentStatus.replace("_", " ")} requests found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => {
                const status = statusConfig[request.status];
                const StatusIcon = status?.icon || Clock;

                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <Link
                          href={`/admin/requests/${request.id}`}
                          className="font-medium hover:underline"
                        >
                          {request.name}
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {request.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={request.requester.avatar ?? undefined} />
                          <AvatarFallback className="text-xs">
                            {request.requester.name?.charAt(0) ||
                              request.requester.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {request.requester.name || request.requester.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize">
                        {request.type.toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={tierColors[request.tier]} variant="secondary">
                        {request.tier === "COMMUNITY_PAID" ? "Paid" : "Free"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={status?.color} variant="outline">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status?.label || request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/requests/${request.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Review Details
                            </Link>
                          </DropdownMenuItem>
                          {request.status === "PENDING" && (
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/requests/${request.id}?action=start-review`}>
                                <Search className="h-4 w-4 mr-2" />
                                Start Review
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {request.status === "IN_REVIEW" && (
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dev?request=${request.id}`}
                                target="_blank"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Test in Dev
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/profile/${request.requester.id}`}>
                              View Requester Profile
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * 20 + 1} to{" "}
            {Math.min(currentPage * 20, total)} of {total} requests
          </p>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/admin/requests?status=${currentStatus}&page=${currentPage - 1}`}
                >
                  Previous
                </Link>
              </Button>
            )}
            {hasMore && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/admin/requests?status=${currentStatus}&page=${currentPage + 1}`}
                >
                  Next
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent>
          <h3 className="font-semibold mb-2">Request Review Workflow</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              </div>
              <p>New submissions awaiting initial review.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                  <Eye className="h-3 w-3 mr-1" />
                  In Review
                </Badge>
                <span>→</span>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Testing
                </Badge>
              </div>
              <p>Review code quality, then test in /dev playground.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
                </Badge>
                <span>or</span>
                <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
                  <XCircle className="h-3 w-3 mr-1" />
                  Rejected
                </Badge>
              </div>
              <p>Publish to registry or provide feedback.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
