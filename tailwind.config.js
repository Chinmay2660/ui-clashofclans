/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clash of Clans Authentic Color Palette
        dark: {
          900: '#0a0e14',
          800: '#111827',
          700: '#1a2332',
          600: '#243044',
          500: '#2d3d52',
        },
        // Gold (Coins, Premium)
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Elixir Pink
        elixir: {
          300: '#f472b6',
          400: '#ec4899',
          500: '#db2777',
          600: '#be185d',
        },
        // Dark Elixir Purple
        darkElixir: {
          300: '#c084fc',
          400: '#a855f7',
          500: '#9333ea',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        // Gem Green
        gem: {
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        // Builder Gold (Orange)
        builder: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        // War Red
        war: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        // Clan Castle Blue
        clan: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
      fontFamily: {
        // Supercell Magic font (download from Fan Kit)
        'clash': ['Supercell-Magic', 'Lilita One', 'system-ui', 'sans-serif'],
        'display': ['Lilita One', 'system-ui', 'sans-serif'],
        'sans': ['Nunito', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'sword-swing': 'swordSwing 0.8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)' },
          '50%': { boxShadow: '0 0 50px rgba(251, 191, 36, 0.7)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        swordSwing: {
          '0%, 100%': { transform: 'rotate(-15deg)' },
          '50%': { transform: 'rotate(15deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // CoC-style gradients
        'coc-gold': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
        'coc-elixir': 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)',
        'coc-dark': 'linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7c3aed 100%)',
        'coc-gem': 'linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)',
        'coc-war': 'linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)',
        'coc-clan': 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
        // Card backgrounds
        'card-dark': 'linear-gradient(180deg, rgba(26, 35, 50, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
        'card-gold': 'linear-gradient(180deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
      },
      boxShadow: {
        'glow-gold': '0 0 30px rgba(251, 191, 36, 0.4)',
        'glow-elixir': '0 0 30px rgba(236, 72, 153, 0.4)',
        'glow-dark': '0 0 30px rgba(168, 85, 247, 0.4)',
        'glow-gem': '0 0 30px rgba(74, 222, 128, 0.4)',
        'glow-war': '0 0 30px rgba(248, 113, 113, 0.4)',
        'glow-clan': '0 0 30px rgba(96, 165, 250, 0.4)',
        // 3D button shadow
        'btn-3d': '0 4px 0 0 rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.3)',
        'btn-3d-sm': '0 2px 0 0 rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)',
        // Card shadows
        'card': '0 10px 40px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'coc': '1rem',
        'coc-lg': '1.5rem',
        'coc-xl': '2rem',
      },
    },
  },
  plugins: [],
}
