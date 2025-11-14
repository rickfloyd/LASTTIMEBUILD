/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'fluorescent-pink': '#FF1493',
        'hot-pink': '#FF0080',
        'fluorescent-blue': '#00FFFF',
        'electric-purple': '#8A2BE2',
        'pulsing-cyan': '#00BFFF',
        'electric-orange': '#FF4500',
        'electric-yellow': '#FFFF00',
        'neon-green': '#39FF14',
        'deep-black': '#000000',
        'charcoal': '#1a1a1a',
        'dark-gray': '#2a2a2a',
      },
      backgroundImage: {
        'charcoal-gradient': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%)',
        'fluorescent-gradient': 'linear-gradient(135deg, #FF1493 0%, #00BFFF 50%, #8A2BE2 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #00FFFF 0%, #FF4500 50%, #FFFF00 100%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-in',
        'bounce-glow': 'bounce-glow 1s ease-in-out infinite',
        'cyber-pulse': 'cyber-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%': { 
            boxShadow: '0 0 5px #FF1493, 0 0 10px #FF1493, 0 0 15px #FF1493',
            transform: 'scale(1)'
          },
          '100%': { 
            boxShadow: '0 0 10px #00BFFF, 0 0 20px #00BFFF, 0 0 30px #00BFFF',
            transform: 'scale(1.02)'
          }
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'bounce-glow': {
          '0%, 100%': { 
            transform: 'translateY(0)',
            boxShadow: '0 0 10px #FF1493'
          },
          '50%': { 
            transform: 'translateY(-10px)',
            boxShadow: '0 0 20px #00BFFF, 0 0 30px #00BFFF'
          }
        },
        'cyber-pulse': {
          '0%': { 
            boxShadow: '0 0 5px #00FFFF',
            borderColor: '#00FFFF'
          },
          '50%': { 
            boxShadow: '0 0 20px #FF4500, 0 0 30px #FF4500',
            borderColor: '#FF4500'
          },
          '100%': { 
            boxShadow: '0 0 5px #FFFF00',
            borderColor: '#FFFF00'
          }
        }
      },
      boxShadow: {
        'neon-pink': '0 0 10px #FF1493, 0 0 20px #FF1493, 0 0 30px #FF1493',
        'neon-blue': '0 0 10px #00BFFF, 0 0 20px #00BFFF, 0 0 30px #00BFFF',
        'neon-cyan': '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF',
        'neon-orange': '0 0 10px #FF4500, 0 0 20px #FF4500, 0 0 30px #FF4500',
      }
    },
  },
  plugins: [],
};