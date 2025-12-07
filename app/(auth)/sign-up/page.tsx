import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowLeft, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Sign Up",
  description: "Create your OonkooUI account",
};

const features = [
  "Access to 50+ free components",
  "CLI installation support",
  "Community marketplace access",
  "Save favorite components",
];

export default async function SignUpPage() {
  const { isAuthenticated } = getKindeServerSession();

  if (await isAuthenticated()) {
    redirect("/dashboard");
  }
  return (
    <div className="w-full max-w-md px-4">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block">
          <Image
            src="/oonkoo_logo.svg"
            alt="OonkooUI"
            width={150}
            height={50}
            className="h-10 w-auto mx-auto"
          />
        </Link>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Join thousands of developers building with OonkooUI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-center text-sm">
                <Check className="mr-2 h-4 w-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>

          <RegisterLink>
            <Button className="w-full" size="lg">
              Create Account
            </Button>
          </RegisterLink>

          <p className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
