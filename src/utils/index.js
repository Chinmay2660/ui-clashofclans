// Date utilities
export {
  parseCoCDate,
  formatDate,
  formatDateShort,
  formatDateTime,
  formatTimeRemaining,
  getRelativeTime,
} from './dateUtils';

// Format utilities
export {
  formatNumber,
  formatPercent,
  cleanTag,
  formatTag,
  truncateText,
  getOrdinal,
} from './formatUtils';

// User storage utilities
export {
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
} from './userStorage';
