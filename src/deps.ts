/**
 * Centralized dependencies for Firefly III Tools
 *
 * This file centralizes all external dependencies to ensure version consistency
 * across the entire project. All external imports should go through this file.
 */

// Standard Library Re-exports (version 0.208.0)
export {
  assert,
  assertEquals,
  assertExists,
  assertNotEquals,
  assertRejects,
  assertThrows,
} from "https://deno.land/std@0.208.0/assert/mod.ts";

export {
  ensureDir,
  ensureDirSync,
  exists,
  existsSync,
  move,
  walk,
} from "https://deno.land/std@0.208.0/fs/mod.ts";

export {
  basename,
  dirname,
  extname,
  join,
  resolve,
} from "https://deno.land/std@0.208.0/path/mod.ts";

export { deadline, delay } from "https://deno.land/std@0.208.0/async/mod.ts";

// Version constant for reference
export const STD_VERSION = "0.208.0";

// Future external dependencies can be added here
// export { someFunction } from "https://deno.land/x/some-package@version/mod.ts";
