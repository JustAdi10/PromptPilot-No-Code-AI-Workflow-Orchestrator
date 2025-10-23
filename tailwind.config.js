/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // PromptPilot Bruno Simon Inspired Colors
        neon: {
          cyan: '#00E0FF',
          purple: '#9B51E0',
          emerald: '#10B981',
          amber: '#F59E0B',
          glow: 'rgba(0,224,255,0.3)',
        },
        slate: {
          850: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        // 3D Scene Colors
        scene: {
          bg: '#0A0F18',
          surface: '#0F1419',
          glass: 'rgba(255, 255, 255, 0.1)',
          text: {
            primary: '#E4E7EB',
            secondary: '#5A6B7C',
            muted: '#394A5A',
          }
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'glow-pulse': {
          '0%, 100%': {
            'box-shadow': '0 0 20px rgba(0, 224, 255, 0.3)',
          },
          '50%': {
            'box-shadow': '0 0 40px rgba(0, 224, 255, 0.6)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'drive': {
          '0%': { transform: 'translateX(-100%) rotate(0deg)' },
          '25%': { transform: 'translateX(25vw) rotate(15deg)' },
          '50%': { transform: 'translateX(50vw) rotate(0deg)' },
          '75%': { transform: 'translateX(75vw) rotate(-15deg)' },
          '100%': { transform: 'translateX(120vw) rotate(0deg)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 10px rgba(155, 81, 224, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(155, 81, 224, 0.6)' },
        },
        'tilt': {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
          '100%': { transform: 'rotateX(10deg) rotateY(10deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'drive': 'drive 20s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'tilt': 'tilt 0.3s ease-out forwards',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'neon-gradient': 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      // 3D and depth utilities
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 224, 255, 0.15)',
        'glow-purple': '0 0 20px rgba(155, 81, 224, 0.15)',
        'depth': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'card-3d': '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'inner-glow': 'inset 0 0 20px rgba(0, 224, 255, 0.1)',
      },
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '104': '26rem',
      },
      // Typography
      fontFamily: {
        'mono': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // Custom 3D utilities
    function({ addUtilities }) {
      addUtilities({
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.perspective-2000': {
          perspective: '2000px',
        },
        '.transform-3d': {
          transformStyle: 'preserve-3d',
        },
        '.hover-tilt': {
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'rotateX(5deg) rotateY(5deg) translateZ(10px)',
          },
        },
      })
    }
  ],
};