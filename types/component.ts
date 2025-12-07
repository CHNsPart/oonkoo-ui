export type ComponentType = "BLOCK" | "ELEMENT" | "TEMPLATE" | "ANIMATION";

export type ComponentTier = "FREE" | "PRO" | "COMMUNITY_FREE" | "COMMUNITY_PAID";

export type ComponentCategory =
  | "HERO"
  | "FEATURES"
  | "PRICING"
  | "TESTIMONIALS"
  | "FAQ"
  | "FOOTER"
  | "NAVIGATION"
  | "DASHBOARD"
  | "FORMS"
  | "CARDS"
  | "BUTTONS"
  | "ANIMATIONS"
  | "OTHER";

export type ComponentStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "ARCHIVED";

export interface Component {
  id: string;
  authorId: string;
  name: string;
  slug: string;
  description: string;
  code: string;
  previewUrl: string | null;
  previewImage: string | null;
  type: ComponentType;
  tier: ComponentTier;
  category: ComponentCategory;
  tags: string[];
  dependencies: string[];
  devDependencies: string[];
  registryDeps: string[];
  price: number | null;
  status: ComponentStatus;
  featured: boolean;
  downloads: number;
  upvoteCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface ComponentWithAuthor extends Component {
  author: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
}

export interface ComponentWithDetails extends ComponentWithAuthor {
  hasUpvoted: boolean;
  hasPurchased?: boolean;
}

export interface Upvote {
  id: string;
  userId: string;
  componentId: string;
  createdAt: Date;
}

export type PurchaseStatus = "PENDING" | "COMPLETED" | "REFUNDED" | "DISPUTED";

export interface Purchase {
  id: string;
  buyerId: string;
  componentId: string;
  sellerId: string;
  amount: number;
  platformFee: number;
  sellerAmount: number;
  stripePaymentId: string;
  status: PurchaseStatus;
  createdAt: Date;
}

// Registry types (for CLI)
export interface RegistryComponent {
  name: string;
  type: string;
  tier: string;
  category: string;
  description: string;
  dependencies: string[];
  devDependencies: string[];
  registryDependencies: string[];
  files: {
    name: string;
    path: string;
  }[];
}

export interface Registry {
  $schema: string;
  name: string;
  version: string;
  styles: { name: string; label: string }[];
  components: RegistryComponent[];
}
