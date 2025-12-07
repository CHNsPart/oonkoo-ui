"use client";

import { Header } from "@/components/layout/header";
import { ComponentSearch } from "@/components/components/component-search";
import type { RegistryIndexItem } from "@/types/registry";

interface DocsHeaderProps {
  components: RegistryIndexItem[];
}

export function DocsHeader({ components }: DocsHeaderProps) {
  return (
    <Header fullWidth>
      <ComponentSearch components={components} />
    </Header>
  );
}
