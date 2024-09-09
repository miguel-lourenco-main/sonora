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
import { cn } from '../utils';


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
    externalSetOpen?: React.Dispatch<React.SetStateAction<boolean>>
    onOpen?: () => void
    tooltip?: string
    contentClassName?: string
}) {
  const [internalOpen, internalSetOpen] = React.useState(false);

  const isOpen = externalOpen && externalSetOpen ? externalOpen : internalOpen;
  const setIsOpen = externalOpen && externalSetOpen ? externalSetOpen : internalSetOpen;

  return (
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          setIsOpen(open);
          if (open) {
            onOpen?.();
          } else {
            reset?.();
          }
        }}
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
            optionalClose={() => setIsOpen(false)}
            className={cn("max-w-[90vw] max-h-[90vh] size-fit", contentClassName)} 
          >
              <DialogHeader >
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription>
                      {description}
                  </DialogDescription>
              </DialogHeader>
              {children}
              <DialogFooter>
                {footer && footer()}
              </DialogFooter>
          </DialogContent>
      </Dialog>
  );
}