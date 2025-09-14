import type { Config } from 'tailwindcss';
import tailwindCssAnimate from 'tailwindcss-animate';
import { fontFamily } from 'tailwindcss/defaultTheme';
import tailwindScrollbar from 'tailwind-scrollbar';
import tailwindScrollbarHide from 'tailwind-scrollbar-hide';

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
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
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
      },
      fontFamily: {
        cal: ['var(--font-cal)', ...fontFamily.sans],
        sans: ['-apple-system', 'var(--font-sans)', ...fontFamily.sans],
        heading: ['var(--font-heading)'],
        oregano: ['var(--font-oregano)', ...fontFamily.sans],
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