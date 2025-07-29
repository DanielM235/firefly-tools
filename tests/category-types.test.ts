import { assertEquals } from "../src/deps.ts";
import { CreateCategoryRequest, CategoryLocalData } from "../src/types/firefly-api.ts";

Deno.test("Category Types - CreateCategoryRequest interface", () => {
  const validCategory: CreateCategoryRequest = {
    name: "Test Category",
    notes: "Test notes"
  };

  assertEquals(typeof validCategory.name, "string");
  assertEquals(typeof validCategory.notes, "string");
  assertEquals(validCategory.name, "Test Category");
  assertEquals(validCategory.notes, "Test notes");

  console.log("✅ CreateCategoryRequest interface test passed");
});

Deno.test("Category Types - CategoryLocalData interface", () => {
  const categoryData: CategoryLocalData = {
    name: "[🏠 Test] Category Name",
    notes: "Category description"
  };

  assertEquals(typeof categoryData.name, "string");
  assertEquals(typeof categoryData.notes, "string");
  assertEquals(categoryData.name.includes("🏠"), true);

  console.log("✅ CategoryLocalData interface test passed");
});

Deno.test("Category Types - optional notes field", () => {
  const categoryWithoutNotes: CreateCategoryRequest = {
    name: "Category Without Notes"
  };

  assertEquals(typeof categoryWithoutNotes.name, "string");
  assertEquals(categoryWithoutNotes.notes, undefined);

  console.log("✅ Optional notes field test passed");
});

Deno.test("Category Types - emoji validation", () => {
  const categoryWithEmoji: CategoryLocalData = {
    name: "[🏠 Despesas Domésticas] Supermercado",
    notes: "Alimentos e produtos domésticos"
  };

  // Test that emoji categories follow the expected pattern
  assertEquals(categoryWithEmoji.name.startsWith("["), true);
  assertEquals(categoryWithEmoji.name.includes("]"), true);
  
  const emojiPart = categoryWithEmoji.name.split("]")[0];
  assertEquals(emojiPart.includes("🏠"), true);

  console.log("✅ Emoji validation test passed");
});
