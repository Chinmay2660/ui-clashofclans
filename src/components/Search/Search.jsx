import { useState, useCallback, memo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiUser, HiUsers, HiArrowRight, HiSparkles, HiHashtag, HiViewList, HiLocationMarker, HiStar, HiUserGroup } from 'react-icons/hi';
import { Card, Button, Badge } from '../ui';
import { PlayerProfile, ClanProfile } from '../shared';
import Loader from '../Loader';
import SEO from '../SEO';
import { usePlayer, useClan, useSearchMode, useClanSearch } from '../../Store/hooks';
import { getRecentSearches, addRecentSearch } from '../../utils/recentSearches';

// Assets
import grandWarden from '../../assets/homeArmy/Grand_Warden.png';
import royalChampion from '../../assets/homeArmy/Royal_Champion.png';
import electroDragon from '../../assets/homeArmy/Electro_Dragon.png';
import pekka from '../../assets/homeArmy/P.E.K.K.A.png';
import barbarianKing from '../../assets/homeArmy/Barbarian_King.png';
import archerQueen from '../../assets/homeArmy/Archer_Queen.png';

// Floating character component - hidden on mobile for performance
const FloatingCharacter = memo(({ src, className, delay = 0 }) => (
  <div 
    className={`absolute pointer-events-none select-none hidden md:block ${className}`}
    style={{ 
      animation: `float 4s ease-in-out infinite`,
      animationDelay: `${delay}s`
    }}
  >
    <img src={src} alt="" className="w-full h-full object-contain opacity-20 blur-[1px]" />
  </div>
));

// Search type card
const SearchTypeCard = memo(({ 
  icon: Icon, 
  title, 
  description, 
  gradient, 
  selected, 
  onClick,
  character
}) => (
  <button
    onClick={onClick}
    className={`
      relative overflow-hidden rounded-xl md:rounded-2xl p-4 md:p-6 text-left transition-all duration-300
      group w-full
      ${selected 
        ? `${gradient} shadow-2xl scale-[1.02]` 
        : 'bg-dark-800/50'
      }
    `}
  >
    {/* Background character */}
    <div className={`
      absolute -right-2 -bottom-2 md:-right-4 md:-bottom-4 w-20 h-20 md:w-32 md:h-32 transition-all duration-500
      ${selected ? 'opacity-30 scale-110' : 'opacity-10 group-hover:opacity-20 group-hover:scale-105'}
    `}>
      <img src={character} alt="" className="w-full h-full object-contain" />
    </div>

    <div className="relative z-10">
      <div className={`
        w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-all duration-300
        ${selected 
          ? 'bg-white/20 shadow-lg' 
          : 'bg-dark-700 group-hover:bg-dark-600'
        }
      `}>
        <Icon size={22} className={selected ? 'text-white' : 'text-gray-400'} />
      </div>
      
      <h3 className={`text-base md:text-xl font-bold mb-1 md:mb-2 ${selected ? 'text-white' : 'text-gray-200'}`}>
        {title}
      </h3>
      <p className={`text-xs md:text-sm line-clamp-2 ${selected ? 'text-white/70' : 'text-gray-500'}`}>
        {description}
      </p>

      {selected && (
        <div className="absolute top-3 right-3 md:top-4 md:right-4">
          <Badge variant="gold" className="bg-white/20 text-xs">
            <HiSparkles size={10} />
            Selected
          </Badge>
        </div>
      )}
    </div>
  </button>
));

// Clan search result item component
const ClanSearchResultItem = memo(({ clan, onClick }) => (
  <button
    onClick={onClick}
    className="w-full p-3 md:p-4 bg-dark-800/50 hover:bg-dark-800 rounded-xl transition-all duration-200 flex items-center gap-3 md:gap-4 group"
  >
    {/* Clan Badge */}
    <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-lg bg-dark-700 flex items-center justify-center overflow-hidden">
      {clan.badgeUrls?.small ? (
        <img src={clan.badgeUrls.small} alt="" className="w-full h-full object-cover" />
      ) : (
        <HiUsers className="text-amber-500" size={24} />
      )}
    </div>

    {/* Clan Info */}
    <div className="flex-1 text-left min-w-0">
      <h4 className="text-white font-semibold truncate text-sm md:text-base">{clan.name}</h4>
      <div className="flex items-center gap-2 md:gap-3 text-xs text-gray-400 mt-1">
        <span className="flex items-center gap-1">
          <HiUserGroup size={12} />
          {clan.members}/50
        </span>
        <span className="flex items-center gap-1">
          <HiStar size={12} className="text-amber-500" />
          Lvl {clan.clanLevel}
        </span>
        {clan.location?.name && (
          <span className="hidden sm:flex items-center gap-1">
            <HiLocationMarker size={12} />
            {clan.location.name}
          </span>
        )}
      </div>
    </div>

    {/* Tag & Arrow */}
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 font-mono hidden sm:block">{clan.tag}</span>
      <HiArrowRight className="text-gray-600 group-hover:text-amber-500 transition-colors" size={18} />
    </div>
  </button>
));

