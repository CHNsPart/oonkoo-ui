"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Terminal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function CLIAuthContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-session">("loading");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("no-session");
      return;
    }

    // Complete the auth session
    completeAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function completeAuth() {
    try {
      const response = await fetch("/api/auth/cli/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || "Authentication failed");
      }

      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setStatus("error");
    }
  }

  if (status === "no-session") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <Terminal className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">CLI Authentication</h1>
          <p className="text-muted-foreground mb-6">
            To authenticate the CLI, run this command in your terminal:
          </p>
          <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm text-primary mb-6">
            npx oonkoo auth
          </div>
          <p className="text-sm text-muted-foreground">
            This will open a browser window for you to sign in.
          </p>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <Loader2 className="h-16 w-16 mx-auto mb-6 text-primary animate-spin" />
          <h1 className="text-2xl font-bold mb-2">Completing Authentication...</h1>
          <p className="text-muted-foreground">
            Please wait while we connect your CLI.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <XCircle className="h-16 w-16 mx-auto mb-6 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">Authentication Failed</h1>
          <p className="text-muted-foreground mb-6">
            {error || "Something went wrong. Please try again."}
          </p>
          <Button onClick={() => window.close()}>Close Window</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <CheckCircle className="h-16 w-16 mx-auto mb-6 text-green-500" />
        <h1 className="text-2xl font-bold mb-2">CLI Authenticated!</h1>
        <p className="text-muted-foreground mb-6">
          You can now close this window and return to your terminal.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          The CLI is now connected to your OonkooUI account.
        </p>
        <Button onClick={() => window.close()}>Close Window</Button>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <Loader2 className="h-16 w-16 mx-auto mb-6 text-primary animate-spin" />
        <h1 className="text-2xl font-bold mb-2">Loading...</h1>
      </div>
    </div>
  );
}

export default function CLIAuthPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CLIAuthContent />
    </Suspense>
  );
}
