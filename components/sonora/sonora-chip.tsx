'use client';

import { cn } from '@kit/ui/lib';

interface SonoraChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SonoraChip({ label, active, onClick, className }: SonoraChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-h-tap-target-min shrink-0 rounded-full px-6 py-2 font-label-lg text-label-lg transition-all active:scale-95',
        active
          ? 'bg-primary text-on-primary shadow-md magical-glow'
          : 'bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-container',
        className,
      )}
    >
      {label}
    </button>
  );
}
