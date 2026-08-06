import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF9F6', // Soft Off-White
        foreground: '#1F2937', // Charcoal
        primary: {
          DEFAULT: '#A31F34', // MIT Red
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#8A8B8C', // MIT Warm Gray
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F3F4F6',
          foreground: '#6B7280',
        },
        // Oil black & obsidian overrides — warm/cool dark slate instead of pure black
        gray: {
          950: '#14191D', // Rich Oil Black Slate (navbar, footer, dark sections)
          900: '#1C2226', // Dark Surface / Cards
          800: '#252D32',
          700: '#343E44',
          600: '#4A555C',
          550: '#606C73',
          500: '#738087',
          450: '#8A979E',
          400: '#A3AFB5',
          350: '#B8C4CA',
          300: '#D1D9DE',
          250: '#DCE2E6',
          200: '#E5EAED',
          150: '#EFEFEF',
          100: '#F5F5F5',
          50:  '#FAFAFA',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '28px',
      },
      // Extended breakpoints — full device spectrum
      screens: {
        'xs':    '375px',   // Small phones
        'sm':    '640px',   // Large phones / small tablets
        'md':    '768px',   // Tablets
        'lg':    '1024px',  // Small laptops
        'xl':    '1280px',  // Laptops / desktops
        '2xl':   '1536px',  // Large desktops
        '3xl':   '1920px',  // Full HD monitors
        '4xl':   '2560px',  // QHD / ultra-wide
        '5xl':   '3840px',  // 4K
        '6xl':   '5120px',  // 5K
        '7xl':   '7680px',  // 8K
      },
      // Max-width scale for ultra-wide containers
      maxWidth: {
        '8xl':  '88rem',   // 1408px
        '9xl':  '96rem',   // 1536px
        '10xl': '112rem',  // 1792px
        '11xl': '128rem',  // 2048px — for 4K+ displays
      },
      // Fluid spacing utilities
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
    },
  },
  plugins: [],
}
export default config
