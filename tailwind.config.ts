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
        'sci-fi-dark': '#0a0a0f',
        'sci-fi-darker': '#050508',
        'sci-fi-accent': '#00f5ff',
        'sci-fi-accent-dark': '#0099a3',
        'sci-fi-purple': '#8b5cf6',
        'sci-fi-pink': '#ec4899',
        'sci-fi-cyan': '#06b6d4',
      },
      fontFamily: {
        'sci-fi': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sci-fi': '0 0 20px rgba(0, 245, 255, 0.1), 0 0 40px rgba(139, 92, 246, 0.05)',
        'sci-fi-glow': '0 0 30px rgba(0, 245, 255, 0.3)',
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

