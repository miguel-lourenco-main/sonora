'use client';

import { motion } from 'motion/react';

import { fadeUp, scaleIn, staggerContainer } from '~/lib/motion/variants';

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  /** Animate when scrolled into view (default) or immediately on mount */
  inView?: boolean;
}

export function StaggerGroup({
  children,
  className,
  stagger = 0.06,
  delay = 0,
  inView = true,
}: StaggerGroupProps) {
  const viewProps = inView
    ? { whileInView: 'visible' as const, viewport: { once: true, margin: '-60px' } }
    : { animate: 'visible' as const };

  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      {...viewProps}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fadeUp' | 'scaleIn';
}

export function StaggerItem({ children, className, variant = 'fadeUp' }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={variant === 'scaleIn' ? scaleIn : fadeUp}>
      {children}
    </motion.div>
  );
}
