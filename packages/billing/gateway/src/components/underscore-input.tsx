'use client';

import { MAX_PAGES_SUBSCRIPTION } from "@kit/shared/constants";
import { cn } from "@kit/ui/utils";
import { forwardRef, useEffect, useRef, useState } from "react";

export const UnderscoreInput = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { 
  isFocused: boolean, 
  setIsFocused: (value: boolean) => void, 
  pageCount: number, 
  setPageCount: (value: number) => void 
}>((props, ref) => {
    const divRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [tempValue, setTempValue] = useState<number>(props.pageCount);
    const [lastValidValue, setLastValidValue] = useState<number>(props.pageCount);
    const [isDirty, setIsDirty] = useState(false);
  
    useEffect(() => {
      if (!isDirty) {
        setTempValue(props.pageCount);
        setLastValidValue(props.pageCount);
      }
    }, [props.pageCount, isDirty]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key >= '0' && e.key <= '9') {
        const newValue = tempValue === 0 ? 
          parseInt(e.key, 10) : 
          parseInt(tempValue.toString() + e.key, 10);
        setTempValue(newValue);
        setIsDirty(true);
      } else if (e.key === 'Backspace') {
        const newValue = tempValue > 9 ? Math.floor(tempValue / 10) : 0;
        setTempValue(newValue);
        setIsDirty(true);
      }
    };

    const handleBlur = () => {
      props.setIsFocused(false);
      if (isDirty) {
        let finalValue = tempValue;
        
        // Apply the 5-50 range logic
        if (tempValue > 5 && tempValue < 50) {
          finalValue = lastValidValue <= 5 ? 50 : 5;
        } else {
          // Clamp the value to valid ranges
          finalValue = Math.min(Math.max(5, tempValue), MAX_PAGES_SUBSCRIPTION);
        }
        
        props.setPageCount(finalValue);
        setIsDirty(false);
      }
    };
  
    useEffect(() => {
      if (props.isFocused) {
        divRef.current?.focus();
      }
    }, [props.isFocused]);
  
    const maxDigits = MAX_PAGES_SUBSCRIPTION.toString().length;
    const currentDigits = tempValue.toString().length;
    const showUnderscore = currentDigits < maxDigits;

    return (
      <div className={cn('hover:bg-muted ease-in-out duration-300 p-2 rounded-lg', 
        props.isFocused && showUnderscore && tempValue !== 0 && 'pr-6')}>
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
            onFocus={() => {
              props.setIsFocused(true);
              setIsDirty(false);
            }}
            onBlur={handleBlur}
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
            <span className='text-current'>{tempValue}</span>
          </div>
          {props.isFocused && isVisible && showUnderscore && (
            <span 
              className={cn("absolute bottom-1 w-[1rem] h-[1.5px] bg-current animate-blink", {
                'right-[-1rem]': props.isFocused,
                'right-0': tempValue === 0,
              })}
              style={{ animation: 'blink 1s step-end infinite' }}
            />
          )}
        </div>
      </div>
    );
  }
);

UnderscoreInput.displayName = 'UnderscoreInput';