#!/usr/bin/env -S deno run --allow-read --allow-net --allow-env

import { ConfigManager } from './utils/config-manager.ts';
import { FireflyApiClient } from './client/firefly-client.ts';
import { PROJECT_INFO, FIREFLY_III_SUPPORTED_VERSIONS } from './version.ts';

/**
 * Main entry point for the Firefly III tools
 * 
 * This demonstrates how to:
 * 1. Load configuration securely
 * 2. Create an API client
 * 3. Test the connection
 * 4. Perform basic API operations
 */
async function main(): Promise<void> {
  try {
    console.log(`🔥 ${PROJECT_INFO.name} v${PROJECT_INFO.version} - Starting...`);
    console.log(`📋 Compatible with Firefly III v${FIREFLY_III_SUPPORTED_VERSIONS.max}`);

    // Load configuration
    console.log('📋 Loading configuration...');
    const configManager = new ConfigManager();
    const config = await configManager.loadConfig();
    console.log(`✅ Configuration loaded successfully`);
    console.log(`🔗 API URL: ${config.firefly.baseUrl}`);

    // Create API client
    console.log('🚀 Creating API client...');
    const client = new FireflyApiClient(config);

    // Test connection
    console.log('🔍 Testing API connection...');
    const isConnected = await client.testConnection();
    
    if (!isConnected) {
      console.error('❌ Failed to connect to Firefly III API');
      console.error('Please check your configuration:');
      console.error('- Base URL is correct and accessible');
      console.error('- API token is valid');
      console.error('- Firefly III instance is running');
      Deno.exit(1);
    }

    console.log('✅ API connection successful!');

    // Get user information
    console.log('👤 Fetching user information...');
    const userInfo = await client.getUser();
    console.log('User info:', userInfo);

    // Get accounts summary
    console.log('💰 Fetching accounts...');
    const accounts = await client.getAccounts();
    console.log(`📊 Found ${accounts.data.length} accounts`);

    // Display account summary
    if (accounts.data.length > 0) {
      console.log('\n📈 Account Summary:');
      accounts.data.forEach(account => {
        const { name, type, current_balance, currency_code } = account.attributes;
        console.log(`  • ${name} (${type}): ${current_balance} ${currency_code}`);
      });
    }

    // Get recent transactions
    console.log('\n📝 Fetching recent transactions...');
    const transactions = await client.getTransactions({ limit: 5 });
    console.log(`📋 Found ${transactions.data.length} recent transactions`);

    // Display transaction summary
    if (transactions.data.length > 0) {
      console.log('\n💸 Recent Transactions:');
      transactions.data.forEach(transaction => {
        const firstSplit = transaction.attributes.transactions[0];
        const { date, description, amount, currency_code } = firstSplit;
        console.log(`  • ${date}: ${description} - ${amount} ${currency_code}`);
      });
    }

    // Display API usage stats
    const stats = client.getStats();
    console.log(`\n📊 API Stats: ${stats.requestCount} requests made`);

    console.log('\n🎉 All operations completed successfully!');

  } catch (error) {
    console.error('\n❌ Error occurred:', error instanceof Error ? error.message : error);
    
    if (error instanceof Error && error.message.includes('required')) {
      console.error('\n💡 Tip: Make sure to configure your API credentials:');
      console.error('1. Copy config/config.example.json to config/config.json');
      console.error('2. Update the baseUrl and apiToken values');
      console.error('3. Or set environment variables FIREFLY_BASE_URL and FIREFLY_API_TOKEN');
    }
    
    Deno.exit(1);
  }
}

// Run the main function if this file is executed directly
if (import.meta.main) {
  await main();
}
