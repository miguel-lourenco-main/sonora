import { cn } from '@kit/ui/lib';
import { Sparkles } from 'lucide-react';

// Cover badge for narration mode (bundled samples vs on-demand TTS).

type SonoraBadgeVariant = 'ai-live' | 'pre-recorded' | 'new-tale';

interface SonoraBadgeProps {
  variant: SonoraBadgeVariant;
  className?: string;
}

const labels: Record<SonoraBadgeVariant, string> = {
  'ai-live': 'AI-Live',
  'pre-recorded': 'Pre-Recorded',
  'new-tale': 'New Tale',
};

export function SonoraBadge({ variant, className }: SonoraBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-tertiary-fixed px-3 py-1 font-label-lg text-label-lg text-on-tertiary-fixed shadow-sm',
        className,
      )}
    >
      {variant === 'ai-live' && <Sparkles className="size-4 fill-current" />}
      {labels[variant]}
    </span>
  );
}
