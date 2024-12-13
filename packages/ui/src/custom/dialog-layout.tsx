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

/**
 * DialogLayout Component
 * A reusable dialog/modal component that supports both controlled and uncontrolled states,
 * with optional tooltip, header, footer, and custom content.
 * 
 * @component
 */
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
    trigger: () => React.ReactNode       // Function that returns the trigger element
    children: React.ReactNode            // Content to be displayed inside the dialog
    title?: string                       // Optional dialog title
    description?: string                 // Optional dialog description
    footer?: () => React.ReactNode       // Optional footer content
    reset?: () => void                   // Optional reset function called when dialog closes
    externalOpen?: boolean               // Optional external open state for controlled usage
    externalSetOpen?: (open: boolean) => void  // Optional external state setter for controlled usage
    onOpen?: () => void                  // Optional callback when dialog opens
    tooltip?: string                     // Optional tooltip for the trigger element
    contentClassName?: string            // Optional additional classes for the dialog content
}) {

  // Internal state for uncontrolled usage
  const [internalOpen, setInternalOpen] = React.useState(false);

  // Determine if dialog is controlled externally
  const isControlled = externalOpen !== undefined && externalSetOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;

  /**
   * Handles dialog open state changes
   * Manages both controlled and uncontrolled states
   * Triggers appropriate callbacks (onOpen, reset)
   */
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
  }, [isControlled, externalSetOpen, onOpen, reset]);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleOpenChange}
    >
      {/* Dialog trigger with optional tooltip */}
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

      {/* Dialog content with header, body, and footer */}
      <DialogContent 
        // Prevent closing when clicking outside
        onInteractOutside={(event) => event.preventDefault()}
        // Optional close handler
        optionalClose={() => handleOpenChange(false)}
        // Merge default and custom classes
        className={cn("max-w-[90vw] max-h-[90vh] size-fit", contentClassName)} 
      >
        {/* Dialog header with title and description */}
        <DialogHeader >
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
              {description}
          </DialogDescription>
        </DialogHeader>

        {/* Main dialog content */}
        {children}

        {/* Optional footer */}
        {footer && (
          <DialogFooter>
            {footer()}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}