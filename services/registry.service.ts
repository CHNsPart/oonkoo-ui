import { prisma } from "@/lib/prisma";
import { ComponentTier, ComponentStatus } from "@prisma/client";
import type {
  RegistryComponent,
  RegistryIndexItem,
  RegistrySearchParams,
} from "@/types/registry";

// Map Prisma enums to registry types
const tierMap: Record<ComponentTier, RegistryComponent["tier"]> = {
  FREE: "free",
  PRO: "pro",
  COMMUNITY_FREE: "community_free",
  COMMUNITY_PAID: "community_paid",
};

export class RegistryService {
  /**
   * Get registry index with optional filtering
   */
  static async getIndex(params: RegistrySearchParams = {}) {
    const {
      query,
      type,
      tier,
      category,
      tags,
      sort = "downloads",
      page = 1,
      limit = 50,
    } = params;

    const where: Record<string, unknown> = {
      status: ComponentStatus.PUBLISHED,
    };

    // Search query
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: [query.toLowerCase()] } },
      ];
    }

    // Filters
    if (type) {
      where.type = type.toUpperCase();
    }
    if (tier) {
      where.tier = tier.toUpperCase();
    }
    if (category) {
      where.category = category.toUpperCase();
    }
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    // Sorting
    const orderBy: Record<string, string> = {};
    switch (sort) {
      case "downloads":
        orderBy.downloads = "desc";
        break;
      case "upvotes":
        orderBy.upvoteCount = "desc";
        break;
      case "newest":
        orderBy.publishedAt = "desc";
        break;
      case "name":
        orderBy.name = "asc";
        break;
      default:
        orderBy.downloads = "desc";
    }

    const [components, total] = await Promise.all([
      prisma.component.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          type: true,
          tier: true,
          category: true,
          tags: true,
          downloads: true,
          upvoteCount: true,
          price: true,
          previewImage: true,
          badge: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.component.count({ where }),
    ]);

    const items: RegistryIndexItem[] = components.map((c) => ({
      name: c.name,
      slug: c.slug,
      description: c.description,
      type: c.type.toLowerCase() as RegistryIndexItem["type"],
      tier: tierMap[c.tier],
      category: c.category.toLowerCase(),
      tags: c.tags,
      downloads: c.downloads,
      upvotes: c.upvoteCount,
      price: c.price ? Number(c.price) : undefined,
      badge: c.badge.toLowerCase() as RegistryIndexItem["badge"],
      previewImage: c.previewImage ?? undefined,
      author: {
        id: c.author.id,
        name: c.author.name ?? "Anonymous",
      },
    }));

    return {
      components: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single component by slug
   */
  static async getComponent(
    slug: string,
    userId?: string
  ): Promise<RegistryComponent | null> {
    const component = await prisma.component.findUnique({
      where: { slug, status: ComponentStatus.PUBLISHED },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!component) {
      return null;
    }

    // Check access based on tier - but still show component info even without access
    const accessGranted = await this.checkAccess(component.tier, userId);

    // Parse dependencies from JSON string
    let parsedDeps: string[] = [];
    if (component.dependencies) {
      try {
        parsedDeps = typeof component.dependencies === "string"
          ? JSON.parse(component.dependencies)
          : component.dependencies as string[];
      } catch {
        parsedDeps = [];
      }
    }

    let parsedDevDeps: string[] = [];
    if (component.devDependencies) {
      try {
        parsedDevDeps = typeof component.devDependencies === "string"
          ? JSON.parse(component.devDependencies)
          : component.devDependencies as string[];
      } catch {
        parsedDevDeps = [];
      }
    }

    // Parse controls from metadata
    let parsedControls: RegistryComponent["controls"] = undefined;
    if (component.metadata) {
      try {
        const metadata = typeof component.metadata === "string"
          ? JSON.parse(component.metadata)
          : component.metadata;
        if (metadata && metadata.controls) {
          parsedControls = metadata.controls;
        }
      } catch {
        parsedControls = undefined;
      }
    }

    return {
      name: component.name,
      slug: component.slug,
      description: component.description,
      type: component.type.toLowerCase() as RegistryComponent["type"],
      tier: tierMap[component.tier],
      category: component.category.toLowerCase(),
      tags: component.tags,
      author: {
        id: component.author.id,
        name: component.author.name ?? "Anonymous",
      },
      // Only include files if user has access
      files: accessGranted
        ? [
            {
              name: `${component.slug}.tsx`,
              path: `components/oonkoo/${component.slug}.tsx`,
              content: component.code,
              type: "component",
            },
          ]
        : [],
      dependencies: parsedDeps,
      devDependencies: parsedDevDeps,
      registryDependencies: component.registryDeps,
      cssSetup: component.cssSetup ?? undefined,
      previewUrl: component.previewUrl ?? undefined,
      previewImage: component.previewImage ?? undefined,
      controls: parsedControls,
      downloads: component.downloads,
      upvotes: component.upvoteCount,
      price: component.price ? Number(component.price) : undefined,
      createdAt: component.createdAt.toISOString(),
      updatedAt: component.updatedAt.toISOString(),
    };
  }

  /**
   * Check if user has access to a component tier
   */
  static async checkAccess(
    tier: ComponentTier,
    userId?: string
  ): Promise<boolean> {
    // Free and community free components are always accessible
    if (tier === ComponentTier.FREE || tier === ComponentTier.COMMUNITY_FREE) {
      return true;
    }

    // For Pro and paid components, user must be authenticated
    if (!userId) {
      return false;
    }

    // Check if user is admin (always has access)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (user?.role === "ADMIN") {
      return true;
    }

    // Check if user has Pro subscription for PRO tier
    if (tier === ComponentTier.PRO) {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
        select: { status: true },
      });
      return subscription?.status === "ACTIVE";
    }

    // For paid community components, check if purchased
    if (tier === ComponentTier.COMMUNITY_PAID) {
      // For now, allow if user is Pro or has purchased
      // We'll implement purchase checking later
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
        select: { status: true },
      });
      return subscription?.status === "ACTIVE";
    }

    return false;
  }

  /**
   * Increment download count for a component
   */
  static async trackDownload(slug: string) {
    await prisma.component.update({
      where: { slug },
      data: { downloads: { increment: 1 } },
    });
  }

  /**
   * Get categories with component counts
   */
  static async getCategories() {
    const categories = await prisma.component.groupBy({
      by: ["category"],
      where: { status: ComponentStatus.PUBLISHED },
      _count: { category: true },
    });

    return categories.map((c) => ({
      name: c.category.toLowerCase(),
      count: c._count.category,
    }));
  }

  /**
   * Get popular tags
   */
  static async getPopularTags(limit = 20) {
    const components = await prisma.component.findMany({
      where: { status: ComponentStatus.PUBLISHED },
      select: { tags: true },
    });

    const tagCounts: Record<string, number> = {};
    components.forEach((c) => {
      c.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));
  }
}
