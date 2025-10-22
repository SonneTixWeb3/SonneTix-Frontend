/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Black and white with grays
        paper: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        ink: {
          light: '#404040',
          DEFAULT: '#171717',
          dark: '#000000',
        },
      },
      fontFamily: {
        sans: ['Comic Neue', 'Bangers', 'Patrick Hand', 'ui-sans-serif', 'system-ui'],
        hand: ['Patrick Hand', 'Comic Sans MS', 'cursive'],
        comic: ['Bangers', 'Comic Neue', 'sans-serif'],
      },
      boxShadow: {
        'sketch': '3px 3px 0px 0px rgba(0, 0, 0, 0.8)',
        'sketch-sm': '2px 2px 0px 0px rgba(0, 0, 0, 0.8)',
        'sketch-lg': '5px 5px 0px 0px rgba(0, 0, 0, 0.8)',
        'sketch-xl': '8px 8px 0px 0px rgba(0, 0, 0, 0.8)',
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'wiggle': 'wiggle 0.5s ease-in-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
}
