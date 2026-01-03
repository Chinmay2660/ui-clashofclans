export { default as playerReducer } from './playerSlice';
export { default as clanReducer } from './clanSlice';
export { default as uiReducer } from './uiSlice';
export { default as rankingsReducer } from './rankingsSlice';
export { default as leaguesReducer } from './leaguesSlice';

// ========== PLAYER EXPORTS ==========
export {
  fetchPlayer,
  clearCurrentPlayer,
  clearError as clearPlayerError,
  setMyProfile,
  selectCurrentPlayer,
  selectMyProfile,
  selectPlayerLoading,
  selectPlayerError,
} from './playerSlice';

// ========== CLAN EXPORTS ==========
export {
  fetchClan,
  searchClans,
  fetchWarLog,
  fetchCurrentWar,
  fetchCapitalRaidSeasons,
  fetchCWLGroup,
  clearCurrentClan,
  clearSearchResults,
  clearWarLog,
  clearCurrentWar,
  clearCapitalRaids,
  clearCWL,
  clearError as clearClanError,
  selectCurrentClan,
  selectClanLoading,
  selectClanError,
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
} from './clanSlice';

// ========== UI EXPORTS ==========
export {
  setSearchMode,
  toggleSearchMode,
  showGlobalLoader,
  hideGlobalLoader,
  selectIsClanSearch,
  selectGlobalLoader,
} from './uiSlice';

// ========== RANKINGS EXPORTS ==========
export {
  fetchLocations,
  fetchClanRankings,
  fetchPlayerRankings,
  fetchCapitalRankings,
  fetchBuilderClanRankings,
  fetchBuilderPlayerRankings,
  setCurrentLocation,
  clearRankings,
  selectLocations,
  selectLocationsLoading,
  selectClanRankings,
  selectPlayerRankings,
  selectCapitalRankings,
  selectBuilderClanRankings,
  selectBuilderPlayerRankings,
  selectRankingsLoading,
  selectRankingsError,
  selectCurrentLocationId,
} from './rankingsSlice';

// ========== LEAGUES EXPORTS ==========
export {
  fetchLeagues,
  fetchWarLeagues,
  fetchCapitalLeagues,
  fetchBuilderBaseLeagues,
  fetchLeagueSeasons,
  fetchSeasonRankings,
  fetchPlayerLabels,
  fetchClanLabels,
  fetchGoldPass,
  setCurrentSeason,
  clearSeasonRankings,
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
  selectLeaguesError,
} from './leaguesSlice';
