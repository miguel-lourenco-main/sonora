"use client";

import { useRef } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  UseInViewOptions,
  Variants,
} from "framer-motion";

type MarginType = UseInViewOptions["margin"];

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  offset?: number;
  direction?: "up" | "down" | "left" | "right";
  inView?: boolean;
  show?: boolean;
  inViewMargin?: MarginType;
  blur?: string;
  useLayout?: boolean;
}

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  offset = 6,
  direction = "down",
  inView = false,
  show = true,
  inViewMargin = "-50px",
  blur = "6px",
  useLayout = false,
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;
  
  const defaultVariants: Variants = {
    hidden: {
      [direction === "left" || direction === "right" ? "x" : "y"]:
        direction === "right" || direction === "down" ? -offset : offset,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      [direction === "left" || direction === "right" ? "x" : "y"]: 0,
      opacity: 1,
      filter: `blur(0px)`,
    },
    exit: {
      [direction === "left" || direction === "right" ? "x" : "y"]:
        direction === "right" || direction === "down" ? offset : -offset,
      opacity: 0,
      filter: `blur(${blur})`,
    }
  };
  
  const combinedVariants = variant || defaultVariants;

  const motionProps = {
    ref,
    initial: "hidden",
    animate: (isInView && show) ? "visible" : "hidden",
    exit: "exit",
    variants: combinedVariants,
    className,
    ...(useLayout && { layout: true }),
    transition: useLayout ? {
      layout: {
        duration: duration,
        ease: [0.16, 1, 0.3, 1],
      },
      opacity: {
        duration: duration,
        ease: [0.16, 1, 0.3, 1],
      },
      default: {
        duration: duration,
        ease: [0.16, 1, 0.3, 1],
      }
    } : {
      delay: delay,
      duration,
      ease: [0.16, 1, 0.3, 1],
    }
  };

  return useLayout ? (
    <motion.div {...motionProps}>
      {children}
    </motion.div>
  ) : (
    <AnimatePresence mode="sync">
      {(isInView && show) && (
        <motion.div {...motionProps}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}