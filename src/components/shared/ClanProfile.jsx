import { memo, useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUsers, HiStar, HiShieldCheck, HiFire, HiGlobe, HiFlag, HiTrendingUp, HiExternalLink, HiHome, HiLockClosed, HiLockOpen, HiClock, HiChat, HiChevronDown, HiChevronUp, HiOfficeBuilding, HiLocationMarker } from 'react-icons/hi';
import { GiCastle, GiTwoCoins, GiCrossedSwords, GiBattleGear } from 'react-icons/gi';
import { Card, Badge, StatCard } from '../ui';
import { formatNumber } from '../../utils';

// Assets
import trophyIcon from '../../assets/others/Trophy.png';
import starIcon from '../../assets/others/Star.png';
import shieldIcon from '../../assets/others/sheild.png';
import builderTrophyIcon from '../../assets/others/builderTrophy.png';

// Town Hall images
const townHallImages = import.meta.glob('../../assets/townHall/*.png', { eager: true });

const getTownHallImage = (level) => {
  if (!level) return null;
  if (level >= 16) {
    const img = townHallImages['../../assets/townHall/TH16_Main.png'];
    return img?.default;
  }
  if (level >= 12) {
    const img = townHallImages[`../../assets/townHall/Giga_Inferno${level}-1.png`] || 
                townHallImages['../../assets/townHall/Giga_Inferno1.png'];
    return img?.default;
  }
  const img = townHallImages[`../../assets/townHall/Town_Hall${level}.png`];
  return img?.default;
};

// War frequency labels
const warFrequencyLabels = {
  'always': 'Always',
  'moreThanOncePerWeek': '2+ per Week',
  'oncePerWeek': 'Once per Week',
  'lessThanOncePerWeek': 'Rarely',
  'never': 'Never',
  'unknown': 'Unknown'
};

// Role labels mapping (API values to in-game names)
const roleLabels = {
  'leader': 'Leader',
  'coLeader': 'Co-Leader',
  'admin': 'Elder',
  'member': 'Member'
};

// ========== SUB-COMPONENTS ==========

// Achievement Banner Component
const AchievementBanner = memo(({ currentStreak, records }) => {
  if (!records) return null;
  
  return (
    <div className="relative overflow-hidden rounded-xl md:rounded-2xl mb-6 md:mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-500 to-red-500" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />
      <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
              <HiFire className="text-white drop-shadow-lg" size={36} />
            </div>
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-[10px] md:text-xs font-bold text-yellow-900">🏆</span>
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-1.5 md:gap-2 mb-2 flex-wrap">
              <Badge variant="gold" className="bg-white/20 text-white text-xs">
                <HiGlobe size={12} />
                {records.recordScope}
              </Badge>
              {records.bestRank && (
                <Badge variant="gold" className="bg-yellow-500/30 text-white text-xs">
                  🏅 Rank #{records.bestRank}
                </Badge>
              )}
              <Badge variant="outline" className="text-white/90 text-xs">
                {records.recordDate}
              </Badge>
            </div>
            
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-lg">
              {records.recordTitle}
            </h2>
            
            <p className="text-white/80 text-xs md:text-sm lg:text-base hidden sm:block">
              {records.bestRank 
                ? `Ranked #${records.bestRank} in ${records.recordScope} for War Win Streak`
                : 'Unmatched dominance in Clan Wars'
              }
            </p>
          </div>

          <div className="flex gap-3 md:gap-4 shrink-0">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3">
                <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg">
                  {records.highestWarWinStreak}
                </p>
                <p className="text-[10px] md:text-xs text-white/70 uppercase tracking-wide mt-0.5">Best Streak</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3">
                <div className="flex items-center justify-center gap-0.5">
                  <HiTrendingUp className="text-emerald-300" size={16} />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg">
                    {currentStreak}
                  </p>
                </div>
                <p className="text-[10px] md:text-xs text-white/70 uppercase tracking-wide mt-0.5">Current</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-700/50 flex flex-wrap justify-center md:justify-start gap-3 md:gap-6">
          <div className="flex items-center gap-1.5 text-white/80">
            <HiFlag className="text-white/60" size={14} />
            <span className="text-xs md:text-sm">{records.recordScope}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/80">
            <HiStar className="text-yellow-300" size={14} />
            <span className="text-xs md:text-sm">Elite War Clan</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/80">
            <HiFire className="text-orange-300" size={14} />
            <span className="text-xs md:text-sm">{records.highestWarWinStreak} Win Streak Record</span>
          </div>
        </div>
      </div>
    </div>
  );
});

