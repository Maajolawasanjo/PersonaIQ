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
        foreground: '#2C353E', // Soft Charcoal (Reduced blackness)
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
        // Softened executive dark slate & charcoal palette (reduced heavy blackness)
        gray: {
          950: '#1F262E', // Softened Dark Slate (Navbar, Footer, Hero)
          900: '#2A323B', // Soft Dark Surface / Cards
          800: '#35404B',
          700: '#44515E',
          600: '#586675',
          550: '#6C7B8B',
          500: '#7E8D9D',
          450: '#94A3B2',
          400: '#ABB8C6',
          350: '#C2CDD8',
          300: '#D6DFE7',
          250: '#E2E8EE',
          200: '#EBF0F4',
          150: '#F2F5F8',
          100: '#F6F8FA',
          50:  '#FAFCFD',
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
