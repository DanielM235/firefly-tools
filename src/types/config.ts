/**
 * Configuration interface for the Firefly III API client
 */
export interface FireflyConfig {
  baseUrl: string;
  apiToken: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

/**
 * Logging configuration interface
 */
export interface LoggingConfig {
  level: "debug" | "info" | "warn" | "error";
  logToFile: boolean;
  logFile: string;
}

/**
 * Cache configuration interface
 */
export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
}

/**
 * Main application configuration interface
 */
export interface AppConfig {
  firefly: FireflyConfig;
  logging: LoggingConfig;
  cache: CacheConfig;
}
