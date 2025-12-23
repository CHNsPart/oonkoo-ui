"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveShinyText } from "@/components/ui/wave-shiny-text";
import { cn } from "@/lib/utils";

// =============================================================================
// THREE.JS INTERACTIVE BACKGROUND
// =============================================================================

interface ParticleFieldProps {
  mousePosition: { x: number; y: number };
  color: string;
}

function ParticleField({ mousePosition, color }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const particleCount = 150;

  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;

      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return [positions, velocities];
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const positionAttr = meshRef.current.geometry.attributes.position;
    const pos = positionAttr.array as Float32Array;
    const mouseX = (mousePosition.x - 0.5) * 2;
    const mouseY = -(mousePosition.y - 0.5) * 2;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i3];
      pos[i3 + 1] += velocities[i3 + 1];
      pos[i3 + 2] += velocities[i3 + 2];

      const dx = mouseX - pos[i3];
      const dy = mouseY - pos[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 1.5) {
        const force = (1.5 - dist) * 0.02;
        pos[i3] += dx * force;
        pos[i3 + 1] += dy * force;
      }

      if (pos[i3] > 2) pos[i3] = -2;
      if (pos[i3] < -2) pos[i3] = 2;
      if (pos[i3 + 1] > 2) pos[i3 + 1] = -2;
      if (pos[i3 + 1] < -2) pos[i3 + 1] = 2;
    }
    positionAttr.needsUpdate = true;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.08}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GlowingOrb({ mousePosition, color }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mouseX = (mousePosition.x - 0.5) * 1.5;
    const mouseY = -(mousePosition.y - 0.5) * 1.5;
    meshRef.current.position.x += (mouseX - meshRef.current.position.x) * 0.05;
    meshRef.current.position.y += (mouseY - meshRef.current.position.y) * 0.05;
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  );
}

function InteractiveScene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const primaryColor = "#3cb26f6e";
  return (
    <>
      <ambientLight intensity={0.5} />
      <ParticleField mousePosition={mousePosition} color={primaryColor} />
      <GlowingOrb mousePosition={mousePosition} color={primaryColor} />
    </>
  );
}

// =============================================================================
// PRO UPGRADE CARD COMPONENT
// =============================================================================

const benefits = [
  "50+ Premium Components",
  "Lifetime Updates",
  "Priority Support",
  "Figma Files Included",
];

export function ProUpgradeCard() {
  const { resolvedTheme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const logoSrc = resolvedTheme === "dark"
    ? "/oonkoo-ui-text-darkmode.svg"
    : "/oonkoo-ui-text.svg";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0.5, y: 0.5 });
      }}
      className={cn(
        "relative rounded-2xl overflow-hidden transition-all duration-500 min-h-[420px]",
        "border border-[#3CB270]/20",
        "bg-white dark:bg-[#1F1C1C]",
        isHovered && "border-[#3CB270]/40 shadow-lg shadow-[#3CB270]/10"
      )}
    >
      {/* Three.js Background */}
      <div className="absolute inset-0 opacity-60">
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, 3], fov: 50 }}
            style={{ background: "transparent" }}
            gl={{ alpha: true, antialias: true }}
          >
            <InteractiveScene mousePosition={mousePosition} />
          </Canvas>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex flex-col items-center justify-between mb-4">
          {mounted && (
            <Image
              src={logoSrc}
              alt="OonkoO UI"
              width={60}
              height={15}
              className="size-full mb-2"
            />
          )}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-[#3cb26f]">Upgrade to Pro</span>
          </div>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 text-center">
          Unlock all premium components and features
        </p>

        <ul className="space-y-3 mb-6">
          {benefits.map((benefit, index) => (
            <li
              key={benefit}
              className={cn(
                "flex items-center gap-3 text-sm transition-all duration-300",
                isHovered && "translate-x-1"
              )}
              style={{ transitionDelay: isHovered ? `${index * 50}ms` : "0ms" }}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3CB270]/20">
                <Check className="h-3 w-3 text-[#3CB270]" />
              </div>
              <span className="text-zinc-600 dark:text-zinc-300">{benefit}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button - Updated with styles from first code */}
        <div className="mt-auto">
          <Button
            asChild
            className={cn(
              "group w-full relative overflow-hidden transition-all duration-300 h-11",
              "bg-[#0D0A0A] dark:bg-[#0D0A0A] text-white",
              "hover:bg-[#272323] dark:hover:bg-[#272323]",
              "shadow-sm hover:shadow-lg hover:shadow-[#272323]/25"
            )}
          >
            <Link href="/pricing" className="flex items-center justify-center gap-2">
              <WaveShinyText
                shimmerWidth={100}
                className="font-semibold text-sm text-white transition-colors duration-300"
              >
                View Pricing
              </WaveShinyText>
              <ArrowRight
                className={cn(
                  "h-4 w-4 text-white transition-all duration-300",
                  isHovered && "translate-x-1"
                )}
              />
            </Link>
          </Button>
        </div>

        {/* Decorative Glow */}
        <div
          className={cn(
            "absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none z-[-1]",
            "bg-[#3CB270]/10 blur-3xl transition-opacity duration-500",
            isHovered ? "opacity-100" : "opacity-50"
          )}
          style={{
            transform: `translate(${(mousePosition.x - 0.5) * 20}px, ${(mousePosition.y - 0.5) * 20}px)`,
          }}
        />
      </div>
    </div>
  );
}