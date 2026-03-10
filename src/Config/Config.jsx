// API Configuration
const isLocalhost = typeof window !== 'undefined' && 
  window.location.hostname && 
  /^localhost$/.test(window.location.hostname);

// Use local API when running locally, production otherwise
const API_BASE_URL = isLocalhost 
  ? 'http://localhost:8000/api/v1' 
  : 'https://api-clashofclans.vercel.app/api/v1';

// ========== PLAYER ENDPOINTS ==========
export const GET_PLAYER_INFO = `${API_BASE_URL}/players`;
export const VERIFY_PLAYER_TOKEN = `${API_BASE_URL}/players/verify`;

// ========== CLAN ENDPOINTS ==========
export const GET_CLAN_INFO = `${API_BASE_URL}/clans`;
export const SEARCH_CLANS = `${API_BASE_URL}/clans/search`;
export const GET_CLAN_CURRENT_WAR_LEAGUE_GROUP_INFO = `${API_BASE_URL}/clans/currentwar/leaguegroup`;
export const GET_CLAN_WAR_LEAGUE_INDIVIDUAL_WAR_INFO = `${API_BASE_URL}/clans/clanwarleagues/wars`;
export const GET_CLAN_WAR_INFO = `${API_BASE_URL}/clans/warlog`;
export const GET_SEARCH_CLAN_INFO = `${API_BASE_URL}/clans/clans`;
export const GET_CLAN_CURRENT_WAR_INFO = `${API_BASE_URL}/clans/currentwar`;
export const GET_CLAN_MEMBERS = `${API_BASE_URL}/clans/members`;
export const GET_CLAN_CAPITAL_RAID_SEASONS_INFO = `${API_BASE_URL}/clans/capitalraidseasons`;

// ========== LOCATION ENDPOINTS ==========
export const GET_LOCATIONS = `${API_BASE_URL}/locations`;
export const GET_LOCATION_BY_ID = (locationId) => `${API_BASE_URL}/locations/${locationId}`;
export const GET_CLAN_RANKINGS = (locationId) => `${API_BASE_URL}/locations/${locationId}/rankings/clans`;
export const GET_PLAYER_RANKINGS = (locationId) => `${API_BASE_URL}/locations/${locationId}/rankings/players`;
export const GET_CLAN_BUILDER_RANKINGS = (locationId) => `${API_BASE_URL}/locations/${locationId}/rankings/clans-builder-base`;
export const GET_PLAYER_BUILDER_RANKINGS = (locationId) => `${API_BASE_URL}/locations/${locationId}/rankings/players-builder-base`;
export const GET_CAPITAL_RANKINGS = (locationId) => `${API_BASE_URL}/locations/${locationId}/rankings/capitals`;

// ========== LEAGUE ENDPOINTS ==========
export const GET_LEAGUES = `${API_BASE_URL}/leagues`;
export const GET_LEAGUE_BY_ID = (leagueId) => `${API_BASE_URL}/leagues/${leagueId}`;
export const GET_LEAGUE_SEASONS = (leagueId) => `${API_BASE_URL}/leagues/${leagueId}/seasons`;
export const GET_LEAGUE_SEASON_RANKINGS = (leagueId, seasonId) => `${API_BASE_URL}/leagues/${leagueId}/seasons/${seasonId}`;

// ========== WAR LEAGUE ENDPOINTS ==========
export const GET_WAR_LEAGUES = `${API_BASE_URL}/warleagues`;
export const GET_WAR_LEAGUE_BY_ID = (leagueId) => `${API_BASE_URL}/warleagues/${leagueId}`;

// ========== CAPITAL LEAGUE ENDPOINTS ==========
export const GET_CAPITAL_LEAGUES = `${API_BASE_URL}/capitalleagues`;
export const GET_CAPITAL_LEAGUE_BY_ID = (leagueId) => `${API_BASE_URL}/capitalleagues/${leagueId}`;

// ========== BUILDER BASE LEAGUE ENDPOINTS ==========
export const GET_BUILDER_BASE_LEAGUES = `${API_BASE_URL}/builderbaseleagues`;
export const GET_BUILDER_BASE_LEAGUE_BY_ID = (leagueId) => `${API_BASE_URL}/builderbaseleagues/${leagueId}`;

// ========== LABEL ENDPOINTS ==========
export const GET_PLAYER_LABELS = `${API_BASE_URL}/labels/players`;
export const GET_CLAN_LABELS = `${API_BASE_URL}/labels/clans`;

// ========== GOLDPASS ENDPOINTS ==========
export const GET_GOLDPASS_CURRENT = `${API_BASE_URL}/goldpass/current`;

// ========== LOCATION IDS (Common ones) ==========
export const LOCATION_IDS = {
  GLOBAL: 'global',
  INDIA: 32000113,
  UNITED_STATES: 32000249,
  UNITED_KINGDOM: 32000248,
  GERMANY: 32000094,
  FRANCE: 32000086,
  CHINA: 32000056,
  JAPAN: 32000121,
  SOUTH_KOREA: 32000139,
  BRAZIL: 32000032,
  RUSSIA: 32000193,
  INDONESIA: 32000109,
  TURKEY: 32000244,
  THAILAND: 32000236,
  VIETNAM: 32000258,
  PHILIPPINES: 32000177,
  MEXICO: 32000153,
  SPAIN: 32000219,
  ITALY: 32000117,
  CANADA: 32000040,
  AUSTRALIA: 32000013,
};

// Legend League ID (for seasons)
export const LEGEND_LEAGUE_ID = 29000022;
