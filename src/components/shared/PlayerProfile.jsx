import { memo, useMemo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiStar, HiTrendingUp, HiShieldCheck, HiLightningBolt, HiExternalLink, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { Card, Badge, StatCard } from '../ui';

// Assets
import trophyIcon from '../../assets/others/Trophy.png';
import xpIcon from '../../assets/others/XP.png';
import starIcon from '../../assets/others/Star.png';
import builderTrophyIcon from '../../assets/others/builderTrophy.png';

// Hero images
import barbarianKing from '../../assets/homeArmy/Barbarian_King.png';
import archerQueen from '../../assets/homeArmy/Archer_Queen.png';
import grandWarden from '../../assets/homeArmy/Grand_Warden.png';
import royalChampion from '../../assets/homeArmy/Royal_Champion.png';

// Town Hall images
const townHallImages = import.meta.glob('../../assets/townHall/*.png', { eager: true });

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

// ========== SUB-COMPONENTS ==========

// Hero Card Component
const HeroCard = memo(({ hero }) => {
  const heroImg = heroImages[hero.name];
  const progressPercent = Math.round((hero.level / hero.maxLevel) * 100);
  
  return (
    <div className="relative bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl md:rounded-2xl p-3 md:p-4 overflow-hidden group transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-center gap-3 md:gap-4">
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
                className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs md:text-sm font-bold text-purple-400">{hero.level}</span>
            <span className="text-[10px] md:text-xs text-gray-500">/ {hero.maxLevel}</span>
          </div>
        </div>
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
            {player.role.charAt(0).toUpperCase() + player.role.slice(1)}
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
        {player.league && (
          <Badge variant="outline" icon={player.league.iconUrls?.tiny} className="text-xs md:text-sm">
            {player.league.name}
          </Badge>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
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

// Stats Section Component
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
            <PlayerHeader player={player} townHallImg={townHallImg} actions={headerActions} onClanClick={handleClanClick} />
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {showStats && <PlayerStats player={player} />}
        
        {showHeroes && (
          <>
            <PlayerHeroes heroes={homeHeroes} title="Home Village Heroes" colorClass="bg-purple-500" />
            <PlayerHeroes heroes={builderHeroes} title="Builder Base Heroes" colorClass="bg-sky-500" />
          </>
        )}
        
        {showAchievements && <PlayerAchievements achievements={player.achievements} />}
      </section>
    </>
  );
});

PlayerProfile.displayName = 'PlayerProfile';

// Export sub-components for custom layouts
export { HeroCard, AchievementCard, PlayerHeader, PlayerStats, PlayerHeroes, PlayerAchievements };

export default PlayerProfile;

