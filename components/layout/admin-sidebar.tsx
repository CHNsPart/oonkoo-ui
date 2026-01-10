"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Settings,
  Users,
  BarChart3,
  ChevronsUpDown,
  LogOut,
  Shield,
  Home,
  Code2,
  FileQuestion,
  Crown,
} from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AdminSidebarProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    role: string;
  };
  pendingRequestsCount?: number;
}

// Overview menu items
const overviewMenuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

// Content management menu items
const contentMenuItems = [
  {
    title: "Components",
    href: "/admin/components",
    icon: Package,
    description: "Manage all published components",
  },
  {
    title: "Component Requests",
    href: "/admin/requests",
    icon: FileQuestion,
    description: "Review user submissions",
    showBadge: true,
  },
  {
    title: "Review Queue",
    href: "/admin/reviews",
    icon: ClipboardList,
    description: "Legacy review system",
  },
];

// User management menu items
const userMenuItems = [
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    description: "Manage user accounts",
  },
];

// Development menu items (for testing components)
const devMenuItems = [
  {
    title: "Dev Playground",
    href: "/dev",
    icon: Code2,
    description: "Test & publish official components",
    external: true,
  },
];

// System menu items
const systemMenuItems = [
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar({ user, pendingRequestsCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const roleLabel = isSuperAdmin ? "Super Admin" : "Admin";
  const RoleIcon = isSuperAdmin ? Crown : Shield;

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link href="/admin" className="flex items-center gap-2 px-2 py-1.5">
          <Image
            src="/oonkoo-ui-icon.svg"
            alt="OonkooUI"
            width={28}
            height={28}
            className="h-7 w-7 dark:hidden"
          />
          <Image
            src="/oonkoo-ui-icon-darkmode.svg"
            alt="OonkooUI"
            width={28}
            height={28}
            className="h-7 w-7 hidden dark:block"
          />
          <span className="font-semibold">OonkooUI</span>
          <Badge
            variant={isSuperAdmin ? "default" : "secondary"}
            className="ml-1 text-xs"
          >
            <RoleIcon className="h-3 w-3 mr-1" />
            {isSuperAdmin ? "Team" : "Admin"}
          </Badge>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Overview Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overviewMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.showBadge && pendingRequestsCount > 0 && (
                    <SidebarMenuBadge className="bg-primary text-primary-foreground">
                      {pendingRequestsCount}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Development Section - For testing components */}
        <SidebarGroup>
          <SidebarGroupLabel>Development</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {devMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Section */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Back to Main App */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    <span>Back to App</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar ?? undefined} />
                    <AvatarFallback>
                      {user.name?.charAt(0) ?? user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.name ?? "Admin"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {roleLabel}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                align="start"
                side="top"
                sideOffset={4}
              >
                {/* OonkooUI Team Section - Only for Super Admins */}
                {isSuperAdmin && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      OonkooUI Team
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/oonkoo-team">
                        <Crown className="mr-2 h-4 w-4 text-amber-500" />
                        Team Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dev">
                        <Code2 className="mr-2 h-4 w-4" />
                        Publish Official Components
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                {/* Personal Section */}
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Personal Account
                </div>
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.id}`}>
                    View My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    My Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    My Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {/* Admin Section */}
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Administration
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <LogoutLink className="w-full cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </LogoutLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
