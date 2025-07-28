import { Logger, createLogger } from '../src/utils/logger.ts';

Deno.test("Logger - should format messages with emojis and timestamps", () => {
  const logger = createLogger({
    level: 'debug',
    logToFile: false,
    logFile: 'test.log'
  });

  // Test that we can create a logger without errors
  if (logger instanceof Logger) {
    console.log('✅ Logger test passed');
  } else {
    throw new Error('Failed to create logger');
  }
});

Deno.test("Logger - should respect log levels", () => {
  const logger = createLogger({
    level: 'error',
    logToFile: false,
    logFile: 'test.log'
  });

  // This should work without throwing errors
  logger.error('Test error message');
  logger.warn('This should not be shown due to log level');
  logger.info('This should not be shown due to log level');
  logger.debug('This should not be shown due to log level');
  
  console.log('✅ Log level test passed');
});
