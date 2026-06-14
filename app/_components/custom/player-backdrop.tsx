import Image from 'next/image';

interface PlayerBackdropProps {
  coverUrl: string;
}

/**
 * Ambient backdrop derived from the story cover. Static (never animated) so
 * the blur cost is paid once at paint time.
 */
export function PlayerBackdrop({ coverUrl }: PlayerBackdropProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <Image
        src={coverUrl}
        alt=""
        fill
        priority
        className="scale-125 object-cover opacity-30 blur-3xl saturate-150 dark:opacity-20"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
      <div className="paper-texture absolute inset-0" />
    </div>
  );
}
