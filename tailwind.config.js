/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        forest: { DEFAULT: '#173F2D', dark: '#0F2E20', 900: '#0B2418' },
        botanical: '#2F6245',
        sage: { DEFAULT: '#8FA88F', soft: '#B7C8B5' },
        mist: '#DDE8DC',
        warm: '#FCFCF9',
        card: '#F2F3F0',
        ink: '#23352A',
        muted: '#5F6B63',
        line: '#E1E5DF',
        clay: '#B5663F',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '12px' },
      boxShadow: {
        soft: '0 1px 2px rgba(23,63,45,0.05), 0 10px 28px -14px rgba(23,63,45,0.18)',
        lift: '0 2px 6px rgba(23,63,45,0.06), 0 22px 44px -18px rgba(23,63,45,0.3)',
        float: '0 18px 40px -16px rgba(11,36,24,0.45)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-in': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } },
        'slide-in-right': { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        'slow-zoom': { '0%': { transform: 'scale(1.08)' }, '100%': { transform: 'scale(1)' } },
      },
      animation: {
        'fade-up': 'fade-up .7s cubic-bezier(.2,.7,.2,1) both',
        'fade-in': 'fade-in .3s ease both',
        'slide-in': 'slide-in .3s cubic-bezier(.2,.7,.2,1) both',
        'slide-in-right': 'slide-in-right .3s cubic-bezier(.2,.7,.2,1) both',
        'slow-zoom': 'slow-zoom 2.4s cubic-bezier(.2,.7,.2,1) both',
      },
    },
  },
  plugins: [],
};
