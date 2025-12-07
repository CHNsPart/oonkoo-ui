"use client";

import { useState, ComponentProps } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutButtonProps extends Omit<ComponentProps<typeof Button>, "onClick"> {
  children?: React.ReactNode;
}

export function CheckoutButton({
  children = "Subscribe to Pro",
  className,
  size = "lg",
  ...props
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const json = await res.json();

      if (json.success && json.data.url) {
        window.location.href = json.data.url;
      } else if (json.error?.code === "UNAUTHORIZED") {
        // Redirect to login if not authenticated
        window.location.href = "/api/auth/login?post_login_redirect_url=" + encodeURIComponent(window.location.pathname);
      } else {
        console.error("Checkout error:", json.error);
        setLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className={className}
      size={size}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
