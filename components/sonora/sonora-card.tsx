import { cn } from '@kit/ui/lib';

// Elevated story tile with optional grain overlay and hover lift.

interface SonoraCardProps {
  children: React.ReactNode;
  className?: string;
  grain?: boolean;
  hover?: boolean;
}

export function SonoraCard({ children, className, grain = true, hover = true }: SonoraCardProps) {
  return (
    <div
      className={cn(
        'size-full flex flex-col relative overflow-hidden rounded-[32px] bg-surface-container-low p-6 story-card-shadow',
        grain && 'grain-overlay',
        hover && 'transition-all duration-500 hover:-translate-y-2 hover:shadow-xl magical-glow',
        className,
      )}
    >
      {children}
    </div>
  );
}
