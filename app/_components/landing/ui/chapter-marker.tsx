import { cn } from '@kit/ui/lib';

/**
 * Small editorial chapter label — "01 — Listen" — that threads the page together
 * like chapters in a storybook.
 */
export function ChapterMarker({
  index,
  label,
  className,
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 font-label-lg text-label-lg uppercase tracking-[0.25em] text-tertiary',
        className,
      )}
    >
      <span className="tabular-nums">{index}</span>
      <span className="h-px w-10 bg-tertiary/40" aria-hidden="true" />
      {label}
    </span>
  );
}
