/**
 * Feature Flags Usage Example
 * 
 * This file demonstrates how to use the feature flags system in your application code.
 */

const featureFlags = require('./index');
const themeHandler = require('./theme_handler');

// Example function to render theme options for a user
function renderThemeOptions(userId) {
  // Get the theme options for this user
  const { availableThemes, hasNewThemes, defaultTheme } = themeHandler.getUserThemeOptions(userId);
  
  console.log(`\nTheme options for user ${userId}:`);
  console.log(`Has access to new themes: ${hasNewThemes ? 'Yes' : 'No'}`);
  console.log('Available themes:');
  
  availableThemes.forEach(theme => {
    const cssClass = themeHandler.getThemeClass(theme);
    console.log(`- ${theme} (CSS class: ${cssClass})`);
  });
  
  console.log(`Default theme: ${defaultTheme}`);
}

// Example usage
console.log('Feature Flags Usage Example');
console.log('==========================');

// Davina's user ID (with access to new themes in production)
const davinaId = 'b1deab3f-31a9-4fdf-8885-9e5636fc7845';

// Example user without specific access
const regularUserId = 'regular-user-123';

// Check if new_themes feature flag is enabled for Davina
console.log(`\nChecking new_themes feature flag for Davina (${davinaId}):`);
console.log(`Enabled: ${featureFlags.isEnabled('new_themes', davinaId, 'production')}`);

// Check if new_themes feature flag is enabled for a regular user
console.log(`\nChecking new_themes feature flag for regular user (${regularUserId}):`);
console.log(`Enabled: ${featureFlags.isEnabled('new_themes', regularUserId, 'production')}`);

// Render theme options for Davina
console.log('\nTheme options for Davina:');
renderThemeOptions(davinaId);

// Render theme options for a regular user
console.log('\nTheme options for regular user:');
renderThemeOptions(regularUserId);

// Example of how to add a user to the feature flag
console.log('\nAdding regular user to new_themes feature flag:');
featureFlags.addUser('new_themes', regularUserId, 'production');

// Check again after adding
console.log(`\nChecking new_themes feature flag for regular user after adding (${regularUserId}):`);
console.log(`Enabled: ${featureFlags.isEnabled('new_themes', regularUserId, 'production')}`);

// Render theme options again after adding the user
console.log('\nTheme options for regular user after adding:');
renderThemeOptions(regularUserId);

// Clean up by removing the regular user
console.log('\nRemoving regular user from new_themes feature flag:');
featureFlags.removeUser('new_themes', regularUserId, 'production');

console.log('\nDone!');