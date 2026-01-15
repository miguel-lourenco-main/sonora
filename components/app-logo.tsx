import Image from 'next/image';
import Link from 'next/link';

export function AppLogo({
  href,
  label,
  className,
  width = 48,
  height = 48,
}: {
  href?: string;
  className?: string;
  label?: string;
  width?: number;
  height?: number;
}) {
  return (
    <Link aria-label={label ?? 'Home Page'} href={href ?? '/'}>
      <Image src="/images/app-logo.svg" alt="Sonora Logo" width={width} height={height} className={className} />
    </Link>
  );
}
