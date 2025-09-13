import * as React from 'react';
import { cn } from '../lib';

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 pb-6', className)}
        {...props}
      >
        {title && (
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {children}
      </div>
    );
  }
);
PageHeader.displayName = 'PageHeader';

export { PageHeader };
