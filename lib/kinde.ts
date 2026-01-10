import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { UserWithSubscription } from "@/types/user";

/**
 * Get the current authenticated user with subscription data
 * Syncs user data from Kinde to database on each call
 */
export async function getCurrentUser(): Promise<UserWithSubscription | null> {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession();

    if (!(await isAuthenticated())) {
      return null;
    }

    const kindeUser = await getUser();
    if (!kindeUser?.id) return null;

    // Check if user should be super admin (OonkooUI Team owner)
    const isSuperAdminEmail = kindeUser.email === "imchn24@gmail.com";

    // Sync with database (upsert)
    const user = await prisma.user.upsert({
      where: { kindeId: kindeUser.id },
      update: {
        email: kindeUser.email ?? undefined,
        name: kindeUser.given_name
          ? `${kindeUser.given_name} ${kindeUser.family_name ?? ""}`.trim()
          : undefined,
        avatar: kindeUser.picture ?? undefined,
        // Ensure super admin email always has SUPER_ADMIN role
        ...(isSuperAdminEmail && { role: "SUPER_ADMIN" }),
      },
      create: {
        kindeId: kindeUser.id,
        email: kindeUser.email!,
        name: kindeUser.given_name
          ? `${kindeUser.given_name} ${kindeUser.family_name ?? ""}`.trim()
          : null,
        avatar: kindeUser.picture ?? null,
        // Set SUPER_ADMIN role for owner email on creation
        role: isSuperAdminEmail ? "SUPER_ADMIN" : "USER",
      },
      include: {
        subscription: true,
      },
    });

    return user as UserWithSubscription;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<UserWithSubscription> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Require Pro subscription - throws if not Pro
 */
export async function requirePro(): Promise<UserWithSubscription> {
  const user = await requireAuth();
  if (user.subscription?.status !== "ACTIVE") {
    throw new Error("Pro subscription required");
  }
  return user;
}

/**
 * Require verified seller status - throws if not verified
 */
export async function requireSeller(): Promise<UserWithSubscription> {
  const user = await requireAuth();
  if (user.sellerStatus !== "VERIFIED") {
    throw new Error("Verified seller status required");
  }
  return user;
}

/**
 * Require admin role - throws if not admin or super admin
 */
export async function requireAdmin(): Promise<UserWithSubscription> {
  const user = await requireAuth();
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    throw new Error("Admin access required");
  }
  return user;
}

/**
 * Require super admin role - throws if not super admin
 */
export async function requireSuperAdmin(): Promise<UserWithSubscription> {
  const user = await requireAuth();
  if (user.role !== "SUPER_ADMIN") {
    throw new Error("Super Admin access required");
  }
  return user;
}

/**
 * Check if user has Pro access (either active subscription or admin/super admin)
 */
export function hasProAccess(user: UserWithSubscription | null): boolean {
  if (!user) return false;
  // Admin and Super Admin always have Pro access
  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") return true;
  return user.subscription?.status === "ACTIVE";
}

/**
 * Check if user is an admin (ADMIN or SUPER_ADMIN)
 */
export function isAdmin(user: UserWithSubscription | null): boolean {
  if (!user) return false;
  return user.role === "ADMIN" || user.role === "SUPER_ADMIN";
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(user: UserWithSubscription | null): boolean {
  if (!user) return false;
  return user.role === "SUPER_ADMIN";
}

/**
 * Check if user can sell components
 */
export function canSell(user: UserWithSubscription | null): boolean {
  if (!user) return false;
  return user.sellerStatus === "VERIFIED";
}
