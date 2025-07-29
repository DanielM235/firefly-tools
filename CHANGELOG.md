# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2025-07-28

### Added

- Initial project setup with Deno 2.x
- Professional Firefly III API client with type safety
- Secure configuration management system
- Support for Firefly III v6.x (API v1)
- Comprehensive error handling with custom error types
- Automatic retry logic with exponential backoff
- Rate limiting to respect API constraints
- Environment variable and config file support
- Git-ignored configuration for security
- Complete TypeScript type definitions for Firefly III API
- Professional development tooling (formatting, linting, testing)
- Comprehensive documentation and examples
- GitHub Copilot instructions for development guidelines
- Version tracking and compatibility information
- User-Agent header with version information

### Project Structure

- `src/client/` - API client implementations
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions including configuration management
- `config/` - Secure configuration directory (git-ignored)
- `examples/` - Usage examples and demonstrations
- `tests/` - Comprehensive test suite
- `docs/` - Development guides and API documentation
- `scripts/` - Setup and utility scripts

### Documentation

- README.md with setup instructions and compatibility matrix
- Development guide with Deno best practices
- Complete API reference documentation
- Project summary with architecture overview
- GitHub Copilot development instructions

### Security Features

- No hardcoded secrets in source code
- Git-ignored configuration files
- Environment variable support for production
- HTTPS-only API communications
- Token validation and secure handling
- API tokens never exposed in logs or error messages

### Compatibility

- Firefly III v6.x and later
- Deno 2.x runtime
- TypeScript with strict type checking
- Modern ES modules and async/await patterns

[0.0.1]: https://github.com/DanielM235/firefly-tools/releases/tag/v0.0.1
