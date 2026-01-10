import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/kinde";
import { prisma } from "@/lib/prisma";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Separator } from "@/components/ui/separator";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;

  try {
    user = await requireAdmin();
  } catch {
    redirect("/dashboard");
  }

  // Get pending requests count for sidebar badge
  const pendingRequestsCount = await prisma.componentRequest.count({
    where: { status: "PENDING" },
  });

  return (
    <SidebarProvider>
      <AdminSidebar user={user} pendingRequestsCount={pendingRequestsCount} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1" />
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
