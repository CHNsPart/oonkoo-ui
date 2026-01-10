"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CancelRequestButtonProps {
  requestId: string;
  requestName: string;
}

export function CancelRequestButton({ requestId, requestName }: CancelRequestButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/component-requests/${requestId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel request");
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error("Error cancelling request:", error);
      alert("Failed to cancel request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="flex w-full items-center text-red-600 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm">
        <Trash2 className="h-4 w-4 mr-2" />
        Cancel Request
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Request?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel your submission for "{requestName}"?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Request</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Cancel Request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
