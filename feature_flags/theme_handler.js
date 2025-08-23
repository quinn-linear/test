/**
 * Theme Handler
 * 
 * This module provides functionality for handling themes based on feature flags.
 * It determines if a user should have access to new themes based on their ID
 * and the feature flag configuration.
 */

const featureFlags = require('./index');

/**
 * Theme names
 * @enum {string}
 */
const Theme = {
  DEFAULT: 'default',
  LIGHT: 'light',
  DARK: 'dark',
  HIGH_CONTRAST: 'high-contrast',
  SEPIA: 'sepia'
};

/**
 * Determines the available themes for a user
 * 
 * @param {string} userId - The ID of the user
 * @returns {Object} - Object containing theme availability and current theme
 */
function getUserThemeOptions(userId) {
  // Default available themes for all users
  const defaultThemes = [Theme.DEFAULT, Theme.LIGHT, Theme.DARK];
  
  // Check if the new themes feature flag is enabled for this user
  const newThemesEnabled = featureFlags.isEnabled('new_themes', userId);
  
  // If new themes are enabled, add additional themes
  const availableThemes = newThemesEnabled 
    ? [...defaultThemes, Theme.HIGH_CONTRAST, Theme.SEPIA] 
    : defaultThemes;
  
  return {
    availableThemes,
    hasNewThemes: newThemesEnabled,
    defaultTheme: Theme.DEFAULT
  };
}

/**
 * Validates if a theme is available for a user
 * 
 * @param {string} themeName - The name of the theme to check
 * @param {string} userId - The ID of the user
 * @returns {boolean} - Whether the theme is available for the user
 */
function isThemeAvailableForUser(themeName, userId) {
  const { availableThemes } = getUserThemeOptions(userId);
  return availableThemes.includes(themeName);
}

/**
 * Gets the CSS class for a specific theme
 * 
 * @param {string} themeName - The name of the theme
 * @returns {string} - CSS class for the theme
 */
function getThemeClass(themeName) {
  switch (themeName) {
    case Theme.LIGHT:
      return 'theme-light';
    case Theme.DARK:
      return 'theme-dark';
    case Theme.HIGH_CONTRAST:
      return 'theme-high-contrast';
    case Theme.SEPIA:
      return 'theme-sepia';
    case Theme.DEFAULT:
    default:
      return 'theme-default';
  }
}

module.exports = {
  Theme,
  getUserThemeOptions,
  isThemeAvailableForUser,
  getThemeClass
};