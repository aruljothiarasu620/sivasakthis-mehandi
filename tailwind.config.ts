import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { maroon: { DEFAULT: '#5b1220', dark: '#3d0b15', soft: '#7d1d2f' }, cream: '#fbf5ea', beige: '#efe2cc', gold: { DEFAULT: '#b8923f', light: '#d9bd7a' }, earth: '#7a5c3e' },
    fontFamily: { serif: ['"Cormorant Garamond"', 'Georgia', 'serif'], sans: ['Jost', 'system-ui', 'sans-serif'] },
    keyframes: { rise: { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'none' } } },
    animation: { rise: 'rise .7s ease-out both' } } },
  plugins: [],
} satisfies Config;
