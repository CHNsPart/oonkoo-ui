import Link from "next/link";
import { Metadata } from "next";
import {
  BookOpen,
  FileText,
  ArrowRight,
  Code2,
  Package,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Documentation - OonkooUI",
  description:
    "OonkooUI documentation. Learn how to use components, submit your own, and integrate with your projects.",
};

const docs = [
  {
    title: "Component Submission Guide",
    description:
      "Learn how to create and submit components to OonkooUI. Complete guide with examples, best practices, and requirements.",
    href: "/docs/component-guide",
    icon: BookOpen,
    badge: "Popular",
    badgeColor: "bg-blue-500/10 text-blue-500",
  },
];

const comingSoon = [
  {
    title: "Installation Guide",
    description: "How to install OonkooUI components via CLI or copy-paste.",
    icon: Package,
  },
  {
    title: "Theming & Customization",
    description: "Customize components to match your brand and design system.",
    icon: Sparkles,
  },
  {
    title: "CLI Reference",
    description: "Complete reference for the OonkooUI CLI commands and options.",
    icon: Code2,
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Docs</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Documentation</h1>
              <p className="text-muted-foreground mt-1">
                Everything you need to build with OonkooUI
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Available Docs */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Available Guides</h2>
          <div className="grid gap-4">
            {docs.map((doc) => {
              const Icon = doc.icon;
              return (
                <Link key={doc.href} href={doc.href} className="group">
                  <Card className="hover:border-primary/30 hover:shadow-md transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {doc.title}
                              </CardTitle>
                              {doc.badge && (
                                <Badge className={doc.badgeColor} variant="secondary">
                                  {doc.badge}
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="mt-1">
                              {doc.description}
                            </CardDescription>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Coming Soon */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {comingSoon.map((doc) => {
              const Icon = doc.icon;
              return (
                <Card key={doc.title} className="opacity-60">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{doc.title}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {doc.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 rounded-lg border bg-muted/30 px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Ready to contribute?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Submit your components and help grow the OonkooUI ecosystem.
              </p>
            </div>
            <Button asChild>
              <Link href="/submit-component">
                Submit Component
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
