"use client";

import {
  MultiSelector,
  MultiSelectorTrigger,
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

const MultiSelectKBs = ({ 
    className,
    onChange, 
    knowledgeBases
}: { 
    className?: string,
    onChange: (value: string[]) => void, 
    knowledgeBases: string[]
}) => {

  const { t } = useTranslation('vercel')

  return (
    <MultiSelector values={knowledgeBases} onValuesChange={onChange} loop={false} className={className}>
      <MultiSelectorTrigger>
        <MultiSelectorInput placeholder={t('select_knowledge_bases')} />
      </MultiSelectorTrigger>
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

export default MultiSelectKBs;
