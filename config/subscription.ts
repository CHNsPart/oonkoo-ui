export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for trying out OonkooUI",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      "Access to 20+ free components",
      "Community support",
      "CLI installation",
      "Basic documentation",
      "MIT License for components",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professional developers and teams",
    price: {
      monthly: 10,
      yearly: 100, // ~17% discount
    },
    features: [
      "Everything in Free",
      "30+ premium components",
      "Priority support",
      "Early access to new components",
      "Advanced animations",
      "Dashboard templates",
      "Commercial license",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
];

export const SELLER_REQUIREMENTS = {
  TENURE_DAYS: 30,
  MIN_CONTRIBUTIONS: 5,
  MIN_UPVOTES_PER_COMPONENT: 10,
} as const;

export const PLATFORM_FEE_PERCENT = 20;
