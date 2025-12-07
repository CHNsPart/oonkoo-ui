export type UserRole = "USER" | "CONTRIBUTOR" | "SELLER" | "ADMIN";

export type SellerStatus =
  | "NOT_ELIGIBLE"
  | "ELIGIBLE"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "SUSPENDED";

export type SubscriptionStatus =
  | "ACTIVE"
  | "CANCELED"
  | "PAST_DUE"
  | "UNPAID"
  | "TRIALING";

export interface User {
  id: string;
  kindeId: string;
  email: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  githubUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  techStack: string[];
  role: UserRole;
  sellerStatus: SellerStatus;
  stripeConnectId: string | null;
  profileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  status: SubscriptionStatus;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithSubscription extends User {
  subscription: Subscription | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: Record<string, unknown>;
  createdAt: Date;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  badge: Badge;
  awardedAt: Date;
}
