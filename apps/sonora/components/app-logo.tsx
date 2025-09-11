import Image from 'next/image';
import Link from 'next/link';

export function AppLogo({
  href,
  label,
  className,
}: {
  href?: string;
  className?: string;
  label?: string;
}) {
  return (
    <Link aria-label={label ?? 'Home Page'} href={href ?? '/'}>
      <Image src="/images/logo.svg" alt="Sonora Logo" width={105} height={42} className={className} />
    </Link>
  );
}
