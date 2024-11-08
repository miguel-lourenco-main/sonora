'use client';

import React, { useEffect, useState } from 'react';
import { Slider } from '@kit/ui/slider';
import { UnderscoreInput } from './underscore-input'; // Assuming you move UnderscoreInput to a separate file
import { MAX_PAGES_SUBSCRIPTION } from '@kit/shared/constants';

interface PageAmountInputProps {
  onPageCountChange: (pageCount: number) => void;
  className?: string;
  value?: number;
}

export function PageAmountInput({ value, onPageCountChange, className }: PageAmountInputProps) {
  const [pageCount, setPageCount] = useState(value ?? 50);
  const [lastValidValue, setLastValidValue] = useState(value ?? 50);
  const [isFocused, setIsFocused] = useState(false);

  const updatePageCount = (value: number) => {
    let newValue;
    
    // If we're in the forbidden range (5-50)
    if (value > 5 && value < 50) {
      // Stick to the last valid value
      newValue = lastValidValue;
    } else {
      // Outside forbidden range - clamp to valid ranges
      newValue = Math.min(Math.max(5, value), MAX_PAGES_SUBSCRIPTION);
      setLastValidValue(newValue); // Update last valid value
    }
    
    setPageCount(newValue);
    onPageCountChange(newValue);
  };

  const valueToSliderPosition = (value: number) => {
    return Math.log(value / 5) / Math.log(MAX_PAGES_SUBSCRIPTION / 5);
  };

  const sliderPositionToValue = (position: number) => {
    return Math.round(5 * Math.pow(MAX_PAGES_SUBSCRIPTION / 5, position));
  };

  useEffect(() => {
    const newValue = value !== undefined ? value : 50;
    setPageCount(newValue);
    setLastValidValue(newValue);
  }, [value]);

  const isPro = pageCount > 5;

  return (
    <div className={`text-center py-2 ${className}`}>
      <div className='flex flex-col items-center justify-center mb-4'>
        <h2 className="text-3xl font-bold">Pages</h2>
        <UnderscoreInput
          pageCount={pageCount}
          setPageCount={updatePageCount}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
        />
      </div>
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Slider
          min={0}
          max={1}
          step={0.001}
          value={[valueToSliderPosition(pageCount)]}
          onValueChange={(value) => updatePageCount(sliderPositionToValue(value[0] ?? 0))}
          className="w-[60%]"
        />
      </div>
    </div>
  );
}