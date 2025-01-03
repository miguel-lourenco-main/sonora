import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../shadcn/dialog';
import { cn } from "../../lib"

/**
 * DialogLayout Component
 * A reusable dialog/modal component that supports both controlled and uncontrolled states,
 * with optional tooltip, header, footer, and custom content.
 * 
 * @component
 */
interface DialogLayoutProps {
    trigger?: () => React.ReactNode;
    children: React.ReactNode;
    title?: string;
    description?: string;
    contentClassName?: string;
    externalOpen?: boolean;
    externalSetOpen?: (open: boolean) => void;
    reset?: () => void;
}

export default function DialogLayout({
    trigger,
    children,
    title,
    description,
    contentClassName,
    externalOpen,
    externalSetOpen,
    reset
}: DialogLayoutProps) {
    return (
        <Dialog open={externalOpen} onOpenChange={externalSetOpen}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger()}
                </DialogTrigger>
            )}
            <DialogContent className={cn("flex flex-col max-h-[90vh]", contentClassName)}>
                {(title || description) && (
                    <div className="flex-shrink-0 mb-4">
                        {title && <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            {description && <DialogDescription>{description}</DialogDescription>}
                        </DialogHeader>}
                    </div>
                )}
                <div className="flex-1 overflow-y-auto scrollbar-hide pb-4 p-1">
                    {children}
                </div>
                <div className="flex-shrink-0 pt-4 border-t">
                    <slot name="footer" />
                </div>
            </DialogContent>
        </Dialog>
    );
}