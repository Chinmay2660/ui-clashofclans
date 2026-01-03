import { memo } from 'react';

const StatCard = memo(({ 
  icon,
  label, 
  value, 
  subValue,
  color = 'amber',
  className = '' 
}) => {
  const colors = {
    amber: 'from-amber-500/20 to-yellow-600/20',
    blue: 'from-sky-500/20 to-blue-600/20',
    purple: 'from-purple-500/20 to-violet-600/20',
    green: 'from-emerald-500/20 to-green-600/20',
    red: 'from-red-500/20 to-rose-600/20',
  };

  return (
    <div 
      className={`
        bg-gradient-to-br ${colors[color]}
        backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 md:p-4
        ${className}
      `}
    >
      <div className="flex items-center gap-2 md:gap-3">
        {icon && (
          <img src={icon} alt="" className="w-6 h-6 md:w-8 md:h-8 object-contain shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide truncate">{label}</p>
          <p className="text-base md:text-xl font-bold text-white">{value}</p>
          {subValue && (
            <p className="text-[10px] md:text-xs text-gray-500 truncate">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;

