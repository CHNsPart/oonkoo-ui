import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowLeft } from "lucide-react";

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
  title: "Sign In",
  description: "Sign in to your OonkooUI account",
};

export default async function SignInPage() {
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
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to access your account and components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginLink>
            <Button className="w-full" size="lg">
              Sign In with Kinde
            </Button>
          </LoginLink>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Secure authentication
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            We use Kinde for secure, passwordless authentication. Your data is
            safe with us.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign up
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
