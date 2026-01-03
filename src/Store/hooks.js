import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchPlayer,
  fetchClan,
  searchClans,
  fetchWarLog,
  fetchCurrentWar,
  fetchCapitalRaidSeasons,
  fetchCWLGroup,
  selectCurrentPlayer,
  selectCurrentClan,
  selectPlayerLoading,
  selectClanLoading,
  selectPlayerError,
  selectClanError,
  selectIsClanSearch,
  setSearchMode,
  clearCurrentPlayer,
  clearCurrentClan,
  clearSearchResults,
  clearWarLog,
  clearCurrentWar,
  clearCapitalRaids,
  clearCWL,
  // Search
  selectSearchResults,
  selectSearchLoading,
  selectSearchError,
  // War log
  selectWarLog,
  selectWarLogLoading,
  selectWarLogError,
  // Current war
  selectCurrentWar,
  selectCurrentWarLoading,
  selectCurrentWarError,
  // Capital raids
  selectCapitalRaidSeasons,
  selectCapitalRaidLoading,
  selectCapitalRaidError,
  // CWL
  selectCWLGroup,
  selectCWLLoading,
  selectCWLError,
  // Rankings
  fetchLocations,
  fetchClanRankings,
  fetchPlayerRankings,
  fetchCapitalRankings,
  selectLocations,
  selectLocationsLoading,
  selectClanRankings,
  selectPlayerRankings,
  selectCapitalRankings,
  selectRankingsLoading,
  selectRankingsError,
  selectCurrentLocationId,
  // Leagues
  fetchLeagues,
  fetchWarLeagues,
  fetchCapitalLeagues,
  fetchBuilderBaseLeagues,
  fetchLeagueSeasons,
  fetchSeasonRankings,
  fetchPlayerLabels,
  fetchClanLabels,
  fetchGoldPass,
  selectLeagues,
  selectWarLeagues,
  selectCapitalLeagues,
  selectBuilderBaseLeagues,
  selectLegendSeasons,
  selectSeasonRankings,
  selectPlayerLabels,
  selectClanLabels,
  selectGoldPass,
  selectLeaguesLoading,
} from './slices';

// Custom hook for player operations
export const usePlayer = () => {
  const dispatch = useDispatch();
  const player = useSelector(selectCurrentPlayer);
  const loading = useSelector(selectPlayerLoading);
  const error = useSelector(selectPlayerError);

  const getPlayer = useCallback((tag) => {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    return dispatch(fetchPlayer(cleanTag));
  }, [dispatch]);

  const clearPlayer = useCallback(() => {
    dispatch(clearCurrentPlayer());
  }, [dispatch]);

  return {
    player,
    loading,
    error,
    getPlayer,
    clearPlayer,
    hasData: player && !player.error && player.name,
  };
};

// Custom hook for clan operations
export const useClan = () => {
  const dispatch = useDispatch();
  const clan = useSelector(selectCurrentClan);
  const loading = useSelector(selectClanLoading);
  const error = useSelector(selectClanError);

  const getClan = useCallback((tag) => {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    return dispatch(fetchClan(cleanTag));
  }, [dispatch]);

  const clearClan = useCallback(() => {
    dispatch(clearCurrentClan());
  }, [dispatch]);

  return {
    clan,
    loading,
    error,
    getClan,
    clearClan,
    hasData: clan && !clan.error && clan.name,
  };
};

// Custom hook for clan search
export const useClanSearch = () => {
  const dispatch = useDispatch();
  const searchResults = useSelector(selectSearchResults);
  const loading = useSelector(selectSearchLoading);
  const error = useSelector(selectSearchError);

  const search = useCallback((params) => {
    // params: { name, warFrequency, locationId, minMembers, maxMembers, minClanPoints, minClanLevel, labelIds, limit }
    return dispatch(searchClans(params));
  }, [dispatch]);

  const clearResults = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  return {
    searchResults,
    clans: searchResults?.items || [],
    loading,
    error,
    search,
    clearResults,
    hasResults: searchResults && searchResults.items && searchResults.items.length > 0,
    totalResults: searchResults?.items?.length || 0,
  };
};

