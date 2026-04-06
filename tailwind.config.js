/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      colors: {
        // ── Akrion Digitals Official Brand Colors ──
        // Deep forest green backgrounds
        'bg-dark':    '#0D1F13',   // Main page background
        'bg-darker':  '#0A1A0F',   // Slightly deeper (alternating sections)
        'bg-card':    '#132019',   // Card surfaces
        'bg-elevated':'#1A2D20',   // Elevated elements

        // Gold / copper accent (from business card)
        'accent-gold':       '#C9A170',   // Primary accent — warm gold
        'accent-gold-light': '#E2C49A',   // Lighter gold for text/hover
        'accent-gold-dark':  '#9E7A4A',   // Darker gold for pressed states
        'accent-orange':     '#C9A170',   // Legacy alias → now maps to gold

        // Forest greens for borders / glows
        'green-border': 'rgba(100,180,120,0.12)',
        'green-light':  '#2D6B3F',

        // Text palette
        'text-cream':  '#F0EAD6',   // Main text (off-white / cream)
        'text-muted':  '#7A9B84',   // Muted text (greenish-gray)
        'text-gray':   '#6B8B74',   // Legacy alias
      },
      fontFamily: {
        sans:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs-mobile': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'sm-mobile': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)', opacity: '0.6' },
          '33%':  { transform: 'translateY(-20px) translateX(10px)',  opacity: '1'   },
          '66%':  { transform: 'translateY(-10px) translateX(-10px)', opacity: '0.8' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%'   },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'shimmer': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)'  },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)'   },
          '100%': { transform: 'rotate(360deg)' },
        },
        'eth-pattern-rotate': {
          '0%':   { transform: 'rotate(0deg) scale(1)'    },
          '50%':  { transform: 'rotate(180deg) scale(1.05)' },
          '100%': { transform: 'rotate(360deg) scale(1)'  },
        },
      },
      animation: {
        float:              'float 6s ease-in-out infinite',
        'gradient-shift':   'gradient-shift 4s ease infinite',
        'blink':            'blink 1s step-end infinite',
        'shimmer':          'shimmer 2s ease-in-out infinite',
        'spin-slow':        'spin-slow 8s linear infinite',
        'eth-spin':         'eth-pattern-rotate 12s linear infinite',
      },
      backgroundSize: {
        '200%': '200%',
        '300%': '300%',
      },
    },
  },
  plugins: [],
}
