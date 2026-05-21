import type { Config } from 'tailwindcss';
import tailwindCssAnimate from 'tailwindcss-animate';
import { fontFamily } from 'tailwindcss/defaultTheme';
import tailwindScrollbar from 'tailwind-scrollbar';
import tailwindScrollbarHide from 'tailwind-scrollbar-hide';

/** Sonora semantic colors — values switch in .dark via sonora-tokens.css */
const sonoraTokenNames = [
  'surface-variant',
  'inverse-primary',
  'on-tertiary-fixed-variant',
  'surface-tint',
  'magic-purple',
  'error',
  'surface',
  'on-tertiary',
  'on-primary-fixed',
  'error-container',
  'secondary-container',
  'tertiary-container',
  'on-error-container',
  'primary-fixed',
  'primary-fixed-dim',
  'tertiary-fixed',
  'on-secondary-fixed',
  'surface-dim',
  'on-error',
  'on-surface',
  'surface-container-high',
  'sunset-pink',
  'outline-variant',
  'surface-container-highest',
  'surface-bright',
  'inverse-on-surface',
  'surface-container-low',
  'ink-blue',
  'outline',
  'inverse-surface',
  'on-surface-variant',
  'on-tertiary-container',
  'on-primary-fixed-variant',
  'on-primary-container',
  'tertiary',
  'on-secondary-fixed-variant',
  'tertiary-fixed-dim',
  'surface-container-lowest',
  'secondary-fixed-dim',
  'on-background',
  'storybook-cream',
  'on-secondary-container',
  'secondary-fixed',
  'primary-container',
  'on-tertiary-fixed',
  'surface-container',
  'on-primary',
  'secondary',
  'on-secondary',
] as const;

const sonoraColors = Object.fromEntries(
  sonoraTokenNames.map((name) => [
    name,
    `rgb(var(--sonora-${name}) / <alpha-value>)`,
  ]),
) as Record<(typeof sonoraTokenNames)[number], string>;

export default {
  darkMode: ['class'],
  content: ['./components/**/*.tsx', './app/**/*.tsx'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      screens: {
        '3xl': '1820px',
      },
      borderColor: {
        DEFAULT: 'hsl(var(--border) / <alpha-value>)',
      },
      colors: {
        ...sonoraColors,
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        light: {
          primary: 'hsl(var(--light-primary) / <alpha-value>)',
          foreground: 'hsl(var(--light-foreground) / <alpha-value>)',
          background: 'hsl(var(--light-background) / <alpha-value>)',
        },
        dark: {
          primary: 'hsl(var(--dark-primary) / <alpha-value>)',
          foreground: 'hsl(var(--dark-foreground) / <alpha-value>)',
          background: 'hsl(var(--dark-background) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--sonora-primary) / <alpha-value>)',
          foreground: 'rgb(var(--sonora-on-primary) / <alpha-value>)',
          container: 'rgb(var(--sonora-primary-container) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--sonora-secondary) / <alpha-value>)',
          foreground: 'rgb(var(--sonora-on-secondary) / <alpha-value>)',
          fixed: 'rgb(var(--sonora-secondary-fixed) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        grid: 'hsl(var(--grid-background) / <alpha-value>)',
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
        '4xl': '2rem',
      },
      spacing: {
        gutter: '16px',
        'container-margin-mobile': '20px',
        'container-margin-desktop': '40px',
        'tap-target-min': '44px',
        unit: '8px',
      },
      fontFamily: {
        display: ['var(--font-display)', ...fontFamily.serif],
        body: ['var(--font-body)', ...fontFamily.sans],
        'headline-lg': ['var(--font-display)', ...fontFamily.serif],
        'headline-md': ['var(--font-display)', ...fontFamily.serif],
        'headline-lg-mobile': ['var(--font-display)', ...fontFamily.serif],
        'body-md': ['var(--font-body)', ...fontFamily.sans],
        'body-lg': ['var(--font-body)', ...fontFamily.sans],
        'label-lg': ['var(--font-body)', ...fontFamily.sans],
        'narration-text': ['var(--font-body)', ...fontFamily.sans],
        'display-lg': ['var(--font-display)', ...fontFamily.serif],
        sans: ['var(--font-body)', ...fontFamily.sans],
        heading: ['var(--font-display)', ...fontFamily.serif],
        cal: ['var(--font-cal)', ...fontFamily.sans],
      },
      fontSize: {
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'headline-lg-mobile': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-lg': ['20px', { lineHeight: '30px', fontWeight: '500' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '700' }],
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'narration-text': ['24px', { lineHeight: '36px', fontWeight: '500' }],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '80%': { opacity: '0.6' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '80%': { opacity: '0.6' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'border-beam': {
          '100%': { 'offset-distance': '100%' },
        },
        shine: {
          '0%': { 'background-position': '0% 0%' },
          '50%': { 'background-position': '100% 100%' },
          to: { 'background-position': '0% 0%' },
        },
        'background-position-spin': {
          '0%': { backgroundPosition: 'top center' },
          '100%': { backgroundPosition: 'bottom center' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s',
        'fade-down': 'fade-down 0.5s',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        shine: 'shine var(--duration) infinite linear',
        'background-position-spin': 'background-position-spin 3000ms infinite alternate',
      },
    },
  },
  plugins: [tailwindCssAnimate, tailwindScrollbar, tailwindScrollbarHide],
} satisfies Config;
