import { memo, useEffect, useState, useRef } from 'react';
import { HiStar, HiShieldCheck, HiShieldExclamation, HiMinus, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { Card, Badge, WarStatsSummary } from '../ui';
import { useWarLog } from '../../Store/hooks';
import { Skeleton } from '../ui/Skeleton';
import { formatDate } from '../../utils';

// Single war entry
const WarEntry = memo(({ war, index }) => {
  const isWin = war.result === 'win';
  const isLoss = war.result === 'lose';
  const isDraw = war.result === 'tie';
  
  const resultColor = isWin ? 'text-emerald-400' : isLoss ? 'text-red-400' : 'text-yellow-400';
  const resultBg = isWin ? 'bg-emerald-500/20' : isLoss ? 'bg-red-500/20' : 'bg-yellow-500/20';
  const resultBorder = '';
  
  const ResultIcon = isWin ? HiShieldCheck : isLoss ? HiShieldExclamation : HiMinus;
  
  return (
    <div 
      className={`p-3 sm:p-4 rounded-xl ${resultBg} transition-all hover:scale-[1.01]`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left side - Result & Opponent */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${resultBg} flex items-center justify-center shrink-0`}>
            <ResultIcon className={resultColor} size={24} />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant={isWin ? 'success' : isLoss ? 'error' : 'warning'} 
                className="text-xs uppercase font-bold"
              >
                {war.result?.toUpperCase() || 'UNKNOWN'}
              </Badge>
              <span className="text-gray-500 text-xs hidden sm:inline">
                {formatDate(war.endTime)}
              </span>
            </div>
            <p className="text-white font-medium truncate text-sm sm:text-base mt-0.5">
              vs {war.opponent?.name || 'Unknown Clan'}
            </p>
          </div>
        </div>
        
        {/* Right side - Stars */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-white font-bold text-lg sm:text-xl">
              {war.clan?.stars || 0}
            </span>
            <HiStar className="text-yellow-400" size={18} />
            <span className="text-gray-500 mx-1">-</span>
            <span className="text-gray-400 font-bold text-lg sm:text-xl">
              {war.opponent?.stars || 0}
            </span>
            <HiStar className="text-gray-500" size={18} />
          </div>
          <div className="text-xs text-gray-500">
            {war.teamSize}v{war.teamSize}
          </div>
        </div>
      </div>
      
      {/* Additional stats */}
      <div className="mt-3 pt-3 border-t border-gray-700/50 flex justify-between text-xs text-gray-400">
        <div className="flex gap-4">
          <span>Destruction: <span className="text-white">{(war.clan?.destructionPercentage || 0).toFixed(1)}%</span></span>
          <span className="hidden sm:inline">Attacks: <span className="text-white">{war.clan?.attacks || 0}</span></span>
        </div>
        <span className="sm:hidden text-gray-500">{formatDate(war.endTime)}</span>
      </div>
    </div>
  );
});

WarEntry.displayName = 'WarEntry';

// War Log Loading Skeleton
const WarLogSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="p-4 rounded-xl bg-dark-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton type="avatar" className="w-12 h-12" />
            <div>
              <Skeleton type="text" className="w-16 h-4 mb-1" />
              <Skeleton type="text" className="w-32 h-5" />
            </div>
          </div>
          <Skeleton type="text" className="w-24 h-6" />
        </div>
      </div>
    ))}
  </div>
);

// War Statistics Summary - uses reusable component
const WarStats = memo(({ wars }) => {
  const wins = wars.filter(w => w.result === 'win').length;
  const losses = wars.filter(w => w.result === 'lose').length;
  const total = wars.length;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : 0;
  const totalStars = wars.reduce((sum, w) => sum + (w.clan?.stars || 0), 0);
  
  return (
    <div className="mb-6">
      <WarStatsSummary 
        wins={wins} 
        losses={losses} 
        winRate={winRate} 
        totalStars={totalStars} 
      />
    </div>
  );
});

WarStats.displayName = 'WarStats';

// Main War Log Component
const WarLog = ({ clanTag, showTitle = true, limit = 10 }) => {
  const { wars, loading, error, getWarLog, hasData } = useWarLog();
  const [showAll, setShowAll] = useState(false);
  const fetchedTagRef = useRef(null);

  useEffect(() => {
    // Only fetch if we haven't fetched for this tag yet
    if (clanTag && fetchedTagRef.current !== clanTag && !loading) {
      fetchedTagRef.current = clanTag;
      getWarLog(clanTag);
    }
  }, [clanTag, getWarLog, loading]);

  // Loading state
  if (loading) {
    return (
      <Card className="p-4 sm:p-6">
        {showTitle && (
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <HiShieldCheck className="text-amber-400" size={24} />
            War Log
          </h3>
        )}
        <WarLogSkeleton />
      </Card>
    );
  }

  // Error state - War log might be private
  if (error) {
    return (
      <Card className="p-4 sm:p-6">
        {showTitle && (
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <HiShieldCheck className="text-amber-400" size={24} />
            War Log
          </h3>
        )}
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-3">
            <HiShieldExclamation className="text-gray-500" size={32} />
          </div>
          <p className="text-gray-400 text-sm">
            War log is private or unavailable
          </p>
        </div>
      </Card>
    );
  }

  // No data
  if (!hasData || wars.length === 0) {
    return (
      <Card className="p-4 sm:p-6">
        {showTitle && (
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <HiShieldCheck className="text-amber-400" size={24} />
            War Log
          </h3>
        )}
        <div className="text-center py-8">
          <p className="text-gray-400">No war history available</p>
        </div>
      </Card>
    );
  }

  const displayedWars = showAll ? wars : wars.slice(0, limit);
  const hasMore = wars.length > limit;

  return (
    <Card className="p-4 sm:p-6">
      {showTitle && (
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <HiShieldCheck className="text-amber-400" size={24} />
          War Log
          <Badge variant="outline" className="ml-2 text-xs">
            {wars.length} Wars
          </Badge>
        </h3>
      )}
      
      {/* Stats Summary */}
      <WarStats wars={wars} />
      
      {/* War List */}
      <div className="space-y-3">
        {displayedWars.map((war, index) => (
          <WarEntry key={`${war.endTime}-${index}`} war={war} index={index} />
        ))}
      </div>
      
      {/* Show More/Less */}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-3 text-center text-amber-400 hover:text-amber-300 transition-colors flex items-center justify-center gap-2 rounded-xl hover:bg-amber-500/10"
        >
          {showAll ? (
            <>
              <HiChevronUp size={18} />
              Show Less
            </>
          ) : (
            <>
              <HiChevronDown size={18} />
              Show All {wars.length} Wars
            </>
          )}
        </button>
      )}
    </Card>
  );
};

export default memo(WarLog);

