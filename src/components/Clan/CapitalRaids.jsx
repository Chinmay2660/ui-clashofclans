import { memo, useEffect, useState, useRef } from 'react';
import { HiHome, HiLightningBolt, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { Card, Badge, RaidStatsSummary } from '../ui';
import { useCapitalRaids } from '../../Store/hooks';
import { Skeleton } from '../ui/Skeleton';
import { formatDateShort, formatNumber } from '../../utils';

// Capital Gold icon (using emoji as placeholder)
const CapitalGoldIcon = () => (
  <span className="text-yellow-400">💰</span>
);

// Raid Medal icon
const RaidMedalIcon = () => (
  <span className="text-purple-400">🏅</span>
);

// Single Raid Weekend Entry
const RaidEntry = memo(({ raid, index }) => {
  const [expanded, setExpanded] = useState(false);
  
  const totalLoot = raid.capitalTotalLoot || 0;
  const raidsCompleted = raid.raidsCompleted || 0;
  const totalAttacks = raid.totalAttacks || 0;
  const offensiveReward = raid.offensiveReward || 0;
  const defensiveReward = raid.defensiveReward || 0;
  const totalReward = offensiveReward + defensiveReward;
  
  return (
    <div 
      className="bg-dark-700/50 rounded-xl overflow-hidden transition-all"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Main row - clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 sm:p-4 flex items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
            <HiHome className="text-purple-400" size={24} />
          </div>
          
          <div className="min-w-0">
            <p className="text-white font-medium text-sm sm:text-base">
              Raid Weekend
            </p>
            <p className="text-gray-400 text-xs">
              {formatDateShort(raid.startTime)} - {formatDateShort(raid.endTime)}
            </p>
          </div>
        </div>
        
        {/* Rewards summary */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="flex items-center gap-1 justify-end">
              <CapitalGoldIcon />
              <span className="text-white font-bold">{totalLoot.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400">{raidsCompleted} raids</p>
          </div>
          
          <div className="flex items-center gap-1 text-purple-400">
            <RaidMedalIcon />
            <span className="font-bold">{totalReward}</span>
          </div>
          
          {expanded ? <HiChevronUp size={20} className="text-gray-400" /> : <HiChevronDown size={20} className="text-gray-400" />}
        </div>
      </button>
      
      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-700/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="bg-dark-600/50 rounded-lg p-3 text-center">
              <p className="text-xl sm:text-2xl font-bold text-white">{raidsCompleted}</p>
              <p className="text-xs text-gray-400">Raids</p>
            </div>
            <div className="bg-dark-600/50 rounded-lg p-3 text-center">
              <p className="text-xl sm:text-2xl font-bold text-white">{totalAttacks}</p>
              <p className="text-xs text-gray-400">Attacks</p>
            </div>
            <div className="bg-dark-600/50 rounded-lg p-3 text-center">
              <p className="text-xl sm:text-2xl font-bold text-yellow-400">{totalLoot.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Capital Gold</p>
            </div>
            <div className="bg-dark-600/50 rounded-lg p-3 text-center">
              <p className="text-xl sm:text-2xl font-bold text-purple-400">{totalReward}</p>
              <p className="text-xs text-gray-400">Raid Medals</p>
            </div>
          </div>
          
          {/* Offensive vs Defensive */}
          <div className="mt-3 flex gap-3">
            <div className="flex-1 bg-emerald-500/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Offensive</span>
                <HiLightningBolt className="text-emerald-400" size={14} />
              </div>
              <p className="text-lg font-bold text-emerald-400">{offensiveReward} medals</p>
            </div>
            <div className="flex-1 bg-blue-500/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Defensive</span>
                <HiHome className="text-blue-400" size={14} />
              </div>
              <p className="text-lg font-bold text-blue-400">{defensiveReward} medals</p>
            </div>
          </div>
          
          {/* Districts attacked */}
          {raid.attackLog && raid.attackLog.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Districts Raided ({raid.attackLog.length})</p>
              <div className="flex flex-wrap gap-2">
                {raid.attackLog.slice(0, 5).map((attack, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {attack.defender?.name || 'Unknown'} - {attack.districtsDestroyed || 0} districts
                  </Badge>
                ))}
                {raid.attackLog.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{raid.attackLog.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

RaidEntry.displayName = 'RaidEntry';

// Loading Skeleton
const CapitalRaidsSkeleton = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-4 rounded-xl bg-dark-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton type="avatar" className="w-12 h-12" />
            <div>
              <Skeleton type="text" className="w-24 h-4 mb-1" />
              <Skeleton type="text" className="w-32 h-3" />
            </div>
          </div>
          <Skeleton type="text" className="w-20 h-6" />
        </div>
      </div>
    ))}
  </div>
);

// Raid Stats Summary
// Raid Statistics Summary - uses reusable component
const RaidStats = memo(({ raids }) => {
  if (!raids || raids.length === 0) return null;
  
  const totalLoot = raids.reduce((sum, r) => sum + (r.capitalTotalLoot || 0), 0);
  const totalMedals = raids.reduce((sum, r) => sum + (r.offensiveReward || 0) + (r.defensiveReward || 0), 0);
  const totalRaidsCount = raids.reduce((sum, r) => sum + (r.raidsCompleted || 0), 0);
  
  return (
    <div className="mb-6">
      <RaidStatsSummary 
        weekends={raids.length}
        totalLoot={formatNumber(totalLoot)}
        raidsCount={totalRaidsCount}
        totalMedals={totalMedals}
      />
    </div>
  );
});

RaidStats.displayName = 'RaidStats';

// Main Capital Raids Component
const CapitalRaids = ({ clanTag, showTitle = true, limit = 5 }) => {
  const { raids, loading, error, getCapitalRaids, hasData } = useCapitalRaids();
  const [showAll, setShowAll] = useState(false);
  const fetchedTagRef = useRef(null);

  useEffect(() => {
    // Only fetch if we haven't fetched for this tag yet
    if (clanTag && fetchedTagRef.current !== clanTag && !loading) {
      fetchedTagRef.current = clanTag;
      getCapitalRaids(clanTag);
    }
  }, [clanTag, getCapitalRaids, loading]);

  // Loading state
  if (loading) {
    return (
      <Card className="p-4 sm:p-6">
        {showTitle && (
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <HiHome className="text-purple-400" size={24} />
            Capital Raid Weekends
          </h3>
        )}
        <CapitalRaidsSkeleton />
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="p-4 sm:p-6">
        {showTitle && (
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <HiHome className="text-purple-400" size={24} />
            Capital Raid Weekends
          </h3>
        )}
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-3">
            <HiHome className="text-gray-500" size={32} />
          </div>
          <p className="text-gray-400 text-sm">Capital raid data unavailable</p>
        </div>
      </Card>
    );
  }

  // No data
  if (!hasData || raids.length === 0) {
    return (
      <Card className="p-4 sm:p-6">
        {showTitle && (
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <HiHome className="text-purple-400" size={24} />
            Capital Raid Weekends
          </h3>
        )}
        <div className="text-center py-8">
          <p className="text-gray-400">No capital raid history available</p>
        </div>
      </Card>
    );
  }

  const displayedRaids = showAll ? raids : raids.slice(0, limit);
  const hasMore = raids.length > limit;

  return (
    <Card className="p-4 sm:p-6">
      {showTitle && (
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <HiHome className="text-purple-400" size={24} />
          Capital Raid Weekends
          <Badge variant="outline" className="ml-2 text-xs">
            {raids.length} Seasons
          </Badge>
        </h3>
      )}
      
      {/* Stats Summary */}
      <RaidStats raids={raids} />
      
      {/* Raid List */}
      <div className="space-y-3">
        {displayedRaids.map((raid, index) => (
          <RaidEntry key={`${raid.startTime}-${index}`} raid={raid} index={index} />
        ))}
      </div>
      
      {/* Show More/Less */}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-3 text-center text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-center gap-2 rounded-xl hover:bg-purple-500/10"
        >
          {showAll ? (
            <>
              <HiChevronUp size={18} />
              Show Less
            </>
          ) : (
            <>
              <HiChevronDown size={18} />
              Show All {raids.length} Weekends
            </>
          )}
        </button>
      )}
    </Card>
  );
};

export default memo(CapitalRaids);

