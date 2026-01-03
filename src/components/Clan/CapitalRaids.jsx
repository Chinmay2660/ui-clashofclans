import { memo, useEffect, useState, useRef } from 'react';
import { HiHome, HiLightningBolt, HiChevronDown, HiChevronUp, HiShieldCheck, HiStar, HiUsers } from 'react-icons/hi';
import { GiCrossedSwords, GiCastle } from 'react-icons/gi';
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

// District Card Component
const DistrictCard = memo(({ district }) => (
  <div className="bg-dark-600/50 rounded-lg p-2 sm:p-3">
    <div className="flex items-center gap-2 mb-1">
      <GiCastle className="text-amber-400 shrink-0" size={14} />
      <span className="text-white text-xs sm:text-sm font-medium truncate">{district.name}</span>
      <Badge variant="outline" className="text-[10px] ml-auto shrink-0">Lvl {district.districtHallLevel}</Badge>
    </div>
    <div className="flex items-center justify-between mt-2 text-[10px] sm:text-xs">
      <div className="flex items-center gap-1">
        <span className={`font-bold ${district.destructionPercent === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
          {district.destructionPercent}%
        </span>
        <span className="text-gray-500">destroyed</span>
      </div>
      <div className="flex items-center gap-1 text-gray-400">
        <GiCrossedSwords size={10} />
        <span>{district.attackCount} attacks</span>
      </div>
    </div>
    {district.totalLooted > 0 && (
      <div className="flex items-center gap-1 mt-1 text-[10px] text-yellow-400">
        <CapitalGoldIcon />
        <span>{district.totalLooted.toLocaleString()} looted</span>
      </div>
    )}
  </div>
));

DistrictCard.displayName = 'DistrictCard';

// Defense Log Entry - Shows clans that attacked us
const DefenseLogEntry = memo(({ defense, isExpanded, onToggle }) => {
  return (
    <div className="bg-dark-600/30 rounded-lg p-3 border border-dark-600 hover:bg-dark-500/30 transition-all duration-200">
      {/* Attacker Clan Header */}
      <button 
        onClick={onToggle}
        className="w-full flex items-center gap-3 group"
      >
        {/* Clan Badge */}
        {defense.attacker?.badgeUrls?.small ? (
          <img 
            src={defense.attacker.badgeUrls.small} 
            alt={defense.attacker.name} 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg shrink-0 transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-dark-700 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <HiUsers className="text-gray-500" size={20} />
          </div>
        )}
        
        {/* Clan Info */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-white font-medium text-sm sm:text-base truncate group-hover:text-amber-400 transition-colors">{defense.attacker?.name || 'Unknown Clan'}</p>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400">
            <span>Level {defense.attacker?.level || '?'}</span>
            <span>•</span>
            <span className="font-mono">#{defense.attacker?.tag?.replace('#', '')}</span>
          </div>
        </div>
        
        {/* Attack Stats */}
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 justify-end text-red-400">
            <GiCrossedSwords size={14} />
            <span className="font-bold text-sm">{defense.attackCount} attacks</span>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400">
            {defense.districtsDestroyed}/{defense.districtCount} districts
          </p>
        </div>
        
        {defense.districts && defense.districts.length > 0 && (
          <div className="shrink-0">
            {isExpanded ? <HiChevronUp size={16} className="text-gray-400 group-hover:text-amber-400 transition-colors" /> : <HiChevronDown size={16} className="text-gray-400 group-hover:text-amber-400 transition-colors" />}
          </div>
        )}
      </button>
      
      {/* Districts Detail */}
      {isExpanded && defense.districts && defense.districts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-dark-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {defense.districts.map((district, idx) => (
            <DistrictCard key={idx} district={district} />
          ))}
        </div>
      )}
    </div>
  );
});

DefenseLogEntry.displayName = 'DefenseLogEntry';

// Single Raid Weekend Entry
const RaidEntry = memo(({ raid, index, isExpanded, onToggle }) => {
  // Track which defense log entry is expanded (only one at a time)
  const [expandedDefenseIdx, setExpandedDefenseIdx] = useState(null);
  
  const totalLoot = raid.capitalTotalLoot || 0;
  const raidsCompleted = raid.raidsCompleted || 0;
  const totalAttacks = raid.totalAttacks || 0;
  const enemyDistrictsDestroyed = raid.enemyDistrictsDestroyed || 0;
  const offensiveReward = raid.offensiveReward || 0;
  const defensiveReward = raid.defensiveReward || 0;
  const totalReward = offensiveReward + defensiveReward;
  const defenseLog = raid.defenseLog || [];
  const attackLog = raid.attackLog || [];
  const members = raid.members || [];
  
  // Calculate total attacks received
  const totalAttacksReceived = defenseLog.reduce((sum, d) => sum + (d.attackCount || 0), 0);
  const totalDistrictsLost = defenseLog.reduce((sum, d) => sum + (d.districtsDestroyed || 0), 0);
  
  return (
    <div 
      className="bg-dark-700/50 rounded-xl overflow-hidden transition-all"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Main row - clickable */}
      <button
        onClick={onToggle}
        className="w-full p-3 sm:p-4 flex items-center justify-between gap-3 text-left hover:bg-dark-600/50 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <HiHome className="text-purple-400" size={24} />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-white font-medium text-sm sm:text-base">
                Raid Weekend
              </p>
              <Badge variant={raid.state === 'ended' ? 'outline' : 'gold'} className="text-[10px]">
                {raid.state === 'ended' ? 'Ended' : 'Active'}
              </Badge>
            </div>
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
            <p className="text-xs text-gray-400">{raidsCompleted} raids completed</p>
          </div>
          
          <div className="text-right hidden md:block">
            <div className="flex items-center gap-1 justify-end text-red-400">
              <HiShieldCheck size={14} />
              <span className="font-bold">{defenseLog.length}</span>
            </div>
            <p className="text-xs text-gray-400">attackers</p>
          </div>
          
          <div className="flex items-center gap-1 text-purple-400">
            <RaidMedalIcon />
            <span className="font-bold">{totalReward}</span>
          </div>
          
          {isExpanded ? <HiChevronUp size={20} className="text-gray-400 group-hover:text-purple-400 transition-colors" /> : <HiChevronDown size={20} className="text-gray-400 group-hover:text-purple-400 transition-colors" />}
        </div>
      </button>
      
      {/* Expanded details */}
      {isExpanded && (
        <div className="px-3 sm:px-4 pb-4 pt-0 border-t border-gray-700/50">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mt-4">
            <div className="bg-dark-600/50 rounded-lg p-2 sm:p-3 text-center">
              <p className="text-lg sm:text-xl font-bold text-white">{raidsCompleted}</p>
              <p className="text-[10px] sm:text-xs text-gray-400">Raids Done</p>
            </div>
            <div className="bg-dark-600/50 rounded-lg p-2 sm:p-3 text-center">
              <p className="text-lg sm:text-xl font-bold text-white">{totalAttacks}</p>
              <p className="text-[10px] sm:text-xs text-gray-400">Our Attacks</p>
            </div>
            <div className="bg-dark-600/50 rounded-lg p-2 sm:p-3 text-center">
              <p className="text-lg sm:text-xl font-bold text-emerald-400">{enemyDistrictsDestroyed}</p>
              <p className="text-[10px] sm:text-xs text-gray-400">Districts Destroyed</p>
            </div>
            <div className="bg-dark-600/50 rounded-lg p-2 sm:p-3 text-center">
              <p className="text-lg sm:text-xl font-bold text-yellow-400">{totalLoot.toLocaleString()}</p>
              <p className="text-[10px] sm:text-xs text-gray-400">Capital Gold</p>
            </div>
            <div className="bg-dark-600/50 rounded-lg p-2 sm:p-3 text-center">
              <p className="text-lg sm:text-xl font-bold text-red-400">{totalAttacksReceived}</p>
              <p className="text-[10px] sm:text-xs text-gray-400">Attacks Received</p>
            </div>
            <div className="bg-dark-600/50 rounded-lg p-2 sm:p-3 text-center">
              <p className="text-lg sm:text-xl font-bold text-purple-400">{totalReward}</p>
              <p className="text-[10px] sm:text-xs text-gray-400">Raid Medals</p>
            </div>
          </div>
          
          {/* Offensive vs Defensive Rewards */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Offensive Reward</span>
                <HiLightningBolt className="text-emerald-400" size={14} />
              </div>
              <p className="text-lg sm:text-xl font-bold text-emerald-400">{offensiveReward} <span className="text-xs font-normal">medals</span></p>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Defensive Reward</span>
                <HiShieldCheck className="text-blue-400" size={14} />
              </div>
              <p className="text-lg sm:text-xl font-bold text-blue-400">{defensiveReward} <span className="text-xs font-normal">medals</span></p>
            </div>
          </div>
          
          {/* Defense Log - Clans that attacked us */}
          {defenseLog.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <HiShieldCheck className="text-red-400" size={16} />
                Clans That Attacked Us ({defenseLog.length})
                <span className="text-xs font-normal text-gray-400">• {totalDistrictsLost} districts lost</span>
              </h4>
              <div className="space-y-2">
                {defenseLog.map((defense, idx) => (
                  <DefenseLogEntry 
                    key={idx} 
                    defense={defense}
                    isExpanded={expandedDefenseIdx === idx}
                    onToggle={() => setExpandedDefenseIdx(expandedDefenseIdx === idx ? null : idx)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Attack Log - Clans we attacked */}
          {attackLog.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <GiCrossedSwords className="text-emerald-400" size={16} />
                Clans We Attacked ({attackLog.length})
              </h4>
              <div className="space-y-2">
                {attackLog.map((attack, idx) => (
                  <div key={idx} className="bg-dark-600/30 rounded-lg p-3 flex items-center gap-3">
                    {attack.defender?.badgeUrls?.small ? (
                      <img 
                        src={attack.defender.badgeUrls.small} 
                        alt={attack.defender.name} 
                        className="w-10 h-10 rounded-lg shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center shrink-0">
                        <HiUsers className="text-gray-500" size={20} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{attack.defender?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">Level {attack.defender?.level || '?'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold text-sm">{attack.districtsDestroyed || 0} districts</p>
                      <p className="text-xs text-gray-400">{attack.attackCount || 0} attacks</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Participating Members */}
          {members.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <HiUsers className="text-purple-400" size={16} />
                Participating Members ({members.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {members.slice(0, 8).map((member, idx) => (
                  <div key={idx} className="bg-dark-600/30 rounded-lg p-2 text-center hover:bg-dark-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer group">
                    <p className="text-white text-xs font-medium truncate group-hover:text-amber-400 transition-colors">{member.name}</p>
                    <p className="text-[10px] text-gray-400">{member.attacks || 0} attacks • {member.capitalResourcesLooted?.toLocaleString() || 0} gold</p>
                  </div>
                ))}
                {members.length > 8 && (
                  <div className="bg-dark-600/30 rounded-lg p-2 text-center flex items-center justify-center hover:bg-dark-500/30 transition-colors">
                    <p className="text-xs text-gray-400">+{members.length - 8} more</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* No activity message */}
          {defenseLog.length === 0 && attackLog.length === 0 && members.length === 0 && (
            <div className="mt-4 text-center py-4 bg-dark-600/30 rounded-lg">
              <p className="text-gray-400 text-sm">No detailed activity recorded for this weekend</p>
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
const CapitalRaids = ({ clanTag, showTitle = true, limit = 5, skipFetch = false }) => {
  const { raids, loading, error, getCapitalRaids, hasData } = useCapitalRaids();
  const [showAll, setShowAll] = useState(false);
  const [expandedRaidIdx, setExpandedRaidIdx] = useState(null); // Only one raid expanded at a time
  const fetchedTagRef = useRef(null);

  useEffect(() => {
    // Skip fetching if parent already fetched data in parallel
    if (skipFetch) return;
    
    // Only fetch if we haven't fetched for this tag yet
    if (clanTag && fetchedTagRef.current !== clanTag && !loading) {
      fetchedTagRef.current = clanTag;
      getCapitalRaids(clanTag);
    }
  }, [clanTag, getCapitalRaids, loading, skipFetch]);

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
          <RaidEntry 
            key={`${raid.startTime}-${index}`} 
            raid={raid} 
            index={index}
            isExpanded={expandedRaidIdx === index}
            onToggle={() => setExpandedRaidIdx(expandedRaidIdx === index ? null : index)}
          />
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

