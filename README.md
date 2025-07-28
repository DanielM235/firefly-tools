# Firefly III Tools

**Version**: 0.0.1  
**Compatible with**: Firefly III v6.x (API v1)  
**Built with**: Deno 2.x

A collection of tools built with Deno to enhance workflow with the Firefly III API.

## Overview

This repository contains utilities for interacting with the [Firefly III API](https://api-docs.firefly-iii.org/) to automate and enhance personal finance management workflows. All tools are built using Deno, a modern runtime for JavaScript and TypeScript.

## About Deno

**Deno is different from Node.js in several key ways:**

- **Security First**: Deno runs with no file, network, or environment access by default. You must explicitly grant permissions.
- **Built-in TypeScript**: No need for separate compilation steps - TypeScript works out of the box.
- **Standard Library**: Comprehensive standard library that reduces dependency on third-party packages.
- **ES Modules**: Uses modern ES module syntax (`import`/`export`) instead of CommonJS.
- **No package.json**: Dependencies are imported directly via URLs.
- **Built-in Tools**: Includes formatter, linter, test runner, and bundler.

## Prerequisites

- [Deno](https://deno.land/) 2.x or later
- A running Firefly III instance (v6.x or later) with API access
- Personal Access Token from your Firefly III instance

## Compatibility

| Firefly III Tools | Firefly III Version | API Version | Deno Version |
|-------------------|---------------------|-------------|--------------|
| 0.0.1             | 6.x                 | v1          | 2.x          |

**Important**: This project is designed for Firefly III v6.x and later. Earlier versions may not be fully compatible due to API changes and security improvements.

## Installation & Setup

1. **Install Deno** (if not already installed):
   ```bash
   curl -fsSL https://deno.land/install.sh | sh
   ```

2. **Clone this repository**:
   ```bash
   git clone <repository-url>
   cd firefly-tools
   ```

3. **Configure your environment** (see Configuration section below)

## Configuration

### Secure Configuration Management

This project uses a secure configuration system that keeps sensitive data out of the repository:

1. **Copy the example configuration**:
   ```bash
   cp config/config.example.json config/config.json
   ```

2. **Edit your configuration**:
   ```bash
   # Use your preferred editor
   nano config/config.json
   ```

3. **Set your Firefly III details**:
   ```json
   {
     "firefly": {
       "baseUrl": "https://your-firefly-instance.com",
       "apiToken": "your-personal-access-token"
     }
   }
   ```

**Important**: The `config/config.json` file is git-ignored to prevent accidental exposure of sensitive data.

### Environment Variables (Alternative)

You can also use environment variables:

```bash
export FIREFLY_BASE_URL="https://your-firefly-instance.com"
export FIREFLY_API_TOKEN="your-personal-access-token"
```

## Development

### Project Structure

```
firefly-tools/
├── src/
│   ├── client/          # Firefly III API client
│   ├── utils/           # Utility functions
│   └── tools/           # Specific tools and utilities
├── config/              # Configuration files
├── tests/               # Test files
├── scripts/             # Build and deployment scripts
└── docs/                # Additional documentation
```

### Deno Development Tools

This project uses Deno's built-in development tools:

- **Formatter**: `deno fmt` - Automatically formats code
- **Linter**: `deno lint` - Identifies code issues
- **Type Checker**: `deno check` - TypeScript type checking
- **Test Runner**: `deno test` - Runs tests
- **Documentation**: `deno doc` - Generates documentation

### Development Commands

```bash
# Format code
deno fmt

# Lint code
deno lint

# Type check
deno check src/main.ts

# Run tests
deno test

# Run with file permissions (if needed)
deno run --allow-read --allow-net src/main.ts
```

## Features

### Firefly III API Client

A robust, type-safe client for the Firefly III API that handles:

- **Authentication**: Secure token-based authentication
- **Error Handling**: Comprehensive error handling and retries
- **Type Safety**: Full TypeScript support with API response types
- **Rate Limiting**: Built-in rate limiting to respect API limits
- **Configuration**: Flexible configuration management
- **Professional Logging**: Structured logging with configurable levels and file output

## Security Considerations

- **No Secrets in Code**: All sensitive data is handled through configuration files or environment variables
- **Git Ignore**: Configuration files with sensitive data are git-ignored
- **Token Security**: API tokens are never logged or exposed in error messages
- **HTTPS Only**: All API communications use HTTPS

## General Development Rules

1. **Language**: All code and comments must be in English
2. **Dependencies**: Use the latest stable versions of all dependencies
3. **Code Quality**: Prioritize readability and maintainability
4. **Type Safety**: Leverage TypeScript for type safety
5. **Testing**: Write tests for all functionality
6. **Documentation**: Document all public APIs and complex logic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the development rules
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For issues related to:
- **Firefly III API**: Check the [official API documentation](https://api-docs.firefly-iii.org/)
- **Deno**: Check the [Deno documentation](https://deno.land/manual)
- **This project**: Open an issue in this repository
