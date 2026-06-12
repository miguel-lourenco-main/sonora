'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

import { cn } from '@kit/ui/lib';

import { SparkleBorder } from '~/components/ui/magic-ui/sparkle-border';
import { SPRING } from '~/lib/motion/tokens';

interface ChoiceCardProps {
  text: string;
  index: number;
  selected: boolean;
  dimmed: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function ChoiceCard({ text, index, selected, dimmed, disabled, onClick }: ChoiceCardProps) {
  const isPrimary = index === 0;

  return (
    <SparkleBorder isSelected={selected} className="rounded-[24px]">
      <motion.button
        type="button"
        onClick={onClick}
        disabled={disabled}
        animate={{ scale: selected ? 1.03 : 1, opacity: dimmed ? 0.4 : 1 }}
        whileHover={disabled ? undefined : { scale: selected ? 1.03 : 1.02 }}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        transition={SPRING.gentle}
        className={cn(
          'glow-focus group flex min-h-[88px] w-full cursor-pointer items-center justify-between gap-4 rounded-[24px] p-6 text-left',
          isPrimary
            ? 'bg-primary-container text-on-primary-container shadow-card hover:shadow-xl hover:shadow-primary/20'
            : 'glass-card text-on-surface hover:border-tertiary-fixed-dim',
          selected && 'magical-glow-strong',
          disabled && !selected && 'pointer-events-none',
        )}
      >
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              'font-label-lg text-label-lg uppercase tracking-wider',
              isPrimary ? 'text-primary-fixed-dim' : 'text-outline',
            )}
          >
            Choice {String.fromCharCode(65 + index)}
          </span>
          <span className="font-headline-md text-headline-md text-inherit">{text}</span>
        </div>
        <ArrowRight
          className={cn(
            'size-8 shrink-0 transition-transform group-hover:translate-x-2',
            isPrimary ? 'text-tertiary-fixed' : 'text-primary',
          )}
          aria-hidden="true"
        />
      </motion.button>
    </SparkleBorder>
  );
}
