import { assertEquals, assertRejects } from "../src/deps.ts";
import { move } from "https://deno.land/std@0.208.0/fs/mod.ts";
import { ConfigManager } from "../src/utils/config-manager.ts";

Deno.test("ConfigManager - should load configuration from environment variables", async () => {
  // Set test environment variables
  Deno.env.set("FIREFLY_BASE_URL", "https://test.firefly-iii.org");
  Deno.env.set("FIREFLY_API_TOKEN", "test-token-12345");

  const configManager = new ConfigManager();
  const config = await configManager.loadConfig();

  assertEquals(config.firefly.baseUrl, "https://test.firefly-iii.org");
  assertEquals(config.firefly.apiToken, "test-token-12345");
  assertEquals(config.firefly.timeout, 30000);
  assertEquals(config.logging.level, "info");

  // Clean up
  Deno.env.delete("FIREFLY_BASE_URL");
  Deno.env.delete("FIREFLY_API_TOKEN");
  configManager.clearConfig();
});

Deno.test("ConfigManager - should validate required configuration", async () => {
  // Clear any existing environment variables
  Deno.env.delete("FIREFLY_BASE_URL");
  Deno.env.delete("FIREFLY_API_TOKEN");

  // Temporarily move config.json if it exists
  const configPath = "./config/config.json";
  const tempConfigPath = "./config/config.json.bak";
  let configExisted = false;

  try {
    await Deno.stat(configPath);
    await move(configPath, tempConfigPath);
    configExisted = true;
  } catch {
    // Config file doesn't exist, which is what we want for this test
  }

  const configManager = new ConfigManager();

  try {
    await assertRejects(
      () => configManager.loadConfig(),
      Error,
      "Firefly III base URL is required",
    );
  } finally {
    // Restore config file if it existed
    if (configExisted) {
      try {
        await move(tempConfigPath, configPath);
      } catch {
        // Ignore errors during restoration
      }
    }
  }
});

Deno.test("ConfigManager - should validate URL format", async () => {
  Deno.env.set("FIREFLY_BASE_URL", "invalid-url");
  Deno.env.set("FIREFLY_API_TOKEN", "test-token-12345");

  const configManager = new ConfigManager();

  await assertRejects(
    () => configManager.loadConfig(),
    Error,
    "Invalid Firefly III base URL format",
  );

  // Clean up
  Deno.env.delete("FIREFLY_BASE_URL");
  Deno.env.delete("FIREFLY_API_TOKEN");
});

Deno.test("ConfigManager - should validate token length", async () => {
  Deno.env.set("FIREFLY_BASE_URL", "https://test.firefly-iii.org");
  Deno.env.set("FIREFLY_API_TOKEN", "short");

  const configManager = new ConfigManager();

  await assertRejects(
    () => configManager.loadConfig(),
    Error,
    "Firefly III API token appears to be invalid",
  );

  // Clean up
  Deno.env.delete("FIREFLY_BASE_URL");
  Deno.env.delete("FIREFLY_API_TOKEN");
});
