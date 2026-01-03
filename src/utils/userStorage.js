/**
 * User Storage Utility
 * Manages user's saved player and clan tags in localStorage
 */

const STORAGE_KEYS = {
  PLAYER_TAG: 'coc_my_player_tag',
  CLAN_TAG: 'coc_my_clan_tag',
  CLAN_RECORDS: 'coc_my_clan_records',
};

// ========== PLAYER TAG ==========

/**
 * Get saved player tag from localStorage
 * @returns {string|null}
 */
export const getMyPlayerTag = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.PLAYER_TAG);
  } catch (error) {
    console.error('Error reading player tag from localStorage:', error);
    return null;
  }
};

/**
 * Save player tag to localStorage
 * @param {string} tag - Player tag (with or without #)
 */
export const setMyPlayerTag = (tag) => {
  try {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    localStorage.setItem(STORAGE_KEYS.PLAYER_TAG, cleanTag);
    return true;
  } catch (error) {
    console.error('Error saving player tag to localStorage:', error);
    return false;
  }
};

/**
 * Remove player tag from localStorage
 */
export const removeMyPlayerTag = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PLAYER_TAG);
    return true;
  } catch (error) {
    console.error('Error removing player tag from localStorage:', error);
    return false;
  }
};

// ========== CLAN TAG ==========

/**
 * Get saved clan tag from localStorage
 * @returns {string|null}
 */
export const getMyClanTag = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.CLAN_TAG);
  } catch (error) {
    console.error('Error reading clan tag from localStorage:', error);
    return null;
  }
};

/**
 * Save clan tag to localStorage
 * @param {string} tag - Clan tag (with or without #)
 */
export const setMyClanTag = (tag) => {
  try {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    localStorage.setItem(STORAGE_KEYS.CLAN_TAG, cleanTag);
    return true;
  } catch (error) {
    console.error('Error saving clan tag to localStorage:', error);
    return false;
  }
};

/**
 * Remove clan tag from localStorage
 */
export const removeMyClanTag = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CLAN_TAG);
    return true;
  } catch (error) {
    console.error('Error removing clan tag from localStorage:', error);
    return false;
  }
};

// ========== CLAN RECORDS (Optional Manual Data) ==========

/**
 * Get saved clan records from localStorage
 * @returns {Object|null}
 */
export const getMyClanRecords = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CLAN_RECORDS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading clan records from localStorage:', error);
    return null;
  }
};

/**
 * Save clan records to localStorage
 * @param {Object} records - { highestWarWinStreak, bestRankInLocation, recordDate }
 */
export const setMyClanRecords = (records) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CLAN_RECORDS, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('Error saving clan records to localStorage:', error);
    return false;
  }
};

/**
 * Remove clan records from localStorage
 */
export const removeMyClanRecords = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CLAN_RECORDS);
    return true;
  } catch (error) {
    console.error('Error removing clan records from localStorage:', error);
    return false;
  }
};

// ========== UTILITIES ==========

/**
 * Check if user has configured their profile
 * @returns {boolean}
 */
export const hasPlayerTagConfigured = () => {
  return !!getMyPlayerTag();
};

/**
 * Check if user has configured their clan
 * @returns {boolean}
 */
export const hasClanTagConfigured = () => {
  return !!getMyClanTag();
};

/**
 * Clear all user data from localStorage
 */
export const clearAllUserData = () => {
  removeMyPlayerTag();
  removeMyClanTag();
  removeMyClanRecords();
};

export default {
  getMyPlayerTag,
  setMyPlayerTag,
  removeMyPlayerTag,
  getMyClanTag,
  setMyClanTag,
  removeMyClanTag,
  getMyClanRecords,
  setMyClanRecords,
  removeMyClanRecords,
  hasPlayerTagConfigured,
  hasClanTagConfigured,
  clearAllUserData,
};

