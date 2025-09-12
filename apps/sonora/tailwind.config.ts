import type { Config } from 'tailwindcss';
import baseConfig from '../../tooling/tailwind/index';
import tailwindScrollbar from 'tailwind-scrollbar';
import tailwindScrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: [...baseConfig.content, './components/**/*.tsx', './app/**/*.tsx'],
  presets: [baseConfig],
  plugins: [tailwindScrollbar, tailwindScrollbarHide],
} satisfies Config;