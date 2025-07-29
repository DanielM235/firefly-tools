# Testing Strategy

## 📋 **Overview**

This project uses a multi-layered testing approach to ensure code quality while
maintaining safety and preventing accidental API calls to production systems.

## 🛡️ **Test Safety Principles**

### **🚨 NEVER Test Against Production**

- **Unit tests** use mock data and configurations
- **Integration tests** are disabled by default and clearly marked
- **Real API calls** are only made intentionally in controlled environments

### **Test Isolation**

- Each test cleans up after itself
- Tests don't depend on external state
- Configuration is mocked to prevent real API access

## 📁 **Test Structure**

```
tests/
├── unit/                    # Unit tests (safe, no external calls)
│   ├── category-types.test.ts      # Type validation tests
│   ├── config-manager.test.ts      # Configuration loading tests
│   └── logger.test.ts              # Logging functionality tests
├── integration/             # Integration tests (real API calls)
│   └── category-api.integration.ts # Real API testing (disabled by default)
└── fixtures/                # Test data and mocks
    └── mock-configs.ts             # Mock configurations
```

## 🧪 **Test Types**

### **Unit Tests**

**Purpose**: Test individual components in isolation **Safety**: ✅ Safe - No
external dependencies **Run**: Automatically in CI/CD

```bash
# Run all safe unit tests
deno test --allow-read --allow-env --allow-write

# Run specific test file
deno test tests/config-manager.test.ts --allow-read --allow-env --allow-write
```

**Examples:**

- Type interface validation
- Configuration loading with mock data
- Logger formatting and level handling
- Input validation without network calls

### **Integration Tests**

**Purpose**: Test real API interactions **Safety**: ⚠️ **DANGEROUS** - Makes
real API calls **Run**: Manual only, against test instances

```bash
# Enable integration test (edit file first)
# 1. Remove 'SKIP_' from test name in the file
# 2. Configure test environment
# 3. Run manually:
deno test tests/integration/category-api.integration.ts --allow-read --allow-env --allow-net
```

**Requirements:**

- Dedicated test Firefly III instance
- Test configuration separate from production
- Manual cleanup of test data

## 🔧 **Test Configuration**

### **Mock Configuration**

Used in unit tests to prevent real API calls:

```typescript
const mockConfig: AppConfig = {
  firefly: {
    baseUrl: "https://mock-firefly.test",
    apiToken: "mock-token-for-testing",
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  logging: {
    level: "error", // Suppress logs during tests
    logToFile: false,
    logFile: "test.log",
  },
  cache: {
    enabled: false,
    ttl: 300000,
  },
};
```

### **Test Environment Isolation**

```typescript
// Example: Config manager test isolation
Deno.test("ConfigManager - should validate required configuration", async () => {
  // Clear environment variables
  Deno.env.delete("FIREFLY_BASE_URL");
  Deno.env.delete("FIREFLY_API_TOKEN");

  // Temporarily move real config file
  const configPath = "./config/config.json";
  const tempConfigPath = "./config/config.json.bak";
  // ... isolation logic

  try {
    // Test with no configuration available
    await assertRejects(() => configManager.loadConfig());
  } finally {
    // Always restore original state
    // ... cleanup logic
  }
});
```

## 🚀 **Running Tests**

### **Safe Test Suite (Default)**

Runs all unit tests without external dependencies:

```bash
# All safe tests
deno test --allow-read --allow-env --allow-write

# Specific test categories
deno test tests/config-manager.test.ts --allow-read --allow-env --allow-write
deno test tests/logger.test.ts --allow-read --allow-env
deno test tests/category-types.test.ts --allow-read --allow-env
```

### **Integration Tests (Manual)**

**⚠️ WARNING: Only run against test instances!**

1. **Set up test environment**:
   ```bash
   # Create test config
   cp config/config.example.json config/test-config.json
   # Edit with test instance details
   ```

2. **Enable integration test**:
   ```typescript
   // In tests/integration/category-api.integration.ts
   // Change: "SKIP_INTEGRATION: ..."
   // To:     "INTEGRATION: ..."
   ```

3. **Run integration tests**:
   ```bash
   deno test tests/integration/ --allow-read --allow-env --allow-net
   ```

## 📊 **Test Coverage Goals**

### **Unit Test Coverage**

- ✅ **Types and Interfaces** - 100% coverage
- ✅ **Configuration Loading** - All paths tested
- ✅ **Logger Functionality** - All levels and formats
- ✅ **Input Validation** - All validation rules
- ⏳ **API Client Structure** - Method signatures and error handling

### **Integration Test Coverage**

- ⏳ **Category Creation** - Real API category creation
- ⏳ **Error Handling** - Real API error responses
- ⏳ **Authentication** - Token validation
- ⏳ **Rate Limiting** - API throttling behavior

## 🔍 **Test Quality Checklist**

### **Before Adding Tests**

- [ ] No hardcoded production URLs or tokens
- [ ] Mock configurations used for unit tests
- [ ] Integration tests clearly marked and disabled
- [ ] Test cleanup removes temporary files/data
- [ ] Tests are isolated and don't depend on order

### **Test Review Checklist**

- [ ] No `--allow-net` in unit test commands
- [ ] Mock data used instead of real API calls
- [ ] Environment variables cleared in tests
- [ ] Config files temporarily moved during validation tests
- [ ] Integration tests have clear warnings and instructions

## 🚨 **Security Considerations**

### **API Token Safety**

- Never commit real API tokens to tests
- Use "mock-token-for-testing" in unit tests
- Keep integration test tokens in git-ignored files

### **Production Protection**

- Unit tests must not make network calls
- Integration tests are disabled by default
- Clear warnings on all dangerous operations

### **Error Handling**

- Network failures in tests should be expected
- Mock errors to test error handling paths
- Don't expose sensitive data in test failures

## 📝 **Adding New Tests**

### **Unit Test Template**

```typescript
import { assertEquals } from "../src/deps.ts";

Deno.test("Component - functionality description", () => {
  // Arrange: Set up test data
  const testData = {/* mock data */};

  // Act: Execute the functionality
  const result = functionUnderTest(testData);

  // Assert: Verify the result
  assertEquals(result.property, expectedValue);

  console.log("✅ Test description passed");
});
```

### **Integration Test Template**

```typescript
// 🚨 INTEGRATION TEST - MAKES REAL API CALLS 🚨
Deno.test("SKIP_INTEGRATION: Component - real API test", async () => {
  console.log("⚠️ WARNING: This test makes real API calls!");

  // Test setup with real configuration
  // Actual API interaction
  // Verification of real results

  console.log("⚠️ Remember to clean up test data!");
});
```

## 🔄 **Continuous Integration**

### **CI/CD Pipeline**

```bash
# Only run safe tests in CI
deno test --allow-read --allow-env --allow-write

# Never run integration tests automatically
# Integration tests require manual setup and cleanup
```

### **Pre-commit Hooks**

- Run unit tests before commits
- Lint all test files
- Validate no production tokens in code
- Ensure integration tests are disabled

This testing strategy ensures code quality while protecting production systems
from accidental test data or API abuse.
