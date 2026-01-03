import { memo, useEffect, useRef } from 'react';
import { HiLightningBolt, HiClock, HiStar, HiUsers, HiShieldCheck } from 'react-icons/hi';
import { Card, Badge } from '../ui';
import { useCurrentWar } from '../../Store/hooks';
import { Skeleton } from '../ui/Skeleton';
import { formatTimeRemaining } from '../../utils';

// War State Badge
const WarStateBadge = ({ state }) => {
  const stateConfig = {
    preparation: { color: 'warning', label: 'Preparation Day', icon: HiClock },
    inWar: { color: 'error', label: 'Battle Day', icon: HiLightningBolt },
    warEnded: { color: 'primary', label: 'War Ended', icon: HiShieldCheck },
    notInWar: { color: 'outline', label: 'Not in War', icon: HiShieldCheck },
  };
  
  const config = stateConfig[state] || stateConfig.notInWar;
  const Icon = config.icon;
  
  return (
    <Badge variant={config.color} className="text-sm">
      <Icon size={14} />
      {config.label}
    </Badge>
  );
};

// Clan War Side Card
const ClanSide = memo(({ clan, isOpponent = false }) => {
  if (!clan) return null;
  
  const destructionPercent = clan.destructionPercentage?.toFixed(1) || '0.0';
  
  return (
    <div className={`flex-1 text-center ${isOpponent ? 'order-2' : 'order-1'}`}>
      <div className="relative inline-block mb-3">
        {clan.badgeUrls?.medium && (
          <img 
            src={clan.badgeUrls.medium} 
            alt={clan.name} 
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto"
          />
        )}
      </div>
      <h4 className="text-white font-bold text-sm sm:text-base truncate px-2">
        {clan.name}
      </h4>
      <div className="flex items-center justify-center gap-1 mt-2">
        <HiStar className="text-yellow-400" size={20} />
        <span className="text-2xl sm:text-3xl font-black text-white">{clan.stars || 0}</span>
      </div>
      <div className="mt-1 text-gray-400 text-xs sm:text-sm">
        {destructionPercent}% destruction
      </div>
      <div className="mt-1 text-gray-500 text-xs">
        {clan.attacks || 0} / {(clan.members || 0) * 2} attacks
      </div>
    </div>
  );
});

ClanSide.displayName = 'ClanSide';

// Loading Skeleton
const CurrentWarSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-center">
      <Skeleton type="badge" className="w-32 h-8" />
    </div>
    <div className="flex items-center justify-around">
      <div className="text-center">
        <Skeleton type="avatar" className="w-20 h-20 mx-auto mb-2" />
        <Skeleton type="text" className="w-24 h-4 mx-auto" />
      </div>
      <div className="text-2xl text-gray-600">VS</div>
      <div className="text-center">
        <Skeleton type="avatar" className="w-20 h-20 mx-auto mb-2" />
        <Skeleton type="text" className="w-24 h-4 mx-auto" />
      </div>
    </div>
  </div>
);

// Main Current War Component
const CurrentWar = ({ clanTag, showTitle = true, skipFetch = false }) => {
  const { currentWar, loading, error, getCurrentWar, isInWar, warState } = useCurrentWar();
  const fetchedTagRef = useRef(null);

  useEffect(() => {
    // Skip fetching if parent already fetched data in parallel
    if (skipFetch) return;
    
    // Only fetch if we haven't fetched for this tag yet
    if (clanTag && fetchedTagRef.current !== clanTag && !loading) {
      fetchedTagRef.current = clanTag;
      getCurrentWar(clanTag);
    }
  }, [clanTag, getCurrentWar, loading, skipFetch]);

  // Loading state
  if (loading) {
    return (
      <Card className="p-4 sm:p-6">
        {showTitle && (
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <HiLightningBolt className="text-red-400" size={24} />
            Current War
          </h3>
        )}
        <CurrentWarSkeleton />
      </Card>
    );
  }

  // Error or not in war
  if (error || !isInWar) {
    return (
      <Card className="p-4 sm:p-6">
        {showTitle && (
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <HiLightningBolt className="text-red-400" size={24} />
            Current War
          </h3>
        )}
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-3">
            <HiShieldCheck className="text-gray-500" size={32} />
          </div>
          <p className="text-gray-400 text-sm">
            {error ? 'War info unavailable' : 'Not currently in war'}
          </p>
        </div>
      </Card>
    );
  }

  const timeRemaining = warState === 'preparation' 
    ? formatTimeRemaining(currentWar.startTime)
    : formatTimeRemaining(currentWar.endTime);

  return (
    <Card className="p-4 sm:p-6 overflow-hidden">
      {/* War glow effect */}
      {warState === 'inWar' && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10 pointer-events-none" />
      )}
      
      <div className="relative">
        {showTitle && (
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <HiLightningBolt className="text-red-400" size={24} />
              Current War
            </h3>
            <WarStateBadge state={warState} />
          </div>
        )}
        
        {/* Team size & time */}
        <div className="flex items-center justify-center gap-4 mb-4 text-sm">
          <Badge variant="outline">
            <HiUsers size={14} />
            {currentWar.teamSize}v{currentWar.teamSize}
          </Badge>
          <Badge variant={warState === 'inWar' ? 'error' : 'warning'}>
            <HiClock size={14} />
            {timeRemaining} remaining
          </Badge>
        </div>
        
        {/* Clans comparison */}
        <div className="flex items-start justify-around gap-4 py-4">
          <ClanSide clan={currentWar.clan} />
          
          <div className="flex flex-col items-center justify-center shrink-0">
            <span className="text-xl sm:text-2xl font-black text-gray-500">VS</span>
          </div>
          
          <ClanSide clan={currentWar.opponent} isOpponent />
        </div>
        
        {/* War progress bar */}
        {warState === 'inWar' && (
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>{currentWar.clan?.name}</span>
              <span>{currentWar.opponent?.name}</span>
            </div>
            <div className="h-3 bg-dark-700 rounded-full overflow-hidden flex">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                style={{ 
                  width: `${(currentWar.clan?.destructionPercentage || 0)}%`
                }}
              />
              <div className="flex-1" />
              <div 
                className="bg-gradient-to-l from-red-500 to-red-400 transition-all"
                style={{ 
                  width: `${(currentWar.opponent?.destructionPercentage || 0)}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default memo(CurrentWar);

