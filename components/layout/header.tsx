"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import {
  LoginLink,
  RegisterLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";
import { mainNav } from "@/config/navigation";

interface HeaderProps {
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export function Header({ fullWidth = false, children }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md dark:bg-card dark:border-white/10">
      <div className={cn(
        "flex h-16 items-center justify-between",
        fullWidth ? "px-4 md:px-6" : "container"
      )}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/oonkoo-ui-text.svg"
            alt="OonkooUI"
            width={160}
            height={40}
            className="h-8 w-auto dark:hidden"
            priority
          />
          <Image
            src="/oonkoo-ui-text-darkmode.svg"
            alt="OonkooUI"
            width={160}
            height={40}
            className="h-8 w-auto hidden dark:block"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground",
                item.disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {item.title}
              {item.badge && (
                <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {children}
          <ThemeToggle />
          {isLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.picture ?? undefined}
                      alt={user.given_name ?? "User"}
                    />
                    <AvatarFallback>
                      {user.given_name?.charAt(0) ??
                        user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.given_name} {user.family_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <LogoutLink className="w-full cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </LogoutLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <LoginLink>
                <Button variant="ghost">Sign In</Button>
              </LoginLink>
              <RegisterLink>
                <Button>Get Started</Button>
              </RegisterLink>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.disabled ? "#" : item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground",
                      item.disabled && "cursor-not-allowed opacity-50"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-4 flex flex-col gap-2">
                  {isAuthenticated && user ? (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.picture ?? undefined} />
                          <AvatarFallback>
                            {user.given_name?.charAt(0) ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user.given_name} {user.family_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        asChild
                        className="justify-start"
                        onClick={() => setOpen(false)}
                      >
                        <Link href="/dashboard">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        asChild
                        className="justify-start"
                        onClick={() => setOpen(false)}
                      >
                        <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </Button>
                      <LogoutLink>
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                          onClick={() => setOpen(false)}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </LogoutLink>
                    </>
                  ) : (
                    <>
                      <LoginLink>
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                          onClick={() => setOpen(false)}
                        >
                          Sign In
                        </Button>
                      </LoginLink>
                      <RegisterLink>
                        <Button className="w-full" onClick={() => setOpen(false)}>
                          Get Started
                        </Button>
                      </RegisterLink>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
