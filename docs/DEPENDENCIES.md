# Dependency Management

## 📋 **Overview**

This project uses a centralized dependency management approach to ensure version
consistency and easy maintenance of external dependencies.

## 🏗️ **Architecture**

### Centralized Dependencies (`src/deps.ts`)

All external dependencies are re-exported through `src/deps.ts`. This provides:

- **Single source of truth** for external package versions
- **Easy version updates** - change version in one place
- **Consistent imports** across the entire codebase
- **Type safety** with proper TypeScript support

### Import Maps (`deno.json`)

The `deno.json` file defines import maps for:

- Standard library modules (`@std/*`)
- Local dependency file (`@/deps`)
- Future external packages

## 📦 **Current Dependencies**

### Deno Standard Library (v0.208.0)

- **@std/assert** - Testing assertions
- **@std/fs** - File system utilities
- **@std/path** - Path manipulation
- **@std/async** - Async utilities
- **@std/log** - Logging (reserved for future use)

## 🔧 **Usage Examples**

### In Tests:

```typescript
import { assertEquals, assertRejects } from "../src/deps.ts";
```

### In Source Code:

```typescript
import { ensureDir, exists } from "../deps.ts";
```

### With Import Maps:

```typescript
import { assertEquals } from "@std/assert"; // Alternative approach
```

## 📝 **Adding New Dependencies**

### External Packages:

1. Add to `src/deps.ts`:

```typescript
export { someFunction } from "https://deno.land/x/package@version/mod.ts";
```

2. Update `deno.json` imports if using import maps:

```json
{
  "imports": {
    "@package": "https://deno.land/x/package@version/mod.ts"
  }
}
```

### Standard Library Updates:

1. Update version in `src/deps.ts`
2. Update corresponding entries in `deno.json`

## 🎯 **Benefits**

### Version Consistency

- All modules use the same standard library version
- No version conflicts between different parts of the application
- Easy to audit and update dependencies

### Maintenance

- Single file to update when upgrading dependencies
- Clear visibility of all external dependencies
- Simplified dependency management

### Developer Experience

- Consistent import patterns across the codebase
- Type safety for external dependencies
- Clear dependency boundaries

## 🔍 **Current Implementation**

The project currently uses:

- **Deno Standard Library v0.208.0** for all standard modules
- **Centralized re-exports** through `src/deps.ts`
- **Import maps** for alternative import syntax
- **TypeScript support** with proper type definitions

## 🚀 **Future Considerations**

- Consider using `deno.lock` for dependency locking in production
- Evaluate `deps.ts` vs import maps based on project growth
- Monitor Deno ecosystem for new dependency management features
- Consider automated dependency updates with proper testing
