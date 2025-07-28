import { AppConfig } from '../types/config.ts';
import { USER_AGENT } from '../version.ts';
import { 
  ApiResponse, 
  ApiErrorResponse, 
  Account, 
  Transaction, 
  Budget, 
  Category 
} from '../types/firefly-api.ts';

/**
 * HTTP method types
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Request options for API calls
 */
interface RequestOptions {
  method?: HttpMethod;
  body?: Record<string, unknown>;
  params?: Record<string, string | number>;
}

/**
 * Firefly III API Client Error
 */
export class FireflyApiError extends Error {
  public status: number;
  public response?: ApiErrorResponse;

  constructor(message: string, status: number, response?: ApiErrorResponse) {
    super(message);
    this.name = 'FireflyApiError';
    this.status = status;
    this.response = response;
  }
}

/**
 * Professional Firefly III API Client
 * 
 * This client provides a robust, type-safe interface to the Firefly III API.
 * It includes:
 * - Automatic authentication handling
 * - Rate limiting and retry logic
 * - Comprehensive error handling
 * - TypeScript support
 * - Request/response logging
 */
export class FireflyApiClient {
  private readonly config: AppConfig;
  private readonly baseHeaders: HeadersInit;
  private lastRequestTime = 0;
  private requestCount = 0;

  constructor(config: AppConfig) {
    this.config = config;
    this.baseHeaders = {
      'Authorization': `Bearer ${config.firefly.apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.api+json',
      'User-Agent': USER_AGENT
    };
  }

  /**
   * Make an HTTP request to the Firefly III API
   * 
   * @param endpoint The API endpoint (without base URL)
   * @param options Request options
   * @returns Promise<T> The response data
   */
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, params } = options;
    
    // Rate limiting - ensure we don't exceed reasonable request rates
    await this.handleRateLimit();

    // Build URL with query parameters
    const url = new URL(endpoint, this.config.firefly.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    // Prepare request configuration
    const requestConfig: RequestInit = {
      method,
      headers: this.baseHeaders,
      signal: AbortSignal.timeout(this.config.firefly.timeout),
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestConfig.body = JSON.stringify(body);
    }

    // Execute request with retry logic
    return await this.executeWithRetry(url.toString(), requestConfig);
  }

  /**
   * Execute a request with retry logic
   * 
   * @param url The full URL to request
   * @param config The fetch configuration
   * @returns Promise<T> The response data
   */
  private async executeWithRetry<T>(url: string, config: RequestInit): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.firefly.retryAttempts; attempt++) {
      try {
        this.logRequest(url, config);

        const response = await fetch(url, config);
        this.requestCount++;

        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response);
          throw new FireflyApiError(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorData
          );
        }

        const data = await response.json();
        this.logResponse(response.status, data);
        return data;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry on client errors (4xx) or authentication issues
        if (error instanceof FireflyApiError && error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < this.config.firefly.retryAttempts) {
          const delay = this.config.firefly.retryDelay * Math.pow(2, attempt);
          console.warn(`Request failed (attempt ${attempt + 1}/${this.config.firefly.retryAttempts + 1}), retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Request failed after all retry attempts');
  }

  /**
   * Parse error response from the API
   * 
   * @param response The failed response
   * @returns Promise<ApiErrorResponse> The parsed error data
   */
  private async parseErrorResponse(response: Response): Promise<ApiErrorResponse> {
    try {
      return await response.json();
    } catch {
      return {
        message: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  }

  /**
   * Handle rate limiting to avoid overwhelming the API
   */
  private async handleRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = 100; // Minimum 100ms between requests

    if (timeSinceLastRequest < minInterval) {
      await new Promise(resolve => setTimeout(resolve, minInterval - timeSinceLastRequest));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Log outgoing requests (if debug logging is enabled)
   */
  private logRequest(url: string, config: RequestInit): void {
    if (this.config.logging.level === 'debug') {
      console.debug(`[FireflyAPI] ${config.method || 'GET'} ${url}`);
    }
  }

  /**
   * Log incoming responses (if debug logging is enabled)
   */
  private logResponse(status: number, data: unknown): void {
    if (this.config.logging.level === 'debug') {
      console.debug(`[FireflyAPI] Response ${status}:`, data);
    }
  }

  // === API METHODS ===

  /**
   * Test the API connection and authentication
   * 
   * @returns Promise<boolean> True if connection is successful
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.request('/api/v1/about');
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get user information
   * 
   * @returns Promise<any> User information
   */
  async getUser(): Promise<unknown> {
    return await this.request('/api/v1/about');
  }

  /**
   * Get all accounts
   * 
   * @param type Optional account type filter
   * @returns Promise<ApiResponse<Account[]>> List of accounts
   */
  async getAccounts(type?: string): Promise<ApiResponse<Account[]>> {
    const params = type ? { type } : undefined;
    return await this.request<ApiResponse<Account[]>>('/api/v1/accounts', { params });
  }

  /**
   * Get a specific account by ID
   * 
   * @param id The account ID
   * @returns Promise<ApiResponse<Account>> Account details
   */
  async getAccount(id: string): Promise<ApiResponse<Account>> {
    return await this.request<ApiResponse<Account>>(`/api/v1/accounts/${id}`);
  }

  /**
   * Get transactions
   * 
   * @param params Query parameters for filtering
   * @returns Promise<ApiResponse<Transaction[]>> List of transactions
   */
  async getTransactions(params?: Record<string, string | number>): Promise<ApiResponse<Transaction[]>> {
    return await this.request<ApiResponse<Transaction[]>>('/api/v1/transactions', { params });
  }

  /**
   * Get a specific transaction by ID
   * 
   * @param id The transaction ID
   * @returns Promise<ApiResponse<Transaction>> Transaction details
   */
  async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
    return await this.request<ApiResponse<Transaction>>(`/api/v1/transactions/${id}`);
  }

  /**
   * Get all budgets
   * 
   * @returns Promise<ApiResponse<Budget[]>> List of budgets
   */
  async getBudgets(): Promise<ApiResponse<Budget[]>> {
    return await this.request<ApiResponse<Budget[]>>('/api/v1/budgets');
  }

  /**
   * Get a specific budget by ID
   * 
   * @param id The budget ID
   * @returns Promise<ApiResponse<Budget>> Budget details
   */
  async getBudget(id: string): Promise<ApiResponse<Budget>> {
    return await this.request<ApiResponse<Budget>>(`/api/v1/budgets/${id}`);
  }

  /**
   * Get all categories
   * 
   * @returns Promise<ApiResponse<Category[]>> List of categories
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return await this.request<ApiResponse<Category[]>>('/api/v1/categories');
  }

  /**
   * Get a specific category by ID
   * 
   * @param id The category ID
   * @returns Promise<ApiResponse<Category>> Category details
   */
  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return await this.request<ApiResponse<Category>>(`/api/v1/categories/${id}`);
  }

  /**
   * Get request statistics
   * 
   * @returns Object with request count and other stats
   */
  getStats(): { requestCount: number; lastRequestTime: number } {
    return {
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime,
    };
  }
}
