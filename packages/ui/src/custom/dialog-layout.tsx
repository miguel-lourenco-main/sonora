import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../shadcn/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../shadcn/tooltip';
import { cn } from "../lib"


export default function DialogLayout({
    trigger,
    children,
    title,
    description,
    footer,
    reset,
    externalOpen,
    externalSetOpen,
    onOpen,
    tooltip,
    contentClassName
}:{
    trigger: () => React.ReactNode
    children: React.ReactNode
    title?: string
    description?: string
    footer?: () => React.ReactNode
    reset?: () => void
    externalOpen?: boolean
    externalSetOpen?: (open: boolean) => void
    onOpen?: () => void
    tooltip?: string
    contentClassName?: string
}) {

  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = externalOpen !== undefined && externalSetOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;

  const handleOpenChange = React.useCallback((open: boolean) => {

    if (isControlled) {
      externalSetOpen(open);
    } else {
      setInternalOpen(open);
    }
    if (open) {
      onOpen?.();
    } else {
      reset?.();
    }
  }, [isControlled, isOpen, externalSetOpen, onOpen, reset]);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <div>
            {tooltip ? (
              <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {trigger()}
                    </TooltipTrigger>
                    <TooltipContent className='bg-muted'>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ):(
                trigger()
            )}
        </div>
      </DialogTrigger>
      <DialogContent 
        onInteractOutside={(event) => event.preventDefault()}
        optionalClose={() => handleOpenChange(false)}
        className={cn("max-w-[90vw] max-h-[90vh] size-fit", contentClassName)} 
      >
        <DialogHeader >
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
              {description}
          </DialogDescription>
        </DialogHeader>
        {children}
        {footer && (
          <DialogFooter>
            {footer()}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}