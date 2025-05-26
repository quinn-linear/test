# Feature Flags System

A simple feature flag implementation for managing feature toggles across different environments.

## Overview

This feature flag system allows you to control access to features across different environments:
- Enable/disable features globally per environment
- Enable features for specific users by their ID
- Check if a feature is enabled for a particular user

## Configuration

Feature flags are configured in the `config.json` file with the following structure:

```json
{
  "environments": {
    "production": {
      "flags": {
        "new_themes": {
          "enabled": true,
          "users": ["user-id-1", "user-id-2"]
        }
      }
    },
    "staging": {
      "flags": {
        "new_themes": {
          "enabled": false,
          "users": []
        }
      }
    },
    "development": {
      "flags": {
        "new_themes": {
          "enabled": true,
          "users": []
        }
      }
    }
  }
}
```

## Usage in Code

```javascript
const featureFlags = require('./feature_flags');

// Check if a feature is enabled for a user
const isEnabled = featureFlags.isEnabled('new_themes', 'user-id-123');

// Add a user to a feature flag
featureFlags.addUser('new_themes', 'user-id-123', 'production');

// Remove a user from a feature flag
featureFlags.removeUser('new_themes', 'user-id-123', 'production');

// Enable/disable a feature flag globally
featureFlags.setEnabled('new_themes', true, 'production');
```

## Command Line Interface

You can also manage feature flags using the CLI:

```bash
# Make CLI executable
chmod +x ./cli.js

# List all feature flags in the production environment
node cli.js list --env production

# Enable a feature flag globally in production
node cli.js enable new_themes --env production

# Disable a feature flag globally in production
node cli.js disable new_themes --env production

# Add a user to a feature flag in production
node cli.js add-user new_themes user-id-123 --env production

# Remove a user from a feature flag in production
node cli.js remove-user new_themes user-id-123 --env production

# Get all users for a feature flag in production
node cli.js get-users new_themes --env production

# Check if a feature is enabled for a user in production
node cli.js check new_themes user-id-123 --env production
```

## Current Configuration

The current configuration has the following setup:

1. **Production Environment**:
   - `new_themes` feature flag is enabled
   - User "Davina" (ID: b1deab3f-31a9-4fdf-8885-9e5636fc7845) has been added to this flag

2. **Staging Environment**:
   - `new_themes` feature flag is disabled
   - No users specifically enabled

3. **Development Environment**:
   - `new_themes` feature flag is enabled
   - No users specifically enabled (all users have access)