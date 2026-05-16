/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#01AAFB',
          pink: '#FE84FB',
          yellow: '#FFBE02',
        },
        surface: {
          50: '#FFFFFF',
          100: '#F9FAFB',
          200: '#F3F4F6',
          300: '#E5E7EB',
          400: '#D1D5DB',
        },
        text: {
          primary: '#111827',
          secondary: '#4B5563',
          tertiary: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        mono: ['Geist', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #01AAFB, #FE84FB, #FFBE02)',
        'brand-gradient-horizontal': 'linear-gradient(90deg, #01AAFB, #FE84FB, #FFBE02)',
      }
    },
  },
  plugins: [],
}
