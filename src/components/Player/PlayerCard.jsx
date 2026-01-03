import { memo, useMemo } from 'react';
import { Card, Badge, StatCard } from '../ui';
import trophyIcon from '../../assets/others/Trophy.png';
import xpIcon from '../../assets/others/XP.png';
import starIcon from '../../assets/others/Star.png';
import builderTrophyIcon from '../../assets/others/builderTrophy.png';

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

const PlayerCard = memo(({ player }) => {
  const townHallImg = useMemo(() => getTownHallImage(player.townHallLevel), [player.townHallLevel]);

  if (!player) return null;

  return (
    <Card gradient className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        {/* Town Hall Image */}
        <div className="relative">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center">
            {townHallImg && (
              <img src={townHallImg} alt={`TH${player.townHallLevel}`} className="w-20 h-20 object-contain" />
            )}
          </div>
          <Badge variant="gold" className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            TH {player.townHallLevel}
          </Badge>
        </div>

        {/* Player Info */}
        <div className="text-center md:text-left flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{player.name}</h2>
          <p className="text-gray-400 font-mono mb-3">#{player.tag?.replace('#', '')}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {player.role && (
              <Badge variant="purple">{player.role}</Badge>
            )}
            {player.clan && (
              <Badge variant="blue" icon={player.clan.badgeUrls?.small}>
                {player.clan.name}
              </Badge>
            )}
            {player.league && (
              <Badge variant="outline" icon={player.league.iconUrls?.tiny}>
                {player.league.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Level Circle */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <span className="text-2xl font-bold text-white">{player.expLevel}</span>
          </div>
          <p className="text-center text-xs text-gray-400 mt-1">Level</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={trophyIcon}
          label="Trophies"
          value={player.trophies?.toLocaleString()}
          subValue={`Best: ${player.bestTrophies?.toLocaleString()}`}
          color="amber"
        />
        <StatCard
          icon={builderTrophyIcon}
          label="Builder Trophies"
          value={player.builderBaseTrophies?.toLocaleString() || '0'}
          subValue={`Best: ${player.bestBuilderBaseTrophies?.toLocaleString() || '0'}`}
          color="blue"
        />
        <StatCard
          icon={starIcon}
          label="War Stars"
          value={player.warStars?.toLocaleString() || '0'}
          color="purple"
        />
        <StatCard
          icon={xpIcon}
          label="Donations"
          value={player.donations?.toLocaleString() || '0'}
          subValue={`Received: ${player.donationsReceived?.toLocaleString() || '0'}`}
          color="green"
        />
      </div>

      {/* Heroes Section */}
      {player.heroes && player.heroes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-amber-500 rounded-full" />
            Heroes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {player.heroes.filter(h => h.village === 'home').map((hero) => (
              <div
                key={hero.name}
                className="bg-dark-900/50 rounded-xl p-3 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-600/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-purple-400">{hero.level}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{hero.name}</p>
                  <p className="text-xs text-gray-500">Max: {hero.maxLevel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {player.achievements && player.achievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-emerald-500 rounded-full" />
            Top Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {player.achievements.slice(0, 6).map((achievement) => (
              <div
                key={achievement.name}
                className="bg-dark-900/50 rounded-xl p-3"
              >
                <p className="text-sm font-medium text-white mb-1">{achievement.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{achievement.info}</p>
                  <Badge variant="green" className="text-xs">{achievement.value}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
});

PlayerCard.displayName = 'PlayerCard';

export default PlayerCard;

