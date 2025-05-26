#!/usr/bin/env node

/**
 * Command Line Interface for Feature Flags Management
 * 
 * This CLI allows managing feature flags and user access from the command line.
 * Usage examples:
 * 
 * node cli.js list                          - List all feature flags
 * node cli.js enable new_themes             - Enable a feature flag globally
 * node cli.js disable new_themes            - Disable a feature flag globally
 * node cli.js add-user new_themes user123   - Add a user to a feature flag
 * node cli.js remove-user new_themes user123 - Remove a user from a feature flag
 * node cli.js get-users new_themes          - Get all users for a feature flag
 * node cli.js check new_themes user123      - Check if a feature is enabled for a user
 */

// Parse command line arguments and extract environment BEFORE requiring the module
const rawArgs = process.argv.slice(2);
const envIndex = rawArgs.indexOf('--env');
if (envIndex !== -1) {
  process.env.NODE_ENV = rawArgs[envIndex + 1] || 'development';
  // Remove the environment arguments from the args array
  rawArgs.splice(envIndex, 2);
}

// Now require the module with the environment already set
const featureFlags = require('./index');

// Continue with command processing
const args = rawArgs;
const command = args[0];

// Handle commands
switch (command) {
  case 'list':
    listFeatureFlags();
    break;
  
  case 'enable':
    if (args.length < 2) {
      console.error('Missing flag name. Usage: node cli.js enable <flag-name>');
      process.exit(1);
    }
    enableFeatureFlag(args[1]);
    break;
  
  case 'disable':
    if (args.length < 2) {
      console.error('Missing flag name. Usage: node cli.js disable <flag-name>');
      process.exit(1);
    }
    disableFeatureFlag(args[1]);
    break;
  
  case 'add-user':
    if (args.length < 3) {
      console.error('Missing arguments. Usage: node cli.js add-user <flag-name> <user-id>');
      process.exit(1);
    }
    addUser(args[1], args[2]);
    break;
  
  case 'remove-user':
    if (args.length < 3) {
      console.error('Missing arguments. Usage: node cli.js remove-user <flag-name> <user-id>');
      process.exit(1);
    }
    removeUser(args[1], args[2]);
    break;
  
  case 'get-users':
    if (args.length < 2) {
      console.error('Missing flag name. Usage: node cli.js get-users <flag-name>');
      process.exit(1);
    }
    getUsers(args[1]);
    break;
  
  case 'check':
    if (args.length < 3) {
      console.error('Missing arguments. Usage: node cli.js check <flag-name> <user-id>');
      process.exit(1);
    }
    checkFeatureFlag(args[1], args[2]);
    break;
  
  case 'help':
  default:
    showHelp();
    break;
}

// Function implementations

function listFeatureFlags() {
  const environment = process.env.NODE_ENV || 'development';
  console.log(`Feature Flags in '${environment}' environment:`);
  
  const flags = featureFlags.config.environments[environment]?.flags || {};
  
  if (Object.keys(flags).length === 0) {
    console.log('No feature flags defined.');
    return;
  }
  
  Object.keys(flags).forEach(flagName => {
    const flag = flags[flagName];
    console.log(`- ${flagName}: ${flag.enabled ? 'Enabled' : 'Disabled'}`);
    
    if (flag.users && flag.users.length > 0) {
      console.log(`  Users (${flag.users.length}): ${flag.users.join(', ')}`);
    } else {
      console.log('  No users specifically enabled');
    }
  });
}

function enableFeatureFlag(flagName) {
  const environment = process.env.NODE_ENV || 'development';
  const result = featureFlags.setEnabled(flagName, true, environment);
  
  if (result) {
    console.log(`Successfully enabled '${flagName}' in '${environment}' environment.`);
  }
}

function disableFeatureFlag(flagName) {
  const environment = process.env.NODE_ENV || 'development';
  const result = featureFlags.setEnabled(flagName, false, environment);
  
  if (result) {
    console.log(`Successfully disabled '${flagName}' in '${environment}' environment.`);
  }
}

function addUser(flagName, userId) {
  const environment = process.env.NODE_ENV || 'development';
  const result = featureFlags.addUser(flagName, userId, environment);
  
  if (result) {
    console.log(`Successfully added user '${userId}' to '${flagName}' in '${environment}' environment.`);
  }
}

function removeUser(flagName, userId) {
  const environment = process.env.NODE_ENV || 'development';
  const result = featureFlags.removeUser(flagName, userId, environment);
  
  if (result) {
    console.log(`Successfully removed user '${userId}' from '${flagName}' in '${environment}' environment.`);
  }
}

function getUsers(flagName) {
  const environment = process.env.NODE_ENV || 'development';
  const users = featureFlags.getUsers(flagName, environment);
  
  console.log(`Users for feature flag '${flagName}' in '${environment}' environment:`);
  
  if (users.length === 0) {
    console.log('No users specifically enabled for this feature flag.');
    return;
  }
  
  users.forEach(userId => {
    console.log(`- ${userId}`);
  });
}

function checkFeatureFlag(flagName, userId) {
  const environment = process.env.NODE_ENV || 'development';
  const isEnabled = featureFlags.isEnabled(flagName, userId, environment);
  
  console.log(`Feature flag '${flagName}' is ${isEnabled ? 'enabled' : 'disabled'} for user '${userId}' in '${environment}' environment.`);
}

function showHelp() {
  console.log(`
Feature Flags CLI

Usage:
  node cli.js <command> [options]

Commands:
  list                                  List all feature flags
  enable <flag-name>                    Enable a feature flag globally
  disable <flag-name>                   Disable a feature flag globally
  add-user <flag-name> <user-id>        Add a user to a feature flag
  remove-user <flag-name> <user-id>     Remove a user from a feature flag
  get-users <flag-name>                 Get all users for a feature flag
  check <flag-name> <user-id>           Check if a feature is enabled for a user
  help                                  Show this help message

Options:
  --env <environment>                   Specify the environment (default: development)

Examples:
  node cli.js list --env production
  node cli.js add-user new_themes b1deab3f-31a9-4fdf-8885-9e5636fc7845 --env production
  `);
}