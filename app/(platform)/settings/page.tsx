import Link from "next/link";
import { User, CreditCard, Key, Shield } from "lucide-react";

import { getCurrentUser } from "@/lib/kinde";
import { ProfileForm } from "@/components/profile/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export const metadata = {
  title: "Settings",
  description: "Manage your OonkooUI account settings",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const isPro = user.subscription?.status === "ACTIVE";

  // Calculate profile completion percentage
  const completionItems = [
    !!user.name,
    !!user.bio,
    user.techStack.length > 0,
    !!(user.githubUrl || user.twitterUrl || user.websiteUrl),
  ];
  const completionPercentage = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100
  );

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar ?? undefined} />
                <AvatarFallback>
                  {user.name?.charAt(0) ?? user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name ?? "Set your name"}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <div className="flex gap-2 mt-2">
                  <Badge variant={isPro ? "default" : "secondary"}>
                    {isPro ? "Pro" : "Free"}
                  </Badge>
                  {user.profileComplete && (
                    <Badge variant="outline" className="text-primary border-primary">
                      Profile Complete
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {user.name && (
              <Button variant="outline" asChild>
                <Link href={`/profile/${user.id}`}>View Public Profile</Link>
              </Button>
            )}
          </div>
        </CardHeader>
        {!user.profileComplete && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Profile Completion</span>
                <span className="font-medium">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Complete your profile to unlock seller eligibility and increase visibility.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Profile Form */}
      <ProfileForm user={user} />

      {/* Subscription Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Subscription</CardTitle>
          </div>
          <CardDescription>
            Manage your subscription and billing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {isPro ? "Pro Plan" : "Free Plan"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isPro
                  ? "Access to all premium components and features."
                  : "Upgrade to unlock premium components."}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/settings/billing">
                {isPro ? "Manage Billing" : "View Plans"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>API Keys</CardTitle>
          </div>
          <CardDescription>
            Manage API keys for CLI authentication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Generate API keys to authenticate the OonkooUI CLI.
              </p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Account</CardTitle>
          </div>
          <CardDescription>
            Manage your account security settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Update your password and security preferences via Kinde.
              </p>
            </div>
            <Button variant="outline" asChild>
              <a
                href={process.env.KINDE_ISSUER_URL + "/account"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Manage Account
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
