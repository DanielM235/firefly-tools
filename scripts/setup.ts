#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env

/**
 * Setup script for Firefly III Tools
 *
 * This script helps users set up their development environment:
 * 1. Check if Deno is installed
 * 2. Create configuration from template
 * 3. Validate configuration
 * 4. Test API connection
 */

async function checkDeno(): Promise<boolean> {
  try {
    const process = new Deno.Command("deno", { args: ["--version"] });
    const result = await process.output();
    return result.success;
  } catch {
    return false;
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}

async function copyConfigTemplate(): Promise<void> {
  const templatePath = "./config/config.example.json";
  const configPath = "./config/config.json";

  if (await fileExists(configPath)) {
    console.log("⚠️  Configuration file already exists at config/config.json");
    return;
  }

  try {
    const template = await Deno.readTextFile(templatePath);
    await Deno.writeTextFile(configPath, template);
    console.log("✅ Created config/config.json from template");
    console.log(
      "📝 Please edit config/config.json with your Firefly III details",
    );
  } catch (error) {
    console.error("❌ Failed to copy configuration template:", error);
  }
}

async function testConfiguration(): Promise<void> {
  console.log("\n🔍 Testing configuration...");

  try {
    // Import our modules
    const { ConfigManager } = await import("../src/utils/config-manager.ts");
    const { FireflyApiClient } = await import(
      "../src/client/firefly-client.ts"
    );

    const configManager = new ConfigManager();
    const config = await configManager.loadConfig();

    console.log("✅ Configuration loaded successfully");
    console.log(`🔗 API URL: ${config.firefly.baseUrl}`);

    const client = new FireflyApiClient(config);
    const isConnected = await client.testConnection();

    if (isConnected) {
      console.log("✅ API connection successful!");
      console.log("🎉 Setup completed successfully!");
    } else {
      console.log("❌ API connection failed");
      console.log("💡 Please check your URL and API token");
    }
  } catch (error) {
    console.error(
      "❌ Configuration test failed:",
      error instanceof Error ? error.message : error,
    );
  }
}

async function main(): Promise<void> {
  console.log("🔥 Firefly III Tools - Setup\n");

  // Check Deno installation
  console.log("1. Checking Deno installation...");
  const hasDeno = await checkDeno();
  if (!hasDeno) {
    console.error("❌ Deno is not installed or not in PATH");
    console.error("📥 Install Deno from: https://deno.land/install");
    return;
  }
  console.log("✅ Deno is installed");

  // Create configuration
  console.log("\n2. Setting up configuration...");
  await copyConfigTemplate();

  // Check if we need interactive setup
  const hasConfig = await fileExists("./config/config.json");
  if (hasConfig) {
    // Test existing configuration
    await testConfiguration();
  } else {
    console.log("\n❌ Configuration file not found");
    console.log(
      "💡 Please copy config/config.example.json to config/config.json",
    );
    console.log("📝 Then edit it with your Firefly III details");
  }

  console.log("\n📚 Next steps:");
  console.log("1. Edit config/config.json with your API details");
  console.log(
    "2. Run: deno run --allow-read --allow-net --allow-env examples/basic-usage.ts",
  );
  console.log("3. Check out the documentation in docs/");
}

if (import.meta.main) {
  await main();
}
