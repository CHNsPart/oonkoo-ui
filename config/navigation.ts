import { LucideIcon, Home, Blocks, Store, User, Settings, LayoutDashboard, Shield } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Main navigation for marketing pages
export const mainNav: NavItem[] = [
  {
    title: "Components",
    href: "/components/marketplace",
  },
  {
    title: "Marketplace",
    href: "/marketplace",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "Docs",
    href: "/docs",
    disabled: true,
  },
];

// Dashboard sidebar navigation
export const dashboardNav: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Library",
    items: [
      {
        title: "Components",
        href: "/components",
        icon: Blocks,
      },
      {
        title: "Marketplace",
        href: "/marketplace",
        icon: Store,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        href: "/profile",
        icon: User,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

// Admin navigation
export const adminNav: NavItem[] = [
  {
    title: "Admin Dashboard",
    href: "/admin",
    icon: Shield,
  },
  {
    title: "Components",
    href: "/admin/components",
    icon: Blocks,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: User,
  },
];
