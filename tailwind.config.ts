import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Tajawal', 'sans-serif'],
        headline: ['Tajawal', 'sans-serif'],
      },
      colors: {
        'gold': '#D4AF37',
        'dark-gold': '#B8860B',
        'light-gold': '#F5E6A3',
        'rich-brown': '#5D4037',
        'dark-brown': '#3E2723',
        'light-brown': '#8D6E63',
        'cream': '#EFEBE9',
        
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      textShadow: {
        DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.10)',
        sm: '0 1px 2px rgba(0, 0, 0, 0.10)',
        md: '0 4px 8px rgba(0, 0, 0, 0.15)',
        lg: '2px 2px 8px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [
      require('tailwindcss-animate'),
      function ({ addUtilities, theme }: { addUtilities: any, theme: any }) {
          const newUtilities = {
              '.text-shadow': {
                  textShadow: theme('textShadow.DEFAULT'),
              },
              '.text-shadow-sm': {
                  textShadow: theme('textShadow.sm'),
              },
               '.text-shadow-md': {
                  textShadow: theme('textShadow.md'),
              },
              '.text-shadow-lg': {
                  textShadow: theme('textShadow.lg'),
              },
          }
          addUtilities(newUtilities, ['responsive', 'hover'])
      }
    ],
} satisfies Config;
