import type { LucideIcon } from 'lucide-react';

import { cn } from '@kit/ui/lib';

import { BlurFade } from '../ui/magic-ui/blur-fade';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <BlurFade direction="up">
      <div className={cn('flex flex-col items-center gap-4 py-16 text-center', className)}>
        <div className="magical-glow flex size-16 items-center justify-center rounded-full bg-tertiary-container/40">
          <Icon className="size-7 text-tertiary" aria-hidden="true" />
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
        {description ? (
          <p className="max-w-md font-body-md text-body-md text-on-surface-variant">{description}</p>
        ) : null}
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </BlurFade>
  );
}
