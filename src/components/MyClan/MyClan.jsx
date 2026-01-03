import { useEffect, memo, useMemo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiUsers, HiCog, HiCheck, HiArrowRight, HiExclamation } from 'react-icons/hi';
import { ErrorState, RefreshButton, PageWrapper, Card, Button } from '../ui';
import { ClanProfile } from '../shared';
import { WarLog, CurrentWar, CapitalRaids } from '../Clan';
import Loader from '../Loader';
import SEO from '../SEO';
import { useClanWithDetails } from '../../Store/hooks';
import { useUserSettings } from '../../hooks/useUserSettings';

// Setup Component when no clan tag is configured
const ClanSetup = memo(({ onSave, loading, error, onClearError }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSave = () => {
    if (inputValue.trim()) {
      onSave(inputValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value.toUpperCase());
    // Clear error when user starts typing
    if (error && onClearError) {
      onClearError();
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-3 sm:px-4 py-8">
      <Card className="max-w-md w-full p-5 sm:p-6 md:p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <HiUsers className="text-amber-400" size={32} />
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
          Set Up Your Clan
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 px-2">
          Enter your clan tag to link your Clash of Clans clan
        </p>

        {/* Input */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-base sm:text-lg">#</span>
            <input
              type="text"
              placeholder="Enter your clan tag"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={`w-full bg-dark-800 border rounded-lg sm:rounded-xl pl-8 sm:pl-10 pr-3 sm:pr-4 py-3 sm:py-4 text-white text-base sm:text-lg font-mono placeholder-gray-600 focus:outline-none focus:ring-2 transition-colors ${
                error 
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-gray-700/50 focus:border-amber-500/50 focus:ring-amber-500/20'
              }`}
            />
          </div>
          {error && (
            <div className="flex items-start gap-2 text-red-400 text-xs sm:text-sm mt-2 text-left">
              <HiExclamation size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Save Button */}
        <Button 
          variant="primary" 
          size="lg"
          fullWidth
          onClick={handleSave}
          loading={loading}
          disabled={!inputValue.trim()}
          className="text-sm sm:text-base"
        >
          <HiCheck size={18} />
          Link My Clan
        </Button>

        {/* Help text */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3 px-2">
            Don't know your clan tag? Open Clash of Clans, go to your clan, tap settings, and find the tag.
          </p>
          <Link 
            to="/settings" 
            className="text-amber-400 hover:text-amber-300 text-xs sm:text-sm inline-flex items-center gap-1"
          >
            <HiCog size={14} />
            Go to Settings
            <HiArrowRight size={12} />
          </Link>
        </div>
      </Card>
    </div>
  );
});

ClanSetup.displayName = 'ClanSetup';

const MyClan = () => {
  const { clanTag, hasClanTag, saveClanTag, clanRecords } = useUserSettings();
  const { 
    clan, 
    clanLoading, 
    clanError, 
    hasClanData,
    isLoading,
    isInitialLoading,
    fetchAllClanData, 
    clearAllClanData 
  } = useClanWithDetails();
  const hasFetched = useRef(false);
  
  // Local error state for setup screen
  const [setupError, setSetupError] = useState(null);

  // Check if current data is for MY clan
  const isMyClan = useMemo(() => {
    if (!clan?.tag || !clanTag) return false;
    const currentTag = clan.tag.replace('#', '').toUpperCase();
    return currentTag === clanTag.toUpperCase();
  }, [clan?.tag, clanTag]);

  useEffect(() => {
    // Only fetch if we have a configured tag and it's not the current data
    if (hasClanTag && !isMyClan && !hasFetched.current && !clanLoading) {
      hasFetched.current = true;
      // Clear all data and fetch everything in PARALLEL
      clearAllClanData();
      fetchAllClanData(clanTag);
    }
  }, [fetchAllClanData, isMyClan, clanTag, hasClanTag, clearAllClanData, clanLoading]);

  // Reset fetch flag when clanTag changes
  useEffect(() => {
    hasFetched.current = false;
  }, [clanTag]);

  const handleRefresh = useCallback(() => {
    if (clanTag) {
      hasFetched.current = false;
      clearAllClanData();
      // Fetch all data in PARALLEL for faster refresh
      fetchAllClanData(clanTag);
    }
  }, [fetchAllClanData, clanTag, clearAllClanData]);

  // Handle saving a new clan tag (verifies first)
  const handleSaveTag = useCallback(async (tag) => {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    setSetupError(null);
    
    // Clear old data
    clearAllClanData();
    
    try {
      // Fetch ALL clan data in parallel for verification + data loading
      const results = await fetchAllClanData(cleanTag);
      const clanResult = results[0]; // First result is clan data
      
      if (clanResult.error || clanResult.payload?.error) {
        setSetupError(clanResult.payload?.message || 'Clan not found. Please check the tag and try again.');
      } else {
        saveClanTag(cleanTag);
        setSetupError(null);
      }
    } catch (err) {
      setSetupError('Failed to verify clan tag. Please try again.');
    }
  }, [fetchAllClanData, saveClanTag, clearAllClanData]);

  // Memoize header actions
  const headerActions = useMemo(() => (
    <div className="flex items-center gap-2">
      <RefreshButton onClick={handleRefresh} loading={isLoading} />
      <Link to="/settings">
        <Button variant="ghost" size="sm">
          <HiCog size={18} />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </Link>
    </div>
  ), [isLoading, handleRefresh]);

  // Build records object from localStorage or clan location
  const records = useMemo(() => {
    if (!clanRecords || !clan?.location?.name) return null;
    
    return {
      highestWarWinStreak: clanRecords.highestWarWinStreak,
      recordTitle: "Highest War Win Streak",
      recordScope: clan.location.name,
      recordDate: clanRecords.recordDate,
      bestRank: clanRecords.bestRankInLocation,
    };
  }, [clanRecords, clan?.location?.name]);

  // If no clan tag configured, show setup
  if (!hasClanTag) {
    return (
      <>
        <SEO 
          title="My Clan - Setup"
          description="Link your Clash of Clans clan to view detailed clan statistics, war log, capital raids, and member list."
          path="/myclan"
        />
        <ClanSetup 
          onSave={handleSaveTag} 
          loading={clanLoading} 
          error={setupError}
          onClearError={() => setSetupError(null)}
        />
      </>
    );
  }

  // Show loader while initial loading (clan data)
  if (isInitialLoading) {
    return <Loader />;
  }

  // Error State
  if (clanError && !hasClanData) {
    return (
      <ErrorState
        title="Failed to Load Clan"
        message={clanError?.message || 'Something went wrong'}
        onRetry={handleRefresh}
      />
    );
  }

  // Clan Profile - only show if it's MY clan
  if (hasClanData && isMyClan) {
    return (
      <>
        <SEO 
          title="My Clan"
          description="View your Clash of Clans clan stats, war log, capital raids, and member list."
          path="/myclan"
          clan={clan}
        />
        <PageWrapper>
        <ClanProfile 
          clan={clan}
          showHeader={true}
          showStats={true}
          showWarRecord={true}
          showLabels={true}
          showMembers={true}
          records={records}
          headerActions={headerActions}
          variant="full"
        />
        
        {/* Clan War & Activity Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
          {/* Current War Status - skipFetch because data was fetched in parallel */}
          <CurrentWar clanTag={clanTag} showTitle={true} skipFetch={true} />
          
          {/* Capital Raid Weekends - skipFetch because data was fetched in parallel */}
          <CapitalRaids clanTag={clanTag} showTitle={true} limit={5} skipFetch={true} />
          
          {/* War Log History - skipFetch because data was fetched in parallel */}
          <WarLog clanTag={clanTag} showTitle={true} limit={10} skipFetch={true} />
        </div>
      </PageWrapper>
      </>
    );
  }

  // Initial loading state
  return <Loader />;
};

export default memo(MyClan);
