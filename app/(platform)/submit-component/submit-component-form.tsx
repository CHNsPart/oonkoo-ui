"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Send,
  Info,
  Tag,
  Package,
  DollarSign,
  CheckCircle,
  ImageIcon,
  BookOpen,
  ExternalLink,
  Terminal,
  Lightbulb,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { CodeEditor } from "@/components/ui/code-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SubmitComponentFormProps {
  isVerifiedSeller: boolean;
}

const COMPONENT_TYPES = [
  { value: "BLOCK", label: "Block", description: "Full section (Hero, Footer, etc.)" },
  { value: "ELEMENT", label: "Element", description: "Single element (Button, Card, etc.)" },
  { value: "TEMPLATE", label: "Template", description: "Full page template" },
  { value: "ANIMATION", label: "Animation", description: "Animation utility" },
];

const CATEGORIES = [
  "HERO", "FEATURES", "PRICING", "TESTIMONIALS", "FAQ", "FOOTER",
  "NAVIGATION", "DASHBOARD", "FORMS", "CARDS", "BUTTONS", "CURSOR",
  "ANIMATIONS", "BACKGROUND", "OTHER",
];

// Default templates for the two required files
const COMPONENT_TEMPLATE = `"use client";

import { cn } from "@/lib/utils";

interface MyComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("p-4 rounded-lg border bg-card", className)}>
      {children || "Hello from MyComponent!"}
    </div>
  );
}
`;

const PREVIEW_TEMPLATE = `import { MyComponent } from "@/components/ui/my-component";

export default function PreviewPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <MyComponent>
        Your component preview here
      </MyComponent>
    </div>
  );
}
`;

