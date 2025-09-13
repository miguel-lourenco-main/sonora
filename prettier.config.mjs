/** @typedef  {import("prettier").Config} PrettierConfig */
/** @typedef  {import("@trivago/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
  tabWidth: 2,
  useTabs: false,
  semi: true,
  printWidth: 100,
  singleQuote: true,
  arrowParens: 'always',
  importOrder: [
    '/^(?!.*\\.css).*/',
    '^server-only$',
    '^react$',
    '^react-dom$',
    '^next$',
    '^next/(.*)$',
    '^@supabase/supabase-js$',
    '^@supabase/gotrue-js$',
    '<THIRD_PARTY_MODULES>',
    '^@kit/(.*)$',
    '^~/(.*)$',
    '^[./]',
  ],
  tailwindFunctions: ['tw', 'clsx', 'cn', 'cva'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
};

export default config;
