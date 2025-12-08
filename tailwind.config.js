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
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      colors: {
        'bg-dark': '#1A1A1A',
        'bg-darker': '#0F0F0F',
        'text-gray': '#AAAAAA',
        'accent-orange': '#FF7F3E',
        'card-bg': '#FFFFFF',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      fontSize: {
        'xs-mobile': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'sm-mobile': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
      },
    },
  },
  plugins: [],
}

