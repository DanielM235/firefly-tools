# Development Guide

## Quick Start

1. **Setup your environment**:
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd firefly-tools
   
   # Copy configuration template
   cp config/config.example.json config/config.json
   
   # Edit configuration with your Firefly III details
   nano config/config.json
   ```

2. **Run the basic example**:
   ```bash
   deno run --allow-read --allow-net --allow-env examples/basic-usage.ts
   ```

3. **Run tests**:
   ```bash
   deno test --allow-read --allow-net --allow-env
   ```

## Understanding Deno

### Key Differences from Node.js

**Security Model**: 
- Deno runs with no permissions by default
- You must explicitly grant permissions with flags like `--allow-read`, `--allow-net`
- This prevents scripts from accessing files or network without permission

**Module System**:
- Uses ES modules (`import`/`export`) exclusively
- No `package.json` - dependencies are imported via URLs
- Built-in dependency management and caching

**Built-in Tools**:
- Formatter: `deno fmt` (like Prettier)
- Linter: `deno lint` (like ESLint)
- Test runner: `deno test`
- Bundle: `deno bundle`

**TypeScript First**:
- TypeScript works out of the box, no compilation step needed
- Strong type checking built-in

## Project Structure

```
src/
├── client/              # API client implementations
│   └── firefly-client.ts   # Main Firefly III API client
├── types/               # TypeScript type definitions
│   ├── config.ts           # Configuration interfaces
│   └── firefly-api.ts      # Firefly III API types
├── utils/               # Utility functions
│   └── config-manager.ts   # Configuration management
└── main.ts             # Main entry point

config/
├── config.example.json # Configuration template
└── config.json        # Your actual config (git-ignored)

examples/               # Example scripts
├── basic-usage.ts     # Basic API usage example
└── ...                # More examples

tests/                 # Test files
└── *.test.ts         # Unit tests

docs/                 # Additional documentation
└── ...
```

## Common Commands

```bash
# Development with auto-reload
deno task dev

# Run the main application
deno task start

# Format code
deno task fmt

# Lint code
deno task lint

# Type check
deno task check

# Run tests
deno task test
```

## Configuration

### Method 1: Configuration File
```json
{
  "firefly": {
    "baseUrl": "https://your-firefly-instance.com",
    "apiToken": "your-personal-access-token"
  }
}
```

### Method 2: Environment Variables
```bash
export FIREFLY_BASE_URL="https://your-firefly-instance.com"
export FIREFLY_API_TOKEN="your-personal-access-token"
```

## API Client Usage

```typescript
import { ConfigManager } from './src/utils/config-manager.ts';
import { FireflyApiClient } from './src/client/firefly-client.ts';

// Load configuration
const configManager = new ConfigManager();
const config = await configManager.loadConfig();

// Create client
const client = new FireflyApiClient(config);

// Test connection
const isConnected = await client.testConnection();

// Get accounts
const accounts = await client.getAccounts();

// Get transactions
const transactions = await client.getTransactions({ limit: 10 });
```

## Error Handling

The client includes comprehensive error handling:

- **Network errors**: Automatic retries with exponential backoff
- **Rate limiting**: Built-in rate limiting to respect API limits
- **Authentication errors**: Clear error messages for auth issues
- **Validation errors**: Input validation with helpful error messages

## Security Best Practices

1. **Never commit sensitive data**:
   - `config/config.json` is git-ignored
   - Use environment variables in production

2. **Use HTTPS only**:
   - All API communications use HTTPS
   - Validate SSL certificates

3. **Token security**:
   - API tokens are never logged
   - Tokens are not exposed in error messages

## Testing

Write tests for your utilities:

```typescript
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("My test", () => {
  assertEquals(1 + 1, 2);
});
```

Run tests with:
```bash
deno test --allow-read --allow-net --allow-env
```

## Adding New Features

1. **Create the feature**:
   - Add types in `src/types/`
   - Implement logic in appropriate directory
   - Add to the API client if needed

2. **Add tests**:
   - Create test files in `tests/`
   - Test both success and error cases

3. **Update documentation**:
   - Update README.md
   - Add examples if applicable

4. **Follow code style**:
   - Run `deno fmt` before committing
   - Fix any `deno lint` issues

## Debugging

Enable debug logging:
```bash
# Set log level to debug
export LOG_LEVEL=debug
deno run --allow-read --allow-net --allow-env src/main.ts
```

Or in config.json:
```json
{
  "logging": {
    "level": "debug"
  }
}
```

## Deployment

For production deployment:

1. **Use environment variables** for configuration
2. **Set appropriate permissions** in your deployment script
3. **Use `deno compile`** to create a standalone binary if needed:
   ```bash
   deno compile --allow-read --allow-net --allow-env --output firefly-tools src/main.ts
   ```
