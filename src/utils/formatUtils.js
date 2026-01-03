/**
 * Format Utility Functions
 * Common formatting helpers for numbers, text, etc.
 */

/**
 * Format large numbers with K, M suffixes
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined) return '0';
  
  const absNum = Math.abs(num);
  
  if (absNum >= 1000000) {
    return (num / 1000000).toFixed(decimals).replace(/\.0$/, '') + 'M';
  }
  if (absNum >= 1000) {
    return (num / 1000).toFixed(decimals).replace(/\.0$/, '') + 'K';
  }
  
  return num.toLocaleString();
};

/**
 * Format percentage
 * @param {number} value - Percentage value
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} - Formatted percentage string
 */
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Clean player/clan tag (remove # and uppercase)
 * @param {string} tag - Player or clan tag
 * @returns {string} - Cleaned tag
 */
export const cleanTag = (tag) => {
  if (!tag) return '';
  return tag.replace('#', '').toUpperCase().trim();
};

/**
 * Format tag with # prefix
 * @param {string} tag - Player or clan tag
 * @returns {string} - Tag with # prefix
 */
export const formatTag = (tag) => {
  if (!tag) return '';
  const cleaned = cleanTag(tag);
  return `#${cleaned}`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 20) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get ordinal suffix for number (1st, 2nd, 3rd, etc.)
 * @param {number} n - Number
 * @returns {string} - Number with ordinal suffix
 */
export const getOrdinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

