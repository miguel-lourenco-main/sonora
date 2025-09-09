import type { Config } from 'tailwindcss';
import baseConfig from '@kit/tailwind-config';
import tailwindScrollbar from 'tailwind-scrollbar';
import tailwindScrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: [...baseConfig.content, './components/**/*.tsx', './app/**/*.tsx'],
  presets: [baseConfig],
  plugins: [tailwindScrollbar, tailwindScrollbarHide],
} satisfies Config;