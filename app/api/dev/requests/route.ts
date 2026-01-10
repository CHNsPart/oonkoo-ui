import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/kinde';

/**
 * GET /api/dev/requests
 * Fetch approved component requests for the DevLayout "Load from Request" feature
 * Returns requests that are APPROVED but not yet published (no publishedComponentId)
 */
export async function GET() {
  try {
    // Check if user is admin
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch approved requests that haven't been published yet
    const requests = await prisma.componentRequest.findMany({
      where: {
        status: 'APPROVED',
        publishedComponentId: null, // Not yet published
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        type: true,
        tier: true,
        category: true,
        tags: true,
        dependencies: true,
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format for DevLayout consumption
    const formattedRequests = requests.map(req => ({
      id: req.id,
      name: req.name,
      slug: req.slug,
      description: req.description,
      type: req.type.toLowerCase(),
      tier: req.tier.toLowerCase().replace('_', '_'), // Keep COMMUNITY_FREE as community_free
      category: req.category.toLowerCase(),
      tags: req.tags,
      dependencies: Array.isArray(req.dependencies) ? req.dependencies : [],
      author: {
        id: req.requester.id,
        name: req.requester.name,
        email: req.requester.email,
        avatar: req.requester.avatar,
      },
      createdAt: req.createdAt,
    }));

    return NextResponse.json({ requests: formattedRequests });
  } catch (error) {
    console.error('Failed to fetch approved requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}
