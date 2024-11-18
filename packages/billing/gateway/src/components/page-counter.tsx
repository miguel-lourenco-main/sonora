'use client';

import React, { useEffect, useState } from 'react';
import Slider from '@kit/ui/slider';
import { UnderscoreInput } from './underscore-input';
import { MAX_PAGES_SUBSCRIPTION } from '@kit/shared/constants';
import { CurrentBillingInfo } from '../lib/interfaces';
import { TierEffect } from '@kit/ui/tier-effect';

interface PageAmountInputProps {
  onPageCountChange: (pageCount: number) => void;
  billingInfo: CurrentBillingInfo;
  value: number;
  className?: string;
}

const MAX_DIGITS = 7;

export function PageAmountInput({ value, onPageCountChange, billingInfo, className }: PageAmountInputProps) {
  const [pageCount, setPageCount] = useState(value ?? 50);
  const [lastValidValue, setLastValidValue] = useState(value ?? 50);
  const [isFocused, setIsFocused] = useState(false);

  const updatePageCount = (value: number) => {
    let newValue;
    
    // Check for digit limit
    if (value.toString().length > MAX_DIGITS) {
      newValue = lastValidValue;
    }
    // If we're in the forbidden range (5-50)
    else if (value > 5 && value < 50) {
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

    if (value !== undefined) {
      const newValue = value.toString().length > MAX_DIGITS ? lastValidValue : value;
      
      setPageCount(newValue);
      setLastValidValue(newValue);
    }
  }, [value, lastValidValue]);

  const maxDigits = MAX_PAGES_SUBSCRIPTION.toString().length;

  const tierTag = () => {
    
    const effectConfigs = {
      0: { // Free tier
        type: 'beam' as const,
        colors: { from: "#ffaa40", to: "#9c40ff" }
      },
      1: { // Pro tier
        type: 'shine' as const,
        colors: { from: "#A07CFE", to: "#FE8FB5" }
      },
      2: { // Business tier
        type: 'neon' as const,
        colors: { from: "#ff00aa", to: "#00FFF1" }
      }
    };

    const config = effectConfigs[billingInfo.tierIndex as keyof typeof effectConfigs];
    
    if (!config) return null;

    return (
      <TierEffect
        effectType={billingInfo.productName == 'Free' ? 'none' : config.type}
        colors={config.colors}
      >
        {billingInfo.tierText}
      </TierEffect>
    );
  };

  const handleMarkerClick = (value: number) => {
    updatePageCount(value);
  };

  return (
    <div className={`text-center py-2 ${className}`}>
      <div className='flex flex-col items-center gap-y-4'>
        <h2 className="text-4xl font-bold">Pages</h2>
        
        <div className='w-[60%] relative'>
          <div className='mb-6'>
            <div className='flex justify-center'>
              <div className='relative'>
                <UnderscoreInput
                  maxDigits={maxDigits}
                  pageCount={pageCount}
                  setPageCount={updatePageCount}
                  isFocused={isFocused}
                  setIsFocused={setIsFocused}
                />
                <div className='absolute left-full ml-4 top-1/2 -translate-y-1/2'>
                  {tierTag()}
                </div>
              </div>
            </div>
          </div>

          <Slider
            min={0}
            max={1}
            step={0.001}
            value={[valueToSliderPosition(pageCount)]}
            onValueChange={(value) => updatePageCount(sliderPositionToValue(value[0] ?? 0))}
            className="w-full"
          />
          
          <div className="relative w-full mt-3">
            <button
              onClick={() => handleMarkerClick(5)}
              className="absolute text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              style={{ left: 'calc(0% + 9.5px)', transform: 'translateX(-50%)' }}
            >
              5
            </button>
            <button 
              onClick={() => handleMarkerClick(50)}
              className="absolute text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              style={{ left: `calc(${valueToSliderPosition(50) * 100}% + 4px)`, transform: 'translateX(-50%)' }}
            >
              50
            </button>
            <button 
              onClick={() => handleMarkerClick(100)}
              className="absolute text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              style={{ left: `calc(${valueToSliderPosition(100) * 100}% + 2.5px)`, transform: 'translateX(-50%)' }}
            >
              100
            </button>
            <button 
              onClick={() => handleMarkerClick(2000)}
              className="absolute text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              style={{ left: `calc(${valueToSliderPosition(2000) * 100}% - 5.5px)`, transform: 'translateX(-50%)' }}
            >
              2000
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}