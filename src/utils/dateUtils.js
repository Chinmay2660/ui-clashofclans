/**
 * Date Utility Functions for Clash of Clans API
 * 
 * The CoC API returns dates in a non-standard format: "20231215T070000.000Z"
 * These utilities handle parsing and formatting those dates.
 */

/**
 * Parse CoC API date format to JavaScript Date object
 * @param {string} dateStr - Date string from CoC API (e.g., "20231215T070000.000Z")
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
export const parseCoCDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  
  // Trim any whitespace
  const trimmed = dateStr.trim();
  
  // CoC API format examples:
  // "20231215T070000.000Z" - most common
  // "20231215T070000Z" - without milliseconds
  // "2023-12-15T07:00:00.000Z" - standard ISO (fallback)
  
  // Check if it's already standard ISO format (has dashes)
  if (trimmed.includes('-') && trimmed.includes('T')) {
    const date = new Date(trimmed);
    return isNaN(date.getTime()) ? null : date;
  }
  
  // Handle CoC compact format: "20231215T070000.000Z" or "20231215T070000Z"
  if (trimmed.length >= 15 && trimmed.includes('T')) {
    try {
      const year = trimmed.substring(0, 4);
      const month = trimmed.substring(4, 6);
      const day = trimmed.substring(6, 8);
      
      // Find T position to get time part
      const tIndex = trimmed.indexOf('T');
      const timeAndRest = trimmed.substring(tIndex + 1);
      
      // Parse time part: "070000.000Z" or "070000Z"
      const hour = timeAndRest.substring(0, 2);
      const minute = timeAndRest.substring(2, 4);
      const second = timeAndRest.substring(4, 6);
      
      // Get milliseconds if present
      let ms = '000';
      const dotIndex = timeAndRest.indexOf('.');
      if (dotIndex !== -1) {
        ms = timeAndRest.substring(dotIndex + 1, dotIndex + 4).padEnd(3, '0');
      }
      
      // Construct ISO string
      const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}Z`;
      const date = new Date(isoString);
      
      return isNaN(date.getTime()) ? null : date;
    } catch (e) {
      console.warn('Failed to parse CoC date:', dateStr, e);
      return null;
    }
  }
  
  // Last resort: try native parsing
  try {
    const date = new Date(trimmed);
    return isNaN(date.getTime()) ? null : date;
  } catch (e) {
    return null;
  }
};

/**
 * Format date for display (e.g., "Dec 15, 2023")
 * @param {string} dateStr - Date string from CoC API
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr || dateStr === '' || dateStr === 'undefined' || dateStr === 'null') {
    return '—';
  }
  
  const date = parseCoCDate(dateStr);
  
  if (!date) {
    // Fallback: try manual extraction
    if (typeof dateStr === 'string' && dateStr.length >= 8) {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      if (!isNaN(parseInt(month)) && !isNaN(parseInt(day)) && !isNaN(parseInt(year))) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthIdx = parseInt(month) - 1;
        if (monthIdx >= 0 && monthIdx < 12) {
          return `${months[monthIdx]} ${parseInt(day)}, ${year}`;
        }
      }
    }
    return '—';
  }
  
  const defaultOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    ...options
  };
  
  try {
    return date.toLocaleDateString('en-US', defaultOptions);
  } catch (e) {
    return '—';
  }
};

/**
 * Format date short (e.g., "Dec 15")
 * @param {string} dateStr - Date string from CoC API
 * @returns {string} - Formatted date string
 */
export const formatDateShort = (dateStr) => {
  if (!dateStr || dateStr === '' || dateStr === 'undefined' || dateStr === 'null') {
    return '—';
  }
  
  const date = parseCoCDate(dateStr);
  
  if (!date) {
    // If we can't parse, try to show at least something meaningful
    if (typeof dateStr === 'string' && dateStr.length >= 8) {
      // Try to extract date parts manually
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      if (!isNaN(parseInt(month)) && !isNaN(parseInt(day))) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthIdx = parseInt(month) - 1;
        if (monthIdx >= 0 && monthIdx < 12) {
          return `${months[monthIdx]} ${parseInt(day)}`;
        }
      }
    }
    return '—';
  }
  
  try {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  } catch (e) {
    return '—';
  }
};

/**
 * Format date with time (e.g., "Dec 15, 2023 7:00 AM")
 * @param {string} dateStr - Date string from CoC API
 * @returns {string} - Formatted date and time string
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  
  const date = parseCoCDate(dateStr);
  
  if (!date) return '—';
  
  try {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch (e) {
    return '—';
  }
};

/**
 * Calculate time remaining from now to end time
 * @param {string} endTimeStr - End time string from CoC API
 * @returns {string} - Human readable time remaining
 */
export const formatTimeRemaining = (endTimeStr) => {
  if (!endTimeStr) return '—';
  
  const end = parseCoCDate(endTimeStr);
  
  if (!end) return '—';
  
  const now = new Date();
  const diff = end - now;
  
  if (diff <= 0) return 'Ended';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
};

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 * @param {string} dateStr - Date string from CoC API
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (dateStr) => {
  if (!dateStr) return '—';
  
  const date = parseCoCDate(dateStr);
  
  if (!date) return '—';
  
  const now = new Date();
  const diff = now - date;
  const absDiff = Math.abs(diff);
  const isPast = diff > 0;
  
  const minutes = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  
  if (days > 0) {
    return isPast ? `${days}d ago` : `in ${days}d`;
  }
  if (hours > 0) {
    return isPast ? `${hours}h ago` : `in ${hours}h`;
  }
  if (minutes > 0) {
    return isPast ? `${minutes}m ago` : `in ${minutes}m`;
  }
  
  return 'Just now';
};
