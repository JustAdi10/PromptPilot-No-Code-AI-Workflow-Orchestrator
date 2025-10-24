/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'text-brand-orange',
    'text-brand-orange-light',
    'text-brand-orange-dark',
    'bg-brand-orange',
    'bg-brand-orange-light',
    'bg-brand-orange-dark',
    'border-brand-orange',
    'shadow-glow-orange',
    'shadow-glow-orange-strong',
    'bg-dark-bg',
    'bg-dark-surface',
    'bg-dark-card',
    'border-dark-border',
    'text-dark-text',
    'text-dark-text-secondary',
    'text-dark-text-muted',
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
        // PromptPilot Black, White & Orange Theme
        'brand-orange': '#FF6B35',
        'brand-orange-light': '#FF8A5C',
        'brand-orange-dark': '#E55A2B',
        'orange-glow': 'rgba(255, 107, 53, 0.3)',
        // Dark theme colors
        'dark-bg': '#000000',
        'dark-surface': '#111111',
        'dark-card': '#1A1A1A',
        'dark-border': '#2A2A2A',
        'dark-text': '#FFFFFF',
        'dark-text-secondary': '#D1D5DB',
        'dark-text-muted': '#6B7280',
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
        'orange-gradient': 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
        'dark-gradient': 'linear-gradient(135deg, #000000 0%, #1A1A1A 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      // 3D and depth utilities
      boxShadow: {
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.3)',
        'glow-orange-strong': '0 0 40px rgba(255, 107, 53, 0.5)',
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
        'sans': ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
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