// App constants

export const APP_NAME = "OonkooUI";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

// Component limits
export const MAX_COMPONENT_CODE_SIZE = 50000; // 50KB
export const MAX_COMPONENT_DESCRIPTION = 500;
export const MAX_TAGS_PER_COMPONENT = 5;

// File upload
export const MAX_PREVIEW_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

// Rate limits
export const RATE_LIMITS = {
  API: { requests: 100, window: "1m" },
  AUTH: { requests: 10, window: "1m" },
  UPLOAD: { requests: 5, window: "1h" },
} as const;

// Seller requirements
export const SELLER_REQUIREMENTS = {
  TENURE_DAYS: 30,
  MIN_CONTRIBUTIONS: 5,
  MIN_UPVOTES_PER_COMPONENT: 10,
} as const;

// Payment
export const PLATFORM_FEE_PERCENT = 20;
export const MIN_COMPONENT_PRICE = 1;
export const MAX_COMPONENT_PRICE = 999;

// Component categories with labels
export const COMPONENT_CATEGORIES = [
  { value: "HERO", label: "Hero Sections" },
  { value: "FEATURES", label: "Features" },
  { value: "PRICING", label: "Pricing" },
  { value: "TESTIMONIALS", label: "Testimonials" },
  { value: "FAQ", label: "FAQ" },
  { value: "FOOTER", label: "Footer" },
  { value: "NAVIGATION", label: "Navigation" },
  { value: "DASHBOARD", label: "Dashboard" },
  { value: "FORMS", label: "Forms" },
  { value: "CARDS", label: "Cards" },
  { value: "BUTTONS", label: "Buttons" },
  { value: "ANIMATIONS", label: "Animations" },
  { value: "OTHER", label: "Other" },
] as const;

// Component types with labels
export const COMPONENT_TYPES = [
  { value: "BLOCK", label: "Block" },
  { value: "ELEMENT", label: "Element" },
  { value: "TEMPLATE", label: "Template" },
  { value: "ANIMATION", label: "Animation" },
] as const;

// Component tiers with labels
export const COMPONENT_TIERS = [
  { value: "FREE", label: "Free", color: "green" },
  { value: "PRO", label: "Pro", color: "purple" },
  { value: "COMMUNITY_FREE", label: "Community", color: "blue" },
  { value: "COMMUNITY_PAID", label: "Premium", color: "orange" },
] as const;
