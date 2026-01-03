import { memo, forwardRef } from 'react';

const Input = memo(forwardRef(({ 
  label,
  icon: Icon,
  error,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-dark-800/80 backdrop-blur-sm border-2 border-gray-700/50
            rounded-xl px-4 py-3 text-white placeholder-gray-500
            focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20
            transition-all duration-200
            ${Icon ? 'pl-12' : ''}
            ${error ? 'border-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}));

Input.displayName = 'Input';

export default Input;

