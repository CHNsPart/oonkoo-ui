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

    // Check if user should be admin based on email
    const isAdminEmail = kindeUser.email === "imchn24@gmail.com";

    // Sync with database (upsert)
    const user = await prisma.user.upsert({
      where: { kindeId: kindeUser.id },
      update: {
        email: kindeUser.email ?? undefined,
        name: kindeUser.given_name
          ? `${kindeUser.given_name} ${kindeUser.family_name ?? ""}`.trim()
          : undefined,
        avatar: kindeUser.picture ?? undefined,
        // Ensure admin email always has ADMIN role
        ...(isAdminEmail && { role: "ADMIN" }),
      },
      create: {
        kindeId: kindeUser.id,
        email: kindeUser.email!,
        name: kindeUser.given_name
          ? `${kindeUser.given_name} ${kindeUser.family_name ?? ""}`.trim()
          : null,
        avatar: kindeUser.picture ?? null,
        // Set ADMIN role for admin email on creation
        role: isAdminEmail ? "ADMIN" : "USER",
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
 * Require admin role - throws if not admin
 */
export async function requireAdmin(): Promise<UserWithSubscription> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
  return user;
}

/**
 * Check if user has Pro access (either active subscription or admin)
 */
export function hasProAccess(user: UserWithSubscription | null): boolean {
  if (!user) return false;
  // Admin always has Pro access
  if (user.role === "ADMIN") return true;
  return user.subscription?.status === "ACTIVE";
}

/**
 * Check if user can sell components
 */
export function canSell(user: UserWithSubscription | null): boolean {
  if (!user) return false;
  return user.sellerStatus === "VERIFIED";
}
