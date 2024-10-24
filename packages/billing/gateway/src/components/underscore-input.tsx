'use client';

import { MAX_PAGES_SUBSCRIPTION } from "@kit/shared/constants";
import { cn } from "@kit/ui/utils";
import { forwardRef, useEffect, useRef, useState } from "react";

export const UnderscoreInput = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { pageCount: number, setPageCount: (value: number) => void }>((props, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const divRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(true);
  
    useEffect(() => {
      let interval: NodeJS.Timeout | null = null;
  
      if (isFocused) {
        interval = setInterval(() => {
          setIsVisible(prev => !prev);
        }, 480);
      } else {
        setIsVisible(false);
      }
  
      return () => {
        if (interval) clearInterval(interval);
      };
    }, [isFocused]);
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key >= '0' && e.key <= '9') {
        const newValue = props.pageCount === 0 ? parseInt(e.key, 10) : parseInt(props.pageCount.toString() + e.key, 10);
        props.setPageCount(newValue);
      } else if (e.key === 'Backspace') {
        const newValue = props.pageCount > 9 ? Math.floor(props.pageCount / 10) : 0;
        props.setPageCount(newValue);
      }
    };
  
    useEffect(() => {
      if (isFocused) {
        divRef.current?.focus();
      }
    }, [isFocused]);
  
    const maxDigits = MAX_PAGES_SUBSCRIPTION.toString().length;
    const currentDigits = props.pageCount.toString().length;
    const showUnderscore = currentDigits < maxDigits;
  
    return (
       <div className={cn('hover:bg-muted ease-in-out duration-300 p-2 rounded-lg', isFocused && showUnderscore && props.pageCount !== 0 && 'pr-6')}>
            <div className="relative inline-block">
                <div 
                    ref={(node) => {
                    divRef.current = node;
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                    }}
                    tabIndex={0}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    className={cn(
                    "inline-block w-fit text-center text-2xl rounded-lg bg-transparent outline-none",
                    "ease-in-out duration-300",
                    "border-0 ring-0 focus:ring-0 hover:ring-0",
                    "shadow-none focus:shadow-none hover:shadow-none",
                    props.className
                    )}
                    style={{
                    ...props.style,
                    minWidth: '1ch',
                    }}
                    data-test="polydoc-billing-quantity-input"
                >
                    <span className='text-current'>{props.pageCount}</span>
                </div>
                {isFocused && isVisible && showUnderscore && (
                    <span 
                        className={cn("absolute bottom-1 w-[1rem] h-[1.5px] bg-current animate-blink", {
                            'right-[-1rem]': isFocused,
                            'right-0': props.pageCount === 0,
                        })}
                        style={{ animation: 'blink 1s step-end infinite' }}
                    />
                )}
            </div>
        </div>
    );
});

UnderscoreInput.displayName = 'UnderscoreInput';