# API Reference

## ConfigManager

Manages application configuration from files and environment variables.

### Methods

#### `loadConfig(): Promise<AppConfig>`
Load configuration with environment variable overrides.

**Returns**: Promise resolving to the application configuration

**Throws**: Error if required configuration is missing or invalid

**Example**:
```typescript
const configManager = new ConfigManager();
const config = await configManager.loadConfig();
```

#### `getConfig(): AppConfig | null`
Get the currently loaded configuration.

**Returns**: Current configuration or null if not loaded

#### `clearConfig(): void`
Clear cached configuration (mainly for testing).

---

## FireflyApiClient

Professional client for the Firefly III API.

### Constructor

```typescript
new FireflyApiClient(config: AppConfig)
```

### Methods

#### `testConnection(): Promise<boolean>`
Test API connection and authentication.

**Returns**: Promise resolving to true if connection successful

#### `getUser(): Promise<unknown>`
Get current user information.

**Returns**: Promise resolving to user data

#### `getAccounts(type?: string): Promise<ApiResponse<Account[]>>`
Get all accounts, optionally filtered by type.

**Parameters**:
- `type` (optional): Account type filter (e.g., 'asset', 'expense')

**Returns**: Promise resolving to paginated account list

#### `getAccount(id: string): Promise<ApiResponse<Account>>`
Get specific account by ID.

**Parameters**:
- `id`: Account ID

**Returns**: Promise resolving to account details

#### `getTransactions(params?: Record<string, string | number>): Promise<ApiResponse<Transaction[]>>`
Get transactions with optional filtering.

**Parameters**:
- `params` (optional): Query parameters for filtering
  - `limit`: Number of transactions to return
  - `page`: Page number for pagination
  - `start`: Start date (YYYY-MM-DD)
  - `end`: End date (YYYY-MM-DD)
  - `type`: Transaction type

**Returns**: Promise resolving to paginated transaction list

#### `getTransaction(id: string): Promise<ApiResponse<Transaction>>`
Get specific transaction by ID.

**Parameters**:
- `id`: Transaction ID

**Returns**: Promise resolving to transaction details

#### `getBudgets(): Promise<ApiResponse<Budget[]>>`
Get all budgets.

**Returns**: Promise resolving to budget list

#### `getBudget(id: string): Promise<ApiResponse<Budget>>`
Get specific budget by ID.

**Parameters**:
- `id`: Budget ID

**Returns**: Promise resolving to budget details

#### `getCategories(): Promise<ApiResponse<Category[]>>`
Get all categories.

**Returns**: Promise resolving to category list

#### `getCategory(id: string): Promise<ApiResponse<Category>>`
Get specific category by ID.

**Parameters**:
- `id`: Category ID

**Returns**: Promise resolving to category details

#### `getStats(): { requestCount: number; lastRequestTime: number }`
Get client usage statistics.

**Returns**: Object with request count and last request timestamp

---

## Error Handling

### FireflyApiError

Extended Error class for API-specific errors.

**Properties**:
- `status: number` - HTTP status code
- `response?: ApiErrorResponse` - API error response details

**Example**:
```typescript
try {
  await client.getAccount('invalid-id');
} catch (error) {
  if (error instanceof FireflyApiError) {
    console.error(`API Error ${error.status}: ${error.message}`);
    if (error.response) {
      console.error('Details:', error.response);
    }
  }
}
```

---

## Configuration

### AppConfig

Main configuration interface.

```typescript
interface AppConfig {
  firefly: FireflyConfig;
  logging: LoggingConfig;
  cache: CacheConfig;
}
```

### FireflyConfig

Firefly III API configuration.

```typescript
interface FireflyConfig {
  baseUrl: string;        // API base URL
  apiToken: string;       // Personal access token
  timeout: number;        // Request timeout (ms)
  retryAttempts: number;  // Number of retry attempts
  retryDelay: number;     // Base retry delay (ms)
}
```

### LoggingConfig

Logging configuration.

```typescript
interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  logToFile: boolean;
  logFile: string;
}
```

### CacheConfig

Cache configuration.

```typescript
interface CacheConfig {
  enabled: boolean;
  ttl: number;  // Time to live (ms)
}
```

---

## Types

### Account

```typescript
interface Account {
  type: string;
  id: string;
  attributes: {
    name: string;
    type: string;
    current_balance: string;
    currency_code: string;
    // ... more properties
  };
}
```

### Transaction

```typescript
interface Transaction {
  type: string;
  id: string;
  attributes: {
    transactions: TransactionSplit[];
    // ... more properties
  };
}
```

### ApiResponse<T>

Standard API response wrapper.

```typescript
interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
  links?: {
    self: string;
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}
```

---

## Environment Variables

All configuration can be set via environment variables:

- `FIREFLY_BASE_URL` - Firefly III base URL
- `FIREFLY_API_TOKEN` - Personal access token
- `FIREFLY_TIMEOUT` - Request timeout in milliseconds
- `FIREFLY_RETRY_ATTEMPTS` - Number of retry attempts
- `FIREFLY_RETRY_DELAY` - Base retry delay in milliseconds
- `LOG_LEVEL` - Logging level (debug, info, warn, error)
- `LOG_TO_FILE` - Enable file logging (true/false)
- `LOG_FILE` - Log file path
- `CACHE_ENABLED` - Enable caching (true/false)
- `CACHE_TTL` - Cache TTL in milliseconds
