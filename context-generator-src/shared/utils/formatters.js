/**
 * Formats a date to a human-readable string
 * @param {Date|string} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
const formatDate = (date, options = {}) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions = {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    ...options
  };
  
  return dateObj.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Formats a number with commas for thousands
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
const formatNumber = (number) => {
  return number.toLocaleString('en-US');
};

/**
 * Formats a price with currency symbol and decimal places
 * @param {number} price - Price to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted price string
 */
const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(price);
};

/**
 * Formats a percentage value
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Converts markdown to plaintext
 * @param {string} markdown - Markdown text
 * @returns {string} Plain text
 */
const markdownToPlaintext = (markdown) => {
  if (!markdown) return '';
  
  // Replace headings
  let text = markdown
    .replace(/#{1,6}\s+([^\n]+)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
    .replace(/\*([^*]+)\*/g, '$1')     // Italic
    .replace(/`([^`]+)`/g, '$1')       // Code
    .replace(/~~([^~]+)~~/g, '$1')     // Strikethrough
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // Images
    .replace(/^\s*>\s*(.*)$/gm, '$1')  // Blockquotes
    .replace(/^\s*[-*+]\s+(.*)$/gm, '" $1') // Unordered lists
    .replace(/^\s*\d+\.\s+(.*)$/gm, '" $1') // Ordered lists
    .replace(/^\s*```[^`]*```\s*$/gm, '') // Code blocks
    .replace(/\n{3,}/g, '\n\n');        // Multiple newlines
  
  return text.trim();
};

module.exports = {
  formatDate,
  formatNumber,
  formatPrice,
  formatPercentage,
  markdownToPlaintext
};