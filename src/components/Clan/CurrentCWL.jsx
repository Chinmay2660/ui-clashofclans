import { memo, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiStar, 
  HiShieldCheck, 
  HiChevronDown, 
  HiChevronUp,
  HiCalendar,
  HiUserGroup,
  HiExternalLink
} from 'react-icons/hi';
import { FaTrophy, FaBolt } from 'react-icons/fa';
import { Card, Badge } from '../ui';
import { useCWL } from '../../Store/hooks';
import { Skeleton } from '../ui/Skeleton';
import CWLWarDetails from './CWLWarDetails';

// CWL Clan Row - Clickable to view clan details
const ClanRow = memo(({ clan, rank, isCurrentClan, onClick }) => {
  const badge = clan.badgeUrls?.small || clan.badgeUrls?.medium;
  
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group text-left hover:scale-[1.01] active:scale-[0.99] ${
        isCurrentClan 
          ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 hover:from-amber-500/30 hover:to-orange-500/20' 
          : 'bg-dark-800/50 hover:bg-dark-700/50'
      }`}
    >
      {/* Rank */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-transform group-hover:scale-110 ${
        rank === 1 ? 'bg-gradient-to-br from-yellow-500/30 to-amber-600/30 text-yellow-400 shadow-lg shadow-yellow-500/20' :
        rank === 2 ? 'bg-gradient-to-br from-gray-400/20 to-gray-500/20 text-gray-300' :
        rank === 3 ? 'bg-gradient-to-br from-orange-500/20 to-amber-600/20 text-orange-400' :
        'bg-dark-600 text-gray-400'
      }`}>
        #{rank}
      </div>
      
      {/* Badge */}
      <div className="w-11 h-11 rounded-xl bg-dark-700/50 flex items-center justify-center shrink-0 overflow-hidden transition-transform group-hover:scale-105">
        {badge ? (
          <img 
            src={badge} 
            alt={clan.name} 
            className="w-9 h-9 object-contain"
          />
        ) : (
          <HiShieldCheck className="text-gray-500" size={22} />
        )}
      </div>
      
      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className={`font-semibold text-sm truncate transition-colors ${
          isCurrentClan 
            ? 'text-amber-400' 
            : 'text-white group-hover:text-purple-400'
        }`}>
          {clan.name}
          {isCurrentClan && <span className="ml-2 text-xs text-amber-400/60 font-normal">(Your Clan)</span>}
        </p>
        <p className="text-gray-500 text-xs">
          Level {clan.clanLevel}
        </p>
      </div>
      
      {/* Stars */}
      <div className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 bg-dark-700/50 rounded-lg group-hover:bg-dark-600/50 transition-colors">
        <span className="text-yellow-400 font-bold text-sm">{clan.stars || 0}</span>
        <HiStar className="text-yellow-400" size={16} />
      </div>
      
      {/* Link indicator */}
      <HiExternalLink className="text-gray-600 group-hover:text-purple-400 transition-colors shrink-0" size={16} />
    </button>
  );
});

ClanRow.displayName = 'ClanRow';

