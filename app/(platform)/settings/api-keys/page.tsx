import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCurrentUser } from "@/lib/kinde";
import { ApiKeyService } from "@/services/api-key.service";
import { ApiKeysManager } from "@/components/profile/api-keys-manager";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "API Keys",
  description: "Manage your OonkooUI API keys for CLI authentication",
};

export default async function ApiKeysPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const keys = await ApiKeyService.listKeys(user.id);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-muted-foreground">
            Manage API keys for CLI authentication.
          </p>
        </div>
      </div>

      <ApiKeysManager initialKeys={keys} />

      <div className="rounded-lg border p-4 space-y-3">
        <h3 className="font-medium">Using API Keys</h3>
        <p className="text-sm text-muted-foreground">
          Authenticate with the OonkooUI CLI using your API key:
        </p>
        <div className="bg-muted rounded-lg p-3 font-mono text-sm">
          <p className="text-muted-foreground"># Set your API key</p>
          <p>npx oonkoo auth --key YOUR_API_KEY</p>
          <p className="text-muted-foreground mt-2"># Or use environment variable</p>
          <p>export OONKOO_API_KEY=YOUR_API_KEY</p>
        </div>
      </div>
    </div>
  );
}
