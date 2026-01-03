import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUsers, HiGlobe, HiTrendingUp, HiChevronDown, HiRefresh, HiLocationMarker, HiExternalLink } from 'react-icons/hi';
import { GiTrophy, GiCastle, GiHammerNails } from 'react-icons/gi';
import { useRankings } from '../../Store/hooks';
import { LOCATION_IDS } from '../../Config/Config';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { PageWrapper } from '../ui';
import SEO from '../SEO';
import Loader from '../Loader';

// Assets
import trophyIcon from '../../assets/others/Trophy.png';
import builderTrophyIcon from '../../assets/others/builderTrophy.png';

// Popular locations for quick select
const POPULAR_LOCATIONS = [
  { id: 'global', name: 'Global', flag: '🌍' },
  { id: LOCATION_IDS.INDIA, name: 'India', flag: '🇮🇳' },
  { id: LOCATION_IDS.UNITED_STATES, name: 'United States', flag: '🇺🇸' },
  { id: LOCATION_IDS.UNITED_KINGDOM, name: 'United Kingdom', flag: '🇬🇧' },
  { id: LOCATION_IDS.GERMANY, name: 'Germany', flag: '🇩🇪' },
  { id: LOCATION_IDS.BRAZIL, name: 'Brazil', flag: '🇧🇷' },
  { id: LOCATION_IDS.INDONESIA, name: 'Indonesia', flag: '🇮🇩' },
  { id: LOCATION_IDS.TURKEY, name: 'Turkey', flag: '🇹🇷' },
  { id: LOCATION_IDS.JAPAN, name: 'Japan', flag: '🇯🇵' },
  { id: LOCATION_IDS.PHILIPPINES, name: 'Philippines', flag: '🇵🇭' },
];

// Ranking tabs
const RANKING_TABS = [
  { id: 'players', label: 'Top Players', icon: HiUsers, color: 'purple' },
  { id: 'clans', label: 'Top Clans', icon: GiTrophy, color: 'amber' },
  { id: 'builderPlayers', label: 'Builder Base Players', icon: GiHammerNails, color: 'cyan' },
  { id: 'builderClans', label: 'Builder Base Clans', icon: GiCastle, color: 'blue' },
  { id: 'capitals', label: 'Clan Capitals', icon: GiCastle, color: 'emerald' },
];

