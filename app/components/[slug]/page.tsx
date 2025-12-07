import { notFound } from "next/navigation";
import Link from "next/link";
import { Download, Heart, User, Lock, Sparkles } from "lucide-react";

import { RegistryService } from "@/services/registry.service";
import { getCurrentUser } from "@/lib/kinde";
import { highlightCode } from "@/lib/highlight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/components/component-preview";
import { ComponentInstallation } from "@/components/components/component-installation";
import { PropsTable } from "@/components/components/props-table";
import { extractPropsFromCode } from "@/lib/extract-props";

interface ComponentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const tierColors: Record<string, string> = {
  free: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  pro: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  community_free: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  community_paid: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

const tierLabels: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  community_free: "Community",
  community_paid: "Paid",
};

export async function generateMetadata({ params }: ComponentPageProps) {
  const { slug } = await params;
  const component = await RegistryService.getComponent(slug);

  if (!component) {
    return {
      title: "Component Not Found",
    };
  }

  return {
    title: `${component.name} - OonkooUI Components`,
    description: component.description,
  };
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();
  const component = await RegistryService.getComponent(slug, user?.id);

  if (!component) {
    notFound();
  }

  const isPro = component.tier === "pro" || component.tier === "community_paid";
  const mainFile = component.files[0];
  const code = mainFile?.content || "";
  const highlightedCode = code ? await highlightCode(code) : "";

  // Extract props from code for the props table
  const componentNameForProps = component.name.replace(/\s+/g, "");
  const props = code ? extractPropsFromCode(code, componentNameForProps) : [];

  return (
    <div className="py-8 px-6 lg:px-10 max-w-5xl">
      {/* Header Section */}
      <div className="space-y-4 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{component.name}</h1>
            <p className="text-lg text-muted-foreground">
              {component.description}
            </p>
          </div>

          {/* Pro Promotion Card (Right side on desktop) */}
          {isPro && !mainFile && (
            <div className="hidden xl:block w-64 shrink-0">
              <div className="rounded-lg border bg-linear-to-br from-purple-500/5 to-purple-500/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold">OonkooUI Pro</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Get access to all Pro components and templates.
                </p>
                <Button size="sm" className="w-full" asChild>
                  <Link href="/pricing">Get Pro Access</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={tierColors[component.tier]}>
            {isPro && <Lock className="h-3 w-3 mr-1" />}
            {tierLabels[component.tier]}
          </Badge>
          {component.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
          <span className="flex items-center gap-1.5">
            <Download className="h-4 w-4" />
            {component.downloads.toLocaleString()} downloads
          </span>
          <span className="flex items-center gap-1.5">
            <Heart className="h-4 w-4" />
            {component.upvotes.toLocaleString()} upvotes
          </span>
          <Link
            href={`/profile/${component.author.id}`}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <User className="h-4 w-4" />
            {component.author.name}
          </Link>
        </div>
      </div>

      {/* Preview Section */}
      <section className="mb-12">
        <ComponentPreview
          name={component.name}
          slug={component.slug}
          code={code}
          highlightedCode={highlightedCode}
          isPro={isPro && !mainFile}
          previewImage={component.previewImage}
          controls={component.controls}
        />
      </section>

      {/* Installation Section */}
      <section className="mb-12">
        <ComponentInstallation
          slug={component.slug}
          code={code}
          dependencies={component.dependencies}
          devDependencies={component.devDependencies}
          registryDependencies={component.registryDependencies}
          cssSetup={component.cssSetup}
          isPro={isPro && !mainFile}
        />
      </section>

      {/* Props Table Section */}
      {props.length > 0 && (
        <section className="mb-12">
          <PropsTable
            componentName={componentNameForProps}
            props={props}
          />
        </section>
      )}

      {/* Usage Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Usage</h2>
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground mb-3">
            Import the component in your file:
          </p>
          <pre className="bg-background rounded-md p-3 text-sm font-mono overflow-x-auto">
            <code>
              {`import { ${componentNameForProps} } from "@/components/oonkoo/${component.slug}"`}
            </code>
          </pre>
        </div>
      </section>

      {/* Mobile Pro Card */}
      {isPro && !mainFile && (
        <section className="xl:hidden mb-12">
          <div className="rounded-lg border bg-linear-to-br from-purple-500/5 to-purple-500/10 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span className="text-lg font-semibold">Unlock with OonkooUI Pro</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Get access to all Pro components, templates, and priority support.
            </p>
            <Button asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Component Info */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Component Info</h2>
        <div className="rounded-lg border divide-y">
          <div className="flex justify-between p-4">
            <span className="text-muted-foreground">Type</span>
            <span className="capitalize font-medium">{component.type}</span>
          </div>
          <div className="flex justify-between p-4">
            <span className="text-muted-foreground">Category</span>
            <span className="capitalize font-medium">{component.category}</span>
          </div>
          <div className="flex justify-between p-4">
            <span className="text-muted-foreground">Tier</span>
            <Badge className={tierColors[component.tier]}>
              {tierLabels[component.tier]}
            </Badge>
          </div>
          <div className="flex justify-between p-4">
            <span className="text-muted-foreground">Last updated</span>
            <span className="font-medium">
              {new Date(component.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between p-4">
            <span className="text-muted-foreground">Author</span>
            <Link
              href={`/profile/${component.author.id}`}
              className="font-medium hover:text-primary transition-colors"
            >
              {component.author.name}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
