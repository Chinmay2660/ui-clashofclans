export const runLocally = () => window.location.hostname && /^localhost$/.test(window.location.hostname);

const HOST_URL = "https://api-clashofclans.vercel.app/api/";

export const HOST_URL1 = runLocally() ? HOST_URL : '';
export const PATH_NAME_PLAYERS = (runLocally() ? HOST_URL : '') + "/api/players";
export const PATH_NAME_CLANS = (runLocally() ? HOST_URL : '') + "/api/clans";

export const GET_PLAYER_INFO = `${PATH_NAME_PLAYERS}`;