#!/usr/bin/env -S deno run --allow-read --allow-net --allow-env

/**
 * Example: Basic Firefly III API Usage
 * 
 * This script demonstrates the basic usage of the Firefly III tools:
 * 1. Configuration management
 * 2. API client creation
 * 3. Basic operations
 */

import { ConfigManager } from '../src/utils/config-manager.ts';
import { FireflyApiClient } from '../src/client/firefly-client.ts';
import { PROJECT_INFO, FIREFLY_III_SUPPORTED_VERSIONS } from '../src/version.ts';
import { createLogger } from '../src/utils/logger.ts';

async function basicExample() {
  try {
    // Step 1: Load configuration
    const configManager = new ConfigManager();
    const config = await configManager.loadConfig();
    
    // Initialize logger
    const logger = createLogger(config.logging);
    
    logger.info(`${PROJECT_INFO.name} v${PROJECT_INFO.version} - Basic API Example`);
    logger.info(`Compatible with Firefly III v${FIREFLY_III_SUPPORTED_VERSIONS.max}`);

    // Step 2: Create API client
    logger.info('Creating API client...');
    const client = new FireflyApiClient(config);

    // Step 3: Test connection
    logger.info('Testing API connection...');
    const isConnected = await client.testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to API');
    }
    logger.info('API connection successful');

    // Step 4: Get user information
    logger.info('Getting user information...');
    await client.getUser();
    logger.info('User info retrieved successfully');

    // Step 5: List accounts
    logger.info('Fetching accounts...');
    const accounts = await client.getAccounts();
    logger.info(`Found ${accounts.data.length} accounts:`);
    
    for (const account of accounts.data.slice(0, 5)) { // Show first 5
      const { name, type, current_balance, currency_code } = account.attributes;
      logger.info(`      • ${name} (${type}): ${current_balance} ${currency_code}`);
    }

    // Step 6: Get recent transactions
    logger.info('Fetching recent transactions...');
    const transactions = await client.getTransactions({ limit: 3 });
    logger.info(`Found ${transactions.data.length} recent transactions:`);
    
    for (const transaction of transactions.data) {
      const split = transaction.attributes.transactions[0];
      logger.info(`      • ${split.date}: ${split.description} - ${split.amount} ${split.currency_code}`);
    }

    // Step 7: API statistics
    const stats = client.getStats();
    logger.info(`API Usage: ${stats.requestCount} requests made`);

    logger.info('Example completed successfully!');

  } catch (error) {
    // Create a basic logger if the main one failed
    const logger = createLogger({ level: 'error', logToFile: false, logFile: '' });
    logger.error('Error:', error instanceof Error ? error : new Error(String(error)));
    logger.error('Make sure to configure your API credentials in config/config.json');
  }
}

// Run the example
if (import.meta.main) {
  await basicExample();
}

export { basicExample };
