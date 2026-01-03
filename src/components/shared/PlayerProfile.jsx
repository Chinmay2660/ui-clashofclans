import { memo, useMemo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiStar, HiTrendingUp, HiShieldCheck, HiLightningBolt, HiExternalLink, HiChevronDown, HiChevronUp, HiHome, HiOfficeBuilding, HiSparkles, HiCube, HiHeart, HiCollection } from 'react-icons/hi';
import { GiSwordClash, GiShield, GiTwoCoins, GiHealthPotion, GiSkeletonKey, GiCastle, GiCrossedSwords, GiHammerNails } from 'react-icons/gi';
import { Card, Badge, StatCard } from '../ui';
import { formatNumber } from '../../utils';

// Assets
import trophyIcon from '../../assets/others/Trophy.png';
import xpIcon from '../../assets/others/XP.png';
import starIcon from '../../assets/others/Star.png';
import builderTrophyIcon from '../../assets/others/builderTrophy.png';
import shieldIcon from '../../assets/others/sheild.png';

// Hero images
import barbarianKing from '../../assets/homeArmy/Barbarian_King.png';
import archerQueen from '../../assets/homeArmy/Archer_Queen.png';
import grandWarden from '../../assets/homeArmy/Grand_Warden.png';
import royalChampion from '../../assets/homeArmy/Royal_Champion.png';

// Town Hall images
const townHallImages = import.meta.glob('../../assets/townHall/*.png', { eager: true });

// Role labels mapping (API values to in-game names)
const roleLabels = {
  'leader': 'Leader',
  'coLeader': 'Co-Leader',
  'admin': 'Elder',
  'member': 'Member'
};

