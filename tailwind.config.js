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
          50: '#E5F9F2',
          100: '#C5F0E0',
          200: '#8BDCC1',
          300: '#52C8A2',
          400: '#1FB483',
          500: '#006747',
          600: '#00593D',
          700: '#004A33',
          800: '#003B29',
          900: '#002C1F',
        },
        sage: '#8CAB18',
        forest: '#335E23',
        surface: '#F7FAF8',
        charcoal: '#1A1F2C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.10), 0 2px 4px -1px rgb(0 0 0 / 0.08)',
        drawer: '-8px 0 32px rgb(0 0 0 / 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'progress': 'progress 1s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(24px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        progress: { '0%': { width: '0%' }, '100%': { width: 'var(--progress-width)' } },
      },
    },
  },
  plugins: [],
}
