import { memo } from 'react';

/**
 * Stat Item - Individual stat display
 */
export const StatItem = memo(({ 
  value, 
  label, 
  icon: Icon,
  iconSrc,
  color = 'gold',
  size = 'md',
  className = '' 
}) => {
  const colors = {
    gold: 'bg-amber-500/10 text-amber-400',
    elixir: 'bg-pink-500/10 text-pink-400',
    dark: 'bg-purple-500/10 text-purple-400',
    gem: 'bg-emerald-500/10 text-emerald-400',
    war: 'bg-red-500/10 text-red-400',
    clan: 'bg-blue-500/10 text-blue-400',
    default: 'bg-dark-700/50 text-white',
  };

  const sizes = {
    sm: {
      container: 'p-2 rounded-lg',
      value: 'text-lg sm:text-xl font-bold',
      label: 'text-[10px]',
      icon: 'w-4 h-4',
    },
    md: {
      container: 'p-3 rounded-xl',
      value: 'text-xl sm:text-2xl font-bold',
      label: 'text-xs',
      icon: 'w-5 h-5',
    },
    lg: {
      container: 'p-4 rounded-xl',
      value: 'text-2xl sm:text-3xl font-black',
      label: 'text-sm',
      icon: 'w-6 h-6',
    },
  };

  const colorClasses = colors[color] || colors.default;
  const sizeClasses = sizes[size] || sizes.md;

  return (
    <div className={`${colorClasses} ${sizeClasses.container} text-center transition-all hover:scale-105 ${className}`}>
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {iconSrc && <img src={iconSrc} alt="" className={sizeClasses.icon} />}
        {Icon && <Icon className={sizeClasses.icon} />}
        <p className={`${sizeClasses.value}`} style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          {value}
        </p>
      </div>
      <p className={`${sizeClasses.label} text-gray-400 uppercase tracking-wide`}>
        {label}
      </p>
    </div>
  );
});

StatItem.displayName = 'StatItem';

/**
 * Stat Grid - Grid container for stats
 */
const StatGrid = memo(({ 
  stats, 
  columns = 4,
  size = 'md',
  className = '' 
}) => {
  const colClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div className={`grid ${colClasses[columns] || colClasses[4]} gap-3 ${className}`}>
      {stats.map((stat, index) => (
        <StatItem
          key={stat.label || index}
          value={stat.value}
          label={stat.label}
          icon={stat.icon}
          iconSrc={stat.iconSrc}
          color={stat.color || 'default'}
          size={size}
        />
      ))}
    </div>
  );
});

StatGrid.displayName = 'StatGrid';

/**
 * War Stats Summary - Specialized for war statistics
 */
export const WarStatsSummary = memo(({ wins, losses, ties, winRate, totalStars }) => {
  const stats = [
    { value: wins, label: 'Wins', color: 'gem' },
    { value: losses, label: 'Losses', color: 'war' },
    { value: `${winRate}%`, label: 'Win Rate', color: 'gold' },
    { value: totalStars, label: 'Total Stars', color: 'clan' },
  ];

  return <StatGrid stats={stats} columns={4} size="md" />;
});

WarStatsSummary.displayName = 'WarStatsSummary';

/**
 * Raid Stats Summary - Specialized for capital raid statistics
 */
export const RaidStatsSummary = memo(({ weekends, totalLoot, raidsCount, totalMedals }) => {
  const stats = [
    { value: weekends, label: 'Weekends', color: 'dark' },
    { value: totalLoot, label: 'Total Loot', color: 'gold' },
    { value: raidsCount, label: 'Raids Done', color: 'gem' },
    { value: totalMedals, label: 'Total Medals', color: 'clan' },
  ];

  return <StatGrid stats={stats} columns={4} size="md" />;
});

RaidStatsSummary.displayName = 'RaidStatsSummary';

export default StatGrid;

