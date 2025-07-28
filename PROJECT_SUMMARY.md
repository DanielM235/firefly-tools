# Firefly III Tools - Project Summary

**Version**: 0.0.1  
**Compatible with**: Firefly III v6.x (API v1)  
**Built with**: Deno 2.x

## 🎯 Project Overview

This repository provides a comprehensive set of tools for interacting with the Firefly III API using Deno. The project emphasizes security, type safety, and maintainability.

## ✨ Key Features

### � **Compatibility & Version Information**
- **Firefly III v6.x** - Designed for the latest stable version
- **API v1** - Uses the standard Firefly III API endpoints
- **Deno 2.x** - Built with modern Deno runtime
- **TypeScript** - Full type safety and modern development experience

### �🔐 Secure Configuration Management
- **Git-ignored configuration files** - No secrets in the repository
- **Environment variable support** - Production-ready deployment
- **Validation and error handling** - Clear error messages for misconfigurations

### 🚀 Professional API Client
- **Type-safe TypeScript interface** - Full API type definitions
- **Automatic retry logic** - Handles network issues gracefully
- **Rate limiting** - Respects API limits
- **Comprehensive error handling** - Detailed error information
- **Request/response logging** - Debug capabilities

### 🛠️ Developer Experience
- **Built-in development tools** - Formatting, linting, testing
- **Clear project structure** - Easy to navigate and extend
- **Comprehensive documentation** - API reference and guides
- **Example scripts** - Learn by doing

## 📁 Project Structure

```
firefly-tools/
├── src/
│   ├── client/firefly-client.ts     # Professional API client
│   ├── types/                       # TypeScript definitions
│   ├── utils/config-manager.ts      # Secure configuration
│   └── main.ts                      # Main entry point
├── config/
│   ├── config.example.json          # Configuration template
│   └── config.json                  # Your config (git-ignored)
├── examples/basic-usage.ts          # Usage examples
├── tests/                           # Unit tests
├── docs/                            # Documentation
└── scripts/setup.ts                 # Setup helper
```

## 🔧 Quick Start

1. **Install Deno** (if needed):
   ```bash
   curl -fsSL https://deno.land/install.sh | sh
   ```

2. **Setup configuration**:
   ```bash
   cp config/config.example.json config/config.json
   # Edit config.json with your Firefly III details
   ```

3. **Test the setup**:
   ```bash
   deno task example
   ```

## 🎮 Available Commands

```bash
deno task setup      # Interactive setup
deno task example    # Run basic example
deno task dev        # Development with watch mode
deno task test       # Run tests
deno task fmt        # Format code
deno task lint       # Lint code
```

## 📚 Documentation

- **[README.md](README.md)** - Main project documentation
- **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Development guide
- **[docs/API.md](docs/API.md)** - API reference
- **[examples/](examples/)** - Usage examples

## 🔒 Security Features

- **No hardcoded secrets** - All sensitive data externalized
- **Git-ignored configuration** - Prevents accidental commits
- **HTTPS only** - All API communications secured
- **Token masking** - API tokens never appear in logs

## 🏗️ Architecture Highlights

### Configuration Management
```typescript
// Supports both file and environment variable configuration
const configManager = new ConfigManager();
const config = await configManager.loadConfig();
```

### API Client
```typescript
// Type-safe, professional API client
const client = new FireflyApiClient(config);
const accounts = await client.getAccounts();
```

### Error Handling
```typescript
// Comprehensive error handling
try {
  await client.getAccount('invalid-id');
} catch (error) {
  if (error instanceof FireflyApiError) {
    console.error(`API Error ${error.status}: ${error.message}`);
  }
}
```

## 🎓 Deno Learning Points

This project demonstrates Deno's key features:

1. **Security Model**: Explicit permissions (`--allow-net`, `--allow-read`)
2. **Built-in TypeScript**: No compilation step needed
3. **ES Modules**: Modern import/export syntax
4. **Standard Library**: Rich built-in functionality
5. **Built-in Tools**: Formatter, linter, test runner

## 🚀 Next Steps

1. **Basic Usage**: Run the example script to familiarize yourself
2. **Read Documentation**: Check out the development guide
3. **Extend Functionality**: Add new tools using the existing patterns
4. **Contribute**: Follow the development rules and submit PRs

## 📋 Development Rules Summary

- ✅ **English only** - All code and comments in English
- ✅ **Latest versions** - Use the most recent stable dependencies
- ✅ **Readability first** - Prioritize clear, maintainable code
- ✅ **Type safety** - Leverage TypeScript fully
- ✅ **Security conscious** - No secrets in code
- ✅ **Well tested** - Comprehensive test coverage
- ✅ **Well documented** - Clear documentation for all APIs

## 🎉 Success Criteria

You'll know the setup is working when:
- ✅ Configuration loads without errors
- ✅ API connection test passes
- ✅ Example script runs successfully
- ✅ You can fetch accounts and transactions
- ✅ All tests pass

Happy coding! 🔥
