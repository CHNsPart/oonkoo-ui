"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docsConfig } from "@/config/docs";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r md:sticky md:block">
      <div className="py-6 pr-6 lg:py-8">
        {docsConfig.sidebar.map((section, i) => (
          <div key={i} className="pb-8">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
              {section.title}
            </h4>
            <div className="grid grid-flow-row auto-rows-max text-sm">
              {section.items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline",
                    pathname === item.href
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
