#!/usr/bin/env -S deno run --allow-read --allow-env --allow-net

/**
 * Category Importer Tool for Firefly III
 *
 * This tool imports categories from JSON files in the data/categories directory
 * into a Firefly III instance via the API.
 */

import { ConfigManager } from "../utils/config-manager.ts";
import { FireflyApiClient } from "../client/firefly-client.ts";
import { getLogger } from "../utils/logger.ts";
import { CategoryLocalData } from "../types/firefly-api.ts";
import { exists } from "../deps.ts";

interface CategoryFile {
  path: string;
  name: string;
}

/**
 * Scan the data/categories directory for JSON files
 */
async function scanCategoryFiles(): Promise<CategoryFile[]> {
  const categoriesDir = "./data/categories";
  const files: CategoryFile[] = [];

  if (!await exists(categoriesDir)) {
    throw new Error("Categories directory not found: ./data/categories");
  }

  // For now, we'll check for known files
  // In a full implementation, you'd use fs.walk or similar
  const knownFiles = [
    "categories-pt-br.json",
    "categories-en.json", 
    "categories-fr.json",
    "categories-es.json"
  ];

  for (const fileName of knownFiles) {
    const filePath = `${categoriesDir}/${fileName}`;
    if (await exists(filePath)) {
      files.push({
        path: filePath,
        name: fileName.replace(".json", ""),
      });
    }
  }

  return files;
}

/**
 * Load categories from a JSON file
 */
async function loadCategoriesFromFile(filePath: string): Promise<CategoryLocalData[]> {
  try {
    const content = await Deno.readTextFile(filePath);
    const categories = JSON.parse(content);

    if (!Array.isArray(categories)) {
      throw new Error("Categories file must contain an array");
    }

    // Validate each category
    for (const category of categories) {
      if (!category.name || typeof category.name !== "string") {
        throw new Error("Each category must have a 'name' field");
      }
    }

    return categories;
  } catch (error) {
    throw new Error(`Failed to load categories from ${filePath}: ${error.message}`);
  }
}

/**
 * Prompt user to select a category file
 */
async function selectCategoryFile(files: CategoryFile[]): Promise<CategoryFile> {
  const logger = getLogger();

  if (files.length === 0) {
    throw new Error("No category files found in ./data/categories");
  }

  if (files.length === 1) {
    logger.info(`📁 Using only available file: ${files[0].name}`);
    return files[0];
  }

  logger.debug("\n📁 Available category files:");
  files.forEach((file, index) => {
    logger.debug(`  ${index + 1}. ${file.name}`);
  });

  logger.debug("\nPlease select a file by entering its number:");
  
  // For now, we'll use the first file as default
  // In a real implementation, you'd use Deno's stdin to get user input
  logger.warn("⚠️  Using first file as default (interactive selection not yet implemented)");
  return await Promise.resolve(files[0]);
}

/**
 * Import categories to Firefly III
 */
async function importCategories(
  client: FireflyApiClient,
  categories: CategoryLocalData[]
): Promise<void> {
  const logger = getLogger();
  let created = 0;
  let errors = 0;

  logger.info(`🚀 Starting import of ${categories.length} categories...`);

  for (const category of categories) {
    try {
      logger.info(`📝 Creating: ${category.name}`);
      
      await client.createCategory({
        name: category.name,
        notes: category.notes,
      });
      
      created++;
      logger.debug(`✅ Created: ${category.name}`);
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      errors++;
      logger.error(`❌ Failed to create ${category.name}: ${error.message}`);
    }
  }

  logger.info(`\n📊 Import Summary:`);
  logger.info(`  ✅ Created: ${created}`);
  logger.info(`  ❌ Errors: ${errors}`);
  logger.info(`  📋 Total: ${categories.length}`);

  if (errors > 0) {
    logger.warn("⚠️  Some categories could not be created. Check the logs above for details.");
  } else {
    logger.info("🎉 All categories imported successfully!");
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const logger = getLogger();
  
  try {
    logger.info("🏷️  Firefly III Category Importer");
    logger.info("=================================\n");

    // Load configuration
    logger.info("🔧 Loading configuration...");
    const configManager = new ConfigManager();
    const config = await configManager.loadConfig();
    logger.info("✅ Configuration loaded");

    // Initialize API client
    logger.info("🔗 Connecting to Firefly III API...");
    const client = new FireflyApiClient(config);
    
    // Test connection
    const isConnected = await client.testConnection();
    if (!isConnected) {
      throw new Error("Failed to connect to Firefly III API");
    }
    logger.info("✅ API connection successful");

    // Scan for category files
    logger.info("📁 Scanning for category files...");
    const files = await scanCategoryFiles();
    logger.info(`📁 Found ${files.length} category file(s)`);

    // Select file
    const selectedFile = await selectCategoryFile(files);
    logger.info(`📂 Selected file: ${selectedFile.name}`);

    // Load categories
    logger.info("📋 Loading categories from file...");
    const categories = await loadCategoriesFromFile(selectedFile.path);
    logger.info(`📋 Loaded ${categories.length} categories`);

    // Confirm import
    logger.info(`\n⚠️  About to import ${categories.length} categories to Firefly III`);
    logger.info("   This will create new categories in your Firefly III instance.");
    logger.info("   Continue? (This tool will proceed automatically for now)\n");

    // Import categories
    await importCategories(client, categories);

  } catch (error) {
    logger.error(`💥 Error: ${error.message}`);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
