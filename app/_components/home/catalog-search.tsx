'use client';

import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CatalogSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CatalogSearch({ value, onChange, className }: CatalogSearchProps) {
  const { t } = useTranslation('custom');
  const placeholder = t('home.search.placeholder', 'Search stories...');

  return (
    <div className={className}>
      <div className="flex h-12 w-full items-center gap-3 rounded-full border border-outline-variant/40 bg-surface-container px-5 transition-all focus-within:border-tertiary-fixed/60 focus-within:ring-2 focus-within:ring-tertiary-fixed/40">
        <Search className="size-5 shrink-0 text-on-surface-variant" aria-hidden="true" />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="min-w-0 flex-1 bg-transparent font-body-md text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/70 [&::-webkit-search-cancel-button]:hidden"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label={t('home.search.clearLabel', 'Clear search')}
            className="rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
