#!/usr/bin/env -S deno run --allow-read --allow-env --allow-net

/**
 * 🚨 INTEGRATION TESTS - THESE MAKE REAL API CALLS 🚨
 * 
 * These tests connect to a real Firefly III instance and should ONLY be run:
 * 1. Against a TEST/DEVELOPMENT instance (NEVER production)
 * 2. Manually by developers when needed
 * 3. With full understanding that they will create/modify data
 * 
 * To run these tests:
 * 1. Set up a test Firefly III instance
 * 2. Configure test credentials in config/test-config.json
 * 3. Run: deno run --allow-read --allow-env --allow-net tests/integration/category-api.integration.ts
 */

import { assertEquals } from "../../src/deps.ts";
import { FireflyApiClient } from "../../src/client/firefly-client.ts";
import { ConfigManager } from "../../src/utils/config-manager.ts";

console.log("🚨 WARNING: Integration tests will make REAL API calls!");
console.log("   Make sure you're using a TEST instance, not production!");
console.log("");

// Integration test (disabled by default)
// To enable: change the test name to remove "SKIP_"
Deno.test("SKIP_INTEGRATION: FireflyApiClient - createCategory real API", async () => {
  const configManager = new ConfigManager();
  const config = await configManager.loadConfig();
  const client = new FireflyApiClient(config);

  // Test API connection first
  const isConnected = await client.testConnection();
  if (!isConnected) {
    throw new Error("Cannot connect to Firefly III API - check your configuration");
  }

  // Create a test category
  const testCategory = {
    name: `[🧪 TEST] Integration Test Category ${Date.now()}`,
    notes: `Created by integration test at ${new Date().toISOString()}`
  };

  const result = await client.createCategory(testCategory);
  
  // Verify the response
  assertEquals(typeof result.data, "object");
  assertEquals(result.data.type, "categories");
  assertEquals(typeof result.data.id, "string");
  assertEquals(result.data.attributes.name, testCategory.name);
  assertEquals(result.data.attributes.notes, testCategory.notes);

  console.log("✅ Integration test passed");
  console.log(`   Created category: ${result.data.attributes.name}`);
  console.log(`   Category ID: ${result.data.id}`);
  console.log("   ⚠️  Remember to clean up test data from your instance!");
});

if (import.meta.main) {
  console.log("To run integration tests:");
  console.log("  1. Edit this file and remove 'SKIP_' from the test name");
  console.log("  2. Ensure you're using a TEST Firefly III instance (not production!)");
  console.log("  3. Run: deno test tests/integration/category-api.integration.ts --allow-read --allow-env --allow-net");
  console.log("");
  console.log("⚠️  WARNING: These tests will create real data in your Firefly III instance!");
}
