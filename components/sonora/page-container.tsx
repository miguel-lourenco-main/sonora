import { cn } from '@kit/ui/lib';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}

export function PageContainer({ children, className, wide }: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-container-margin-mobile md:px-container-margin-desktop',
        wide ? 'max-w-[1400px]' : 'max-w-[1200px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
