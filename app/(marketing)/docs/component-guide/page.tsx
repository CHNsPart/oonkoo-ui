import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  FileCode,
  Folder,
  Sparkles,
  Code2,
  Package,
  BookOpen,
  Copy,
  ExternalLink,
  Terminal,
  FolderTree,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Component Submission Guide - OonkooUI",
  description:
    "Learn how to create and submit components to OonkooUI. Complete guide with examples, best practices, and requirements.",
};

function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  return (
    <div className="relative group rounded-lg overflow-hidden border bg-zinc-950">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b bg-zinc-900/50">
          <span className="text-sm text-muted-foreground font-mono">
            {filename}
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-zinc-100">{code}</code>
      </pre>
    </div>
  );
}

function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2 id={id} className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">
      {children}
    </h2>
  );
}

export default function ComponentGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/docs" className="hover:text-foreground">
              Docs
            </Link>
            <span>/</span>
            <span className="text-foreground">Component Guide</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Component Submission Guide</h1>
              <p className="text-muted-foreground mt-1">
                Everything you need to know to submit components to OonkooUI
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <nav className="sticky top-24 space-y-1">
              <p className="font-semibold mb-3">On this page</p>
              {[
                { id: "file-structure", label: "Required File Structure" },
                { id: "component-file", label: "Component File" },
                { id: "preview-file", label: "Preview File" },
                { id: "dependencies", label: "NPM Dependencies" },
                { id: "styling", label: "Styling Guidelines" },
                { id: "what-works", label: "What Works" },
                { id: "examples", label: "Complete Examples" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t mt-4">
                <Button className="w-full" asChild>
                  <Link href="/submit-component">
                    Submit Component
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-3xl">
            {/* File Structure */}
            <SectionHeading id="file-structure">Required File Structure</SectionHeading>
            <p className="text-muted-foreground mb-4">
              Every submission requires exactly <strong>2 files</strong>:
            </p>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5" />
                  Submission Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <FileCode className="h-4 w-4 text-green-500" />
                  <span className="font-mono text-sm">ui/your-component.tsx</span>
                  <Badge className="ml-auto bg-green-500">Main Component</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm">preview/page.tsx</span>
                  <Badge variant="secondary" className="ml-auto">Preview Page</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm">
                <strong className="text-blue-400">How it works:</strong> Our admin team will copy your files to the codebase,
                install any dependencies you list, and manually test the component. Once approved,
                your component gets published with you as the author.
              </p>
            </div>

            {/* Component File */}
            <SectionHeading id="component-file">1. Component File (ui/)</SectionHeading>
            <p className="text-muted-foreground mb-4">
              This is your core component that users will install. Place it in the <code className="bg-muted px-1 rounded">ui/</code> folder.
            </p>
            <CodeBlock
              filename="ui/glow-button.tsx"
              code={`"use client"

import { cn } from "@/lib/utils"

interface GlowButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "purple" | "blue" | "green"
}

export function GlowButton({
  children,
  className,
  variant = "purple"
}: GlowButtonProps) {
  const colors = {
    purple: "bg-purple-600 hover:shadow-purple-500/50",
    blue: "bg-blue-600 hover:shadow-blue-500/50",
    green: "bg-green-600 hover:shadow-green-500/50",
  }

  return (
    <button
      className={cn(
        "px-6 py-3 rounded-lg text-white font-medium",
        "hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]",
        "transition-all duration-300",
        colors[variant],
        className
      )}
    >
      {children}
    </button>
  )
}`}
            />

            {/* Preview File */}
            <SectionHeading id="preview-file">2. Preview File (preview/)</SectionHeading>
            <p className="text-muted-foreground mb-4">
              This page demonstrates your component in action. Shows admins and users how to use it.
            </p>
            <CodeBlock
              filename="preview/page.tsx"
              code={`import { GlowButton } from "@/components/ui/glow-button"

export default function PreviewPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-background p-8">
      <h1 className="text-3xl font-bold">Glow Button</h1>

      {/* Default variant */}
      <GlowButton>Click Me</GlowButton>

      {/* All variants */}
      <div className="flex gap-4">
        <GlowButton variant="purple">Purple</GlowButton>
        <GlowButton variant="blue">Blue</GlowButton>
        <GlowButton variant="green">Green</GlowButton>
      </div>
    </div>
  )
}`}
            />

            {/* NPM Dependencies */}
            <SectionHeading id="dependencies">NPM Dependencies</SectionHeading>
            <p className="text-muted-foreground mb-4">
              If your component uses external packages like <code className="bg-muted px-1 rounded">framer-motion</code>,
              <code className="bg-muted px-1 rounded">three</code>, <code className="bg-muted px-1 rounded">gsap</code>,
              or <code className="bg-muted px-1 rounded">@radix-ui</code>, list them in the dependencies field.
            </p>

            <Card className="border-orange-500/20 bg-orange-500/5 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-5 w-5 text-orange-500" />
                  Example Dependencies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="font-mono">framer-motion</Badge>
                  <Badge variant="outline" className="font-mono">three</Badge>
                  <Badge variant="outline" className="font-mono">@react-three/fiber</Badge>
                  <Badge variant="outline" className="font-mono">gsap</Badge>
                </div>
                <div className="bg-zinc-900 rounded-md p-3">
                  <code className="text-sm text-green-400 font-mono">
                    npm i framer-motion three @react-three/fiber gsap
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  Admin will run this command before testing your component.
                </p>
              </CardContent>
            </Card>

            <CodeBlock
              filename="ui/liquid-sphere.tsx (with Three.js)"
              code={`"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function Sphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#a855f7"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

export function LiquidSphere() {
  return (
    <div className="w-full h-[400px]">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Sphere />
      </Canvas>
    </div>
  )
}`}
            />

            {/* Styling Guidelines */}
            <SectionHeading id="styling">Styling Guidelines</SectionHeading>
            <div className="grid gap-3 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Use Tailwind CSS</p>
                  <p className="text-sm text-muted-foreground">
                    All Tailwind utility classes are available
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Use cn() for conditional classes</p>
                  <p className="text-sm text-muted-foreground">
                    Import from @/lib/utils: <code className="bg-muted px-1 rounded">cn("base-class", condition && "active")</code>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Use theme CSS variables</p>
                  <p className="text-sm text-muted-foreground">
                    Colors like <code className="bg-muted px-1 rounded">bg-background</code>, <code className="bg-muted px-1 rounded">text-foreground</code>, <code className="bg-muted px-1 rounded">text-muted-foreground</code>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Use Lucide React icons</p>
                  <p className="text-sm text-muted-foreground">
                    Import from lucide-react: <code className="bg-muted px-1 rounded">{"import { Sparkles } from 'lucide-react'"}</code>
                  </p>
                </div>
              </div>
            </div>

            {/* What Works */}
            <SectionHeading id="what-works">What Works</SectionHeading>
            <p className="text-muted-foreground mb-4">
              These are available and will work in your components:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {[
                { name: "React Hooks", desc: "useState, useEffect, useRef, etc." },
                { name: "Tailwind CSS", desc: "All utility classes" },
                { name: "Lucide Icons", desc: "Icon library" },
                { name: "cn() utility", desc: "Class merging" },
                { name: "TypeScript", desc: "Full type support" },
                { name: "framer-motion", desc: "List as dependency" },
                { name: "Three.js", desc: "List as dependency" },
                { name: "GSAP", desc: "List as dependency" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-green-500/5 border-green-500/20"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-muted-foreground mb-4">
              These won't work:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {[
                { name: "API calls", desc: "No fetch, axios, or server calls" },
                { name: "Environment variables", desc: "No process.env access" },
                { name: "Database access", desc: "No Prisma or DB queries" },
                { name: "Server components", desc: "No async components" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-red-500/5 border-red-500/20"
                >
                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Examples */}
            <SectionHeading id="examples">Complete Examples</SectionHeading>

            {/* Example 1: Simple with State */}
            <h3 className="text-lg font-semibold mt-8 mb-3">
              1. Interactive Button with State
            </h3>
            <CodeBlock
              filename="ui/pulse-button.tsx"
              code={`"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

interface PulseButtonProps {
  children: React.ReactNode
  className?: string
}

export function PulseButton({ children, className }: PulseButtonProps) {
  const [isPulsing, setIsPulsing] = useState(false)

  return (
    <button
      className={cn(
        "relative px-6 py-3 rounded-lg",
        "bg-gradient-to-r from-purple-600 to-pink-600",
        "text-white font-medium",
        "hover:scale-105 transition-transform",
        isPulsing && "animate-pulse",
        className
      )}
      onClick={() => {
        setIsPulsing(true)
        setTimeout(() => setIsPulsing(false), 1000)
      }}
    >
      <Sparkles className="inline-block w-4 h-4 mr-2" />
      {children}
    </button>
  )
}`}
            />

            {/* Example 2: Animation with Framer Motion */}
            <h3 className="text-lg font-semibold mt-8 mb-3">
              2. Animated Card (requires framer-motion)
            </h3>
            <CodeBlock
              filename="ui/float-card.tsx"
              code={`"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FloatCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function FloatCard({ title, children, className }: FloatCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={cn(
        "p-6 rounded-xl border bg-card",
        "shadow-lg hover:shadow-xl transition-shadow",
        className
      )}
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {children}
    </motion.div>
  )
}`}
            />

            {/* Example 3: 3D with Three.js */}
            <h3 className="text-lg font-semibold mt-8 mb-3">
              3. 3D Element (requires three, @react-three/fiber)
            </h3>
            <CodeBlock
              filename="ui/spinning-cube.tsx"
              code={`"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function Cube() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshNormalMaterial />
    </mesh>
  )
}

export function SpinningCube() {
  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <Cube />
      </Canvas>
    </div>
  )
}`}
            />

            {/* CTA */}
            <div className="mt-12 p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 text-center">
              <h3 className="text-2xl font-bold mb-3">Ready to Submit?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your two files, list any dependencies, and submit. Our team manually
                tests every component for quality.
              </p>
              <div className="flex justify-center gap-3">
                <Button size="lg" asChild>
                  <Link href="/submit-component">
                    Submit Component
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/components">
                    Browse Examples
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
