/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Maptale 品牌色系
        'mt-lavender': '#c4b5fd',
        'mt-coral': '#f9a8d4',
        'mt-sky': '#bae6fd',
        'mt-mint': '#a7f3d0',
        'mt-gold': '#fbbf24',
        'mt-peach': '#fde68a',
        'mt-bg-from': '#fce4ec',
        'mt-bg-to': '#e8eaf6',
      },
      backgroundImage: {
        'mt-gradient': 'linear-gradient(135deg, #fce4ec 0%, #f3e8ff 50%, #e8eaf6 100%)',
        'mt-card': 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'fade-up': 'fadeUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'mt-card': '0 8px 32px rgba(196,181,253,0.2), 0 2px 8px rgba(0,0,0,0.05)',
        'mt-card-hover': '0 16px 48px rgba(196,181,253,0.35), 0 4px 16px rgba(0,0,0,0.08)',
        'mt-glow-coral': '0 0 20px rgba(249,168,212,0.4)',
        'mt-glow-lavender': '0 0 20px rgba(196,181,253,0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        'display': ['"PingFang SC"', '"Noto Sans SC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
