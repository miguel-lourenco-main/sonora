import localFont from 'next/font/local';

/**
 * @sans
 * @description Define here the sans font.
 * Using custom Oregano font from public/fonts/
 */
const sans = localFont({
  src: [
    {
      path: '../public/fonts/Oregano-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Oregano-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-sans',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  preload: true,
});

/**
 * @heading
 * @description Define here the heading font.
 */
const heading = sans;

/**
 * @oregano
 * @description Custom Oregano font for special use cases
 */
const oregano = localFont({
  src: [
    {
      path: '../public/fonts/Oregano-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Oregano-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-oregano',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  preload: true,
});

// we export these fonts into the root layout
export { sans, heading, oregano };
