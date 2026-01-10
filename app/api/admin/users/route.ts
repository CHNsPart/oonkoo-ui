import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/kinde';

export async function GET() {
  try {
    // Check if user is admin
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all users for author selection
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Map avatar to image for consistency
    const mappedUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      image: u.avatar,
    }));

    return NextResponse.json({ users: mappedUsers });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
