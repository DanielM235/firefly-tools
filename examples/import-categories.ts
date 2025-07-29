#!/usr/bin/env -S deno run --allow-read --allow-env --allow-net

/**
 * Example usage of the category importer tool
 */

console.log("🏷️  Firefly III Category Importer");
console.log("==================================");
console.log();
console.log(
  "This tool will import categories from JSON files into your Firefly III instance.",
);
console.log();
console.log("📁 Available category files:");
console.log("  • categories-pt-br.json - Portuguese categories (BR)");
console.log();
console.log("🔗 Usage:");
console.log(
  "  deno run --allow-read --allow-env --allow-net src/tools/category-importer.ts",
);
console.log();
console.log("⚠️  Make sure your configuration is set up correctly:");
console.log("  • config/config.json with your Firefly III API details");
console.log(
  "  • Or environment variables: FIREFLY_BASE_URL, FIREFLY_API_TOKEN",
);
console.log();

// Import and run the main tool
import "./category-importer.ts";
