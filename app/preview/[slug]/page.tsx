import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PreviewRenderer, type PreviewConfig } from '@/components/components/preview-renderer';

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Parse query parameters into typed control values
 */
function parseControlValues(query: Record<string, string | string[] | undefined>): Record<string, any> {
  const controlValues: Record<string, any> = {};

  Object.entries(query).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Try to parse as number if it looks like one
      if (!isNaN(Number(value)) && value !== '') {
        controlValues[key] = Number(value);
      } else if (value === 'true') {
        controlValues[key] = true;
      } else if (value === 'false') {
        controlValues[key] = false;
      } else {
        controlValues[key] = value;
      }
    }
  });

  return controlValues;
}

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { slug } = await params;
  const query = await searchParams;

  // Get component from database with preview config
  const component = await prisma.component.findUnique({
    where: { slug },
    select: {
      tier: true,
      name: true,
      status: true,
      previewConfig: true,
      hasComplexDeps: true,
    },
  });

  if (!component || component.status !== 'PUBLISHED') {
    return notFound();
  }

  // Note: Preview is visible to ALL users (even non-Pro)
  // Access control for code/manual installation happens on the component page

  // Extract control values from query params
  const controlValues = parseControlValues(query);

  // Parse previewConfig from JSON if exists
  const previewConfig = component.previewConfig as PreviewConfig | null;

  // Use client component to render preview with dynamic imports
  return (
    <PreviewRenderer
      slug={slug}
      previewConfig={previewConfig}
      controlValues={controlValues}
    />
  );
}
