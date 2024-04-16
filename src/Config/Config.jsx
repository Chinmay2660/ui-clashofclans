export const runLocally = () => window.location.hostname && /^localhost$/.test(window.location.hostname);

const HOST_URL = "https://api-clashofclans.vercel.app/api/";

export const HOST_URL1 = runLocally() ? HOST_URL : '';
export const PATH_NAME_PLAYERS = (runLocally() ? HOST_URL : '') + "players";
export const PATH_NAME_CLANS = (runLocally() ? HOST_URL : '') + "clans";

// Player
export const GET_PLAYER_INFO = `${PATH_NAME_PLAYERS}`;

// Clan
export const GET_CLAN_CURRENT_WAR_LEAGUE_GROUP_INFO = `${PATH_NAME_CLANS}/currentwar/leaguegroup`;
export const GET_CLAN_WAR_LEAGUE_INDIVIDUAL_WAR_INFO = `${PATH_NAME_CLANS}/clanwarleagues/wars`;
export const GET_CLAN_WAR_INFO = `${PATH_NAME_CLANS}/warlog`;
export const GET_SEARCH_CLAN_INFO = `${PATH_NAME_CLANS}/clans`;
export const GET_CLAN_CURRENT_WAR_INFO = `${PATH_NAME_CLANS}/currentwar`;
export const GET_CLAN_INFO = `${PATH_NAME_CLANS}`;
export const GET_CLAN_MEMBERS = `${PATH_NAME_CLANS}/members`;
export const GET_CLAN_CAPITAL_RAID_SEASONS_INFO = `${PATH_NAME_CLANS}/capitalraidseasons`;