// Custom hook for war log
export const useWarLog = () => {
  const dispatch = useDispatch();
  const warLog = useSelector(selectWarLog);
  const loading = useSelector(selectWarLogLoading);
  const error = useSelector(selectWarLogError);

  const getWarLog = useCallback((tag) => {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    return dispatch(fetchWarLog(cleanTag));
  }, [dispatch]);

  const clearLog = useCallback(() => {
    dispatch(clearWarLog());
  }, [dispatch]);

  return {
    warLog,
    wars: warLog?.items || [],
    loading,
    error,
    getWarLog,
    clearLog,
    hasData: warLog && warLog.items && warLog.items.length > 0,
  };
};

// Custom hook for current war
export const useCurrentWar = () => {
  const dispatch = useDispatch();
  const currentWar = useSelector(selectCurrentWar);
  const loading = useSelector(selectCurrentWarLoading);
  const error = useSelector(selectCurrentWarError);

  const getCurrentWar = useCallback((tag) => {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    return dispatch(fetchCurrentWar(cleanTag));
  }, [dispatch]);

  const clearWar = useCallback(() => {
    dispatch(clearCurrentWar());
  }, [dispatch]);

  return {
    currentWar,
    loading,
    error,
    getCurrentWar,
    clearWar,
    hasData: currentWar && currentWar.state !== 'notInWar',
    isInWar: currentWar && currentWar.state !== 'notInWar',
    warState: currentWar?.state,
  };
};

// Custom hook for capital raid seasons
export const useCapitalRaids = () => {
  const dispatch = useDispatch();
  const capitalRaidSeasons = useSelector(selectCapitalRaidSeasons);
  const loading = useSelector(selectCapitalRaidLoading);
  const error = useSelector(selectCapitalRaidError);

  const getCapitalRaids = useCallback((tag) => {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    return dispatch(fetchCapitalRaidSeasons(cleanTag));
  }, [dispatch]);

  const clearRaids = useCallback(() => {
    dispatch(clearCapitalRaids());
  }, [dispatch]);

  return {
    capitalRaidSeasons,
    raids: capitalRaidSeasons?.items || [],
    loading,
    error,
    getCapitalRaids,
    clearRaids,
    hasData: capitalRaidSeasons && capitalRaidSeasons.items && capitalRaidSeasons.items.length > 0,
  };
};

// Custom hook for CWL
export const useCWL = () => {
  const dispatch = useDispatch();
  const cwlGroup = useSelector(selectCWLGroup);
  const loading = useSelector(selectCWLLoading);
  const error = useSelector(selectCWLError);

  const getCWLGroup = useCallback((tag) => {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    return dispatch(fetchCWLGroup(cleanTag));
  }, [dispatch]);

  const clearCWLData = useCallback(() => {
    dispatch(clearCWL());
  }, [dispatch]);

  return {
    cwlGroup,
    clans: cwlGroup?.clans || [],
    rounds: cwlGroup?.rounds || [],
    loading,
    error,
    getCWLGroup,
    clearCWLData,
    hasData: cwlGroup && cwlGroup.clans && cwlGroup.clans.length > 0,
    season: cwlGroup?.season,
  };
};

// Custom hook for search mode
export const useSearchMode = () => {
  const dispatch = useDispatch();
  const isClanSearch = useSelector(selectIsClanSearch);

  const setPlayerSearch = useCallback(() => {
    dispatch(setSearchMode(false));
  }, [dispatch]);

  const setClanSearch = useCallback(() => {
    dispatch(setSearchMode(true));
  }, [dispatch]);

  const toggleMode = useCallback(() => {
    dispatch(setSearchMode(!isClanSearch));
  }, [dispatch, isClanSearch]);

  return {
    isClanSearch,
    isPlayerSearch: !isClanSearch,
    setPlayerSearch,
    setClanSearch,
    toggleMode,
  };
};