export function SubmitComponentForm({ isVerifiedSeller }: SubmitComponentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [componentCode, setComponentCode] = useState(COMPONENT_TEMPLATE);
  const [previewCode, setPreviewCode] = useState(PREVIEW_TEMPLATE);
  const [activeTab, setActiveTab] = useState<"component" | "preview">("component");
  const [type, setType] = useState("BLOCK");
  const [category, setCategory] = useState("OTHER");
  const [tier, setTier] = useState("COMMUNITY_FREE");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [dependencies, setDependencies] = useState("");
  const [previewImage, setPreviewImage] = useState<string | undefined>();

  // Generate slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "component";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    // Validate code
    if (componentCode.trim().length < 50) {
      setError("Component code is too short. Please provide a complete component.");
      setIsLoading(false);
      return;
    }

    if (previewCode.trim().length < 20) {
      setError("Preview code is too short. Please provide a preview page.");
      setIsLoading(false);
      return;
    }

    try {
      const requestData = {
        name,
        description,
        code: componentCode, // Main code for backward compatibility
        files: [
          {
            filename: `${slug}.tsx`,
            filepath: `ui/${slug}.tsx`,
            content: componentCode,
            isMain: true,
            order: 0,
          },
          {
            filename: "page.tsx",
            filepath: "preview/page.tsx",
            content: previewCode,
            isMain: false,
            order: 1,
          },
        ],
        previewImage: previewImage || undefined,
        type,
        category,
        tier,
        price: tier === "COMMUNITY_PAID" ? parseFloat(price) : undefined,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        dependencies: dependencies ? dependencies.split(",").map((d) => d.trim()).filter(Boolean) : [],
      };

      const response = await fetch("/api/component-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        throw new Error(data.message || "Failed to submit component");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-green-500/20 bg-green-500/5 max-w-2xl mx-auto h-fit">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Submission Received!</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Thank you for your contribution! Our team will review your component and get back to you soon.
          </p>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/my-requests">View My Requests</Link>
            </Button>
            <Button onClick={() => window.location.reload()}>
              Submit Another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="h-[calc(100vh-10.8rem)] overflow-hidden">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="h-full flex gap-6 overflow-hidden">
        {/* Left: Code Editor Panel (IDE-like) */}
        <div className="w-2/3 flex flex-col rounded-lg border bg-card">
          {/* IDE Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
            <div className="flex items-center gap-2">
              <Image
                src="/free-plan-badge.svg"
                alt="OonkooUI"
                width={16}
                height={16}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium">Component Files</span>
              <Badge variant="secondary" className="text-xs">2 files</Badge>
            </div>
            <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
              <Link href="/docs/component-guide" target="_blank">
                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                Guide
              </Link>
            </Button>
          </div>

          {/* File Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "component" | "preview")} className="flex-1 flex flex-col min-h-0">
            <div className="border-b bg-muted/30 px-1 shrink-0">
              <TabsList className="h-9 bg-transparent gap-1 p-0">
                <TabsTrigger
                  value="component"
                  className={cn(
                    "gap-2 text-xs px-3 py-1.5 rounded-t-md border border-b-0 transition-all",
                    "data-[state=inactive]:border-transparent data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground",
                    "data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:shadow-sm data-[state=active]:text-foreground",
                    "data-[state=active]:relative"
                  )}
                >
                  <Image src="/react.svg" alt="TSX" width={14} height={14} className="h-3.5 w-3.5" />
                  <span className="font-mono">ui/{slug}.tsx</span>
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 bg-green-500/10 text-green-600 border-0">
                    main
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className={cn(
                    "gap-2 text-xs px-3 py-1.5 rounded-t-md border border-b-0 transition-all",
                    "data-[state=inactive]:border-transparent data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground",
                    "data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:shadow-sm data-[state=active]:text-foreground",
                    "data-[state=active]:relative"
                  )}
                >
                  <Image src="/react.svg" alt="TSX" width={14} height={14} className="h-3.5 w-3.5" />
                  <span className="font-mono">preview/page.tsx</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="component" className="flex-1 mt-0 flex flex-col data-[state=inactive]:hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b text-xs shrink-0">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Terminal className="h-3.5 w-3.5" />
                  <code className="font-mono">components/ui/{slug}.tsx</code>
                </div>
                <span className="text-muted-foreground">Core Component</span>
              </div>
              <div className="relative flex-1 min-h-0">
                <div className="absolute inset-0 h-full">
                  <CodeEditor
                    value={componentCode}
                    onChange={setComponentCode}
                    language="tsx"
                    height="100%"
                    showCopyButton
                    showFullscreenButton={false}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 mt-0 flex flex-col data-[state=inactive]:hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b text-xs shrink-0">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Terminal className="h-3.5 w-3.5" />
                  <code className="font-mono">app/preview/page.tsx</code>
                </div>
                <span className="text-muted-foreground">Preview Page</span>
              </div>
              <div className="relative flex-1 min-h-0">
                <div className="absolute inset-0 h-full">
                  <CodeEditor
                    value={previewCode}
                    onChange={setPreviewCode}
                    language="tsx"
                    height="100%"
                    showCopyButton
                    showFullscreenButton={false}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* File Structure Info */}
          <div className="px-4 py-2 bg-muted/30 border-t text-xs text-muted-foreground shrink-0">
            <div className="flex items-start gap-2">
              <Image
                src="/free-plan-badge.svg"
                alt="OonkooUI"
                width={16}
                height={16}
                className="h-3.5"
              />
              <div>
                <span className="font-medium text-foreground">Required structure:</span>{" "}
                <code className="bg-muted px-1 rounded">ui/{slug}.tsx</code> is your core component,{" "}
                <code className="bg-muted px-1 rounded">preview/page.tsx</code> shows how to use it.
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form Panel */}
        <div className="w-1/3 shrink-0 overflow-y-auto overflow-x-hidden">
          <div className="space-y-4 pr-2">
              {/* Basic Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Component Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs">Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Glow Button"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      minLength={3}
                      maxLength={100}
                      className="h-9"
                    />
                    {fieldErrors.name && (
                      <p className="text-xs text-red-500">{fieldErrors.name[0]}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-xs">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your component..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      minLength={10}
                      maxLength={500}
                      rows={3}
                      className="resize-none text-sm"
                    />
                    <p className="text-[10px] text-muted-foreground text-right">
                      {description.length}/500
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 w-full">
                      <Label className="text-xs">Type</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="h-9 text-xs w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPONENT_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value} className="text-xs">
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 w-full">
                      <Label className="text-xs">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="h-9 text-xs w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat} className="text-xs">
                              {cat.charAt(0) + cat.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dependencies - Important! */}
              <Card className="border-orange-500/20 bg-orange-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Package className="h-4 w-4 text-orange-500" />
                    NPM Dependencies
                  </CardTitle>
                  <CardDescription className="text-xs">
                    List packages like framer-motion, three, gsap, etc.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="framer-motion, @radix-ui/react-dialog"
                    value={dependencies}
                    onChange={(e) => setDependencies(e.target.value)}
                    className="h-9 font-mono text-xs"
                  />
                  {dependencies && (
                    <div className="bg-zinc-900 rounded-md p-2">
                      <code className="text-xs text-green-400 font-mono">
                        npm i {dependencies.split(",").map(d => d.trim()).filter(Boolean).join(" ")}
                      </code>
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    Admin will install these before testing your component
                  </p>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="animation, hero, landing-page"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    Comma-separated (max 5)
                  </p>
                </CardContent>
              </Card>

              {/* Preview Screenshot */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Screenshot
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Upload a preview image (optional but recommended)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    value={previewImage}
                    onChange={setPreviewImage}
                    disabled={isLoading}
                  />
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tier"
                        value="COMMUNITY_FREE"
                        checked={tier === "COMMUNITY_FREE"}
                        onChange={(e) => setTier(e.target.value)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Free</span>
                    </label>
                    <label className={cn(
                      "flex items-center gap-2",
                      isVerifiedSeller ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                    )}>
                      <input
                        type="radio"
                        name="tier"
                        value="COMMUNITY_PAID"
                        checked={tier === "COMMUNITY_PAID"}
                        onChange={(e) => setTier(e.target.value)}
                        disabled={!isVerifiedSeller}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Paid</span>
                    </label>
                  </div>

                  {tier === "COMMUNITY_PAID" && isVerifiedSeller && (
                    <div className="space-y-1.5">
                      <Label htmlFor="price" className="text-xs">Price (USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          min="1"
                          max="999"
                          step="0.01"
                          placeholder="9.99"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required={tier === "COMMUNITY_PAID"}
                          className="pl-8 h-9"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        You receive 80%, platform takes 20%
                      </p>
                    </div>
                  )}

                  {!isVerifiedSeller && (
                    <p className="text-[10px] text-muted-foreground">
                      <Link href="/seller" className="text-primary hover:underline">
                        Become a seller
                      </Link>{" "}
                      to submit paid components
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Tips */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2 text-xs">
                    <Lightbulb className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                    <div className="text-muted-foreground">
                      <span className="font-medium text-foreground">Tips:</span> Use Tailwind CSS, Lucide icons, and cn() utility. List external deps like Three.js or GSAP above.{" "}
                      <Link href="/docs/component-guide" className="text-primary hover:underline" target="_blank">
                        Full guide <ExternalLink className="h-2.5 w-2.5 inline" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
        </div>
      </div>
    </form>
  );
}
