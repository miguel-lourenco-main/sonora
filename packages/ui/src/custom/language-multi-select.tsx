import { useState } from "react";
import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger } from "@kit/ui/multi-select";
import { useTranslation } from "react-i18next";

export default function LanguageMultiSelect({languages, className, externalValue, externalSetValue}:{
    languages: {
        value: string;
        label: string;
    }[];
    className?: string;
    externalValue?: string[];
    externalSetValue?: (value: string[]) => void;
}){
    const [internalValue, setInternalValue] = useState<string[]>(languages[0] ? [languages[0].label] : []);

    const value = externalValue && externalSetValue? externalValue : internalValue;
    const setValue = externalValue && externalSetValue ? externalSetValue : setInternalValue;

    const { t } = useTranslation('ui');

    return (
      <MultiSelector className={className} values={value} onValuesChange={setValue} loop={false}>
        <MultiSelectorTrigger>
          <MultiSelectorInput placeholder={t('selectLanguage')} />
        </MultiSelectorTrigger>
        <MultiSelectorContent>
          <MultiSelectorList className="max-h-[15rem] overflow-y-auto">
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