/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'farm-green': '#4CAF50',
        'soil-brown': '#8B4513',
        'sky-blue': '#87CEEB',
        'sunny-yellow': '#FFD700',
      },
      animation: {
        'float-up': 'floatUp 1.5s ease-out forwards',
        'float-down': 'floatDown 1.5s ease-out forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translate(-50%, -50%) scale(0.7)', opacity: '0' },
          '10%': { transform: 'translate(-50%, -50%) scale(1.1)', opacity: '1' },
          '20%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -150%) scale(1)', opacity: '0' },
        },
        floatDown: {
          '0%': { transform: 'translate(-50%, -50%) scale(0.7)', opacity: '0' },
          '10%': { transform: 'translate(-50%, -50%) scale(1.1)', opacity: '1' },
          '20%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, 50%) scale(1)', opacity: '0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