const Search = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [inputError, setInputError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchByName, setSearchByName] = useState(false);
  const [recentSearches, setRecentSearches] = useState(getRecentSearches);
  const inputRef = useRef(null);

  // Redux hooks
  const { player, loading: playerLoading, error: playerError, getPlayer, hasData: hasPlayerData } = usePlayer();
  const { clan, loading: clanLoading, error: clanError, getClan, hasData: hasClanData } = useClan();
  const { clans: clanSearchResults, loading: clanSearchLoading, error: clanSearchError, search: searchClansByName, hasResults, clearResults } = useClanSearch();
  const { isClanSearch, setPlayerSearch, setClanSearch } = useSearchMode();

  const loading = playerLoading || clanLoading || clanSearchLoading;
  const hasData = isClanSearch ? (searchByName ? hasResults : hasClanData) : hasPlayerData;
  const error = isClanSearch ? (searchByName ? clanSearchError : clanError) : playerError;
  const hasError = hasSearched && error;

  const handleSearch = useCallback(async () => {
    if (!searchText.trim()) {
      setInputError(searchByName ? 'Please enter a clan name (min 3 characters)' : 'Please enter a tag to search');
      inputRef.current?.focus();
      return;
    }

    // For name search, require at least 3 characters
    if (searchByName && searchText.trim().length < 3) {
      setInputError('Clan name must be at least 3 characters');
      inputRef.current?.focus();
      return;
    }

    setInputError('');
    setHasSearched(true);

    if (isClanSearch) {
      if (searchByName) {
        // Search clans by name
        await searchClansByName({ name: searchText.trim(), limit: 20 });
      } else {
        // Search clan by tag
        const cleanTag = searchText.replace('#', '').toUpperCase().trim();
        await getClan(cleanTag);
      }
    } else {
      // Player search is always by tag
      const cleanTag = searchText.replace('#', '').toUpperCase().trim();
      await getPlayer(cleanTag);
    }
  }, [searchText, searchByName, isClanSearch, getClan, getPlayer, searchClansByName]);

  const handleClanSelect = useCallback((selectedClan) => {
    const cleanTag = selectedClan.tag.replace('#', '');
    addRecentSearch(cleanTag, 'clan', selectedClan.name);
    setRecentSearches(getRecentSearches());
    navigate(`/clan/${cleanTag}`);
  }, [navigate]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleQuickSearch = useCallback((tag, type) => {
    setSearchText(tag);
    if (type === 'clan') {
      setClanSearch();
    } else {
      setPlayerSearch();
    }
    setHasSearched(true);
    if (type === 'clan') {
      getClan(tag);
    } else {
      getPlayer(tag);
    }
  }, [setClanSearch, setPlayerSearch, getClan, getPlayer]);

  // Add successful result to recent searches (when we have name)
  useEffect(() => {
    if (!hasData || loading) return;
    if (!searchByName && isClanSearch && clan?.tag) {
      addRecentSearch(clan.tag, 'clan', clan.name);
      setRecentSearches(getRecentSearches());
    }
    if (!isClanSearch && player?.tag) {
      addRecentSearch(player.tag, 'player', player.name);
      setRecentSearches(getRecentSearches());
    }
  }, [hasData, loading, searchByName, isClanSearch, clan?.tag, clan?.name, player?.tag, player?.name]);

  return (
    <>
      <SEO 
        title="Search Players & Clans"
        description="Search for any Clash of Clans player or clan by tag or name. View detailed statistics, war logs, heroes, achievements, and more."
        path="/search"
      />
      <div className="min-h-screen bg-dark-900 relative overflow-hidden">
      {/* Floating background characters */}
      <FloatingCharacter src={electroDragon} className="w-32 h-32 lg:w-48 lg:h-48 top-20 -left-12" delay={0} />
      <FloatingCharacter src={pekka} className="w-28 h-28 lg:w-40 lg:h-40 top-40 -right-8" delay={1} />
      <FloatingCharacter src={barbarianKing} className="w-24 h-24 lg:w-36 lg:h-36 bottom-40 left-10" delay={2} />
      <FloatingCharacter src={archerQueen} className="w-24 h-24 lg:w-32 lg:h-32 bottom-20 right-20" delay={0.5} />

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-purple-600/20 rounded-full blur-[60px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 bg-amber-600/20 rounded-full blur-[50px] md:blur-[100px] pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-full px-3 py-1.5 md:px-5 md:py-2 mb-4 md:mb-6">
            <HiSparkles className="text-amber-400 text-sm" />
            <span className="text-xs md:text-sm font-medium text-amber-200">Discover Players & Clans</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 md:mb-4">
            Search the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-purple-500">Realm</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-xl mx-auto px-2">
            Enter a player or clan tag to uncover detailed statistics, war history, and achievements
          </p>
        </div>

        {/* Search Type Selection */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
          <SearchTypeCard
            icon={HiUser}
            title="Player Search"
            description="Find individual player profiles, heroes, troops, and achievements"
            gradient="bg-gradient-to-br from-purple-600/80 to-violet-700/80"
            selected={!isClanSearch}
            onClick={() => {
              setPlayerSearch();
              setSearchByName(false);
              setHasSearched(false);
              clearResults();
            }}
            character={grandWarden}
          />
          <SearchTypeCard
            icon={HiUsers}
            title="Clan Search"
            description="Explore clan details, member lists, war records, and rankings"
            gradient="bg-gradient-to-br from-amber-600/80 to-orange-700/80"
            selected={isClanSearch}
            onClick={() => {
              setClanSearch();
              setHasSearched(false);
            }}
            character={royalChampion}
          />
        </div>

        {/* Clan Search Mode Toggle (only for clan search) */}
        {isClanSearch && (
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="inline-flex bg-dark-800/80 rounded-lg p-1">
              <button
                onClick={() => {
                  setSearchByName(false);
                  setHasSearched(false);
                  setSearchText('');
                  clearResults();
                }}
                className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 ${
                  !searchByName 
                    ? 'bg-amber-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <HiHashtag size={14} />
                Search by Tag
              </button>
              <button
                onClick={() => {
                  setSearchByName(true);
                  setHasSearched(false);
                  setSearchText('');
                  clearResults();
                }}
                className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 ${
                  searchByName 
                    ? 'bg-amber-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <HiViewList size={14} />
                Search by Name
              </button>
            </div>
          </div>
        )}

        {/* Search Input */}
        <Card gradient className="p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              {!searchByName && (
                <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <span className="text-lg md:text-xl font-bold">#</span>
                </div>
              )}
              {searchByName && (
                <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <HiSearch size={20} />
                </div>
              )}
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  searchByName 
                    ? "Enter clan name (e.g., Low Battery Team)" 
                    : isClanSearch 
                      ? "Enter clan tag (e.g., 2P9C9U9Y)" 
                      : "Enter player tag (e.g., 29PUGJQ9P)"
                }
                value={searchText}
                onChange={(e) => {
                  setSearchText(searchByName ? e.target.value : e.target.value.toUpperCase());
                  setInputError('');
                }}
                onKeyPress={handleKeyPress}
                className={`
                  w-full bg-dark-900/80 border-2 rounded-lg md:rounded-xl pl-8 md:pl-10 pr-3 md:pr-4 py-3 md:py-4 
                  text-white text-sm md:text-lg ${searchByName ? '' : 'font-mono'} placeholder-gray-600
                  focus:outline-none transition-all duration-300
                  ${inputError 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : 'border-gray-700/50 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20'
                  }
                `}
              />
              {inputError && (
                <p className="absolute -bottom-5 md:-bottom-6 left-0 text-xs md:text-sm text-red-400">{inputError}</p>
              )}
            </div>
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleSearch}
              loading={loading}
              className="w-full sm:w-auto sm:min-w-[120px] md:min-w-[140px]"
            >
              <HiSearch size={20} />
              Search
            </Button>
          </div>

          {/* Recent searches */}
          {recentSearches.length > 0 && !hasSearched && (
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-800">
              <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide mb-2 md:mb-3">Recent</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <button
                    key={item.tag}
                    onClick={() => handleQuickSearch(item.tag, item.type)}
                    className="flex items-center gap-1.5 md:gap-2 bg-dark-800 hover:bg-dark-700 rounded-lg px-2 md:px-3 py-1.5 md:py-2 transition-colors group"
                  >
                    {item.type === 'clan' ? (
                      <HiUsers className="text-amber-500" size={14} />
                    ) : (
                      <HiUser className="text-purple-500" size={14} />
                    )}
                    <span className="text-gray-400 text-xs md:text-sm truncate max-w-[100px]">{item.name || `#${item.tag}`}</span>
                    <HiArrowRight className="text-gray-600 group-hover:text-gray-400 transition-colors" size={12} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Results Section */}
        <div className="min-h-[150px] md:min-h-[200px]">
          {/* Loading State with Sword Loader */}
          {loading && hasSearched && (
            <Loader />
          )}

          {/* Error State */}
          {hasError && !loading && (
            <Card className="p-6 md:p-10 text-center">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-red-500/20 to-rose-600/20 flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-2xl md:text-4xl">🔍</span>
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3">Not Found</h3>
              <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6 max-w-md mx-auto px-2">
                {error?.message || `We couldn't find a ${isClanSearch ? 'clan' : 'player'} with that tag. Double-check and try again.`}
              </p>
              <div className="flex justify-center">
                <Button variant="ghost" onClick={() => {
                  setHasSearched(false);
                  setSearchText('');
                  inputRef.current?.focus();
                }}>
                  Try Another Search
                </Button>
              </div>
            </Card>
          )}

          {/* Success State - Using Reusable Components */}
          {hasData && !loading && (
            <div className="animate-fadeIn">
              {isClanSearch ? (
                searchByName ? (
                  // Clan search by name - show list of results
                  <Card className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <h3 className="text-lg md:text-xl font-bold text-white">
                        Search Results
                      </h3>
                      <Badge variant="gold">
                        {clanSearchResults.length} clan{clanSearchResults.length !== 1 ? 's' : ''} found
                      </Badge>
                    </div>
                    <div className="space-y-2 md:space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                      {clanSearchResults.map((clanItem) => (
                        <ClanSearchResultItem 
                          key={clanItem.tag} 
                          clan={clanItem} 
                          onClick={() => handleClanSelect(clanItem)}
                        />
                      ))}
                    </div>
                  </Card>
                ) : (
                  // Clan search by tag - show card with view details button
                  <div className="space-y-0">
                    <ClanProfile clan={clan} variant="card" />
                    {/* View Full Details Button */}
                    <button
                      onClick={() => navigate(`/clan/${clan.tag.replace('#', '')}`)}
                      className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
                    >
                      <span className="text-sm md:text-base">View Full Clan Details</span>
                      <HiArrowRight size={18} />
                    </button>
                  </div>
                )
              ) : (
                // Player search - show card with view details button
                <div className="space-y-0">
                  <PlayerProfile player={player} variant="card" />
                  {/* View Full Profile Button */}
                  <button
                    onClick={() => navigate(`/player/${player.tag.replace('#', '')}`)}
                    className="w-full mt-4 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02]"
                  >
                    <span className="text-sm md:text-base">View Full Player Profile</span>
                    <HiArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!hasSearched && !loading && (
            <div className="text-center py-10 md:py-16">
              <div className="relative inline-block mb-4 md:mb-6">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-gradient-to-br from-dark-800 to-dark-700 flex items-center justify-center">
                  <HiSearch className="text-gray-600" size={28} />
                </div>
                <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-amber-500 flex items-center justify-center animate-bounce">
                  <HiSparkles className="text-white" size={12} />
                </div>
              </div>
              <h3 className="text-base md:text-xl font-semibold text-gray-300 mb-2">
                Ready to Explore
              </h3>
              <p className="text-gray-500 text-sm md:text-base max-w-sm mx-auto px-4">
                Select a search type above and enter a tag to discover detailed Clash of Clans statistics
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default memo(Search);
