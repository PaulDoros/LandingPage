import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        black: 'rgb(var(--color-black))',
        white: 'rgb(var(--color-white))',
        primary: {
          '50': 'rgb(var(--color-primary-50))',
          '100': 'rgb(var(--color-primary-100))',
          '200': 'rgb(var(--color-primary-200))',
          '300': 'rgb(var(--color-primary-300))',
          '400': 'rgb(var(--color-primary-400))',
          '500': 'rgb(var(--color-primary-500))',
          '600': 'rgb(var(--color-primary-600))',
          '700': 'rgb(var(--color-primary-700))',
          '800': 'rgb(var(--color-primary-800))',
          '900': 'rgb(var(--color-primary-900))',
          '950': 'rgb(var(--color-primary-950))',
        },
        gray: {
          '50': 'rgb(var(--color-gray-50))',
          '100': 'rgb(var(--color-gray-100))',
          '200': 'rgb(var(--color-gray-200))',
          '300': 'rgb(var(--color-gray-300))',
          '400': 'rgb(var(--color-gray-400))',
          '500': 'rgb(var(--color-gray-500))',
          '600': 'rgb(var(--color-gray-600))',
          '700': 'rgb(var(--color-gray-700))',
          '800': 'rgb(var(--color-gray-800))',
          '900': 'rgb(var(--color-gray-900))',
          '950': 'rgb(var(--color-gray-950))',
        },
        destructive: {
          '50': 'rgb(var(--color-destructive-50))',
          '100': 'rgb(var(--color-destructive-100))',
          '200': 'rgb(var(--color-destructive-200))',
          '300': 'rgb(var(--color-destructive-300))',
          '400': 'rgb(var(--color-destructive-400))',
          '500': 'rgb(var(--color-destructive-500))',
          '600': 'rgb(var(--color-destructive-600))',
          '700': 'rgb(var(--color-destructive-700))',
          '800': 'rgb(var(--color-destructive-800))',
          '900': 'rgb(var(--color-destructive-900))',
          '950': 'rgb(var(--color-destructive-950))',
        },
        background: 'rgb(var(--color-background))',
        foreground: 'rgb(var(--color-foreground))',
        muted: {
          DEFAULT: 'rgb(var(--color-muted))',
          foreground: 'rgb(var(--color-muted-foreground))',
        },
        card: {
          DEFAULT: 'rgb(var(--color-card))',
          foreground: 'rgb(var(--color-card-foreground))',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent))',
          foreground: 'rgb(var(--color-accent-foreground))',
        },
        border: 'rgb(var(--color-border))',
        input: 'rgb(var(--color-input))',
        ring: 'rgb(var(--color-ring))',
      },
      opacity: {
        '15': '0.15',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
