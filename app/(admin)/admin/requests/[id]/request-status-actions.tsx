"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  ArrowRight,
  Code2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RequestStatusActionsProps {
  requestId: string;
  currentStatus: string;
  requestSlug: string;
}

interface NextStep {
  action: string;
  url: string;
  description: string;
}

export function RequestStatusActions({
  requestId,
  currentStatus,
  requestSlug,
}: RequestStatusActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [nextStep, setNextStep] = useState<NextStep | null>(null);

  const updateStatus = async (newStatus: string, extraData?: { adminNotes?: string; rejectionReason?: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/component-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          ...extraData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update status");
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error instanceof Error ? error.message : "Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/component-requests/${requestId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminNotes: adminNotes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to approve request");
      }

      // Show next step guidance
      setNextStep(data.data.nextStep);
      router.refresh();
    } catch (error) {
      console.error("Error approving request:", error);
      alert(error instanceof Error ? error.message : "Failed to approve request");
      setApproveDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    await updateStatus("REJECTED", { rejectionReason, adminNotes: adminNotes || undefined });
    setRejectDialogOpen(false);
  };

  // Terminal states - APPROVED now shows next step guidance
  if (currentStatus === "APPROVED") {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            Approved - Ready to Publish
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This request has been approved. Complete the publishing process in the Dev Platform.
          </p>

          <div className="bg-background border rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Next Steps:</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Go to the Dev Platform</li>
              <li>Use "Load from Request" to auto-fill author info</li>
              <li>Configure preview settings</li>
              <li>Click Publish</li>
            </ol>
          </div>

          <Button className="w-full" asChild>
            <Link href={`/dev/${requestSlug}`}>
              <Code2 className="h-4 w-4 mr-2" />
              Go to Dev Platform
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (currentStatus === "CANCELLED") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Status Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This request has been cancelled by the user.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Rejected - can re-open for review
  if (currentStatus === "REJECTED") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Status Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This request was rejected. You can re-open it for review if the user has made changes.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => updateStatus("PENDING")}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4 mr-2" />
            )}
            Re-open for Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Status Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Admin Notes (optional) */}
        <div className="space-y-2">
          <Label htmlFor="adminNotes">Admin Notes (Internal)</Label>
          <Textarea
            id="adminNotes"
            placeholder="Add internal notes about this review..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Action buttons based on current status */}
        {currentStatus === "PENDING" && (
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => updateStatus("IN_REVIEW", { adminNotes: adminNotes || undefined })}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Start Review
            </Button>
          </div>
        )}

        {currentStatus === "IN_REVIEW" && (
          <div className="space-y-2">
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => updateStatus("TESTING", { adminNotes: adminNotes || undefined })}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              Move to Testing
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Copy component files to codebase for testing
            </p>
          </div>
        )}

        {currentStatus === "TESTING" && (
          <div className="space-y-2">
            <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                {nextStep ? (
                  // Success state - show next step
                  <div className="flex flex-col items-center py-6">
                    <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <DialogHeader className="text-center">
                      <DialogTitle>Request Approved!</DialogTitle>
                      <DialogDescription className="text-center">
                        The component request has been approved. Complete publishing in the Dev Platform.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="w-full bg-muted rounded-lg p-4 mt-4 space-y-2">
                      <p className="text-sm font-medium">{nextStep.action}</p>
                      <p className="text-xs text-muted-foreground">{nextStep.description}</p>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
                        Close
                      </Button>
                      <Button asChild>
                        <Link href={nextStep.url}>
                          <Code2 className="h-4 w-4 mr-2" />
                          Go to Dev Platform
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Confirmation state
                  <>
                    <DialogHeader>
                      <DialogTitle>Approve Component Request?</DialogTitle>
                      <DialogDescription>
                        This will mark the request as approved. You'll then need to go to the Dev Platform to configure the preview and publish the component with the correct author.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="bg-muted rounded-lg p-3 my-4">
                      <p className="text-sm font-medium mb-2">After approval:</p>
                      <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Go to /dev/{requestSlug}</li>
                        <li>Click "Load from Request" to set author</li>
                        <li>Configure preview and publish</li>
                      </ol>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleApprove}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve Request
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Reject button - available for PENDING, IN_REVIEW, TESTING */}
        {["PENDING", "IN_REVIEW", "TESTING"].includes(currentStatus) && (
          <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <XCircle className="h-4 w-4 mr-2" />
                Reject Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Component Request</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejection. This will be sent to the requester.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                  <Textarea
                    id="rejectionReason"
                    placeholder="Explain why this request is being rejected..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Be constructive - include suggestions for improvement if applicable.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isLoading || !rejectionReason.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Reject Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Workflow hint */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            {currentStatus === "PENDING" && "Start reviewing to examine the code quality."}
            {currentStatus === "IN_REVIEW" && "Copy files to codebase, install deps, then test manually."}
            {currentStatus === "TESTING" && "Approve after testing. Publishing is done via Dev Platform."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
