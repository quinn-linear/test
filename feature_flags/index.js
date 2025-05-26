/**
 * Feature Flag System
 * 
 * A simple feature flag implementation that allows enabling/disabling features
 * for specific users or globally across different environments.
 */

const fs = require('fs');
const path = require('path');

class FeatureFlags {
  constructor() {
    this.config = this.loadConfig();
    this.environment = process.env.NODE_ENV || 'development';
  }

  /**
   * Load feature flag configuration from the JSON file
   */
  loadConfig() {
    try {
      const configPath = path.join(__dirname, 'config.json');
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.error('Error loading feature flag configuration:', error);
      return { environments: {} };
    }
  }

  /**
   * Save the current configuration to the JSON file
   */
  saveConfig() {
    try {
      const configPath = path.join(__dirname, 'config.json');
      fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving feature flag configuration:', error);
    }
  }

  /**
   * Check if a feature flag is enabled for a specific user
   * 
   * @param {string} flagName - The name of the feature flag
   * @param {string} userId - The ID of the user
   * @param {string} env - Optional environment override
   * @returns {boolean} - Whether the feature is enabled for the user
   */
  isEnabled(flagName, userId = null, env = null) {
    const environment = env || this.environment;
    
    // Check if the environment exists in the config
    if (!this.config.environments[environment]) {
      return false;
    }
    
    // Check if the flag exists in the environment
    const flags = this.config.environments[environment].flags;
    if (!flags || !flags[flagName]) {
      return false;
    }
    
    const flag = flags[flagName];
    
    // If userId is provided, check if the user is in the list
    if (userId && flag.users && flag.users.includes(userId)) {
      return true;
    }
    
    // If no userId provided or user not in list, return the global flag setting
    return flag.enabled;
  }

  /**
   * Add a user to a feature flag in a specific environment
   * 
   * @param {string} flagName - The name of the feature flag
   * @param {string} userId - The ID of the user to add
   * @param {string} env - Optional environment override
   * @returns {boolean} - Success status
   */
  addUser(flagName, userId, env = null) {
    const environment = env || this.environment;
    
    // Check if the environment exists in the config
    if (!this.config.environments[environment]) {
      console.error(`Environment '${environment}' does not exist`);
      return false;
    }
    
    // Check if the flag exists in the environment
    const flags = this.config.environments[environment].flags;
    if (!flags || !flags[flagName]) {
      console.error(`Flag '${flagName}' does not exist in '${environment}'`);
      return false;
    }
    
    // Initialize users array if it doesn't exist
    if (!flags[flagName].users) {
      flags[flagName].users = [];
    }
    
    // Check if user is already in the list
    if (flags[flagName].users.includes(userId)) {
      console.log(`User '${userId}' is already enabled for flag '${flagName}' in '${environment}'`);
      return true;
    }
    
    // Add the user to the list
    flags[flagName].users.push(userId);
    
    // Save the updated configuration
    this.saveConfig();
    
    console.log(`User '${userId}' has been added to flag '${flagName}' in '${environment}'`);
    return true;
  }

  /**
   * Remove a user from a feature flag in a specific environment
   * 
   * @param {string} flagName - The name of the feature flag
   * @param {string} userId - The ID of the user to remove
   * @param {string} env - Optional environment override
   * @returns {boolean} - Success status
   */
  removeUser(flagName, userId, env = null) {
    const environment = env || this.environment;
    
    // Check if the environment exists in the config
    if (!this.config.environments[environment]) {
      console.error(`Environment '${environment}' does not exist`);
      return false;
    }
    
    // Check if the flag exists in the environment
    const flags = this.config.environments[environment].flags;
    if (!flags || !flags[flagName]) {
      console.error(`Flag '${flagName}' does not exist in '${environment}'`);
      return false;
    }
    
    // Check if users array exists
    if (!flags[flagName].users) {
      console.log(`No users defined for flag '${flagName}' in '${environment}'`);
      return true;
    }
    
    // Find user in the list
    const userIndex = flags[flagName].users.indexOf(userId);
    if (userIndex === -1) {
      console.log(`User '${userId}' is not enabled for flag '${flagName}' in '${environment}'`);
      return true;
    }
    
    // Remove the user from the list
    flags[flagName].users.splice(userIndex, 1);
    
    // Save the updated configuration
    this.saveConfig();
    
    console.log(`User '${userId}' has been removed from flag '${flagName}' in '${environment}'`);
    return true;
  }

  /**
   * Enable or disable a feature flag globally for an environment
   * 
   * @param {string} flagName - The name of the feature flag
   * @param {boolean} enabled - Whether to enable or disable the flag
   * @param {string} env - Optional environment override
   * @returns {boolean} - Success status
   */
  setEnabled(flagName, enabled, env = null) {
    const environment = env || this.environment;
    
    // Check if the environment exists in the config
    if (!this.config.environments[environment]) {
      console.error(`Environment '${environment}' does not exist`);
      return false;
    }
    
    // Check if the flag exists in the environment
    const flags = this.config.environments[environment].flags;
    if (!flags || !flags[flagName]) {
      console.error(`Flag '${flagName}' does not exist in '${environment}'`);
      return false;
    }
    
    // Set the enabled status
    flags[flagName].enabled = !!enabled;
    
    // Save the updated configuration
    this.saveConfig();
    
    console.log(`Flag '${flagName}' has been ${enabled ? 'enabled' : 'disabled'} in '${environment}'`);
    return true;
  }

  /**
   * Get all users for a specific feature flag
   * 
   * @param {string} flagName - The name of the feature flag
   * @param {string} env - Optional environment override
   * @returns {Array} - Array of user IDs
   */
  getUsers(flagName, env = null) {
    const environment = env || this.environment;
    
    // Check if the environment exists in the config
    if (!this.config.environments[environment]) {
      console.error(`Environment '${environment}' does not exist`);
      return [];
    }
    
    // Check if the flag exists in the environment
    const flags = this.config.environments[environment].flags;
    if (!flags || !flags[flagName]) {
      console.error(`Flag '${flagName}' does not exist in '${environment}'`);
      return [];
    }
    
    // Return users array or empty array if it doesn't exist
    return flags[flagName].users || [];
  }
}

module.exports = new FeatureFlags();