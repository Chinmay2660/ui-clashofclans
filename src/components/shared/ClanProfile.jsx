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

// Member Row Component with Town Hall
const MemberRow = memo(({ member, index, onClick }) => {
  const thImage = useMemo(() => getTownHallImage(member.townHallLevel), [member.townHallLevel]);
  
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 sm:gap-3 md:gap-4 p-3 md:p-4 bg-dark-900/50 rounded-lg md:rounded-xl hover:bg-dark-800/50 transition-all duration-200 group text-left"
    >
      {/* Rank */}
      <div className={`
        w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold shrink-0
        ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-lg shadow-amber-500/30' :
          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
          index === 2 ? 'bg-gradient-to-br from-orange-600 to-amber-700 text-white' :
          'bg-dark-800 text-gray-400'}
      `}>
        {index + 1}
      </div>

      {/* Town Hall */}
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center shrink-0 relative">
        {thImage ? (
          <img src={thImage} alt={`TH${member.townHallLevel}`} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
        ) : (
          <span className="text-amber-400 font-bold text-xs">{member.townHallLevel}</span>
        )}
        <span className="absolute -bottom-1 -right-1 bg-dark-800 text-amber-400 text-[8px] md:text-[10px] font-bold px-1 rounded">
          {member.townHallLevel}
        </span>
      </div>

      {/* League Icon */}
      {member.league?.iconUrls?.tiny && (
        <img src={member.league.iconUrls.tiny} alt="" className="w-6 h-6 md:w-8 md:h-8 shrink-0 hidden sm:block" />
      )}

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 md:gap-2 flex-wrap">
          <p className="font-semibold text-white text-sm md:text-base truncate group-hover:text-amber-400 transition-colors">{member.name}</p>
          {member.role === 'leader' && (
            <Badge variant="gold" className="text-[10px] md:text-xs">Leader</Badge>
          )}
          {member.role === 'coLeader' && (
            <Badge variant="purple" className="text-[10px] md:text-xs">Co-Leader</Badge>
          )}
          {member.role === 'admin' && (
            <Badge variant="blue" className="text-[10px] md:text-xs">Elder</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[10px] md:text-xs text-gray-500 font-mono">#{member.tag?.replace('#', '')}</p>
          <span className="text-[10px] text-gray-600 hidden md:inline">• Lvl {member.expLevel}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="text-right shrink-0">
        <div className="flex items-center gap-0.5 md:gap-1 justify-end">
          <img src={trophyIcon} alt="" className="w-3 h-3 md:w-4 md:h-4" />
          <span className="font-semibold text-amber-400 text-sm md:text-base">{member.trophies?.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-0.5 justify-end text-[10px] md:text-xs text-gray-500">
          <img src={builderTrophyIcon} alt="" className="w-3 h-3 hidden sm:block" />
          <span>{member.builderBaseTrophies?.toLocaleString() || '0'}</span>
        </div>
      </div>

      {/* Donations */}
      <div className="text-right shrink-0 hidden lg:block">
        <p className="text-sm text-emerald-400">↑ {member.donations}</p>
        <p className="text-xs text-gray-500">↓ {member.donationsReceived}</p>
      </div>

      {/* View indicator */}
      <HiExternalLink className="text-gray-600 group-hover:text-amber-400 transition-colors shrink-0 hidden sm:block" size={16} />
    </button>
  );
});

MemberRow.displayName = 'MemberRow';

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
      <div className="flex items-center justify-center md:justify-start gap-2 mb-1 md:mb-2 flex-wrap">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white truncate">
          {clan.name}
        </h1>
        <Badge variant="purple" className="text-xs md:text-sm">Level {clan.clanLevel}</Badge>
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
          <Badge variant="outline" className="text-xs">{clan.location.name}</Badge>
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
      <div className="space-y-1.5 md:space-y-2">
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

