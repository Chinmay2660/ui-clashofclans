import { memo } from 'react';

const Toggle = memo(({ 
  checked, 
  onChange, 
  leftLabel, 
  rightLabel,
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className={`text-sm font-medium transition-colors ${checked ? 'text-gray-400' : 'text-white'}`}>
        {leftLabel}
      </span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative w-14 h-7 rounded-full transition-colors duration-200
          ${checked ? 'bg-amber-500' : 'bg-gray-600'}
        `}
      >
        <span
          className={`
            absolute top-1 w-5 h-5 bg-white rounded-full shadow-md
            transition-transform duration-200
            ${checked ? 'left-8' : 'left-1'}
          `}
        />
      </button>
      <span className={`text-sm font-medium transition-colors ${checked ? 'text-white' : 'text-gray-400'}`}>
        {rightLabel}
      </span>
    </div>
  );
});

Toggle.displayName = 'Toggle';

export default Toggle;

