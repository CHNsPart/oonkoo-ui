"use client";
import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

/**
 * MagnetCard component props
 * @param rotateDepth Maximum rotation angle in degrees
 * @param translateDepth Maximum translation distance in pixels
 * @param className Additional CSS classes
 * @param children Child elements to render inside the card
 */
interface MagnetCardProps {
  rotateDepth?: number;
  translateDepth?: number;
  className?: string;
  children: React.ReactNode;
}

export const MagnetCard = ({
  rotateDepth = 17.5,
  translateDepth = 20,
  className,
  children,
}: MagnetCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`-${rotateDepth}deg`, `${rotateDepth}deg`],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`${rotateDepth}deg`, `-${rotateDepth}deg`],
  );

  const translateX = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${translateDepth}px`, `${translateDepth}px`],
  );
  const translateY = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${translateDepth}px`, `-${translateDepth}px`],
  );

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 0.75) 20%, rgba(255, 255, 255, 0) 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className={cn("perspective-distant transform-3d", className)}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
        }}
        initial={{ scale: 1, z: 0 }}
        whileHover={{
          scale: 1.05,
          z: 50,
          transition: { duration: 0.2 },
        }}
        className="relative rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
      >
        {children}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded-[16px] mix-blend-overlay"
          style={{
            background: glareBackground,
            opacity: 0.6,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </div>
  );
};

export default function Preview(props: Partial<MagnetCardProps> = {}) {
  const {
    rotateDepth = 17.5,
    translateDepth = 20,
  } = props;

  return (
    <div className="min-h-[500px] w-full flex items-center justify-center bg-background p-8">
      <MagnetCard
        className="w-[400px]"
        rotateDepth={rotateDepth}
        translateDepth={translateDepth}
      >
        <div className="rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-green-500 overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-green-600/50 to-emerald-600/50 flex items-center justify-center">
            <div className="text-white/40 text-6xl font-black">🟢🟢🟢</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-900/50 p-6 flex items-center justify-between border-t border-white/10">
            <div className="flex items-center gap-2">
              <Image
                src="https://ui.oonkoo.com/free-plan-badge.svg"
                alt="Oonkoo Logo"
                width={32}
                height={32}
                className="rounded-full size-10 object-cover"
              />
              OonkoO UI
            </div>
            <a
              href="https://twitter.com/oonkoohq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </MagnetCard>
    </div>
  );
}
