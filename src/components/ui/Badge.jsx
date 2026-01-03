import { memo } from 'react';

// Clean badge variants
const variants = {
  // Solid badges
  gold: 'bg-amber-500 text-white',
  primary: 'bg-amber-500 text-white',
  blue: 'bg-blue-500 text-white',
  green: 'bg-emerald-500 text-white',
  red: 'bg-red-500 text-white',
  purple: 'bg-purple-500 text-white',
  pink: 'bg-pink-500 text-white',
  gray: 'bg-gray-600 text-white',
  
  // Subtle badges (with transparency)
  'gold-subtle': 'bg-amber-500/15 text-amber-400',
  'blue-subtle': 'bg-blue-500/15 text-blue-400',
  'green-subtle': 'bg-emerald-500/15 text-emerald-400',
  'red-subtle': 'bg-red-500/15 text-red-400',
  'purple-subtle': 'bg-purple-500/15 text-purple-400',
  'gray-subtle': 'bg-gray-500/15 text-gray-400',
  
  // Status badges
  success: 'bg-emerald-500/15 text-emerald-400',
  error: 'bg-red-500/15 text-red-400',
  warning: 'bg-amber-500/15 text-amber-400',
  info: 'bg-blue-500/15 text-blue-400',
  
  // Outline
  outline: 'bg-transparent border border-gray-600 text-gray-400',
  
  // Legacy support
  silver: 'bg-gray-500 text-white',
  bronze: 'bg-orange-700 text-white',
  elixir: 'bg-pink-500 text-white',
  dark: 'bg-purple-600 text-white',
  gem: 'bg-emerald-500 text-white',
  war: 'bg-red-500 text-white',
  clan: 'bg-blue-500 text-white',
};

const sizes = {
  xs: 'px-1.5 py-0.5 text-[9px]',
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

const Badge = memo(({ 
  children, 
  variant = 'gold-subtle', 
  size = 'md',
  icon,
  className = '' 
}) => {
  return (
    <span 
      className={`
        ${variants[variant] || variants['gold-subtle']}
        ${sizes[size]}
        inline-flex items-center gap-1.5 
        rounded-full font-medium
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {icon && <img src={icon} alt="" className="w-3 h-3 md:w-4 md:h-4 object-contain" />}
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
