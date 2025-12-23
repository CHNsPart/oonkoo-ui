"use client"

import React, { MouseEvent, useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Ripple {
  x: number
  y: number
  size: number
  id: number
}

interface RippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string
  duration?: number
}

// Inject keyframes once globally
let stylesInjected = false
function injectStyles() {
  if (stylesInjected || typeof document === "undefined") return
  const style = document.createElement("style")
  style.textContent = `
    @keyframes oonkoo-ripple {
      0% {
        transform: scale(0);
        opacity: 0.5;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
  stylesInjected = true
}

export const RippleButton = React.forwardRef<
  HTMLButtonElement,
  RippleButtonProps
>(
  (
    {
      className,
      children,
      rippleColor = "#3CB270",
      duration = 600,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<Ripple[]>([])

    useEffect(() => {
      injectStyles()
    }, [])

    const addRipple = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget
        const rect = button.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height) * 2
        const x = event.clientX - rect.left - size / 2
        const y = event.clientY - rect.top - size / 2

        const newRipple: Ripple = {
          x,
          y,
          size,
          id: Date.now(),
        }

        setRipples((prev) => [...prev, newRipple])

        // Remove ripple after animation completes
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
        }, duration)
      },
      [duration]
    )

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      addRipple(event)
      onClick?.(event)
    }

    return (
      <button
        className={cn(
          "relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-[#3CB270]/30 bg-[#1F1C1C] px-4 py-2 text-center text-white transition-colors hover:border-[#3CB270]/50",
          className
        )}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="pointer-events-none absolute rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: rippleColor,
              animation: `oonkoo-ripple ${duration}ms ease-out forwards`,
            }}
          />
        ))}
      </button>
    )
  }
)

RippleButton.displayName = "RippleButton"
