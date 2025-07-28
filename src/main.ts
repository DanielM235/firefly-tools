#!/usr/bin/env -S deno run --allow-read --allow-net --allow-env

import { ConfigManager } from "./utils/config-manager.ts";
import { FireflyApiClient } from "./client/firefly-client.ts";
import { FIREFLY_III_SUPPORTED_VERSIONS, PROJECT_INFO } from "./version.ts";
import { createLogger, getLogger } from "./utils/logger.ts";

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
    // Load configuration first
    const configManager = new ConfigManager();
    const config = await configManager.loadConfig();

    // Initialize logger with configuration
    const logger = createLogger(config.logging);

    logger.info(`${PROJECT_INFO.name} v${PROJECT_INFO.version} - Starting...`);
    logger.info(
      `Compatible with Firefly III v${FIREFLY_III_SUPPORTED_VERSIONS.max}`,
    );

    // Load configuration
    logger.info("Loading configuration...");
    logger.info(`Configuration loaded successfully`);
    logger.info(`API URL: ${config.firefly.baseUrl}`);

    // Create API client
    logger.info("Creating API client...");
    const client = new FireflyApiClient(config);

    // Test connection
    logger.info("Testing API connection...");
    const isConnected = await client.testConnection();

    if (!isConnected) {
      logger.error("Failed to connect to Firefly III API");
      logger.error("Please check your configuration:");
      logger.error("- Base URL is correct and accessible");
      logger.error("- API token is valid");
      logger.error("- Firefly III instance is running");
      Deno.exit(1);
    }

    logger.info("API connection successful!");

    // Get user information
    logger.info("Fetching user information...");
    await client.getUser();
    logger.debug("User info retrieved successfully");

    // Get accounts summary
    logger.info("Fetching accounts...");
    const accounts = await client.getAccounts();
    logger.info(`Found ${accounts.data.length} accounts`);

    // Display account summary
    if (accounts.data.length > 0) {
      logger.info("Account Summary:");
      accounts.data.forEach((account) => {
        const { name, type, current_balance, currency_code } =
          account.attributes;
        logger.info(
          `  • ${name} (${type}): ${current_balance} ${currency_code}`,
        );
      });
    }

    // Get recent transactions
    logger.info("Fetching recent transactions...");
    const transactions = await client.getTransactions({ limit: 5 });
    logger.info(`Found ${transactions.data.length} recent transactions`);

    // Display transaction summary
    if (transactions.data.length > 0) {
      logger.info("Recent Transactions:");
      transactions.data.forEach((transaction) => {
        const firstSplit = transaction.attributes.transactions[0];
        const { date, description, amount, currency_code } = firstSplit;
        logger.info(`  • ${date}: ${description} - ${amount} ${currency_code}`);
      });
    }

    // Display API usage stats
    const stats = client.getStats();
    logger.info(`API Stats: ${stats.requestCount} requests made`);

    logger.info("All operations completed successfully!");
  } catch (error) {
    const logger = getLogger();
    logger.error(
      "Error occurred:",
      error instanceof Error ? error : new Error(String(error)),
    );

    if (error instanceof Error && error.message.includes("required")) {
      logger.error("Tip: Make sure to configure your API credentials:");
      logger.error("1. Copy config/config.example.json to config/config.json");
      logger.error("2. Update the baseUrl and apiToken values");
      logger.error(
        "3. Or set environment variables FIREFLY_BASE_URL and FIREFLY_API_TOKEN",
      );
    }

    Deno.exit(1);
  }
}

// Run the main function if this file is executed directly
if (import.meta.main) {
  await main();
}
