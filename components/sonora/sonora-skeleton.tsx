import { cn } from '@kit/ui/lib';

interface SonoraSkeletonProps {
  className?: string;
}

export function SonoraSkeleton({ className }: SonoraSkeletonProps) {
  return (
    <div className={cn('skeleton-base', className)} aria-hidden="true">
      <div className="shimmer absolute inset-0" />
    </div>
  );
}

export function StoryCardSkeleton({ className }: SonoraSkeletonProps) {
  return (
    <div className={cn('flex flex-col gap-4 rounded-[32px] bg-surface-container-low p-6', className)}>
      <SonoraSkeleton className="aspect-[3/4] w-full rounded-2xl" />
      <SonoraSkeleton className="h-6 w-3/4" />
      <SonoraSkeleton className="h-4 w-1/2" />
    </div>
  );
}