AchievementBanner.displayName = 'AchievementBanner';

// War Achievements Section - Shows war win streak prominently with personal best tracking
const WarAchievements = memo(({ clan }) => {
  // Get personal best from localStorage
  const storageKey = `clan_${clan.tag?.replace('#', '')}_best_streak`;
  const storedBest = useMemo(() => {
    try {
      return parseInt(localStorage.getItem(storageKey)) || 0;
    } catch {
      return 0;
    }
  }, [storageKey]);
  
  // Update personal best if current streak is higher
  const personalBest = useMemo(() => {
    const currentStreak = clan.warWinStreak || 0;
    if (currentStreak > storedBest) {
      try {
        localStorage.setItem(storageKey, currentStreak.toString());
      } catch {
        // Ignore storage errors
      }
      return currentStreak;
    }
    return storedBest;
  }, [clan.warWinStreak, storedBest, storageKey]);

  const currentStreak = clan.warWinStreak || 0;
  const isNewRecord = currentStreak > 0 && currentStreak >= personalBest;

  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
        <span className="w-1 h-5 md:h-6 bg-orange-500 rounded-full" />
        War Achievements
        {clan.location && (
          <Badge variant="outline" className="ml-auto text-xs">
            <HiLocationMarker size={12} />
            {clan.location.name}
          </Badge>
        )}
      </h2>
      
      {/* War Win Streak Banner */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-600/20 via-amber-500/20 to-yellow-500/20 border border-orange-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            {/* Fire Icon */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-500/30 to-red-600/30 flex items-center justify-center shrink-0">
              <HiFire className="text-orange-400 drop-shadow-lg" size={36} />
              {isNewRecord && currentStreak > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-[8px] md:text-[10px] font-bold text-amber-900">🏆</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <p className="text-[10px] md:text-xs text-orange-300 uppercase tracking-wide font-semibold">
                  Current War Win Streak
                </p>
                {isNewRecord && currentStreak > 0 && (
                  <Badge variant="gold" className="text-[8px] md:text-[10px] animate-pulse">
                    Personal Best!
                  </Badge>
                )}
              </div>
              <p className="text-4xl sm:text-5xl md:text-6xl font-black text-orange-400 drop-shadow-lg">
                {currentStreak}
              </p>
              <p className="text-xs md:text-sm text-gray-400 mt-1">consecutive war victories</p>
            </div>

            {/* Additional Stats */}
            <div className="flex gap-3 md:gap-4 shrink-0">
              <div className="text-center">
                <div className="bg-dark-800/60 rounded-xl px-3 py-2 md:px-4 md:py-3">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-400">{clan.warWins || 0}</p>
                  <p className="text-[9px] md:text-[10px] text-gray-400 uppercase">Total Wins</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-dark-800/60 rounded-xl px-3 py-2 md:px-4 md:py-3">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-400">{personalBest}</p>
                  <p className="text-[9px] md:text-[10px] text-gray-400 uppercase">Best Streak</p>
                </div>
              </div>
            </div>
          </div>

          {/* War Record */}
          {(clan.warWins || clan.warLosses || clan.warTies) && (
            <div className="mt-4 pt-4 border-t border-orange-500/20">
              <div className="flex items-center justify-center sm:justify-start gap-4 md:gap-6 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs md:text-sm text-gray-300">
                    <span className="font-bold text-emerald-400">{clan.warWins || 0}</span> Wins
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-xs md:text-sm text-gray-300">
                    <span className="font-bold text-red-400">{clan.warLosses || 0}</span> Losses
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-xs md:text-sm text-gray-300">
                    <span className="font-bold text-gray-400">{clan.warTies || 0}</span> Ties
                  </span>
                </div>
                {clan.warWins > 0 && (
                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="text-xs md:text-sm text-gray-500">
                      Win Rate: <span className="font-bold text-amber-400">
                        {Math.round((clan.warWins / (clan.warWins + (clan.warLosses || 0))) * 100)}%
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Note */}
          <p className="text-[9px] md:text-[10px] text-gray-500 mt-3 text-center sm:text-left">
            ℹ️ War win streak rankings are not available via the official API. Personal best is tracked locally.
          </p>
        </div>
      </div>
    </div>
  );
});

WarAchievements.displayName = 'WarAchievements';

// Member Row Component with Town Hall - Mobile Optimized with Spacious Card Design
// Shows League Tier (new ranking system) instead of regular league
const MemberRow = memo(({ member, index, onClick }) => {
  const thImage = useMemo(() => getTownHallImage(member.townHallLevel), [member.townHallLevel]);
  
  // Mobile Card Layout
  const MobileCard = () => (
    <div className="p-3 space-y-3">
      {/* Top Row: Rank + TH + Name/Role + League Icon */}
      <div className="flex items-center gap-3">
        {/* Rank Badge */}
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-transform group-hover:scale-110
          ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-lg shadow-amber-500/30' :
            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
            index === 2 ? 'bg-gradient-to-br from-orange-600 to-amber-700 text-white' :
            'bg-dark-700 text-gray-400'}
        `}>
          {index + 1}
        </div>

        {/* Town Hall */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center shrink-0 relative transition-transform group-hover:scale-105">
          {thImage ? (
            <img src={thImage} alt={`TH${member.townHallLevel}`} className="w-9 h-9 object-contain" />
          ) : (
            <span className="text-amber-400 font-bold text-sm">{member.townHallLevel}</span>
          )}
          <span className="absolute -bottom-1 -right-1 bg-dark-800 text-amber-400 text-[9px] font-bold px-1 py-0.5 rounded border border-amber-500/30">
            {member.townHallLevel}
          </span>
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-bold text-white text-sm truncate max-w-[140px] group-hover:text-amber-400 transition-colors">{member.name}</p>
            {member.role === 'leader' && (
              <Badge variant="gold" className="text-[9px] px-1.5 py-0.5">Leader</Badge>
            )}
            {member.role === 'coLeader' && (
              <Badge variant="purple" className="text-[9px] px-1.5 py-0.5">Co-Leader</Badge>
            )}
            {member.role === 'admin' && (
              <Badge variant="blue" className="text-[9px] px-1.5 py-0.5">Elder</Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-gray-500 font-mono text-[10px]">#{member.tag?.replace('#', '')}</span>
            <span className="text-cyan-400 font-medium text-[10px]">Lvl {member.expLevel}</span>
          </div>
        </div>

        {/* League Tier Icon */}
        <div className="shrink-0">
          {member.leagueTier?.iconUrls?.small ? (
            <img src={member.leagueTier.iconUrls.small} alt={member.leagueTier.name} className="w-8 h-8" title={member.leagueTier.name} />
          ) : member.league?.iconUrls?.tiny ? (
            <img src={member.league.iconUrls.tiny} alt="" className="w-8 h-8" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
              <span className="text-[8px] text-gray-500">N/A</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between bg-dark-800/50 rounded-lg px-3 py-2">
        {/* Home Trophies */}
        <div className="flex items-center gap-1.5" title="Home Village Trophies">
          <img src={trophyIcon} alt="" className="w-4 h-4" />
          <span className="text-amber-400 text-sm font-semibold">{member.trophies?.toLocaleString()}</span>
        </div>

        {/* Builder Trophies */}
        <div className="flex items-center gap-1.5" title="Builder Base Trophies">
          <img src={builderTrophyIcon} alt="" className="w-4 h-4" />
          <span className="text-cyan-400 text-sm font-medium">{member.builderBaseTrophies?.toLocaleString() || '0'}</span>
        </div>

        {/* Donations */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-0.5 text-emerald-400" title="Donated">
            <span className="text-emerald-400">↑</span>
            <span className="font-medium">{member.donations}</span>
          </div>
          <div className="flex items-center gap-0.5 text-gray-400" title="Received">
            <span>↓</span>
            <span>{member.donationsReceived}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Row Layout
  const DesktopRow = () => (
    <div className="flex items-center gap-3 p-4">
      {/* Rank */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-transform group-hover:scale-110
        ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-lg shadow-amber-500/30' :
          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
          index === 2 ? 'bg-gradient-to-br from-orange-600 to-amber-700 text-white' :
          'bg-dark-800 text-gray-400'}
      `}>
        {index + 1}
      </div>

      {/* Town Hall */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center shrink-0 relative transition-transform group-hover:scale-105">
        {thImage ? (
          <img src={thImage} alt={`TH${member.townHallLevel}`} className="w-10 h-10 object-contain" />
        ) : (
          <span className="text-amber-400 font-bold text-sm">{member.townHallLevel}</span>
        )}
        <span className="absolute -bottom-1 -right-1 bg-dark-800 text-amber-400 text-[10px] font-bold px-1 rounded">
          {member.townHallLevel}
        </span>
      </div>

      {/* League Tier Icon */}
      <div className="shrink-0 w-10 h-10 flex items-center justify-center" title={member.leagueTier?.name || member.league?.name || 'Unranked'}>
        {member.leagueTier?.iconUrls?.small ? (
          <img src={member.leagueTier.iconUrls.small} alt={member.leagueTier.name} className="w-8 h-8" />
        ) : member.league?.iconUrls?.tiny ? (
          <img src={member.league.iconUrls.tiny} alt="" className="w-8 h-8" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
            <span className="text-[8px] text-gray-500">N/A</span>
          </div>
        )}
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-white text-base truncate group-hover:text-amber-400 transition-colors">{member.name}</p>
          {member.role === 'leader' && (
            <Badge variant="gold" className="text-xs">Leader</Badge>
          )}
          {member.role === 'coLeader' && (
            <Badge variant="purple" className="text-xs">Co-Leader</Badge>
          )}
          {member.role === 'admin' && (
            <Badge variant="blue" className="text-xs">Elder</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 font-mono">#{member.tag?.replace('#', '')}</span>
          <span className="text-cyan-400 font-medium">Lvl {member.expLevel}</span>
          {member.leagueTier && (
            <span className="text-amber-400/80">• {member.leagueTier.name}</span>
          )}
        </div>
      </div>

      {/* Trophies */}
      <div className="shrink-0">
        <div className="flex items-center gap-1.5 justify-end" title="Home Village Trophies">
          <img src={trophyIcon} alt="" className="w-4 h-4" />
          <span className="font-semibold text-amber-400 text-sm w-14 text-right">{member.trophies?.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end" title="Builder Base Trophies">
          <img src={builderTrophyIcon} alt="" className="w-4 h-4" />
          <span className="text-xs text-cyan-400 w-14 text-right">{member.builderBaseTrophies?.toLocaleString() || '0'}</span>
        </div>
      </div>

      {/* Donations */}
      <div className="shrink-0 min-w-[90px]">
        <div className="flex items-center gap-1 justify-end" title="Troops Donated">
          <span className="text-[10px] text-gray-500">Donated</span>
          <span className="text-xs text-emerald-400 font-medium w-8 text-right">{member.donations}</span>
        </div>
        <div className="flex items-center gap-1 justify-end" title="Troops Received">
          <span className="text-[10px] text-gray-500">Received</span>
          <span className="text-[10px] text-gray-400 w-8 text-right">{member.donationsReceived}</span>
        </div>
      </div>

      {/* View indicator */}
      <HiExternalLink className="text-gray-600 group-hover:text-amber-400 transition-colors shrink-0" size={18} />
    </div>
  );

  return (
    <button
      onClick={onClick}
      className="w-full bg-dark-900/50 rounded-xl hover:bg-dark-700/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 group text-left"
    >
      {/* Mobile Layout (< 640px) */}
      <div className="sm:hidden">
        <MobileCard />
      </div>
      
      {/* Desktop Layout (>= 640px) */}
      <div className="hidden sm:block">
        <DesktopRow />
      </div>
    </button>
  );
});

MemberRow.displayName = 'MemberRow';

// Level Badge Component - Premium styled
const LevelBadge = memo(({ level }) => (
  <div className="relative inline-flex items-center">
    {/* Outer glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg blur-sm opacity-50" />
    
    {/* Badge container */}
    <div className="relative flex items-center gap-1 bg-gradient-to-r from-purple-600 to-violet-600 px-2 py-1 rounded-lg shadow-lg">
      {/* Star icon */}
      <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-inner">
        <HiStar className="text-yellow-900" size={10} />
      </div>
      {/* Level number */}
      <span className="text-white font-bold text-sm tracking-wide">
        {level}
      </span>
    </div>
  </div>
));

LevelBadge.displayName = 'LevelBadge';

// Clan Header Component
const ClanHeader = memo(({ clan, actions }) => (
  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
    {clan.badgeUrls?.large ? (
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 flex items-center justify-center p-1.5 md:p-2 shrink-0">
        <img src={clan.badgeUrls.large} alt={clan.name} className="w-full h-full object-contain" />
      </div>
    ) : (
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl md:rounded-2xl bg-dark-800 flex items-center justify-center shrink-0">
        <HiUsers className="text-gray-600" size={36} />
      </div>
    )}

    <div className="text-center md:text-left flex-1 min-w-0">
      <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-1 md:mb-2 flex-wrap">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white truncate">
          {clan.name}
        </h1>
        <LevelBadge level={clan.clanLevel} />
      </div>
      
      <p className="text-gray-400 font-mono text-sm md:text-base mb-2 md:mb-3">#{clan.tag?.replace('#', '')}</p>
      
      <div className="flex flex-wrap justify-center md:justify-start gap-1.5 md:gap-2">
        <Badge variant="gold" className="text-xs">{clan.type}</Badge>
        {clan.warLeague && (
          <Badge variant="blue" icon={clan.warLeague.iconUrls?.tiny} className="text-xs">
            {clan.warLeague.name}
          </Badge>
        )}
        {clan.location && (
          <Badge variant="outline" className="text-xs">
            <HiLocationMarker size={10} />
            {clan.location.name}
          </Badge>
        )}
      </div>
    </div>

    {actions && (
      <div className="shrink-0">
        {actions}
      </div>
    )}
  </div>
));

ClanHeader.displayName = 'ClanHeader';

// Clan Stats Component - Enhanced
const ClanStats = memo(({ clan }) => (
  <div className="mb-6 md:mb-8">
    <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
      <span className="w-1 h-5 md:h-6 bg-amber-500 rounded-full" />
      Clan Statistics
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 text-center">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mx-auto mb-2">
          <img src={trophyIcon} alt="" className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <p className="text-lg md:text-2xl font-bold text-amber-400">{formatNumber(clan.clanPoints || 0)}</p>
        <p className="text-[10px] md:text-xs text-gray-400">Clan Points</p>
      </div>
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 text-center">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-2">
          <img src={builderTrophyIcon} alt="" className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <p className="text-lg md:text-2xl font-bold text-cyan-400">{formatNumber(clan.clanBuilderBasePoints || 0)}</p>
        <p className="text-[10px] md:text-xs text-gray-400">Builder Points</p>
      </div>
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 text-center">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 flex items-center justify-center mx-auto mb-2">
          <GiCastle className="text-purple-400" size={24} />
        </div>
        <p className="text-lg md:text-2xl font-bold text-purple-400">{formatNumber(clan.clanCapitalPoints || 0)}</p>
        <p className="text-[10px] md:text-xs text-gray-400">Capital Points</p>
      </div>
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 text-center">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 flex items-center justify-center mx-auto mb-2">
          <img src={starIcon} alt="" className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <p className="text-lg md:text-2xl font-bold text-emerald-400">{clan.warWins || 0}</p>
        <p className="text-[10px] md:text-xs text-gray-400">War Wins</p>
      </div>
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 text-center">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-600/20 flex items-center justify-center mx-auto mb-2">
          <HiFire className="text-orange-400" size={24} />
        </div>
        <p className="text-lg md:text-2xl font-bold text-orange-400">{clan.warWinStreak || 0}</p>
        <p className="text-[10px] md:text-xs text-gray-400">Win Streak</p>
      </div>
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 text-center">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center mx-auto mb-2">
          <HiUsers className="text-blue-400" size={24} />
        </div>
        <p className="text-lg md:text-2xl font-bold text-blue-400">{clan.members}/50</p>
        <p className="text-[10px] md:text-xs text-gray-400">Members</p>
      </div>
    </div>
  </div>
));

ClanStats.displayName = 'ClanStats';

// Clan Requirements Section
const ClanRequirements = memo(({ clan }) => (
  <div className="mb-6 md:mb-8">
    <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
      <span className="w-1 h-5 md:h-6 bg-red-500 rounded-full" />
      Join Requirements
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
          <img src={trophyIcon} alt="" className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm md:text-lg font-bold text-white">{clan.requiredTrophies?.toLocaleString() || '0'}</p>
          <p className="text-[10px] md:text-xs text-gray-400">Min Trophies</p>
        </div>
      </div>
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
          <img src={builderTrophyIcon} alt="" className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm md:text-lg font-bold text-white">{clan.requiredBuilderBaseTrophies?.toLocaleString() || '0'}</p>
          <p className="text-[10px] md:text-xs text-gray-400">Builder Trophies</p>
        </div>
      </div>
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
          <HiHome className="text-amber-400" size={20} />
        </div>
        <div>
          <p className="text-sm md:text-lg font-bold text-white">TH {clan.requiredTownhallLevel || 1}+</p>
          <p className="text-[10px] md:text-xs text-gray-400">Min Town Hall</p>
        </div>
      </div>
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center shrink-0">
          {clan.type === 'open' ? (
            <HiLockOpen className="text-emerald-400" size={20} />
          ) : clan.type === 'closed' ? (
            <HiLockClosed className="text-red-400" size={20} />
          ) : (
            <HiUsers className="text-amber-400" size={20} />
          )}
        </div>
        <div>
          <p className="text-sm md:text-lg font-bold text-white capitalize">{clan.type || 'Unknown'}</p>
          <p className="text-[10px] md:text-xs text-gray-400">Clan Type</p>
        </div>
      </div>
    </div>
  </div>
));

ClanRequirements.displayName = 'ClanRequirements';

// Clan Capital Section
const ClanCapitalSection = memo(({ clanCapital, capitalLeague }) => {
  if (!clanCapital) return null;
  
  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
        <span className="w-1 h-5 md:h-6 bg-yellow-500 rounded-full" />
        Clan Capital
      </h2>
      <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/10 rounded-xl p-4 md:p-6 border border-yellow-500/20">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-yellow-500/30 to-amber-600/30 flex items-center justify-center">
            <GiCastle className="text-yellow-400" size={40} />
          </div>
          <div className="text-center md:text-left">
            <p className="text-2xl md:text-4xl font-black text-white mb-1">Level {clanCapital.capitalHallLevel}</p>
            <p className="text-gray-400 text-sm">Capital Hall</p>
            {capitalLeague && capitalLeague.name !== 'Unranked' && (
              <Badge variant="gold" className="mt-2">{capitalLeague.name}</Badge>
            )}
          </div>
        </div>
        
        {/* Districts */}
        {clanCapital.districts && clanCapital.districts.length > 0 && (
          <div className="pt-4 border-t border-yellow-500/20">
            <p className="text-xs md:text-sm text-gray-400 mb-3">Unlocked Districts ({clanCapital.districts.length})</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {clanCapital.districts.map((district) => (
                <div 
                  key={district.id}
                  className="bg-dark-800/50 rounded-lg p-3 flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                    <HiOfficeBuilding className="text-yellow-400" size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs md:text-sm font-medium truncate">{district.name}</p>
                    <p className="text-yellow-400 text-[10px] md:text-xs">Level {district.districtHallLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ClanCapitalSection.displayName = 'ClanCapitalSection';

// Clan Info Section (Location, Language, War Frequency)
const ClanInfoSection = memo(({ clan }) => (
  <div className="mb-6 md:mb-8">
    <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
      <span className="w-1 h-5 md:h-6 bg-blue-500 rounded-full" />
      Clan Information
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      {clan.location && (
        <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
            <HiLocationMarker className="text-blue-400" size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-sm md:text-base font-bold text-white truncate">{clan.location.name}</p>
            <p className="text-[10px] md:text-xs text-gray-400">Location</p>
          </div>
        </div>
      )}
      {clan.chatLanguage && (
        <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <HiChat className="text-emerald-400" size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-sm md:text-base font-bold text-white truncate">{clan.chatLanguage.name}</p>
            <p className="text-[10px] md:text-xs text-gray-400">Language</p>
          </div>
        </div>
      )}
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
          <GiCrossedSwords className="text-red-400" size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm md:text-base font-bold text-white truncate">{warFrequencyLabels[clan.warFrequency] || 'Unknown'}</p>
          <p className="text-[10px] md:text-xs text-gray-400">War Frequency</p>
        </div>
      </div>
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
          <HiShieldCheck className={clan.isWarLogPublic ? 'text-emerald-400' : 'text-gray-500'} size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm md:text-base font-bold text-white">{clan.isWarLogPublic ? 'Public' : 'Private'}</p>
          <p className="text-[10px] md:text-xs text-gray-400">War Log</p>
        </div>
      </div>
    </div>
  </div>
));

ClanInfoSection.displayName = 'ClanInfoSection';

// TH Distribution Chart
const THDistribution = memo(({ members }) => {
  if (!members || members.length === 0) return null;
  
  // Calculate TH distribution
  const thCounts = useMemo(() => {
    const counts = {};
    members.forEach(m => {
      const th = m.townHallLevel || 0;
      counts[th] = (counts[th] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([th, count]) => ({ th: parseInt(th), count }))
      .sort((a, b) => b.th - a.th);
  }, [members]);
  
  const maxCount = Math.max(...thCounts.map(t => t.count));
  
  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
        <span className="w-1 h-5 md:h-6 bg-orange-500 rounded-full" />
        Town Hall Distribution
      </h2>
      <div className="bg-dark-800/50 rounded-xl p-4 md:p-6">
        <div className="flex items-end justify-between gap-1 md:gap-2 h-32 md:h-40">
          {thCounts.map(({ th, count }) => {
            const thImg = getTownHallImage(th);
            const heightPercent = (count / maxCount) * 100;
            
            return (
              <div key={th} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-amber-500 to-yellow-400 rounded-t-md transition-all relative group"
                  style={{ height: `${heightPercent}%`, minHeight: '20px' }}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-amber-400">
                    {count}
                  </span>
                </div>
                <div className="w-6 h-6 md:w-8 md:h-8 mt-2 flex items-center justify-center">
                  {thImg ? (
                    <img src={thImg} alt={`TH${th}`} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px] md:text-xs text-gray-400">{th}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

THDistribution.displayName = 'THDistribution';

// War Record Component
const ClanWarRecord = memo(({ clan }) => (
  <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
    <Card className="p-3 md:p-6 text-center bg-gradient-to-br from-emerald-500/10 to-green-600/10">
      <HiStar className="text-emerald-400 mx-auto mb-1 md:mb-2" size={24} />
      <p className="text-xl md:text-3xl font-bold text-emerald-400">{clan.warWins || 0}</p>
      <p className="text-[10px] md:text-sm text-gray-400">Wars Won</p>
    </Card>
    <Card className="p-3 md:p-6 text-center bg-gradient-to-br from-gray-500/10 to-gray-600/10">
      <HiShieldCheck className="text-gray-400 mx-auto mb-1 md:mb-2" size={24} />
      <p className="text-xl md:text-3xl font-bold text-gray-400">{clan.warTies || 0}</p>
      <p className="text-[10px] md:text-sm text-gray-400">Wars Tied</p>
    </Card>
    <Card className="p-3 md:p-6 text-center bg-gradient-to-br from-red-500/10 to-rose-600/10">
      <HiStar className="text-red-400 mx-auto mb-1 md:mb-2" size={24} />
      <p className="text-xl md:text-3xl font-bold text-red-400">{clan.warLosses || 0}</p>
      <p className="text-[10px] md:text-sm text-gray-400">Wars Lost</p>
    </Card>
  </div>
));

ClanWarRecord.displayName = 'ClanWarRecord';

// Clan Labels Component
const ClanLabels = memo(({ labels }) => {
  if (!labels || labels.length === 0) return null;
  
  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
        <span className="w-1 h-5 md:h-6 bg-sky-500 rounded-full" />
        Clan Labels
      </h2>
      <div className="flex flex-wrap gap-2 md:gap-3">
        {labels.map((label) => (
          <div key={label.id} className="flex items-center gap-1.5 md:gap-2 bg-dark-800 rounded-full px-2.5 md:px-4 py-1.5 md:py-2">
            {label.iconUrls?.small && <img src={label.iconUrls.small} alt={label.name} className="w-4 h-4 md:w-6 md:h-6" />}
            <span className="text-gray-300 text-xs md:text-sm">{label.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

ClanLabels.displayName = 'ClanLabels';

// Member List Component
const ClanMemberList = memo(({ members, totalMembers, onMemberClick }) => {
  if (!members || members.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2 flex-wrap">
        <span className="w-1 h-5 md:h-6 bg-amber-500 rounded-full" />
        Clan Members ({totalMembers}/50)
        <span className="text-xs md:text-sm font-normal text-gray-500 ml-1 md:ml-2">Tap to view profile</span>
      </h2>
      
      {/* Column Headers - Desktop only */}
      <div className="hidden sm:flex items-center gap-3 px-3 md:px-4 py-2 mb-2 text-[10px] text-gray-500 uppercase tracking-wide border-b border-dark-700">
        <div className="w-8 md:w-10 text-center shrink-0">#</div>
        <div className="w-10 md:w-12 shrink-0">TH</div>
        <div className="flex-1 min-w-0">Player</div>
        <div className="w-[72px] text-right shrink-0">Trophies</div>
        <div className="w-[80px] text-right shrink-0 hidden md:block">Donations</div>
        <div className="w-4 shrink-0 hidden md:block"></div>
      </div>
      
      <div className="space-y-3 sm:space-y-2">
        {members.map((member, index) => (
          <MemberRow 
            key={member.tag} 
            member={member} 
            index={index} 
            onClick={() => onMemberClick?.(member)}
          />
        ))}
      </div>
    </div>
  );
});

ClanMemberList.displayName = 'ClanMemberList';

// ========== MAIN COMPONENT ==========

/**
 * Reusable ClanProfile Component
 * Can be used in Search results and My Team pages
 * 
 * @param {Object} clan - Clan data object
 * @param {boolean} showHeader - Whether to show the header section
 * @param {boolean} showStats - Whether to show stats section
 * @param {boolean} showWarRecord - Whether to show war record cards
 * @param {boolean} showLabels - Whether to show clan labels
 * @param {boolean} showMembers - Whether to show member list
 * @param {boolean} showInfo - Whether to show clan info section
 * @param {boolean} showRequirements - Whether to show requirements section
 * @param {boolean} showCapital - Whether to show clan capital section
 * @param {boolean} showTHDistribution - Whether to show TH distribution chart
 * @param {Object} records - Achievement records for banner (optional)
 * @param {ReactNode} headerActions - Custom actions for header
 * @param {Function} onMemberClick - Callback when member is clicked
 * @param {string} variant - 'full' (page), 'card' (search result)
 */
const ClanProfile = memo(({ 
  clan, 
  showHeader = true,
  showStats = true,
  showWarRecord = true,
  showLabels = true,
  showMembers = true,
  showInfo = true,
  showRequirements = true,
  showCapital = true,
  showTHDistribution = true,
  records,
  headerActions,
  onMemberClick,
  variant = 'full',
}) => {
  const navigate = useNavigate();
  
  const handleMemberClick = useCallback((member) => {
    if (onMemberClick) {
      onMemberClick(member);
    } else {
      // Default behavior: navigate to player details
      const tag = member.tag.replace('#', '');
      navigate(`/player/${tag}`);
    }
  }, [navigate, onMemberClick]);

  if (!clan) return null;

  // Card variant - used in search results
  if (variant === 'card') {
    return (
      <Card gradient className="p-4 md:p-6 animate-fadeIn">
        <ClanHeader clan={clan} actions={headerActions} />
        
        {clan.description && (
          <div className="bg-dark-900/50 rounded-xl p-4 mt-4">
            <p className="text-gray-300 text-sm">{clan.description}</p>
          </div>
        )}
        
        <div className="mt-4">
          <ClanStats clan={clan} />
        </div>
        
        {clan.memberList && clan.memberList.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-500 rounded-full" />
              Top Members
              <span className="text-xs font-normal text-gray-500 ml-2">Click to view profile</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {clan.memberList.slice(0, 6).map((member, index) => (
                <MemberRow
                  key={member.tag}
                  member={member}
                  index={index}
                  onClick={() => handleMemberClick(member)}
                />
              ))}
            </div>
          </div>
        )}
      </Card>
    );
  }

  // Full variant - complete page display
  return (
    <>
      {/* Header Section */}
      {showHeader && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-dark-900 to-dark-900" />
          
          <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-12">
            <ClanHeader clan={clan} actions={headerActions} />
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {records && (
          <AchievementBanner currentStreak={clan.warWinStreak || 0} records={records} />
        )}
        
        {/* Clan Description */}
        {clan.description && (
          <Card className="p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-sm md:text-base font-semibold text-gray-400 mb-2">About</h2>
            <p className="text-gray-200 text-sm md:text-base whitespace-pre-wrap">{clan.description}</p>
          </Card>
        )}
        
        {/* Stats */}
        {showStats && <ClanStats clan={clan} />}
        
        {/* War Achievements - Always shown for full variant */}
        {showWarRecord && <WarAchievements clan={clan} />}
        
        {/* Clan Info (Location, Language, War Frequency) */}
        {showInfo && <ClanInfoSection clan={clan} />}
        
        {/* Requirements */}
        {showRequirements && <ClanRequirements clan={clan} />}
        
        {/* War Record */}
        {showWarRecord && <ClanWarRecord clan={clan} />}
        
        {/* Labels */}
        {showLabels && <ClanLabels labels={clan.labels} />}
        
        {/* Clan Capital */}
        {showCapital && <ClanCapitalSection clanCapital={clan.clanCapital} capitalLeague={clan.capitalLeague} />}
        
        {/* TH Distribution */}
        {showTHDistribution && <THDistribution members={clan.memberList} />}
        
        {/* Members */}
        {showMembers && (
          <ClanMemberList 
            members={clan.memberList} 
            totalMembers={clan.members}
            onMemberClick={handleMemberClick}
          />
        )}
      </section>
    </>
  );
});

ClanProfile.displayName = 'ClanProfile';

// Export sub-components for custom layouts
export { 
  AchievementBanner, 
  MemberRow, 
  ClanHeader, 
  ClanStats, 
  ClanWarRecord, 
  ClanLabels, 
  ClanMemberList,
  ClanRequirements,
  ClanCapitalSection,
  ClanInfoSection,
  THDistribution,
};

export default ClanProfile;

