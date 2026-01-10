import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, XCircle } from "lucide-react";

import { getCurrentUser } from "@/lib/kinde";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResubmitForm } from "./resubmit-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getRequest(id: string, userId: string) {
  const request = await prisma.componentRequest.findFirst({
    where: {
      id,
      requesterId: userId,
      status: "REJECTED", // Only allow editing rejected requests
    },
  });

  return request;
}

export default async function EditRequestPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/api/auth/login");
  }

  const { id } = await params;
  const request = await getRequest(id, user.id);

  if (!request) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back button & header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/my-requests/${request.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Edit & Resubmit</h1>
          <p className="text-muted-foreground mt-1">
            Update your component and submit for review again
          </p>
        </div>
      </div>

      {/* Rejection Reason Banner */}
      {request.rejectionReason && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Original Rejection Feedback
            </CardTitle>
            <CardDescription>
              Please address this feedback in your updated submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {request.rejectionReason}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Resubmit Form */}
      <ResubmitForm
        request={{
          id: request.id,
          name: request.name,
          description: request.description,
          code: request.code,
          previewCode: request.previewCode,
          previewImage: request.previewImage,
          type: request.type,
          category: request.category,
          tier: request.tier,
          price: request.price ? Number(request.price) : null,
          tags: request.tags,
          dependencies: request.dependencies as string[],
        }}
        isVerifiedSeller={user.sellerStatus === "VERIFIED"}
      />
    </div>
  );
}
