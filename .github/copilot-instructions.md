# GitHub Copilot Instructions for Firefly III Tools

## Project Context

This repository contains professional tools for interacting with the Firefly III API (v6.x) using Deno. The project emphasizes security, type safety, and maintainability.

## Development Rules & Guidelines

### Language & Code Standards
- **Language**: All code, comments, documentation, and variable names must be in English
- **TypeScript**: Use TypeScript with strict type checking enabled
- **Code Style**: Follow Deno's built-in formatting and linting standards
- **Dependencies**: Always use the latest stable versions of dependencies
- **Readability**: Prioritize code readability and maintainability over performance optimizations

### Deno-Specific Guidelines
- **Permissions**: Always use explicit permission flags (`--allow-read`, `--allow-net`, `--allow-env`)
- **Imports**: Use ES modules with URL imports for external dependencies
- **Standard Library**: Prefer Deno's standard library over third-party packages when possible
- **Built-in Tools**: Use `deno fmt`, `deno lint`, and `deno test` for code quality

### Security Requirements
- **No Hardcoded Secrets**: Never include API tokens, passwords, or sensitive data in source code
- **Configuration**: Use git-ignored config files or environment variables for sensitive data
- **API Communications**: Always use HTTPS for API calls
- **Token Handling**: API tokens should never appear in logs or error messages

### Project Structure
```
src/
├── client/          # API client implementations
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── main.ts         # Main entry point

config/              # Configuration files (git-ignored)
examples/            # Usage examples
tests/               # Test files
docs/                # Documentation
```

### API Client Patterns
- **Error Handling**: Use custom error classes extending Error
- **Retry Logic**: Implement exponential backoff for network failures
- **Rate Limiting**: Respect API rate limits with proper delays
- **Type Safety**: Provide full TypeScript interfaces for all API responses

### Firefly III API Compatibility
- **Target Version**: Firefly III API v6.x (latest stable)
- **Base URL Format**: `https://your-firefly-instance.com/api/v1/`
- **Authentication**: Bearer token authentication
- **Response Format**: JSON API specification compliant

### Testing Guidelines
- **Test Coverage**: Write tests for all public APIs and critical functionality
- **Test Files**: Place tests in `tests/` directory with `.test.ts` extension
- **Assertions**: Use Deno's standard assertion library
- **Mocking**: Mock external API calls in tests

### Documentation Standards
- **JSDoc**: Use JSDoc comments for all public functions and classes
- **README**: Keep README.md updated with current setup instructions
- **API Docs**: Maintain comprehensive API documentation
- **Examples**: Provide working examples for all major features

### Configuration Management
- **Config Files**: Use JSON configuration files in `config/` directory
- **Environment Variables**: Support environment variable overrides
- **Validation**: Validate all configuration values with helpful error messages
- **Templates**: Provide example configuration templates

### Common Patterns to Follow

#### Configuration Loading
```typescript
const configManager = new ConfigManager();
const config = await configManager.loadConfig();
```

#### API Client Usage
```typescript
const client = new FireflyApiClient(config);
const accounts = await client.getAccounts();
```

#### Error Handling
```typescript
try {
  await client.getAccount(id);
} catch (error) {
  if (error instanceof FireflyApiError) {
    console.error(`API Error ${error.status}: ${error.message}`);
  }
}
```

### What NOT to Do
- ❌ Don't use Node.js-specific APIs or patterns
- ❌ Don't include package.json or node_modules
- ❌ Don't hardcode URLs, tokens, or sensitive data
- ❌ Don't use CommonJS require/module.exports
- ❌ Don't ignore TypeScript errors
- ❌ Don't skip input validation
- ❌ Don't forget to handle errors appropriately

### File Organization
- **Exports**: Use named exports, avoid default exports
- **Imports**: Group imports: standard library, external, local
- **Structure**: Keep files focused on single responsibility
- **Naming**: Use descriptive, English names for all identifiers

### When Adding New Features
1. Create appropriate TypeScript interfaces in `src/types/`
2. Implement functionality with proper error handling
3. Add comprehensive tests
4. Update documentation and examples
5. Ensure all code is in English with clear comments

### Performance Considerations
- **Rate Limiting**: Implement appropriate delays between API calls
- **Caching**: Use caching for frequently accessed data when appropriate
- **Memory**: Be mindful of memory usage with large datasets
- **Timeouts**: Set reasonable timeouts for network requests

### Maintenance
- **Dependencies**: Regularly update dependencies to latest stable versions
- **Documentation**: Keep all documentation current with code changes
- **Tests**: Maintain test coverage as codebase evolves
- **Examples**: Update examples when APIs change
