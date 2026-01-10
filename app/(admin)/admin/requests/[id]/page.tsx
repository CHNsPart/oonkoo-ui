import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
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
  Terminal,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestStatusActions } from "./request-status-actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getRequest(id: string) {
  const request = await prisma.componentRequest.findUnique({
    where: { id },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          sellerStatus: true,
          createdAt: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
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
    label: "Pending",
  },
  IN_REVIEW: {
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    icon: Eye,
    label: "Reviewing",
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
    label: "Published",
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
  const { id } = await params;
  const request = await getRequest(id);

  if (!request) {
    notFound();
  }

  const status = statusConfig[request.status];
  const StatusIcon = status?.icon || Clock;
  const dependencies = Array.isArray(request.dependencies) ? request.dependencies as string[] : [];

  // Get the main file and other files
  const mainFile = request.files.find(f => f.isMain) || request.files[0];
  const defaultTab = mainFile?.filepath || "code";

  return (
    <div className="h-[calc(100vh-10.8rem)] overflow-hidden flex flex-col">
      {/* Compact Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-background shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href="/admin/requests">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Image
            src="/free-plan-badge.svg"
            alt="OonkooUI"
            width={16}
            height={16}
            className="h-4 w-4 shrink-0"
          />
          <h1 className="font-semibold truncate">{request.name}</h1>
          <Badge className={`${status?.bgColor} ${status?.color} shrink-0`} variant="secondary">
            <StatusIcon className="h-3 w-3 mr-1" />
            {status?.label}
          </Badge>
          <span className="text-xs text-muted-foreground hidden md:block">
            by {request.requester.name || request.requester.email}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="capitalize">
            {request.type.toLowerCase()}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {request.category.toLowerCase()}
          </Badge>
        </div>
      </div>

      {/* Main IDE Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Code Editor Panel */}
        <div className="w-2/3 flex flex-col rounded-lg border bg-card m-4 mr-2">
          {/* IDE Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b shrink-0">
            <div className="flex items-center gap-2">
              <Image
                src="/free-plan-badge.svg"
                alt="OonkooUI"
                width={16}
                height={16}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium">Component Files</span>
              <Badge variant="secondary" className="text-xs">{request.files.length} files</Badge>
            </div>
          </div>

          {/* File Tabs */}
          {request.files.length > 0 ? (
            <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col min-h-0">
              <div className="border-b bg-muted/30 px-1 shrink-0">
                <TabsList className="h-9 bg-transparent gap-1 p-0">
                  {request.files.map((file) => (
                    <TabsTrigger
                      key={file.filepath}
                      value={file.filepath}
                      className={cn(
                        "gap-2 text-xs px-3 py-1.5 rounded-t-md border border-b-0 transition-all",
                        "data-[state=inactive]:border-transparent data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground",
                        "data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:shadow-sm data-[state=active]:text-foreground",
                        "data-[state=active]:relative"
                      )}
                    >
                      <Image src="/react.svg" alt="TSX" width={14} height={14} className="h-3.5 w-3.5" />
                      <span className="font-mono">{file.filepath}</span>
                      {file.isMain && (
                        <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 bg-green-500/10 text-green-600 border-0">
                          main
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {request.files.map((file) => (
                <TabsContent key={file.filepath} value={file.filepath} className="flex-1 mt-0 flex flex-col data-[state=inactive]:hidden">
                  {/* File path bar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b text-xs shrink-0">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Terminal className="h-3.5 w-3.5" />
                      <code className="font-mono">components/{file.filepath}</code>
                    </div>
                    <span className="text-muted-foreground">{file.isMain ? "Core Component" : "Preview Page"}</span>
                  </div>
                  {/* Editor */}
                  <div className="relative flex-1 min-h-0">
                    <div className="absolute inset-0 h-full">
                      <CodeEditor
                        value={file.content}
                        language="tsx"
                        height="100%"
                        readOnly
                        showCopyButton
                        showFullscreenButton={false}
                      />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            // Fallback for legacy single code field
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b text-xs shrink-0">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Terminal className="h-3.5 w-3.5" />
                  <code className="font-mono">components/ui/{request.slug}.tsx</code>
                </div>
                <span className="text-muted-foreground">Core Component</span>
              </div>
              <div className="relative flex-1 min-h-0">
                <div className="absolute inset-0 h-full">
                  <CodeEditor
                    value={request.code}
                    language="tsx"
                    height="100%"
                    readOnly
                    showCopyButton
                    showFullscreenButton={false}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar Panel */}
        <div className="w-1/3 shrink-0 overflow-y-auto overflow-x-hidden p-4 pl-2">
          <div className="space-y-4">
              {/* Status Actions */}
              <RequestStatusActions
                requestId={request.id}
                currentStatus={request.status}
                requestSlug={request.slug}
              />

              {/* Dependencies - Important for testing */}
              {dependencies.length > 0 && (
                <Card className="border-orange-500/20 bg-orange-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Package className="h-4 w-4 text-orange-500" />
                      NPM Dependencies
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Install before testing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {dependencies.map((dep) => (
                        <Badge key={dep} variant="outline" className="text-xs font-mono">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                    <div className="bg-zinc-900 rounded-md p-2 mt-2">
                      <code className="text-xs text-green-400 font-mono">
                        npm i {dependencies.join(" ")}
                      </code>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {request.description}
                  </p>
                </CardContent>
              </Card>

              {/* Tags */}
              {request.tags.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {request.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Requester */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.requester.avatar ?? undefined} />
                      <AvatarFallback className="text-xs">
                        {request.requester.name?.charAt(0) || request.requester.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {request.requester.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {request.requester.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role</span>
                      <Badge variant="outline" className="text-[10px] h-5">
                        {request.requester.role}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Joined</span>
                      <span>{new Date(request.requester.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted</span>
                    <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                  {request.reviewedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span>{new Date(request.reviewedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {request.reviewer && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reviewer</span>
                      <span>{request.reviewer.name || "Admin"}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Rejection Reason */}
              {request.status === "REJECTED" && request.rejectionReason && (
                <Card className="border-red-500/20 bg-red-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-red-600 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Rejection Reason
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {request.rejectionReason}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Admin Notes */}
              {request.adminNotes && (
                <Card className="border-blue-500/20 bg-blue-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-blue-600">Admin Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {request.adminNotes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Published Link */}
              {request.publishedComponent && (
                <Card className="border-green-500/20 bg-green-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Published
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/components/${request.publishedComponent.slug}`}>
                        <ExternalLink className="h-3.5 w-3.5 mr-2" />
                        View Component
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
