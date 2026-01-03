import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiExternalLink } from 'react-icons/hi';
import { Card, Badge, StatCard } from '../ui';
import trophyIcon from '../../assets/others/Trophy.png';
import starIcon from '../../assets/others/Star.png';
import shieldIcon from '../../assets/others/sheild.png';

// Clickable Member Row
const MemberRow = memo(({ member, index, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-dark-900/50 rounded-xl p-3 flex items-center gap-3 hover:bg-dark-800/50 transition-all duration-200 group text-left"
  >
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
      index === 0 ? 'bg-amber-500 text-white' :
      index === 1 ? 'bg-gray-400 text-white' :
      index === 2 ? 'bg-orange-700 text-white' :
      'bg-dark-800 text-gray-400'
    }`}>
      {index + 1}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-white truncate group-hover:text-amber-400 transition-colors">{member.name}</p>
      <p className="text-xs text-gray-500">{member.role}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-sm font-semibold text-amber-400">{member.trophies?.toLocaleString()}</p>
      <p className="text-xs text-gray-500">Lvl {member.expLevel}</p>
    </div>
    <HiExternalLink className="text-gray-600 group-hover:text-amber-400 transition-colors shrink-0" size={16} />
  </button>
));

const ClanCard = memo(({ clan }) => {
  const navigate = useNavigate();

  const handleMemberClick = useCallback((member) => {
    const tag = member.tag.replace('#', '');
    navigate(`/player/${tag}`);
  }, [navigate]);

  if (!clan) return null;

  return (
    <Card gradient className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        {/* Clan Badge */}
        <div className="relative">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 flex items-center justify-center p-2">
            {clan.badgeUrls?.large && (
              <img src={clan.badgeUrls.large} alt={clan.name} className="w-full h-full object-contain" />
            )}
          </div>
          <Badge variant="purple" className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            Level {clan.clanLevel}
          </Badge>
        </div>

        {/* Clan Info */}
        <div className="text-center md:text-left flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{clan.name}</h2>
          <p className="text-gray-400 font-mono mb-3">#{clan.tag?.replace('#', '')}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <Badge variant="gold">{clan.type}</Badge>
            {clan.warLeague && (
              <Badge variant="blue" icon={clan.warLeague.iconUrls?.tiny}>
                {clan.warLeague.name}
              </Badge>
            )}
            {clan.location && (
              <Badge variant="outline">{clan.location.name}</Badge>
            )}
          </div>
        </div>

        {/* Members Count */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <span className="text-2xl font-bold text-white">{clan.members}</span>
          </div>
          <p className="text-center text-xs text-gray-400 mt-1">Members</p>
        </div>
      </div>

      {/* Description */}
      {clan.description && (
        <div className="bg-dark-900/50 rounded-xl p-4 mb-6">
          <p className="text-gray-300 text-sm">{clan.description}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={trophyIcon}
          label="Clan Points"
          value={clan.clanPoints?.toLocaleString()}
          color="amber"
        />
        <StatCard
          icon={trophyIcon}
          label="Builder Points"
          value={clan.clanBuilderBasePoints?.toLocaleString() || '0'}
          color="blue"
        />
        <StatCard
          icon={starIcon}
          label="War Wins"
          value={clan.warWins?.toLocaleString() || '0'}
          subValue={`Streak: ${clan.warWinStreak || 0}`}
          color="green"
        />
        <StatCard
          icon={shieldIcon}
          label="Required Trophies"
          value={clan.requiredTrophies?.toLocaleString() || '0'}
          color="purple"
        />
      </div>

      {/* War Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{clan.warWins || 0}</p>
          <p className="text-xs text-gray-400">Wars Won</p>
        </div>
        <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-400">{clan.warTies || 0}</p>
          <p className="text-xs text-gray-400">Wars Tied</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/20 to-rose-600/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{clan.warLosses || 0}</p>
          <p className="text-xs text-gray-400">Wars Lost</p>
        </div>
      </div>

      {/* Labels */}
      {clan.labels && clan.labels.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-sky-500 rounded-full" />
            Clan Labels
          </h3>
          <div className="flex flex-wrap gap-2">
            {clan.labels.map((label) => (
              <div
                key={label.id}
                className="flex items-center gap-2 bg-dark-900/50 rounded-full px-4 py-2"
              >
                {label.iconUrls?.small && (
                  <img src={label.iconUrls.small} alt={label.name} className="w-5 h-5" />
                )}
                <span className="text-sm text-gray-300">{label.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Members - Clickable */}
      {clan.memberList && clan.memberList.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-amber-500 rounded-full" />
            Top Members
            <span className="text-xs font-normal text-gray-500 ml-2">Click to view profile</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
});

ClanCard.displayName = 'ClanCard';

export default ClanCard;
