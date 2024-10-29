import type { PropsWithChildren } from 'react';

import { cn } from '../lib/utils';
import { Spinner } from './spinner';
import { Loader } from 'lucide-react';
import GeneralLoading from '../custom/general-loading';

export function LoadingOverlay({
  children,
  className,
  fullPage = true,
  spinnerClassName,
}: PropsWithChildren<{
  className?: string;
  spinnerClassName?: string;
  fullPage?: boolean;
  displayLogo?: boolean;
}>) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-4',
        className,
        {
          [`fixed left-0 top-0 z-[100] h-screen w-screen bg-background`]:
            fullPage,
        },
      )}
    >
      <GeneralLoading />

      <div className={'text-sm text-muted-foreground'}>{children}</div>
    </div>
  );
}
