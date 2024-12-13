import { useState } from "react";
import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger } from "@kit/ui/multi-select";
import { useTranslation } from "react-i18next";

/**
 * LanguageMultiSelect Component
 * A dropdown component for selecting one or multiple languages
 * 
 * Features:
 * - Supports both controlled and uncontrolled usage
 * - Integrates with i18n for translations
 * - Customizable through className prop
 */
export default function LanguageMultiSelect({
    languages,
    className,
    externalValue,
    externalSetValue
}:{
    languages: {
        value: string;    // Unique identifier for the language
        label: string;    // Display name of the language
    }[];
    className?: string;   // Optional CSS classes
    externalValue?: string[];  // For controlled component usage
    externalSetValue?: (value: string[]) => void;  // For controlled component usage
}){
    // Internal state for uncontrolled usage
    const [internalValue, setInternalValue] = useState<string[]>(
        languages[0] ? [languages[0].label] : []
    );

    // Use external or internal state based on props
    const value = externalValue && externalSetValue? externalValue : internalValue;
    const setValue = externalValue && externalSetValue ? externalSetValue : setInternalValue;

    const { t } = useTranslation('ui');

    return (
      <MultiSelector 
        className={className} 
        values={value} 
        onValuesChange={setValue} 
        loop={false}
      >
        {/* Trigger button with input field */}
        <MultiSelectorTrigger>
          <MultiSelectorInput placeholder={t('selectLanguage')} />
        </MultiSelectorTrigger>

        {/* Dropdown content */}
        <MultiSelectorContent>
          <MultiSelectorList className="max-h-[15rem] overflow-y-auto">
            {/* Language options */}
            {languages.map((option, i) => (
              <MultiSelectorItem key={i} value={option.label}>
                {option.label}
              </MultiSelectorItem>
            ))}
          </MultiSelectorList>
        </MultiSelectorContent>
      </MultiSelector>
    );
  };