// CWL Round Entry
const RoundEntry = memo(({ round, roundIndex, currentClanTag, onWarClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-dark-700/30 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-dark-600/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Day {roundIndex + 1}
          </Badge>
          <span className="text-gray-400 text-sm">
            {round.warTags?.length || 0} Wars
          </span>
        </div>
        {isExpanded ? (
          <HiChevronUp className="text-gray-400" size={18} />
        ) : (
          <HiChevronDown className="text-gray-400" size={18} />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {round.warTags?.map((warTag, idx) => {
            // warTag is just a reference, we'd need to fetch individual war details
            // For now, show as clickable items
            const isPlaceholder = warTag === '#0';
            
            return (
              <div 
                key={idx}
                className={`p-3 rounded-lg ${
                  isPlaceholder 
                    ? 'bg-dark-600/30 text-gray-500' 
                    : 'bg-dark-600/50 hover:bg-dark-500/50 cursor-pointer'
                }`}
                onClick={() => !isPlaceholder && onWarClick?.(warTag)}
              >
                {isPlaceholder ? (
                  <span className="text-sm">War not started yet</span>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      Match {idx + 1}
                    </span>
                    <Badge variant="gold" className="text-xs">
                      View Details
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

RoundEntry.displayName = 'RoundEntry';

// CWL Loading Skeleton
const CWLSkeleton = () => (
  <div className="space-y-4">
    {/* Header skeleton */}
    <div className="flex items-center justify-between">
      <Skeleton type="text" className="w-32 h-6" />
      <Skeleton type="text" className="w-20 h-5 rounded-full" />
    </div>
    
    {/* Clans skeleton */}
    <div className="space-y-2">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-dark-700/50">
          <Skeleton type="avatar" className="w-8 h-8 rounded-lg" />
          <Skeleton type="avatar" className="w-10 h-10 rounded-lg" />
          <div className="flex-1">
            <Skeleton type="text" className="w-28 h-4 mb-1" />
            <Skeleton type="text" className="w-16 h-3" />
          </div>
          <Skeleton type="text" className="w-10 h-4" />
        </div>
      ))}
    </div>
  </div>
);

// Main CurrentCWL Component
const CurrentCWL = ({ clanTag, showTitle = true, skipFetch = false, cwlData = null }) => {
  const navigate = useNavigate();
  const { cwlGroup, loading, error, getCWLGroup, season } = useCWL();
  const fetchedTagRef = useRef(null);
  const [showRounds, setShowRounds] = useState(false);
  const [selectedWarTag, setSelectedWarTag] = useState(null);
  const [isWarModalOpen, setIsWarModalOpen] = useState(false);
  
  // Handle clan click - navigate to clan details
  const handleClanClick = (clan) => {
    const cleanTag = clan.tag?.replace('#', '');
    if (cleanTag) {
      navigate(`/clan/${cleanTag}`);
    }
  };
  
  // Handle war click - Open CWL war details modal
  const handleWarClick = (warTag) => {
    setSelectedWarTag(warTag);
    setIsWarModalOpen(true);
  };
  
  // Close war modal
  const handleCloseWarModal = () => {
    setIsWarModalOpen(false);
    setSelectedWarTag(null);
  };
  
  // Use provided data OR data from Redux store (already fetched in parallel)
  const data = cwlData || cwlGroup;
  const clans = data?.clans || [];
  const rounds = data?.rounds || [];
  const currentSeason = data?.season || season;
  
  // Check if we have actual data (from props OR from Redux store)
  const dataAvailable = !!(data && data.clans && data.clans.length > 0);
  
  // Check loading - show loading if Redux is loading OR if skipFetch but no data yet (initial parallel fetch)
  const isLoading = loading || (skipFetch && !dataAvailable && !error);
  
  // Has error only if not loading, we have an error, and no data available
  const hasError = !loading && error && !dataAvailable;

  useEffect(() => {
    if (skipFetch) return;
    
    if (clanTag && fetchedTagRef.current !== clanTag && !loading) {
      fetchedTagRef.current = clanTag;
      getCWLGroup(clanTag);
    }
  }, [clanTag, getCWLGroup, loading, skipFetch]);

  // Sort clans by stars (descending)
  const sortedClans = [...clans].sort((a, b) => (b.stars || 0) - (a.stars || 0));
  
  // Find current clan's rank
  const currentClanRank = sortedClans.findIndex(c => 
    c.tag?.replace('#', '').toUpperCase() === clanTag?.replace('#', '').toUpperCase()
  ) + 1;

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-4 sm:p-6">
        {showTitle && (
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaTrophy className="text-purple-400" size={24} />
            Clan War League
          </h3>
        )}
        <CWLSkeleton />
      </Card>
    );
  }

  // Error or not in CWL
  if (hasError || !dataAvailable) {
    return (
      <Card className="p-4 sm:p-6">
        {showTitle && (
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaTrophy className="text-purple-400" size={24} />
            Clan War League
          </h3>
        )}
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
            <FaTrophy className="text-purple-400/50" size={32} />
          </div>
          <p className="text-gray-400 text-sm mb-2">
            Not currently in Clan War League
          </p>
          <p className="text-gray-500 text-xs">
            CWL data is only available during an active CWL season
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6">
      {showTitle && (
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <FaTrophy className="text-purple-400" size={24} />
            Clan War League
          </h3>
          <div className="flex items-center gap-2">
            {currentSeason && (
              <Badge variant="purple" className="text-xs flex items-center gap-1">
                <HiCalendar size={12} />
                {currentSeason}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <HiUserGroup size={12} />
              {clans.length} Clans
            </Badge>
          </div>
        </div>
      )}

      {/* Current Clan Position Highlight */}
      {currentClanRank > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaBolt className="text-amber-400" size={18} />
              <span className="text-gray-300 text-sm">Your Position:</span>
            </div>
            <Badge variant="gold" className="text-sm font-bold">
              #{currentClanRank} of {clans.length}
            </Badge>
          </div>
        </div>
      )}

      {/* Standings */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
          <HiShieldCheck size={16} />
          League Standings
        </h4>
        <div className="space-y-2">
          {sortedClans.map((clan, idx) => (
            <ClanRow 
              key={clan.tag} 
              clan={clan} 
              rank={idx + 1}
              isCurrentClan={clan.tag?.replace('#', '').toUpperCase() === clanTag?.replace('#', '').toUpperCase()}
              onClick={() => handleClanClick(clan)}
            />
          ))}
        </div>
      </div>

      {/* Rounds Toggle */}
      {rounds.length > 0 && (
        <div className="border-t border-gray-700/30 pt-4">
          <button
            onClick={() => setShowRounds(!showRounds)}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-dark-700/30 hover:bg-dark-600/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <HiCalendar className="text-purple-400" size={18} />
              <span className="text-gray-300 font-medium">
                War Schedule
              </span>
              <Badge variant="outline" className="text-xs">
                {rounds.length} Days
              </Badge>
            </div>
            {showRounds ? (
              <HiChevronUp className="text-gray-400" size={18} />
            ) : (
              <HiChevronDown className="text-gray-400" size={18} />
            )}
          </button>
          
          {showRounds && (
            <div className="mt-3 space-y-2">
              {rounds.map((round, idx) => (
                <RoundEntry 
                  key={idx} 
                  round={round} 
                  roundIndex={idx}
                  currentClanTag={clanTag}
                  onWarClick={handleWarClick}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info Note */}
      <div className="mt-4 p-3 rounded-lg bg-dark-700/30 border border-gray-700/30">
        <p className="text-gray-500 text-xs text-center">
          <span className="text-purple-400">ⓘ</span> CWL data is only available during an active season. 
          Historical CWL results are not provided by the API.
        </p>
      </div>
      
      {/* CWL War Details Modal */}
      <CWLWarDetails 
        warTag={selectedWarTag}
        isOpen={isWarModalOpen}
        onClose={handleCloseWarModal}
      />
    </Card>
  );
};

export default memo(CurrentCWL);

