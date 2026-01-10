"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  RefreshCw,
  Code2,
  Info,
  Tag,
  Package,
  DollarSign,
  ImageIcon,
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

interface RequestData {
  id: string;
  name: string;
  description: string;
  code: string;
  previewCode: string | null;
  previewImage: string | null;
  type: string;
  category: string;
  tier: string;
  price: number | null;
  tags: string[];
  dependencies: string[];
}

interface ResubmitFormProps {
  request: RequestData;
  isVerifiedSeller: boolean;
}

const COMPONENT_TYPES = [
  { value: "BLOCK", label: "Block", description: "Full section (Hero, Footer, etc.)" },
  { value: "ELEMENT", label: "Element", description: "Single element (Button, Card, etc.)" },
  { value: "TEMPLATE", label: "Template", description: "Full page template" },
  { value: "ANIMATION", label: "Animation", description: "Animation utility" },
];

const CATEGORIES = [
  "HERO",
  "FEATURES",
  "PRICING",
  "TESTIMONIALS",
  "FAQ",
  "FOOTER",
  "NAVIGATION",
  "DASHBOARD",
  "FORMS",
  "CARDS",
  "BUTTONS",
  "CURSOR",
  "ANIMATIONS",
  "BACKGROUND",
  "OTHER",
];

export function ResubmitForm({ request, isVerifiedSeller }: ResubmitFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Form state - initialized with existing values
  const [name, setName] = useState(request.name);
  const [description, setDescription] = useState(request.description);
  const [code, setCode] = useState(request.code);
  const [previewCode, setPreviewCode] = useState(request.previewCode || "");
  const [previewImage, setPreviewImage] = useState<string | undefined>(request.previewImage || undefined);
  const [type, setType] = useState(request.type);
  const [category, setCategory] = useState(request.category);
  const [tier, setTier] = useState(request.tier);
  const [price, setPrice] = useState(request.price?.toString() || "");
  const [tags, setTags] = useState(request.tags.join(", "));
  const [dependencies, setDependencies] = useState(request.dependencies.join(", "));

  // Prevent form submission on Enter key in text inputs
  const preventEnterSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const requestData = {
        name,
        description,
        code,
        previewCode: previewCode || undefined,
        previewImage: previewImage || undefined,
        type,
        category,
        tier,
        price: tier === "COMMUNITY_PAID" ? parseFloat(price) : undefined,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        dependencies: dependencies ? dependencies.split(",").map((d) => d.trim()).filter(Boolean) : [],
      };

      const response = await fetch(`/api/component-requests/${request.id}/resubmit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        throw new Error(data.message || "Failed to resubmit");
      }

      // Redirect to the request detail page
      router.push(`/my-requests/${request.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={preventEnterSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Update your component details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Component Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Animated Hero Section"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              maxLength={100}
            />
            {fieldErrors.name && (
              <p className="text-sm text-red-500">{fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what your component does, its features, and use cases..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={10}
              maxLength={1000}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/1000 characters
            </p>
            {fieldErrors.description && (
              <p className="text-sm text-red-500">{fieldErrors.description[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {COMPONENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      <div>
                        <span>{t.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({t.description})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0) + cat.slice(1).toLowerCase().replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Component Code
          </CardTitle>
          <CardDescription>
            Update your component's source code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Component Source Code *</Label>
            <CodeEditor
              value={code}
              onChange={setCode}
              language="tsx"
              height={350}
              showFullscreenButton
              showCopyButton={false}
            />
            <p className="text-xs text-muted-foreground">
              Update your component code. Must be at least 50 characters.
            </p>
            {fieldErrors.code && (
              <p className="text-sm text-red-500">{fieldErrors.code[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="previewCode">Preview/Demo Code (Optional)</Label>
            <CodeEditor
              value={previewCode}
              onChange={setPreviewCode}
              language="tsx"
              height={200}
              showFullscreenButton
              showCopyButton={false}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Provide example usage code to help reviewers understand how to use your component.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Screenshot */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Preview Screenshot
          </CardTitle>
          <CardDescription>
            Update your component preview screenshot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            value={previewImage}
            onChange={setPreviewImage}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Recommended: 16:9 aspect ratio, minimum 1280x720px.
          </p>
        </CardContent>
      </Card>

      {/* Dependencies & Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Dependencies & Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dependencies">NPM Dependencies</Label>
            <Input
              id="dependencies"
              placeholder="e.g., framer-motion, @radix-ui/react-dialog"
              value={dependencies}
              onChange={(e) => setDependencies(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated list of npm packages
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <Input
              id="tags"
              placeholder="e.g., animation, hero, landing-page"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated tags (max 5)
            </p>
            {fieldErrors.tags && (
              <p className="text-sm text-red-500">{fieldErrors.tags[0]}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing (Sellers Only) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Component Tier</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tier"
                  value="COMMUNITY_FREE"
                  checked={tier === "COMMUNITY_FREE"}
                  onChange={(e) => setTier(e.target.value)}
                  className="h-4 w-4"
                />
                <span>Free</span>
                <Badge variant="secondary">Community Free</Badge>
              </label>
              <label className={`flex items-center gap-2 ${isVerifiedSeller ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}>
                <input
                  type="radio"
                  name="tier"
                  value="COMMUNITY_PAID"
                  checked={tier === "COMMUNITY_PAID"}
                  onChange={(e) => setTier(e.target.value)}
                  disabled={!isVerifiedSeller}
                  className="h-4 w-4"
                />
                <span>Paid</span>
                <Badge variant="outline">Community Paid</Badge>
              </label>
            </div>
            {!isVerifiedSeller && (
              <p className="text-xs text-muted-foreground">
                You must be a verified seller to submit paid components.
              </p>
            )}
          </div>

          {tier === "COMMUNITY_PAID" && isVerifiedSeller && (
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                You'll receive 80% of each sale. Platform fee is 20%.
              </p>
              {fieldErrors.price && (
                <p className="text-sm text-red-500">{fieldErrors.price[0]}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" asChild>
          <Link href={`/my-requests/${request.id}`}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Resubmitting...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Resubmit for Review
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
