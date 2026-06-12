import { cn } from '@kit/ui/lib';

interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeading({ title, eyebrow, action, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-6 flex items-end justify-between gap-4', className)}>
      <div className="flex flex-col gap-1.5">
        {eyebrow ? (
          <span className="font-label-lg text-label-lg uppercase tracking-widest text-tertiary">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
