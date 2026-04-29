/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#060B18', 2: '#0C1425', 3: '#111D35', 4: '#162447' },
        'blue-deslud': { DEFAULT: '#1464DC', 2: '#1878F0', dark: '#0A3D91' },
        'cyan-deslud': { DEFAULT: '#00BFFF', 2: '#00DFFF' },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['"Barlow"', 'sans-serif'],
      },
      animation: {
        'drop': 'dropFall 4s infinite ease-in',
        'float': 'float 3s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s infinite',
        'load-fill': 'loadFill 1.2s ease forwards',
        'fade-up': 'fadeInUp 0.7s ease both',
        'fade-right': 'fadeInRight 0.8s ease both',
        'fade-down': 'fadeInDown 0.7s ease both',
      },
      keyframes: {
        dropFall: {
          '0%': { opacity: '0', transform: 'rotate(-45deg) translateY(-20px)' },
          '20%': { opacity: '0.8' },
          '80%': { opacity: '0.4' },
          '100%': { opacity: '0', transform: 'rotate(-45deg) translateY(60px)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.5)' },
        },
        loadFill: { from: { width: '0%' }, to: { width: '100%' } },
        fadeInUp: { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeInRight: { from: { opacity: '0', transform: 'translateX(40px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeInDown: { from: { opacity: '0', transform: 'translateY(-20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      boxShadow: {
        glow: '0 0 40px rgba(0,191,255,0.3)',
        'glow-blue': '0 8px 32px rgba(20,100,220,0.4)',
        card: '0 20px 60px rgba(6,11,24,0.5)',
      },
    },
  },
  plugins: [],
}