const getTownHallImage = (level) => {
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

// Hero image mapping
const heroImages = {
  'Barbarian King': barbarianKing,
  'Archer Queen': archerQueen,
  'Grand Warden': grandWarden,
  'Royal Champion': royalChampion,
};

// Color mapping for progress bars based on level completion
const getProgressColor = (percent) => {
  if (percent >= 100) return 'from-emerald-500 to-green-400';
  if (percent >= 75) return 'from-amber-500 to-yellow-400';
  if (percent >= 50) return 'from-orange-500 to-amber-400';
  return 'from-red-500 to-orange-400';
};

// ========== SUB-COMPONENTS ==========

// Labels Section Component
const PlayerLabels = memo(({ labels }) => {
  if (!labels || labels.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {labels.map((label) => (
        <div 
          key={label.id} 
          className="flex items-center gap-2 bg-dark-800/60 rounded-full px-3 py-1.5 border border-gray-700/30"
        >
          {label.iconUrls?.small && (
            <img src={label.iconUrls.small} alt={label.name} className="w-5 h-5" />
          )}
          <span className="text-xs md:text-sm text-gray-300">{label.name}</span>
        </div>
      ))}
    </div>
  );
});

PlayerLabels.displayName = 'PlayerLabels';

// Troop/Spell Card Component
const UnitCard = memo(({ unit, colorScheme = 'purple' }) => {
  const progressPercent = Math.round((unit.level / unit.maxLevel) * 100);
  const isMaxed = unit.level >= unit.maxLevel;
  const colorClasses = {
    purple: 'from-purple-500/20 to-violet-600/20',
    blue: 'from-blue-500/20 to-cyan-600/20',
    amber: 'from-amber-500/20 to-yellow-600/20',
    pink: 'from-pink-500/20 to-rose-600/20',
  };
  
  return (
    <div className="bg-dark-800/50 rounded-lg p-2 md:p-3 group hover:bg-dark-700/50 transition-all">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${colorClasses[colorScheme]} flex items-center justify-center shrink-0`}>
          <span className="text-xs md:text-sm font-bold text-white">{unit.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-white truncate font-medium">{unit.name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex-1 h-1 md:h-1.5 bg-dark-900 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${isMaxed ? 'from-emerald-500 to-green-400' : getProgressColor(progressPercent)} rounded-full`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className={`text-[10px] md:text-xs font-bold ${isMaxed ? 'text-emerald-400' : 'text-gray-400'}`}>
              {unit.level}/{unit.maxLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

UnitCard.displayName = 'UnitCard';

// Hero Equipment Card Component
const EquipmentCard = memo(({ equipment }) => {
  const progressPercent = Math.round((equipment.level / equipment.maxLevel) * 100);
  const isMaxed = equipment.level >= equipment.maxLevel;
  
  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-lg p-2 md:p-3 border border-amber-500/20 group hover:border-amber-500/40 transition-all">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-amber-500/30 to-yellow-600/30 flex items-center justify-center shrink-0">
          <HiSparkles className="text-amber-400" size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-white truncate font-medium">{equipment.name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex-1 h-1 md:h-1.5 bg-dark-900 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${isMaxed ? 'from-emerald-500 to-green-400' : 'from-amber-500 to-yellow-400'} rounded-full`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className={`text-[10px] md:text-xs font-bold ${isMaxed ? 'text-emerald-400' : 'text-amber-400'}`}>
              {equipment.level}/{equipment.maxLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

EquipmentCard.displayName = 'EquipmentCard';

// Hero Card Component with Equipment
const HeroCard = memo(({ hero }) => {
  const heroImg = heroImages[hero.name];
  const progressPercent = Math.round((hero.level / hero.maxLevel) * 100);
  const isMaxed = hero.level >= hero.maxLevel;
  
  return (
    <div className="relative bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl md:rounded-2xl p-3 md:p-4 overflow-hidden group transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 flex items-center justify-center overflow-hidden shrink-0">
            {heroImg ? (
              <img src={heroImg} alt={hero.name} className="w-10 h-10 md:w-14 md:h-14 object-contain" />
            ) : (
              <HiShieldCheck className="text-purple-400" size={22} />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white mb-1 text-sm md:text-base truncate">{hero.name}</h4>
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="flex-1 h-1.5 md:h-2 bg-dark-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${isMaxed ? 'from-emerald-500 to-green-400' : 'from-purple-500 to-violet-500'} rounded-full transition-all duration-500`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className={`text-xs md:text-sm font-bold ${isMaxed ? 'text-emerald-400' : 'text-purple-400'}`}>{hero.level}</span>
              <span className="text-[10px] md:text-xs text-gray-500">/ {hero.maxLevel}</span>
            </div>
          </div>
        </div>
        
        {/* Hero Equipment */}
        {hero.equipment && hero.equipment.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700/30">
            <p className="text-[10px] md:text-xs text-gray-500 mb-2">Equipment</p>
            <div className="flex flex-wrap gap-1.5">
              {hero.equipment.map((eq) => (
                <div 
                  key={eq.name}
                  className="flex items-center gap-1 bg-amber-500/10 rounded-md px-2 py-1 border border-amber-500/20"
                >
                  <HiSparkles className="text-amber-400" size={10} />
                  <span className="text-[10px] md:text-xs text-amber-300 truncate max-w-[80px]">{eq.name}</span>
                  <span className="text-[10px] font-bold text-amber-400">Lv.{eq.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

HeroCard.displayName = 'HeroCard';

// Achievement Card Component
const AchievementCard = memo(({ achievement }) => {
  const stars = achievement.stars || 0;
  
  return (
    <div className="bg-dark-800/50 rounded-lg md:rounded-xl p-3 md:p-4 transition-all duration-300">
      <div className="flex items-start justify-between mb-1.5 md:mb-2 gap-2">
        <h4 className="font-medium text-white text-xs md:text-sm truncate flex-1">{achievement.name}</h4>
        <div className="flex gap-0.5 shrink-0">
          {[1, 2, 3].map((star) => (
            <HiStar 
              key={star}
              size={12}
              className={star <= stars ? 'text-amber-400' : 'text-gray-700'}
            />
          ))}
        </div>
      </div>
      <p className="text-[10px] md:text-xs text-gray-500 mb-1.5 md:mb-2 line-clamp-2">{achievement.info}</p>
      <div className="flex items-center justify-between gap-2">
        <Badge variant={stars === 3 ? 'gold' : 'outline'} className="text-[10px] md:text-xs">
          {achievement.value?.toLocaleString()}
        </Badge>
        {achievement.target && (
          <span className="text-[10px] md:text-xs text-gray-600 truncate">Target: {achievement.target?.toLocaleString()}</span>
        )}
      </div>
    </div>
  );
});

AchievementCard.displayName = 'AchievementCard';

// Player Header Component
const PlayerHeader = memo(({ player, townHallImg, actions, onClanClick }) => (
  <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8">
    {/* Town Hall & Level */}
    <div className="flex flex-col items-center shrink-0">
      <div className="relative mb-3 md:mb-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-2xl md:rounded-3xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center shadow-2xl shadow-amber-500/20">
          {townHallImg && (
            <img src={townHallImg} alt={`TH${player.townHallLevel}`} className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain" />
          )}
        </div>
        <Badge variant="gold" className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 shadow-lg text-xs md:text-sm whitespace-nowrap">
          TH {player.townHallLevel}
        </Badge>
      </div>

      <div className="relative mt-4 md:mt-6">
        <div className="w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30 border-4 border-dark-900">
          <span className="text-lg md:text-xl lg:text-2xl font-black text-white">{player.expLevel}</span>
        </div>
        <p className="text-center text-[10px] md:text-xs text-gray-400 mt-1.5 md:mt-2">EXP Level</p>
      </div>
    </div>

    {/* Player Info */}
    <div className="flex-1 text-center lg:text-left min-w-0">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-1 md:mb-2 truncate">
        {player.name}
      </h1>
      <p className="text-gray-400 font-mono text-sm md:text-base lg:text-lg mb-3 md:mb-4">#{player.tag?.replace('#', '')}</p>
      
      <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 md:gap-2 mb-4 md:mb-6">
        {player.role && (
          <Badge variant="purple" className="text-xs md:text-sm">
            {roleLabels[player.role] || player.role}
          </Badge>
        )}
        {player.clan && (
          <button 
            onClick={() => onClanClick?.(player.clan)}
            className="group flex items-center gap-1 hover:scale-105 transition-transform"
          >
            <Badge variant="blue" icon={player.clan.badgeUrls?.small} className="text-xs md:text-sm group-hover:bg-blue-500/30">
              {player.clan.name}
              <HiExternalLink size={12} className="ml-1 opacity-60 group-hover:opacity-100" />
            </Badge>
          </button>
        )}
        {/* League Tier (Primary - New Ranking System) */}
        {player.leagueTier && (
          <Badge 
            variant="gold"
            icon={player.leagueTier.iconUrls?.small} 
            className="text-xs md:text-sm"
          >
            {player.leagueTier.name}
          </Badge>
        )}
        {/* Regular League (Secondary) */}
        {player.league && (
          <Badge variant="outline" icon={player.league.iconUrls?.tiny} className="text-xs md:text-sm">
            {player.league.name}
          </Badge>
        )}
        {player.builderBaseLeague && (
          <Badge variant="blue" className="text-xs md:text-sm">
            BB: {player.builderBaseLeague.name}
          </Badge>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
        <div className="bg-dark-800/50 rounded-lg md:rounded-xl p-2 md:p-3">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <img src={trophyIcon} alt="" className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-xs text-gray-400">Trophies</span>
          </div>
          <p className="text-base md:text-lg lg:text-xl font-bold text-amber-400">{player.trophies?.toLocaleString()}</p>
        </div>
        <div className="bg-dark-800/50 rounded-lg md:rounded-xl p-2 md:p-3">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <HiTrendingUp className="text-emerald-400" size={16} />
            <span className="text-[10px] md:text-xs text-gray-400">Best</span>
          </div>
          <p className="text-base md:text-lg lg:text-xl font-bold text-emerald-400">{player.bestTrophies?.toLocaleString()}</p>
        </div>
        <div className="bg-dark-800/50 rounded-lg md:rounded-xl p-2 md:p-3">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <img src={starIcon} alt="" className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-xs text-gray-400">War Stars</span>
          </div>
          <p className="text-base md:text-lg lg:text-xl font-bold text-purple-400">{player.warStars?.toLocaleString()}</p>
        </div>
        <div className="bg-dark-800/50 rounded-lg md:rounded-xl p-2 md:p-3">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <HiLightningBolt className="text-sky-400" size={16} />
            <span className="text-[10px] md:text-xs text-gray-400">Donations</span>
          </div>
          <p className="text-base md:text-lg lg:text-xl font-bold text-sky-400">{player.donations?.toLocaleString()}</p>
        </div>
        <div className="bg-dark-800/50 rounded-lg md:rounded-xl p-2 md:p-3 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <GiCastle className="text-yellow-400" size={16} />
            <span className="text-[10px] md:text-xs text-gray-400">Capital</span>
          </div>
          <p className="text-base md:text-lg lg:text-xl font-bold text-yellow-400">{formatNumber(player.clanCapitalContributions || 0)}</p>
        </div>
      </div>
    </div>

    {/* Actions */}
    {actions && (
      <div className="lg:self-start shrink-0">
        {actions}
      </div>
    )}
  </div>
));

PlayerHeader.displayName = 'PlayerHeader';

// Leagues & Rankings Section - League Tier is PRIMARY (new ranking system)
const LeagueStats = memo(({ player }) => {
  const hasAnyLeague = player.league || player.leagueTier || player.builderBaseLeague;
  if (!hasAnyLeague) return null;
  
  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
        <span className="w-1 h-5 md:h-6 bg-amber-500 rounded-full" />
        Leagues & Rankings
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* League Tier (PRIMARY - New Ranking System) - Shown First */}
        {player.leagueTier && (
          <div className="bg-gradient-to-br from-amber-500/10 to-yellow-600/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-4">
            {player.leagueTier.iconUrls?.large ? (
              <img 
                src={player.leagueTier.iconUrls.large} 
                alt={player.leagueTier.name} 
                className="w-14 h-14 md:w-16 md:h-16"
              />
            ) : (
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center">
                <HiStar className="text-amber-400" size={28} />
              </div>
            )}
            <div>
              <p className="text-[10px] md:text-xs text-amber-400 uppercase tracking-wide font-semibold">League Tier ★</p>
              <p className={`text-base md:text-lg font-bold ${player.leagueTier.name === 'Unranked' ? 'text-gray-400' : 'text-amber-400'}`}>
                {player.leagueTier.name}
              </p>
              <p className="text-xs text-amber-400/60">{player.trophies?.toLocaleString() || 0} trophies</p>
            </div>
          </div>
        )}

        {/* Home Village League (Secondary) */}
        {player.league && (
          <div className="bg-dark-800/50 rounded-xl p-4 flex items-center gap-4">
            {player.league.iconUrls?.medium && (
              <img 
                src={player.league.iconUrls.medium} 
                alt={player.league.name} 
                className="w-14 h-14 md:w-16 md:h-16"
              />
            )}
            <div>
              <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">Home League</p>
              <p className="text-base md:text-lg font-bold text-white">{player.league.name}</p>
              <p className="text-xs text-gray-500">Classic League</p>
            </div>
          </div>
        )}
        
        {/* Builder Base League */}
        {player.builderBaseLeague && (
          <div className="bg-dark-800/50 rounded-xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
              <GiHammerNails className="text-cyan-400" size={28} />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">Builder Base</p>
              <p className="text-base md:text-lg font-bold text-cyan-400">{player.builderBaseLeague.name}</p>
              <p className="text-xs text-cyan-400/60">{player.builderBaseTrophies?.toLocaleString() || 0} trophies</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

LeagueStats.displayName = 'LeagueStats';

// Battle Statistics Section
const BattleStats = memo(({ player }) => (
  <div className="mb-6 md:mb-8">
    <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
      <span className="w-1 h-5 md:h-6 bg-red-500 rounded-full" />
      Battle Statistics
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2">
          <GiSwordClash className="text-red-400" size={20} />
          <span className="text-xs md:text-sm text-gray-400">Attack Wins</span>
        </div>
        <p className="text-lg md:text-2xl font-bold text-white">{player.attackWins?.toLocaleString() || '0'}</p>
      </div>
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2">
          <GiShield className="text-blue-400" size={20} />
          <span className="text-xs md:text-sm text-gray-400">Defense Wins</span>
        </div>
        <p className="text-lg md:text-2xl font-bold text-white">{player.defenseWins?.toLocaleString() || '0'}</p>
      </div>
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2">
          <img src={starIcon} alt="" className="w-5 h-5" />
          <span className="text-xs md:text-sm text-gray-400">War Stars</span>
        </div>
        <p className="text-lg md:text-2xl font-bold text-amber-400">{player.warStars?.toLocaleString() || '0'}</p>
      </div>
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2">
          <GiCrossedSwords className="text-purple-400" size={20} />
          <span className="text-xs md:text-sm text-gray-400">War Preference</span>
        </div>
        <Badge variant={player.warPreference === 'in' ? 'success' : 'outline'} className="mt-1">
          {player.warPreference === 'in' ? 'In War' : 'Out of War'}
        </Badge>
      </div>
    </div>
  </div>
));

BattleStats.displayName = 'BattleStats';

// Donation Stats Section
const DonationStats = memo(({ player }) => (
  <div className="mb-6 md:mb-8">
    <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
      <span className="w-1 h-5 md:h-6 bg-green-500 rounded-full" />
      Donations & Contributions
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2">
          <HiLightningBolt className="text-emerald-400" size={20} />
          <span className="text-xs md:text-sm text-gray-400">Donated</span>
        </div>
        <p className="text-lg md:text-2xl font-bold text-emerald-400">{player.donations?.toLocaleString() || '0'}</p>
      </div>
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2">
          <HiHeart className="text-pink-400" size={20} />
          <span className="text-xs md:text-sm text-gray-400">Received</span>
        </div>
        <p className="text-lg md:text-2xl font-bold text-pink-400">{player.donationsReceived?.toLocaleString() || '0'}</p>
      </div>
      <div className="bg-dark-800/50 rounded-xl p-3 md:p-4 col-span-2">
        <div className="flex items-center gap-2 mb-2">
          <GiCastle className="text-yellow-400" size={20} />
          <span className="text-xs md:text-sm text-gray-400">Clan Capital Contributions</span>
        </div>
        <p className="text-lg md:text-2xl font-bold text-yellow-400">{formatNumber(player.clanCapitalContributions || 0)}</p>
      </div>
    </div>
  </div>
));

DonationStats.displayName = 'DonationStats';

// Builder Base Stats Section
const BuilderBaseStats = memo(({ player }) => (
  <div className="mb-6 md:mb-8">
    <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
      <span className="w-1 h-5 md:h-6 bg-cyan-500 rounded-full" />
      Builder Base
    </h2>
    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl p-4 md:p-6 border border-cyan-500/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-2">
            <HiOfficeBuilding className="text-cyan-400" size={28} />
          </div>
          <p className="text-2xl md:text-3xl font-black text-white">{player.builderHallLevel || '?'}</p>
          <p className="text-xs text-gray-400">Builder Hall</p>
        </div>
        <div className="text-center">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center mx-auto mb-2">
            <img src={builderTrophyIcon} alt="" className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <p className="text-2xl md:text-3xl font-black text-amber-400">{player.builderBaseTrophies?.toLocaleString() || '0'}</p>
          <p className="text-xs text-gray-400">Trophies</p>
        </div>
        <div className="text-center">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 flex items-center justify-center mx-auto mb-2">
            <HiTrendingUp className="text-emerald-400" size={28} />
          </div>
          <p className="text-2xl md:text-3xl font-black text-emerald-400">{player.bestBuilderBaseTrophies?.toLocaleString() || '0'}</p>
          <p className="text-xs text-gray-400">Best Trophies</p>
        </div>
        <div className="text-center">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 flex items-center justify-center mx-auto mb-2">
            <HiCollection className="text-purple-400" size={28} />
          </div>
          <p className="text-lg md:text-xl font-bold text-purple-400 truncate px-2">
            {player.builderBaseLeague?.name?.replace(' League', '') || 'N/A'}
          </p>
          <p className="text-xs text-gray-400">League</p>
        </div>
      </div>
    </div>
  </div>
));

BuilderBaseStats.displayName = 'BuilderBaseStats';

// Troops Section Component
const TroopsSection = memo(({ troops, title, colorScheme = 'purple', village = 'home', initialLimit = 12 }) => {
  const [showAll, setShowAll] = useState(false);
  
  const filteredTroops = useMemo(() => 
    troops?.filter(t => t.village === village) || [],
    [troops, village]
  );
  
  if (filteredTroops.length === 0) return null;
  
  const displayedTroops = showAll ? filteredTroops : filteredTroops.slice(0, initialLimit);
  const hasMore = filteredTroops.length > initialLimit;
  
  // Calculate overall progress
  const totalLevels = filteredTroops.reduce((sum, t) => sum + t.level, 0);
  const totalMaxLevels = filteredTroops.reduce((sum, t) => sum + t.maxLevel, 0);
  const overallPercent = totalMaxLevels > 0 ? Math.round((totalLevels / totalMaxLevels) * 100) : 0;
  
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className="text-base md:text-xl font-semibold text-white flex items-center gap-2">
          <span className={`w-1 h-5 md:h-6 ${colorScheme === 'purple' ? 'bg-purple-500' : 'bg-cyan-500'} rounded-full`} />
          {title} ({filteredTroops.length})
        </h2>
        <Badge variant={overallPercent >= 100 ? 'success' : 'outline'} className="text-xs">
          {overallPercent}% Complete
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
        {displayedTroops.map((troop) => (
          <UnitCard key={`${troop.name}-${troop.village}`} unit={troop} colorScheme={colorScheme} />
        ))}
      </div>
      
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className={`w-full mt-4 py-2 text-center ${colorScheme === 'purple' ? 'text-purple-400 hover:bg-purple-500/10' : 'text-cyan-400 hover:bg-cyan-500/10'} transition-colors flex items-center justify-center gap-2 rounded-xl`}
        >
          {showAll ? (
            <>
              <HiChevronUp size={18} />
              Show Less
            </>
          ) : (
            <>
              <HiChevronDown size={18} />
              Show All {filteredTroops.length}
            </>
          )}
        </button>
      )}
    </div>
  );
});

TroopsSection.displayName = 'TroopsSection';

// Spells Section Component
const SpellsSection = memo(({ spells, initialLimit = 8 }) => {
  const [showAll, setShowAll] = useState(false);
  
  if (!spells || spells.length === 0) return null;
  
  const displayedSpells = showAll ? spells : spells.slice(0, initialLimit);
  const hasMore = spells.length > initialLimit;
  
  // Calculate overall progress
  const totalLevels = spells.reduce((sum, s) => sum + s.level, 0);
  const totalMaxLevels = spells.reduce((sum, s) => sum + s.maxLevel, 0);
  const overallPercent = totalMaxLevels > 0 ? Math.round((totalLevels / totalMaxLevels) * 100) : 0;
  
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className="text-base md:text-xl font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-5 md:h-6 bg-pink-500 rounded-full" />
          Spells ({spells.length})
        </h2>
        <Badge variant={overallPercent >= 100 ? 'success' : 'outline'} className="text-xs">
          {overallPercent}% Complete
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
        {displayedSpells.map((spell) => (
          <UnitCard key={spell.name} unit={spell} colorScheme="pink" />
        ))}
      </div>
      
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-center text-pink-400 hover:bg-pink-500/10 transition-colors flex items-center justify-center gap-2 rounded-xl"
        >
          {showAll ? (
            <>
              <HiChevronUp size={18} />
              Show Less
            </>
          ) : (
            <>
              <HiChevronDown size={18} />
              Show All {spells.length}
            </>
          )}
        </button>
      )}
    </div>
  );
});

SpellsSection.displayName = 'SpellsSection';

// Hero Equipment Section
const HeroEquipmentSection = memo(({ equipment, initialLimit = 12 }) => {
  const [showAll, setShowAll] = useState(false);
  
  if (!equipment || equipment.length === 0) return null;
  
  const displayedEquipment = showAll ? equipment : equipment.slice(0, initialLimit);
  const hasMore = equipment.length > initialLimit;
  
  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
        <span className="w-1 h-5 md:h-6 bg-amber-500 rounded-full" />
        Hero Equipment ({equipment.length})
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
        {displayedEquipment.map((eq) => (
          <EquipmentCard key={eq.name} equipment={eq} />
        ))}
      </div>
      
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-center text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-2 rounded-xl"
        >
          {showAll ? (
            <>
              <HiChevronUp size={18} />
              Show Less
            </>
          ) : (
            <>
              <HiChevronDown size={18} />
              Show All {equipment.length}
            </>
          )}
        </button>
      )}
    </div>
  );
});

HeroEquipmentSection.displayName = 'HeroEquipmentSection';

// Stats Section Component (Original - kept for backward compatibility)
const PlayerStats = memo(({ player }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
    <StatCard
      icon={builderTrophyIcon}
      label="Builder Trophies"
      value={player.builderBaseTrophies?.toLocaleString() || '0'}
      subValue={`Best: ${player.bestBuilderBaseTrophies?.toLocaleString() || '0'}`}
      color="blue"
    />
    <StatCard
      icon={xpIcon}
      label="Donations Given"
      value={player.donations?.toLocaleString() || '0'}
      color="green"
    />
    <StatCard
      icon={xpIcon}
      label="Donations Received"
      value={player.donationsReceived?.toLocaleString() || '0'}
      color="purple"
    />
    <StatCard
      icon={starIcon}
      label="Attack Wins"
      value={player.attackWins?.toLocaleString() || '0'}
      color="amber"
    />
  </div>
));

PlayerStats.displayName = 'PlayerStats';

// Heroes Section Component
const PlayerHeroes = memo(({ heroes, title, colorClass }) => {
  if (!heroes || heroes.length === 0) return null;
  
  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
        <span className={`w-1 h-5 md:h-6 ${colorClass} rounded-full`} />
        {title}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {heroes.map((hero) => (
          <HeroCard key={hero.name} hero={hero} />
        ))}
      </div>
    </div>
  );
});

PlayerHeroes.displayName = 'PlayerHeroes';

// Achievements Section Component
const PlayerAchievements = memo(({ achievements, initialLimit = 6 }) => {
  const [showAll, setShowAll] = useState(false);
  
  if (!achievements || achievements.length === 0) return null;
  
  const displayedAchievements = showAll ? achievements : achievements.slice(0, initialLimit);
  const hasMore = achievements.length > initialLimit;
  
  return (
    <div>
      <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
        <span className="w-1 h-5 md:h-6 bg-amber-500 rounded-full" />
        Achievements ({achievements.length})
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
        {displayedAchievements.map((achievement) => (
          <AchievementCard key={achievement.name} achievement={achievement} />
        ))}
      </div>
      
      {/* Show More/Less Button */}
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
              Show All {achievements.length} Achievements
            </>
          )}
        </button>
      )}
    </div>
  );
});

PlayerAchievements.displayName = 'PlayerAchievements';

// ========== MAIN COMPONENT ==========

/**
 * Reusable PlayerProfile Component
 * Can be used in Search results, My Profile, and Player Details pages
 * 
 * @param {Object} player - Player data object
 * @param {boolean} showHeader - Whether to show the header section with gradient background
 * @param {boolean} showStats - Whether to show detailed stats section
 * @param {boolean} showHeroes - Whether to show heroes section
 * @param {boolean} showTroops - Whether to show troops section
 * @param {boolean} showSpells - Whether to show spells section
 * @param {boolean} showEquipment - Whether to show hero equipment section
 * @param {boolean} showBuilderBase - Whether to show builder base stats
 * @param {boolean} showAchievements - Whether to show achievements section
 * @param {ReactNode} headerActions - Custom actions to show in header (e.g., Refresh button)
 * @param {string} variant - 'full' (page), 'card' (search result), 'compact' (minimal)
 * @param {Function} onClanClick - Callback when clan is clicked (optional, defaults to navigate)
 */
const PlayerProfile = memo(({ 
  player, 
  showHeader = true,
  showStats = true,
  showHeroes = true,
  showTroops = true,
  showSpells = true,
  showEquipment = true,
  showBuilderBase = true,
  showAchievements = true,
  headerActions,
  variant = 'full',
  onClanClick,
}) => {
  const navigate = useNavigate();
  
  const townHallImg = useMemo(
    () => player?.townHallLevel ? getTownHallImage(player.townHallLevel) : null,
    [player?.townHallLevel]
  );

  const homeHeroes = useMemo(
    () => player?.heroes?.filter(h => h.village === 'home') || [],
    [player?.heroes]
  );

  const builderHeroes = useMemo(
    () => player?.heroes?.filter(h => h.village === 'builderBase') || [],
    [player?.heroes]
  );

  const homeAchievements = useMemo(
    () => player?.achievements?.filter(a => a.village === 'home') || [],
    [player?.achievements]
  );

  // Handle clan click - navigate to clan page
  const handleClanClick = useCallback((clan) => {
    if (onClanClick) {
      onClanClick(clan);
    } else if (clan?.tag) {
      // Default: navigate to search and load the clan
      const tag = clan.tag.replace('#', '');
      navigate(`/clan/${tag}`);
    }
  }, [navigate, onClanClick]);

  if (!player) return null;

  // Card variant - used in search results
  if (variant === 'card') {
    return (
      <Card gradient className="p-4 md:p-6 animate-fadeIn">
        <PlayerHeader player={player} townHallImg={townHallImg} actions={headerActions} onClanClick={handleClanClick} />
      </Card>
    );
  }

  // Compact variant - minimal display
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-4 p-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center">
          {townHallImg && <img src={townHallImg} alt="" className="w-12 h-12 object-contain" />}
        </div>
        <div>
          <h3 className="font-bold text-white">{player.name}</h3>
          <p className="text-gray-400 text-sm font-mono">#{player.tag?.replace('#', '')}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <img src={trophyIcon} alt="" className="w-5 h-5" />
          <span className="font-bold text-amber-400">{player.trophies?.toLocaleString()}</span>
        </div>
      </div>
    );
  }

  // Full variant - complete page display
  return (
    <>
      {/* Header Section */}
      {showHeader && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-dark-900 to-dark-900" />
          <div className="absolute top-0 right-0 w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-purple-600/20 rounded-full blur-[60px] md:blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 bg-amber-600/10 rounded-full blur-[50px] md:blur-[100px]" />
          
          <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-12">
            {/* Labels under header */}
            <PlayerLabels labels={player.labels} />
            <PlayerHeader player={player} townHallImg={townHallImg} actions={headerActions} onClanClick={handleClanClick} />
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Leagues, Battle & Donation Stats */}
        {showStats && (
          <>
            <LeagueStats player={player} />
            <BattleStats player={player} />
            <DonationStats player={player} />
          </>
        )}
        
        {/* Builder Base Stats */}
        {showBuilderBase && player.builderHallLevel && (
          <BuilderBaseStats player={player} />
        )}
        
        {/* Heroes */}
        {showHeroes && (
          <>
            <PlayerHeroes heroes={homeHeroes} title="Home Village Heroes" colorClass="bg-purple-500" />
            <PlayerHeroes heroes={builderHeroes} title="Builder Base Heroes" colorClass="bg-sky-500" />
          </>
        )}
        
        {/* Hero Equipment */}
        {showEquipment && player.heroEquipment && (
          <HeroEquipmentSection equipment={player.heroEquipment} />
        )}
        
        {/* Troops */}
        {showTroops && player.troops && (
          <>
            <TroopsSection 
              troops={player.troops} 
              title="Home Village Troops" 
              colorScheme="purple" 
              village="home" 
            />
            <TroopsSection 
              troops={player.troops} 
              title="Builder Base Troops" 
              colorScheme="blue" 
              village="builderBase" 
            />
          </>
        )}
        
        {/* Spells */}
        {showSpells && player.spells && (
          <SpellsSection spells={player.spells} />
        )}
        
        {/* Achievements */}
        {showAchievements && <PlayerAchievements achievements={homeAchievements} />}
      </section>
    </>
  );
});

PlayerProfile.displayName = 'PlayerProfile';

// Export sub-components for custom layouts
export { 
  HeroCard, 
  AchievementCard, 
  PlayerHeader, 
  PlayerStats, 
  PlayerHeroes, 
  PlayerAchievements,
  PlayerLabels,
  UnitCard,
  EquipmentCard,
  BattleStats,
  DonationStats,
  BuilderBaseStats,
  TroopsSection,
  SpellsSection,
  HeroEquipmentSection,
};

export default PlayerProfile;

