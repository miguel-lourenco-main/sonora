"use client";

import {
  MultiSelector,
  MultiSelectorOpenTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@kit/ui/multi-select";
import { useTranslation } from 'react-i18next'


const options = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Angular", value: "angular" },
  { label: "Next.js", value: "nextjs" },
  { label: "ReactJs", value: "reactjs" },
  { label: "ReactNative", value: "reactnative" },
];

const MultiSelectCollections = ({ 
    className,
    onChange, 
    collections
}: { 
    className?: string,
    onChange: (value: string[]) => void, 
    collections: string[]
}) => {

  const { t } = useTranslation('vercel')

  return (
    <MultiSelector values={collections} onValuesChange={onChange} loop={false} className={className}>
      <MultiSelectorOpenTrigger>
        <MultiSelectorInput placeholder={t('select_collections')} />
      </MultiSelectorOpenTrigger>
      <MultiSelectorContent>
        <MultiSelectorList>
          {options.map((option, i) => (
            <MultiSelectorItem key={i} value={option.value}>
              {option.label}
            </MultiSelectorItem>
          ))}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  );
};

export default MultiSelectCollections;
