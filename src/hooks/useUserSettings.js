import { useState, useCallback, useEffect } from 'react';
import {
  getMyPlayerTag,
  setMyPlayerTag,
  removeMyPlayerTag,
  getMyClanTag,
  setMyClanTag,
  removeMyClanTag,
  getMyClanRecords,
  setMyClanRecords,
  removeMyClanRecords,
} from '../utils/userStorage';

/**
 * Custom hook for managing user settings (player tag, clan tag, records)
 */
export const useUserSettings = () => {
  // State for player tag
  const [playerTag, setPlayerTagState] = useState(() => getMyPlayerTag());
  
  // State for clan tag
  const [clanTag, setClanTagState] = useState(() => getMyClanTag());
  
  // State for clan records
  const [clanRecords, setClanRecordsState] = useState(() => getMyClanRecords());

  // Sync state with localStorage on mount (for multiple tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'coc_my_player_tag') {
        setPlayerTagState(e.newValue);
      }
      if (e.key === 'coc_my_clan_tag') {
        setClanTagState(e.newValue);
      }
      if (e.key === 'coc_my_clan_records') {
        setClanRecordsState(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Player tag operations
  const savePlayerTag = useCallback((tag) => {
    const success = setMyPlayerTag(tag);
    if (success) {
      setPlayerTagState(tag.replace('#', '').toUpperCase().trim());
    }
    return success;
  }, []);

  const clearPlayerTag = useCallback(() => {
    const success = removeMyPlayerTag();
    if (success) {
      setPlayerTagState(null);
    }
    return success;
  }, []);

  // Clan tag operations
  const saveClanTag = useCallback((tag) => {
    const success = setMyClanTag(tag);
    if (success) {
      setClanTagState(tag.replace('#', '').toUpperCase().trim());
    }
    return success;
  }, []);

  const clearClanTag = useCallback(() => {
    const success = removeMyClanTag();
    if (success) {
      setClanTagState(null);
    }
    return success;
  }, []);

  // Clan records operations
  const saveClanRecords = useCallback((records) => {
    const success = setMyClanRecords(records);
    if (success) {
      setClanRecordsState(records);
    }
    return success;
  }, []);

  const clearClanRecords = useCallback(() => {
    const success = removeMyClanRecords();
    if (success) {
      setClanRecordsState(null);
    }
    return success;
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    clearPlayerTag();
    clearClanTag();
    clearClanRecords();
  }, [clearPlayerTag, clearClanTag, clearClanRecords]);

  return {
    // Player
    playerTag,
    hasPlayerTag: !!playerTag,
    savePlayerTag,
    clearPlayerTag,
    
    // Clan
    clanTag,
    hasClanTag: !!clanTag,
    saveClanTag,
    clearClanTag,
    
    // Records
    clanRecords,
    hasClanRecords: !!clanRecords,
    saveClanRecords,
    clearClanRecords,
    
    // Utils
    clearAll,
    hasAnySettings: !!playerTag || !!clanTag,
  };
};

export default useUserSettings;

