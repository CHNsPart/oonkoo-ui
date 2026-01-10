"use client";

import { motion } from "framer-motion";

interface AnimatedVerifiedBadgeProps {
  className?: string;
}

export function AnimatedVerifiedBadge({ className }: AnimatedVerifiedBadgeProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        {/* Animated OonkoO Logo */}
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 338 125"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Green Circle - Main brand element */}
          <motion.path
            d="M124.118 62.0588C124.118 96.333 96.333 124.118 62.0588 124.118C27.7847 124.118 0 96.333 0 62.0588C0 27.7847 27.7847 0 62.0588 0C96.333 0 124.118 27.7847 124.118 62.0588Z"
            stroke="#3CB371"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0, fill: "rgba(60, 179, 113, 0)" }}
            animate={{ pathLength: 1, opacity: 1, fill: "rgba(60, 179, 113, 1)" }}
            transition={{
              pathLength: { type: "spring", duration: 1.5, bounce: 0 },
              opacity: { duration: 0.01 },
              fill: { duration: 0.5, delay: 1.5 },
            }}
          />
          {/* Small circle */}
          <motion.path
            d="M337.6 91.847C337.6 109.67 323.152 124.118 305.329 124.118C287.507 124.118 273.059 109.67 273.059 91.847C273.059 74.0245 287.507 59.5764 305.329 59.5764C323.152 59.5764 337.6 74.0245 337.6 91.847Z"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
            initial={{ pathLength: 0, opacity: 0, fill: "rgba(0, 0, 0, 0)" }}
            animate={{ pathLength: 1, opacity: 1, fill: "currentColor" }}
            transition={{
              pathLength: { type: "spring", duration: 1.5, bounce: 0, delay: 0.2 },
              opacity: { duration: 0.01 },
              fill: { duration: 0.5, delay: 1.7 },
            }}
          />
          {/* Triangle 1 */}
          <motion.path
            d="M132.61 1.24121L203.553 124.118H61.6675L132.61 1.24121Z"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
            initial={{ pathLength: 0, opacity: 0, fill: "rgba(0, 0, 0, 0)" }}
            animate={{ pathLength: 1, opacity: 1, fill: "currentColor" }}
            transition={{
              pathLength: { type: "spring", duration: 1.5, bounce: 0, delay: 0.4 },
              opacity: { duration: 0.01 },
              fill: { duration: 0.5, delay: 1.9 },
            }}
          />
          {/* Triangle 2 */}
          <motion.path
            d="M206.035 111.706L170.564 50.2677L241.507 50.2677L206.035 111.706Z"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
            initial={{ pathLength: 0, opacity: 0, fill: "rgba(0, 0, 0, 0)" }}
            animate={{ pathLength: 1, opacity: 1, fill: "currentColor" }}
            transition={{
              pathLength: { type: "spring", duration: 1.5, bounce: 0, delay: 0.6 },
              opacity: { duration: 0.01 },
              fill: { duration: 0.5, delay: 2.1 },
            }}
          />
          {/* Triangle 3 */}
          <motion.path
            d="M243.989 62.6794L279.46 124.118L208.518 124.118L243.989 62.6794Z"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
            initial={{ pathLength: 0, opacity: 0, fill: "rgba(0, 0, 0, 0)" }}
            animate={{ pathLength: 1, opacity: 1, fill: "currentColor" }}
            transition={{
              pathLength: { type: "spring", duration: 1.5, bounce: 0, delay: 0.8 },
              opacity: { duration: 0.01 },
              fill: { duration: 0.5, delay: 2.3 },
            }}
          />
        </motion.svg>

        {/* Official Text */}
        <motion.span
          className="text-sm font-semibold text-[#3CB371]"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 2.5 }}
        >
          Official
        </motion.span>
      </div>
    </div>
  );
}
