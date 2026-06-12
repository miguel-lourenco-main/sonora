import { cn } from '@kit/ui/lib';

interface SonoraCardProps {
  children: React.ReactNode;
  className?: string;
  grain?: boolean;
  hover?: boolean;
  interactive?: boolean;
}

export function SonoraCard({
  children,
  className,
  grain = true,
  hover = true,
  interactive = false,
}: SonoraCardProps) {
  return (
    <div
      className={cn(
        'size-full flex flex-col relative overflow-hidden rounded-[32px] bg-surface-container-low p-6 story-card-shadow',
        grain && 'grain-overlay',
        hover && 'transition-all duration-300 ease-sonora hover:-translate-y-2 hover:shadow-xl magical-glow',
        interactive &&
          'focus-within:ring-2 focus-within:ring-tertiary-fixed/70 focus-within:ring-offset-2 focus-within:ring-offset-background',
        className,
      )}
    >
      {children}
    </div>
  );
}
