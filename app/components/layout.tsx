import { RegistryService } from "@/services/registry.service";
import { DocsSidebar } from "@/components/components/docs-sidebar";
import { DocsRightSidebar } from "@/components/components/docs-right-sidebar";
import { DocsHeader } from "@/components/components/docs-header";

export default async function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch all components for the sidebar
  const { components } = await RegistryService.getIndex({ limit: 500 });

  return (
    <div className="flex min-h-screen flex-col">
      <DocsHeader components={components} />
      <div className="flex flex-1">
        {/* Left Sidebar - Fixed width, sticky, scrollable */}
        <aside className="hidden md:block w-[280px] shrink-0 border-r sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <DocsSidebar components={components} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

        {/* Right Sidebar */}
        <DocsRightSidebar />
      </div>
    </div>
  );
}
