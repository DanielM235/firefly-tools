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

async function basicExample() {
  console.log(`=== ${PROJECT_INFO.name} v${PROJECT_INFO.version} - Basic API Example ===`);
  console.log(`Compatible with Firefly III v${FIREFLY_III_SUPPORTED_VERSIONS.max}\n`);

  try {
    // Step 1: Load configuration
    console.log('1. Loading configuration...');
    const configManager = new ConfigManager();
    const config = await configManager.loadConfig();
    console.log(`   ✅ Connected to: ${config.firefly.baseUrl}`);

    // Step 2: Create API client
    console.log('\n2. Creating API client...');
    const client = new FireflyApiClient(config);

    // Step 3: Test connection
    console.log('\n3. Testing API connection...');
    const isConnected = await client.testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to API');
    }
    console.log('   ✅ API connection successful');

    // Step 4: Get user information
    console.log('\n4. Getting user information...');
    await client.getUser();
    console.log('   📋 User info retrieved successfully');

    // Step 5: List accounts
    console.log('\n5. Fetching accounts...');
    const accounts = await client.getAccounts();
    console.log(`   📊 Found ${accounts.data.length} accounts:`);
    
    for (const account of accounts.data.slice(0, 5)) { // Show first 5
      const { name, type, current_balance, currency_code } = account.attributes;
      console.log(`      • ${name} (${type}): ${current_balance} ${currency_code}`);
    }

    // Step 6: Get recent transactions
    console.log('\n6. Fetching recent transactions...');
    const transactions = await client.getTransactions({ limit: 3 });
    console.log(`   📝 Found ${transactions.data.length} recent transactions:`);
    
    for (const transaction of transactions.data) {
      const split = transaction.attributes.transactions[0];
      console.log(`      • ${split.date}: ${split.description} - ${split.amount} ${split.currency_code}`);
    }

    // Step 7: API statistics
    const stats = client.getStats();
    console.log(`\n7. API Usage: ${stats.requestCount} requests made`);

    console.log('\n🎉 Example completed successfully!');

  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    console.error('\n💡 Make sure to configure your API credentials in config/config.json');
  }
}

// Run the example
if (import.meta.main) {
  await basicExample();
}

export { basicExample };
