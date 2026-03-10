const STORAGE_KEY = 'clasherstats_recent_searches';
const MAX_ITEMS = 10;

export const getRecentSearches = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
};

export const addRecentSearch = (tag, type, name = '') => {
  const cleanTag = String(tag).replace('#', '').toUpperCase().trim();
  if (!cleanTag) return;
  try {
    const list = getRecentSearches();
    const entry = { tag: cleanTag, type, name: name || (type === 'clan' ? 'Clan' : 'Player') };
    const filtered = list.filter((item) => !(item.tag === cleanTag && item.type === type));
    const updated = [entry, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
};
