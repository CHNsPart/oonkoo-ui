import { redirect } from "next/navigation";

// Only allow access in development mode
const isDev = process.env.NODE_ENV === "development";

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirect to home in production
  if (!isDev) {
    redirect("/");
  }

  return <>{children}</>;
}
