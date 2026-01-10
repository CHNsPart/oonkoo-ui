import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/kinde";
import { SubmitComponentForm } from "./submit-component-form";

export const metadata = {
  title: "Submit Component",
  description: "Submit your component to the OonkooUI community",
};

export default async function SubmitComponentPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const isVerifiedSeller = user.sellerStatus === "VERIFIED";

  return (
    <div className="w-full flex flex-col justify-center mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Submit a Component</h1>
        <p className="text-muted-foreground text-sm">
          Share your component with the OonkooUI community
        </p>
      </div>

      <SubmitComponentForm isVerifiedSeller={isVerifiedSeller} />
    </div>
  );
}