// Player Ranking Row Component - Shows League Tier (new ranking system)
const PlayerRankingRow = memo(({ player, rank, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-dark-800/50 rounded-lg hover:bg-dark-700/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 group text-left"
  >
    {/* Rank */}
    <div className={`
      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 transition-transform group-hover:scale-110
      ${rank === 1 ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-lg shadow-amber-500/30' :
        rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
        rank === 3 ? 'bg-gradient-to-br from-orange-600 to-amber-700 text-white' :
        'bg-dark-700 text-gray-400'}
    `}>
      {rank}
    </div>

    {/* League Tier Icon (preferred) or fallback to League Icon */}
    {player.leagueTier?.iconUrls?.small ? (
      <img src={player.leagueTier.iconUrls.small} alt={player.leagueTier.name} className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 transition-transform group-hover:scale-105" title={player.leagueTier.name} />
    ) : player.league?.iconUrls?.tiny ? (
      <img src={player.league.iconUrls.tiny} alt="" className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 transition-transform group-hover:scale-105" />
    ) : null}

    {/* Player Info */}
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-white text-xs sm:text-sm truncate group-hover:text-amber-400 transition-colors">
        {player.name}
      </p>
      <div className="flex items-center gap-1.5">
        {player.clan && (
          <p className="text-[10px] sm:text-xs text-gray-500 truncate">{player.clan.name}</p>
        )}
        {player.leagueTier && (
          <span className="text-[9px] sm:text-[10px] text-amber-400/80 hidden sm:inline">• {player.leagueTier.name}</span>
        )}
      </div>
    </div>

    {/* Stats */}
    <div className="text-right shrink-0">
      <div className="flex items-center gap-1 justify-end">
        <img src={trophyIcon} alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="font-bold text-amber-400 text-sm sm:text-base">{player.trophies?.toLocaleString()}</span>
      </div>
      <p className="text-[10px] text-gray-500">Exp: {player.expLevel}</p>
    </div>
    
    <HiExternalLink className="text-gray-600 group-hover:text-amber-400 transition-colors shrink-0 hidden sm:block" size={16} />
  </button>
));

PlayerRankingRow.displayName = 'PlayerRankingRow';

// Clan Ranking Row Component
const ClanRankingRow = memo(({ clan, rank, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-dark-800/50 rounded-lg hover:bg-dark-700/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 group text-left"
  >
    {/* Rank */}
    <div className={`
      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 transition-transform group-hover:scale-110
      ${rank === 1 ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-lg shadow-amber-500/30' :
        rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
        rank === 3 ? 'bg-gradient-to-br from-orange-600 to-amber-700 text-white' :
        'bg-dark-700 text-gray-400'}
    `}>
      {rank}
    </div>

    {/* Clan Badge */}
    {clan.badgeUrls?.small ? (
      <img src={clan.badgeUrls.small} alt="" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shrink-0 transition-transform group-hover:scale-105" />
    ) : (
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-dark-700 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
        <HiUsers className="text-gray-500" size={16} />
      </div>
    )}

    {/* Clan Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <p className="font-semibold text-white text-xs sm:text-sm truncate group-hover:text-amber-400 transition-colors">
          {clan.name}
        </p>
        <Badge variant="outline" className="text-[8px] sm:text-[10px] px-1">Lvl {clan.clanLevel}</Badge>
      </div>
      <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500">
        <span>{clan.members}/50</span>
        {clan.location && <span>• {clan.location.name}</span>}
      </div>
    </div>

    {/* Stats */}
    <div className="text-right shrink-0">
      <div className="flex items-center gap-1 justify-end">
        <img src={trophyIcon} alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="font-bold text-amber-400 text-sm sm:text-base">{clan.clanPoints?.toLocaleString()}</span>
      </div>
      {clan.warWins !== undefined && (
        <p className="text-[10px] text-emerald-400">{clan.warWins} war wins</p>
      )}
    </div>
    
    <HiExternalLink className="text-gray-600 group-hover:text-amber-400 transition-colors shrink-0 hidden sm:block" size={16} />
  </button>
));

ClanRankingRow.displayName = 'ClanRankingRow';

// Builder Clan Ranking Row (shows clanBuilderBasePoints)
const BuilderClanRankingRow = memo(({ clan, rank, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-dark-800/50 rounded-lg hover:bg-dark-700/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 group text-left"
  >
    {/* Rank */}
    <div className={`
      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 transition-transform group-hover:scale-110
      ${rank === 1 ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/30' :
        rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
        rank === 3 ? 'bg-gradient-to-br from-teal-600 to-cyan-700 text-white' :
        'bg-dark-700 text-gray-400'}
    `}>
      {rank}
    </div>

    {/* Clan Badge */}
    {clan.badgeUrls?.small ? (
      <img src={clan.badgeUrls.small} alt="" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shrink-0 transition-transform group-hover:scale-105" />
    ) : (
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-dark-700 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
        <HiUsers className="text-gray-500" size={16} />
      </div>
    )}

    {/* Clan Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <p className="font-semibold text-white text-xs sm:text-sm truncate group-hover:text-cyan-400 transition-colors">
          {clan.name}
        </p>
        <Badge variant="outline" className="text-[8px] sm:text-[10px] px-1">Lvl {clan.clanLevel}</Badge>
      </div>
      <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500">
        <span>{clan.members}/50</span>
        {clan.location && <span>• {clan.location.name}</span>}
      </div>
    </div>

    {/* Stats - Builder Base Points */}
    <div className="text-right shrink-0">
      <div className="flex items-center gap-1 justify-end">
        <img src={builderTrophyIcon} alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="font-bold text-cyan-400 text-sm sm:text-base">{clan.clanBuilderBasePoints?.toLocaleString()}</span>
      </div>
    </div>
    
    <HiExternalLink className="text-gray-600 group-hover:text-cyan-400 transition-colors shrink-0 hidden sm:block" size={16} />
  </button>
));

BuilderClanRankingRow.displayName = 'BuilderClanRankingRow';

// Builder Player Ranking Row
const BuilderPlayerRankingRow = memo(({ player, rank, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-dark-800/50 rounded-lg hover:bg-dark-700/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 group text-left"
  >
    <div className={`
      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 transition-transform group-hover:scale-110
      ${rank === 1 ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/30' :
        rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
        rank === 3 ? 'bg-gradient-to-br from-teal-600 to-cyan-700 text-white' :
        'bg-dark-700 text-gray-400'}
    `}>
      {rank}
    </div>

    <div className="flex-1 min-w-0">
      <p className="font-semibold text-white text-xs sm:text-sm truncate group-hover:text-cyan-400 transition-colors">
        {player.name}
      </p>
      {player.clan && (
        <p className="text-[10px] sm:text-xs text-gray-500 truncate">{player.clan.name}</p>
      )}
    </div>

    <div className="text-right shrink-0">
      <div className="flex items-center gap-1 justify-end">
        <img src={builderTrophyIcon} alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="font-bold text-cyan-400 text-sm sm:text-base">{player.builderBaseTrophies?.toLocaleString()}</span>
      </div>
      <p className="text-[10px] text-gray-500">BH {player.builderHallLevel || '?'}</p>
    </div>
    
    <HiExternalLink className="text-gray-600 group-hover:text-cyan-400 transition-colors shrink-0 hidden sm:block" size={16} />
  </button>
));

BuilderPlayerRankingRow.displayName = 'BuilderPlayerRankingRow';

// Capital Ranking Row
const CapitalRankingRow = memo(({ clan, rank, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-dark-800/50 rounded-lg hover:bg-dark-700/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 group text-left"
  >
    <div className={`
      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 transition-transform group-hover:scale-110
      ${rank === 1 ? 'bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-500/30' :
        rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
        rank === 3 ? 'bg-gradient-to-br from-teal-600 to-emerald-700 text-white' :
        'bg-dark-700 text-gray-400'}
    `}>
      {rank}
    </div>

    {clan.badgeUrls?.small ? (
      <img src={clan.badgeUrls.small} alt="" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shrink-0 transition-transform group-hover:scale-105" />
    ) : (
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-dark-700 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
        <GiCastle className="text-gray-500" size={16} />
      </div>
    )}

    <div className="flex-1 min-w-0">
      <p className="font-semibold text-white text-xs sm:text-sm truncate group-hover:text-emerald-400 transition-colors">
        {clan.name}
      </p>
      <p className="text-[10px] sm:text-xs text-gray-500">{clan.members}/50 members</p>
    </div>

    <div className="text-right shrink-0">
      <p className="font-bold text-emerald-400 text-sm sm:text-base">{clan.clanCapitalPoints?.toLocaleString()}</p>
      <p className="text-[10px] text-gray-500">Capital Points</p>
    </div>
    
    <HiExternalLink className="text-gray-600 group-hover:text-emerald-400 transition-colors shrink-0 hidden sm:block" size={16} />
  </button>
));

CapitalRankingRow.displayName = 'CapitalRankingRow';

// Loading Skeleton
const RankingSkeleton = () => (
  <div className="space-y-2">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg">
        <Skeleton type="avatar" className="w-10 h-10 rounded-full" />
        <Skeleton type="avatar" className="w-10 h-10 rounded-lg" />
        <div className="flex-1">
          <Skeleton type="text" className="w-32 h-4 mb-1" />
          <Skeleton type="text" className="w-20 h-3" />
        </div>
        <Skeleton type="text" className="w-16 h-6" />
      </div>
    ))}
  </div>
);

// Main Leaderboards Component
const Leaderboards = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('players');
  const [selectedLocation, setSelectedLocation] = useState(POPULAR_LOCATIONS[0]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  
  const {
    playerRankings,
    clanRankings,
    builderPlayerRankings,
    builderClanRankings,
    capitalRankings,
    loading,
    error,
    getPlayerRankings,
    getClanRankings,
    getBuilderPlayerRankings,
    getBuilderClanRankings,
    getCapitalRankings,
  } = useRankings();

  // Fetch data based on active tab
  const fetchRankings = useCallback(() => {
    const locationId = selectedLocation.id;
    
    switch (activeTab) {
      case 'players':
        getPlayerRankings(locationId);
        break;
      case 'clans':
        getClanRankings(locationId);
        break;
      case 'builderPlayers':
        getBuilderPlayerRankings(locationId);
        break;
      case 'builderClans':
        getBuilderClanRankings(locationId);
        break;
      case 'capitals':
        getCapitalRankings(locationId);
        break;
      default:
        getPlayerRankings(locationId);
    }
  }, [activeTab, selectedLocation, getPlayerRankings, getClanRankings, getBuilderPlayerRankings, getBuilderClanRankings, getCapitalRankings]);

  // Fetch on mount and when tab/location changes
  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  // Get current rankings based on active tab
  const currentRankings = useMemo(() => {
    switch (activeTab) {
      case 'players': return playerRankings;
      case 'clans': return clanRankings;
      case 'builderPlayers': return builderPlayerRankings;
      case 'builderClans': return builderClanRankings;
      case 'capitals': return capitalRankings;
      default: return [];
    }
  }, [activeTab, playerRankings, clanRankings, builderPlayerRankings, builderClanRankings, capitalRankings]);

  const handlePlayerClick = useCallback((player) => {
    const cleanTag = player.tag.replace('#', '');
    navigate(`/player/${cleanTag}`);
  }, [navigate]);

  const handleClanClick = useCallback((clan) => {
    const cleanTag = clan.tag.replace('#', '');
    navigate(`/clan/${cleanTag}`);
  }, [navigate]);

  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
    setShowLocationPicker(false);
  }, []);

  const activeTabConfig = RANKING_TABS.find(t => t.id === activeTab);

  return (
    <>
      <SEO 
        title="Leaderboards - Global Rankings"
        description="View global and country-specific Clash of Clans leaderboards. Top players, clans, builder base, and capital rankings."
        path="/leaderboards"
      />
      
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <GiTrophy className="text-amber-400" />
              Leaderboards
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              View global and regional rankings for players and clans
            </p>
          </div>

          {/* Location Selector */}
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="flex items-center gap-2 px-4 py-2.5 bg-dark-800 rounded-xl hover:bg-dark-700 transition-colors"
              >
                <HiLocationMarker className="text-amber-400" size={18} />
                <span className="text-lg">{selectedLocation.flag}</span>
                <span className="text-white font-medium">{selectedLocation.name}</span>
                <HiChevronDown className={`text-gray-400 transition-transform ${showLocationPicker ? 'rotate-180' : ''}`} size={18} />
              </button>
              
              {showLocationPicker && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-dark-800 rounded-xl shadow-xl z-20 overflow-hidden border border-dark-700">
                  {POPULAR_LOCATIONS.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationSelect(location)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-700 transition-colors text-left ${
                        selectedLocation.id === location.id ? 'bg-dark-700' : ''
                      }`}
                    >
                      <span className="text-lg">{location.flag}</span>
                      <span className="text-white">{location.name}</span>
                      {selectedLocation.id === location.id && (
                        <Badge variant="gold" className="ml-auto text-[10px]">Selected</Badge>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 overflow-x-auto custom-scrollbar">
            <div className="flex gap-2 min-w-max pb-2">
              {RANKING_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
                      isActive
                        ? `bg-${tab.color}-500/20 text-${tab.color}-400 border border-${tab.color}-500/30`
                        : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchRankings}
              disabled={loading}
              className="text-gray-400 hover:text-white"
            >
              <HiRefresh className={loading ? 'animate-spin' : ''} size={16} />
              Refresh
            </Button>
          </div>

          {/* Rankings Content */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                {activeTabConfig && <activeTabConfig.icon className={`text-${activeTabConfig.color}-400`} size={20} />}
                {activeTabConfig?.label}
                <Badge variant="outline" className="ml-2 text-xs">
                  {selectedLocation.flag} {selectedLocation.name}
                </Badge>
              </h2>
              <Badge variant="outline" className="text-xs">
                {currentRankings.length} results
              </Badge>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-8">
                <p className="text-red-400 mb-4">Failed to load rankings</p>
                <Button variant="primary" size="sm" onClick={fetchRankings}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Loading State */}
            {loading && <RankingSkeleton />}

            {/* Rankings List */}
            {!loading && !error && currentRankings.length > 0 && (
              <div className="space-y-1.5 sm:space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                {activeTab === 'players' && playerRankings.map((player, index) => (
                  <PlayerRankingRow
                    key={player.tag}
                    player={player}
                    rank={player.rank || index + 1}
                    onClick={() => handlePlayerClick(player)}
                  />
                ))}
                
                {activeTab === 'clans' && clanRankings.map((clan, index) => (
                  <ClanRankingRow
                    key={clan.tag}
                    clan={clan}
                    rank={clan.rank || index + 1}
                    onClick={() => handleClanClick(clan)}
                  />
                ))}
                
                {activeTab === 'builderPlayers' && builderPlayerRankings.map((player, index) => (
                  <BuilderPlayerRankingRow
                    key={player.tag}
                    player={player}
                    rank={player.rank || index + 1}
                    onClick={() => handlePlayerClick(player)}
                  />
                ))}
                
                {activeTab === 'builderClans' && builderClanRankings.map((clan, index) => (
                  <BuilderClanRankingRow
                    key={clan.tag}
                    clan={clan}
                    rank={clan.rank || index + 1}
                    onClick={() => handleClanClick(clan)}
                  />
                ))}
                
                {activeTab === 'capitals' && capitalRankings.map((clan, index) => (
                  <CapitalRankingRow
                    key={clan.tag}
                    clan={clan}
                    rank={clan.rank || index + 1}
                    onClick={() => handleClanClick(clan)}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && currentRankings.length === 0 && (
              <div className="text-center py-12">
                <GiTrophy className="text-gray-600 mx-auto mb-4" size={48} />
                <p className="text-gray-400">No rankings available for this location</p>
              </div>
            )}
          </Card>
        </div>
      </PageWrapper>
    </>
  );
};

export default memo(Leaderboards);

