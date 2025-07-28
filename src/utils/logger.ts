/**
 * Logger utility for Firefly III Tools
 *
 * This module provides a centralized logging system with different log levels,
 * formatting, and optional file output based on configuration.
 */

import { LoggingConfig } from "../types/config.ts";

/**
 * Log levels supported by the application
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Logger class for the Firefly III Tools application
 */
export class Logger {
  private static instance: Logger | null = null;
  private config: LoggingConfig | null = null;
  private isConfigured = false;

  private constructor() {}

  /**
   * Get the singleton logger instance
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Configure the logger with the application configuration
   *
   * @param config Logging configuration
   */
  configure(config: LoggingConfig): void {
    this.config = config;
    this.isConfigured = true;
  }

  /**
   * Check if a log level should be output based on configuration
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.config) return true;

    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    return levels[level] >= levels[this.config.level];
  }

  /**
   * Format a log message with timestamp and emoji
   */
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const emoji = this.getEmojiForLevel(level);
    const levelUpper = level.toUpperCase().padEnd(5);

    return `[${timestamp}] ${emoji} ${levelUpper}: ${message}`;
  }

  /**
   * Get emoji for log level
   */
  private getEmojiForLevel(level: LogLevel): string {
    switch (level) {
      case "debug":
        return "🔍";
      case "info":
        return "📋";
      case "warn":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "📝";
    }
  }

  /**
   * Write log message to console and optionally to file
   */
  private async writeLog(level: LogLevel, message: string): Promise<void> {
    const formattedMessage = this.formatMessage(level, message);

    // Always write to console
    switch (level) {
      case "debug":
        console.debug(formattedMessage);
        break;
      case "info":
        console.info(formattedMessage);
        break;
      case "warn":
        console.warn(formattedMessage);
        break;
      case "error":
        console.error(formattedMessage);
        break;
    }

    // Write to file if configured
    if (this.config?.logToFile && this.config.logFile) {
      try {
        const logEntry = formattedMessage + "\n";
        // Read existing content and append
        let existingContent = "";
        try {
          existingContent = await Deno.readTextFile(this.config.logFile);
        } catch {
          // File doesn't exist yet, which is fine
        }
        await Deno.writeTextFile(
          this.config.logFile,
          existingContent + logEntry,
        );
      } catch (error) {
        // Fallback to console if file logging fails
        console.error("Failed to write to log file:", error);
      }
    }
  }

  /**
   * Safely stringify any value for logging
   */
  private safeStringify(value: unknown): string {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return "[object Object]";
    }
  }

  /**
   * Log a debug message
   */
  debug(message: string, ...args: unknown[]): void {
    if (!this.shouldLog("debug")) return;

    const fullMessage = args.length > 0
      ? `${message} ${args.map((arg) => this.safeStringify(arg)).join(" ")}`
      : message;

    this.writeLog("debug", fullMessage);
  }

  /**
   * Log an info message
   */
  info(message: string, ...args: unknown[]): void {
    if (!this.shouldLog("info")) return;

    const fullMessage = args.length > 0
      ? `${message} ${args.map((arg) => this.safeStringify(arg)).join(" ")}`
      : message;

    this.writeLog("info", fullMessage);
  }

  /**
   * Log a warning message
   */
  warn(message: string, ...args: unknown[]): void {
    if (!this.shouldLog("warn")) return;

    const fullMessage = args.length > 0
      ? `${message} ${args.map((arg) => this.safeStringify(arg)).join(" ")}`
      : message;

    this.writeLog("warn", fullMessage);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, ...args: unknown[]): void {
    if (!this.shouldLog("error")) return;

    let errorMessage = message;

    if (error instanceof Error) {
      errorMessage += ` - ${error.message}`;
      if (error.stack) {
        errorMessage += `\nStack trace: ${error.stack}`;
      }
    } else if (error) {
      errorMessage += ` - ${this.safeStringify(error)}`;
    }

    if (args.length > 0) {
      errorMessage += ` ${
        args.map((arg) => this.safeStringify(arg)).join(" ")
      }`;
    }

    this.writeLog("error", errorMessage);
  }
}

/**
 * Convenience function to get the configured logger instance
 */
export function getLogger(): Logger {
  return Logger.getInstance();
}

/**
 * Create a logger with application context
 * This ensures the logger is properly configured before use
 *
 * @param config Logging configuration
 * @returns Configured logger instance
 */
export function createLogger(config: LoggingConfig): Logger {
  const logger = Logger.getInstance();
  logger.configure(config);
  return logger;
}
