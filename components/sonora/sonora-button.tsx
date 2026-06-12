'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

import { cn } from '@kit/ui/lib';

import { pressable } from '~/lib/motion/variants';

const MotionLink = motion.create(Link);

type SonoraButtonVariant = 'primary' | 'tonal' | 'ghost';
type SonoraButtonSize = 'md' | 'lg';

interface SonoraButtonProps {
  children: React.ReactNode;
  variant?: SonoraButtonVariant;
  size?: SonoraButtonSize;
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  'aria-label'?: string;
}

const variantClasses: Record<SonoraButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary shadow-glow-strong hover:brightness-110 sonora-button-shine',
  tonal:
    'bg-tertiary-container text-on-tertiary-fixed hover:bg-tertiary-container/80 shadow-glow',
  ghost:
    'border border-outline-variant bg-surface/60 text-on-surface backdrop-blur-sm hover:bg-surface-container-low hover:border-outline',
};

const sizeClasses: Record<SonoraButtonSize, string> = {
  md: 'px-6 py-2.5 text-label-lg',
  lg: 'px-8 py-3.5 text-label-lg md:text-base',
};

export function SonoraButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  href,
  onClick,
  disabled,
  type = 'button',
  'aria-label': ariaLabel,
}: SonoraButtonProps) {
  const classes = cn(
    'glow-focus relative inline-flex min-h-tap-target-min cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full font-label-lg font-bold transition-colors duration-200',
    variantClasses[variant],
    sizeClasses[size],
    disabled && 'pointer-events-none opacity-50',
    className,
  );

  if (href) {
    return (
      <MotionLink href={href} className={classes} aria-label={ariaLabel} {...pressable}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
      {...pressable}
    >
      {children}
    </motion.button>
  );
}
