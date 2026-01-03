import { memo } from 'react';

// Clean, modern button variants
const variants = {
  // Primary gold button
  primary: `
    bg-gradient-to-b from-amber-500 to-amber-600 
    shadow-lg shadow-amber-500/20
    hover:from-amber-400 hover:to-amber-500
    hover:shadow-xl hover:shadow-amber-500/30
    active:from-amber-600 active:to-amber-700
    text-white
  `,
  // Secondary outline button
  secondary: `
    bg-transparent border border-gray-600/50
    hover:bg-gray-800/50 hover:border-gray-500/50
    text-gray-300 hover:text-white
  `,
  // Ghost button (minimal)
  ghost: `
    bg-transparent
    hover:bg-white/5
    text-gray-300 hover:text-white
  `,
  // Outline with gold accent
  outline: `
    bg-transparent border border-amber-500/30
    hover:bg-amber-500/10 hover:border-amber-500/50
    text-amber-400 hover:text-amber-300
  `,
  // Dark elixir purple
  dark: `
    bg-gradient-to-b from-purple-500 to-purple-600 
    shadow-lg shadow-purple-500/20
    hover:from-purple-400 hover:to-purple-500
    hover:shadow-xl hover:shadow-purple-500/30
    text-white
  `,
  // Gem green
  gem: `
    bg-gradient-to-b from-emerald-500 to-emerald-600 
    shadow-lg shadow-emerald-500/20
    hover:from-emerald-400 hover:to-emerald-500
    hover:shadow-xl hover:shadow-emerald-500/30
    text-white
  `,
  // War red
  war: `
    bg-gradient-to-b from-red-500 to-red-600 
    shadow-lg shadow-red-500/20
    hover:from-red-400 hover:to-red-500
    hover:shadow-xl hover:shadow-red-500/30
    text-white
  `,
  // Clan blue
  clan: `
    bg-gradient-to-b from-blue-500 to-blue-600 
    shadow-lg shadow-blue-500/20
    hover:from-blue-400 hover:to-blue-500
    hover:shadow-xl hover:shadow-blue-500/30
    text-white
  `,
  // Elixir pink
  elixir: `
    bg-gradient-to-b from-pink-500 to-pink-600 
    shadow-lg shadow-pink-500/20
    hover:from-pink-400 hover:to-pink-500
    hover:shadow-xl hover:shadow-pink-500/30
    text-white
  `,
  // Danger
  danger: `
    bg-gradient-to-b from-red-600 to-red-700 
    shadow-lg shadow-red-600/20
    hover:from-red-500 hover:to-red-600
    text-white
  `,
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
  xl: 'px-9 py-4 text-xl',
};

const Button = memo(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  fullWidth = false,
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant] || variants.primary} 
        ${sizes[size]}
        font-semibold rounded-xl 
        transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
