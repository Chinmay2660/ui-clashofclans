import { memo } from 'react';

// Clean card variants
const variants = {
  default: 'bg-gray-900/50 border border-gray-800/50',
  dark: 'bg-gray-900/80 border border-gray-800/50',
  light: 'bg-gray-800/50 border border-gray-700/50',
  glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
  transparent: 'bg-transparent',
};

const Card = memo(({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  padding = true,
  onClick,
  ...props 
}) => {
  const hoverClasses = hover ? `
    hover:bg-gray-800/50 
    hover:border-gray-700/50
    hover:-translate-y-0.5
    cursor-pointer
    transition-all duration-200
  ` : '';

  const paddingClasses = padding ? 'p-4 md:p-6' : '';

  return (
    <div
      onClick={onClick}
      className={`
        ${variants[variant] || variants.default}
        rounded-xl md:rounded-2xl
        ${paddingClasses}
        ${hoverClasses}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
