import { AppConfig } from '../types/config.ts';

/**
 * Configuration manager for the Firefly III tools
 * 
 * This class handles loading configuration from various sources:
 * 1. Configuration file (config/config.json)
 * 2. Environment variables
 * 
 * Environment variables take precedence over configuration file values.
 */
export class ConfigManager {
  private config: AppConfig | null = null;

  /**
   * Load configuration from file and environment variables
   * 
   * @returns Promise<AppConfig> The loaded configuration
   * @throws Error if configuration cannot be loaded or is invalid
   */
  async loadConfig(): Promise<AppConfig> {
    if (this.config) {
      return this.config;
    }

    // Load from configuration file
    let fileConfig: Partial<AppConfig> = {};
    try {
      const configText = await Deno.readTextFile('./config/config.json');
      fileConfig = JSON.parse(configText);
    } catch (error) {
      console.warn('Could not load config/config.json, using environment variables only:', error instanceof Error ? error.message : 'Unknown error');
    }

    // Override with environment variables
    const config: AppConfig = {
      firefly: {
        baseUrl: Deno.env.get('FIREFLY_BASE_URL') || fileConfig.firefly?.baseUrl || '',
        apiToken: Deno.env.get('FIREFLY_API_TOKEN') || fileConfig.firefly?.apiToken || '',
        timeout: parseInt(Deno.env.get('FIREFLY_TIMEOUT') || '30000') || fileConfig.firefly?.timeout || 30000,
        retryAttempts: parseInt(Deno.env.get('FIREFLY_RETRY_ATTEMPTS') || '3') || fileConfig.firefly?.retryAttempts || 3,
        retryDelay: parseInt(Deno.env.get('FIREFLY_RETRY_DELAY') || '1000') || fileConfig.firefly?.retryDelay || 1000,
      },
      logging: {
        level: (Deno.env.get('LOG_LEVEL') as any) || fileConfig.logging?.level || 'info',
        logToFile: Deno.env.get('LOG_TO_FILE') === 'true' || fileConfig.logging?.logToFile || false,
        logFile: Deno.env.get('LOG_FILE') || fileConfig.logging?.logFile || 'firefly-tools.log',
      },
      cache: {
        enabled: Deno.env.get('CACHE_ENABLED') !== 'false' && (fileConfig.cache?.enabled !== false),
        ttl: parseInt(Deno.env.get('CACHE_TTL') || '300000') || fileConfig.cache?.ttl || 300000,
      },
    };

    // Validate required configuration
    this.validateConfig(config);

    this.config = config;
    return config;
  }

  /**
   * Validate that all required configuration values are present
   * 
   * @param config The configuration to validate
   * @throws Error if required configuration is missing
   */
  private validateConfig(config: AppConfig): void {
    if (!config.firefly.baseUrl) {
      throw new Error('Firefly III base URL is required (set FIREFLY_BASE_URL or configure in config.json)');
    }

    if (!config.firefly.apiToken) {
      throw new Error('Firefly III API token is required (set FIREFLY_API_TOKEN or configure in config.json)');
    }

    // Validate URL format
    try {
      new URL(config.firefly.baseUrl);
    } catch {
      throw new Error('Invalid Firefly III base URL format');
    }

    // Validate token format (basic check)
    if (config.firefly.apiToken.length < 10) {
      throw new Error('Firefly III API token appears to be invalid (too short)');
    }
  }

  /**
   * Get the current configuration
   * 
   * @returns AppConfig | null The current configuration or null if not loaded
   */
  getConfig(): AppConfig | null {
    return this.config;
  }

  /**
   * Clear the cached configuration (for testing purposes)
   */
  clearConfig(): void {
    this.config = null;
  }
}
