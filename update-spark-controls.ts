import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  // Read the meta.json file
  const metaPath = path.join(process.cwd(), 'registry/dev/spark-cursor/meta.json');
  const metaContent = fs.readFileSync(metaPath, 'utf-8');
  const meta = JSON.parse(metaContent);

  console.log('Meta controls:', JSON.stringify(meta.controls, null, 2));

  // Update the component's metadata in the database
  const updated = await prisma.component.update({
    where: { slug: 'spark-cursor' },
    data: {
      metadata: meta
    }
  });

  console.log('✅ Updated component metadata!');
  console.log('Component ID:', updated.id);
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