// Custom hook for rankings
export const useRankings = () => {
  const dispatch = useDispatch();
  const locations = useSelector(selectLocations);
  const locationsLoading = useSelector(selectLocationsLoading);
  const clanRankings = useSelector(selectClanRankings);
  const playerRankings = useSelector(selectPlayerRankings);
  const capitalRankings = useSelector(selectCapitalRankings);
  const loading = useSelector(selectRankingsLoading);
  const error = useSelector(selectRankingsError);
  const currentLocationId = useSelector(selectCurrentLocationId);

  const getLocations = useCallback(() => {
    return dispatch(fetchLocations());
  }, [dispatch]);

  const getClanRankings = useCallback((locationId, limit = 100) => {
    return dispatch(fetchClanRankings({ locationId, limit }));
  }, [dispatch]);

  const getPlayerRankings = useCallback((locationId, limit = 100) => {
    return dispatch(fetchPlayerRankings({ locationId, limit }));
  }, [dispatch]);

  const getCapitalRankings = useCallback((locationId, limit = 100) => {
    return dispatch(fetchCapitalRankings({ locationId, limit }));
  }, [dispatch]);

  return {
    locations,
    locationsLoading,
    clanRankings,
    playerRankings,
    capitalRankings,
    loading,
    error,
    currentLocationId,
    getLocations,
    getClanRankings,
    getPlayerRankings,
    getCapitalRankings,
  };
};

// Custom hook for leagues
export const useLeagues = () => {
  const dispatch = useDispatch();
  const leagues = useSelector(selectLeagues);
  const warLeagues = useSelector(selectWarLeagues);
  const capitalLeagues = useSelector(selectCapitalLeagues);
  const builderBaseLeagues = useSelector(selectBuilderBaseLeagues);
  const legendSeasons = useSelector(selectLegendSeasons);
  const seasonRankings = useSelector(selectSeasonRankings);
  const loading = useSelector(selectLeaguesLoading);

  const getLeagues = useCallback(() => dispatch(fetchLeagues()), [dispatch]);
  const getWarLeagues = useCallback(() => dispatch(fetchWarLeagues()), [dispatch]);
  const getCapitalLeagues = useCallback(() => dispatch(fetchCapitalLeagues()), [dispatch]);
  const getBuilderBaseLeagues = useCallback(() => dispatch(fetchBuilderBaseLeagues()), [dispatch]);
  const getLeagueSeasons = useCallback((leagueId) => dispatch(fetchLeagueSeasons(leagueId)), [dispatch]);
  const getSeasonRankings = useCallback((leagueId, seasonId, limit = 200) => {
    return dispatch(fetchSeasonRankings({ leagueId, seasonId, limit }));
  }, [dispatch]);

  return {
    leagues,
    warLeagues,
    capitalLeagues,
    builderBaseLeagues,
    legendSeasons,
    seasonRankings,
    loading,
    getLeagues,
    getWarLeagues,
    getCapitalLeagues,
    getBuilderBaseLeagues,
    getLeagueSeasons,
    getSeasonRankings,
  };
};

// Custom hook for labels
export const useLabels = () => {
  const dispatch = useDispatch();
  const playerLabels = useSelector(selectPlayerLabels);
  const clanLabels = useSelector(selectClanLabels);

  const getPlayerLabels = useCallback(() => dispatch(fetchPlayerLabels()), [dispatch]);
  const getClanLabels = useCallback(() => dispatch(fetchClanLabels()), [dispatch]);

  return {
    playerLabels,
    clanLabels,
    getPlayerLabels,
    getClanLabels,
  };
};

// Custom hook for gold pass
export const useGoldPass = () => {
  const dispatch = useDispatch();
  const goldPass = useSelector(selectGoldPass);

  const getGoldPass = useCallback(() => dispatch(fetchGoldPass()), [dispatch]);

  return {
    goldPass,
    getGoldPass,
    startTime: goldPass?.startTime,
    endTime: goldPass?.endTime,
  };
};

// Export typed dispatch for use in components
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

