import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.component.update({
    where: { slug: 'spark-cursor' },
    data: { badge: 'NEW' }
  });

  console.log('✅ Updated Spark Cursor badge to NEW');
  console.log('Component:', updated.name);
  console.log('Badge:', updated.badge);
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
