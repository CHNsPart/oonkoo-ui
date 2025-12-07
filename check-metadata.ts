import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const component = await prisma.component.findUnique({
    where: { slug: 'spark-cursor' },
    select: {
      id: true,
      name: true,
      slug: true,
      metadata: true,
    },
  });

  if (!component) {
    console.log('❌ Component not found!');
    return;
  }

  console.log('Component found:');
  console.log('ID:', component.id);
  console.log('Name:', component.name);
  console.log('Slug:', component.slug);
  console.log('\nMetadata:', JSON.stringify(component.metadata, null, 2));

  if (component.metadata) {
    const metadata = typeof component.metadata === 'string'
      ? JSON.parse(component.metadata)
      : component.metadata;

    if (metadata.controls) {
      console.log('\n✅ Controls found:', metadata.controls.length);
      console.log('Control names:', metadata.controls.map((c: any) => c.name).join(', '));
    } else {
      console.log('\n❌ No controls in metadata!');
    }
  } else {
    console.log('\n❌ No metadata field!');
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
