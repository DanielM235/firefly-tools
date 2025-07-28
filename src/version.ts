/**
 * Version information for Firefly III Tools
 * 
 * This file contains version constants that are used throughout the application
 * for User-Agent headers, logging, and compatibility checks.
 */

export const VERSION = '0.0.1';

export const FIREFLY_III_SUPPORTED_VERSIONS = {
  min: '6.0.0',
  max: '6.x',
  apiVersion: 'v1'
} as const;

export const DENO_REQUIRED_VERSION = {
  min: '2.0.0'
} as const;

export const USER_AGENT = `Firefly-Tools-Deno/${VERSION} (Compatible with Firefly III v${FIREFLY_III_SUPPORTED_VERSIONS.max})`;

export const PROJECT_INFO = {
  name: 'Firefly III Tools',
  version: VERSION,
  description: 'Professional tools for Firefly III API integration using Deno',
  repository: 'https://github.com/DanielM235/firefly-tools',
  license: 'MIT'
} as const;
