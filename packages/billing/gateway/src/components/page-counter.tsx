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
  const [pageCount, setPageCount] = useState(value ?? 0); 

  const updatePageCount = (value: number) => {
    const clampedValue = Math.min(Math.max(0, value), MAX_PAGES_SUBSCRIPTION);
    setPageCount(clampedValue);
    onPageCountChange(clampedValue);
  };

  useEffect(() => {
    setPageCount(value ?? 0);
  }, [value]);

  return (
    <div className={`text-center py-2 ${className}`}>
      <div className='flex flex-col items-center justify-center mb-4'>
        <h2 className="text-3xl font-bold">Pages</h2>
        <UnderscoreInput
          pageCount={pageCount}
          setPageCount={updatePageCount}
        />
      </div>
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Slider
          min={1}
          max={MAX_PAGES_SUBSCRIPTION}
          step={1}
          value={[pageCount]}
          onValueChange={(value) => updatePageCount(value[0] ?? 0)}
          className="w-[60%]"
        />
      </div>
    </div>
  );
}