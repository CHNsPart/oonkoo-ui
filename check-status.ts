import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const component = await prisma.component.findUnique({
    where: { slug: 'spark-cursor' },
    select: {
      status: true,
      slug: true,
      name: true,
      metadata: true
    }
  });

  console.log('Component:', component);

  if (component && component.status !== 'PUBLISHED') {
    console.log('\n⚠️  Component is not PUBLISHED! Status:', component.status);
    console.log('Updating to PUBLISHED...');

    await prisma.component.update({
      where: { slug: 'spark-cursor' },
      data: { status: 'PUBLISHED' }
    });

    console.log('✅ Updated to PUBLISHED');
  } else if (component) {
    console.log('\n✅ Component is PUBLISHED');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
