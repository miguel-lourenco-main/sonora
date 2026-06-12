'use client';

import { cn } from '@kit/ui/lib';

interface SonoraChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export function SonoraChip({ label, active, onClick, className, icon }: SonoraChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-h-tap-target-min inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-2 font-label-lg text-label-lg transition-all active:scale-95',
        active
          ? 'bg-primary text-on-primary shadow-md magical-glow'
          : 'bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-container',
        className,
      )}
    >
      {icon}
      {label}
    </button>
  );
}
