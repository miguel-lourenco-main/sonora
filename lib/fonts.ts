import { Playfair_Display, Quicksand } from 'next/font/google';

/**
 * Display / headline font (storybook personality)
 */
const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

/**
 * Body / UI / narration font
 */
const body = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

/** @deprecated Use `display` — kept for layout import compatibility */
const heading = display;

/** @deprecated Use `body` — kept for layout import compatibility */
const sans = body;

export { display, body, heading, sans };
