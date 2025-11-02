import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sci-fi-dark': '#0a0a15',
        'sci-fi-darker': '#1a1a2e',
        'sci-fi-accent': '#00f5ff',
        'sci-fi-accent-dark': '#00c4cc',
        'sci-fi-purple': '#8338ec',
        'sci-fi-pink': '#ff0080',
        'sci-fi-cyan': '#00f5ff',
        'sci-fi-yellow': '#ffbe0b',
      },
      fontFamily: {
        'sci-fi': ['Space Grotesk', 'Archivo', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sci-fi': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'sci-fi-glow': '0 12px 40px 0 rgba(255, 0, 128, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

