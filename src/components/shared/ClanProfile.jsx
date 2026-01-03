import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUsers, HiStar, HiShieldCheck, HiFire, HiGlobe, HiFlag, HiTrendingUp, HiExternalLink } from 'react-icons/hi';
import { Card, Badge, StatCard } from '../ui';

// Assets
import trophyIcon from '../../assets/others/Trophy.png';
import starIcon from '../../assets/others/Star.png';
import shieldIcon from '../../assets/others/sheild.png';

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

// Member Row Component
const MemberRow = memo(({ member, index, onClick }) => (
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

    {/* League Icon */}
    {member.league?.iconUrls?.tiny && (
      <img src={member.league.iconUrls.tiny} alt="" className="w-6 h-6 md:w-8 md:h-8 shrink-0 hidden xs:block" />
    )}

    {/* Player Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
        <p className="font-semibold text-white text-sm md:text-base truncate group-hover:text-amber-400 transition-colors">{member.name}</p>
        {member.role === 'leader' && (
          <Badge variant="gold" className="text-[10px] md:text-xs">Leader</Badge>
        )}
        {member.role === 'coLeader' && (
          <Badge variant="purple" className="text-[10px] md:text-xs hidden sm:flex">Co-Leader</Badge>
        )}
        {member.role === 'admin' && (
          <Badge variant="blue" className="text-[10px] md:text-xs hidden sm:flex">Elder</Badge>
        )}
      </div>
      <p className="text-[10px] md:text-xs text-gray-500 font-mono">#{member.tag?.replace('#', '')}</p>
    </div>

    {/* Stats */}
    <div className="text-right shrink-0">
      <div className="flex items-center gap-0.5 md:gap-1 justify-end">
        <img src={trophyIcon} alt="" className="w-3 h-3 md:w-4 md:h-4" />
        <span className="font-semibold text-amber-400 text-sm md:text-base">{member.trophies?.toLocaleString()}</span>
      </div>
      <p className="text-[10px] md:text-xs text-gray-500">Lvl {member.expLevel}</p>
    </div>

    {/* Donations */}
    <div className="text-right shrink-0 hidden md:block">
      <p className="text-sm text-emerald-400">↑ {member.donations}</p>
      <p className="text-xs text-gray-500">↓ {member.donationsReceived}</p>
    </div>

    {/* View indicator */}
    <HiExternalLink className="text-gray-600 group-hover:text-amber-400 transition-colors shrink-0 hidden sm:block" size={16} />
  </button>
));

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

// Clan Stats Component
const ClanStats = memo(({ clan }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
    <StatCard icon={trophyIcon} label="Clan Points" value={clan.clanPoints?.toLocaleString()} color="amber" />
    <StatCard icon={starIcon} label="War Wins" value={clan.warWins?.toLocaleString() || '0'} subValue={`Streak: ${clan.warWinStreak || 0}`} color="green" />
    <StatCard icon={shieldIcon} label="Members" value={`${clan.members}/50`} color="blue" />
    <StatCard icon={trophyIcon} label="Required" value={clan.requiredTrophies?.toLocaleString()} subValue="Min Trophies" color="purple" />
  </div>
));

ClanStats.displayName = 'ClanStats';

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
        
        {clan.description && (
          <Card className="p-4 md:p-6 mb-4 md:mb-6">
            <p className="text-gray-300 text-sm md:text-base">{clan.description}</p>
          </Card>
        )}
        
        {showStats && <ClanStats clan={clan} />}
        
        {showWarRecord && <ClanWarRecord clan={clan} />}
        
        {showLabels && <ClanLabels labels={clan.labels} />}
        
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
export { AchievementBanner, MemberRow, ClanHeader, ClanStats, ClanWarRecord, ClanLabels, ClanMemberList };

export default ClanProfile;

