import Link from "next/link";
import { redirect } from "next/navigation";
import { Store, CheckCircle, Clock, AlertCircle } from "lucide-react";

import { getCurrentUser } from "@/lib/kinde";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Seller Dashboard",
  description: "Manage your seller account and earnings",
};

// TODO: Implement seller dashboard functionality
// - Stripe Connect onboarding
// - Earnings overview
// - Payout history
// - Tax documents

export default async function SellerPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const sellerStatus = user.sellerStatus;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Sell your components and earn money
        </p>
      </div>

      {/* Seller Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Seller Status
          </CardTitle>
          <CardDescription>
            Your current seller verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            {sellerStatus === "VERIFIED" ? (
              <>
                <Badge className="bg-green-500/10 text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Seller
                </Badge>
                <p className="text-sm text-muted-foreground">
                  You can submit paid components
                </p>
              </>
            ) : sellerStatus === "PENDING_VERIFICATION" ? (
              <>
                <Badge className="bg-yellow-500/10 text-yellow-600">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending Verification
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Your seller application is being reviewed
                </p>
              </>
            ) : sellerStatus === "ELIGIBLE" ? (
              <>
                <Badge className="bg-blue-500/10 text-blue-600">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Eligible to Apply
                </Badge>
                <p className="text-sm text-muted-foreground">
                  You meet the requirements to become a seller
                </p>
              </>
            ) : (
              <>
                <Badge variant="secondary">
                  Not Eligible
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Complete the requirements below to become eligible
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Card */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Store className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Seller Features Coming Soon</h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            Full seller dashboard with Stripe Connect integration, earnings tracking, and payout management is under development.
          </p>
        </CardContent>
      </Card>

      {/* Requirements Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Seller Requirements</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Active account for at least 30 days
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              At least 3 approved free components
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Complete profile information
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Valid Stripe Connect account
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
