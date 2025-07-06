/**
 * NestJS Telescope - Main Entry Point
 * 
 * A debugging and monitoring tool for NestJS applications,
 * inspired by Laravel Telescope.
 */

// Core exports
export { NestTelescopeModule as TelescopeModule } from './nest-telescope.module';
export { TelescopeController } from './telescope.controller';
export { TelescopeService } from './telescope.service';
export { TelescopeInterceptor } from './telescope.interceptor';
export { TelescopeBasicAuthGuard } from './telescope-basic-auth.guard';

// Types
export interface TelescopeEntry {
  id: string;
  type: 'request' | 'exception';
  timestamp: string;
  ip: string;
  userAgent: string;
  request?: {
    method: string;
    url: string;
    headers: Record<string, string>;
    query: Record<string, string>;
    body: unknown;
    contentType?: string;
  };
  response?: {
    statusCode: number;
    headers: Record<string, string>;
    body: unknown;
    contentType?: string;
    responseTime?: number;
  };
  exception?: {
    name: string;
    message: string;
    stack: string;
    context?: Record<string, unknown>;
  };
}

export interface TelescopeStats {
  totalEntries: number;
  requests: number;
  exceptions: number;
  uniqueIPs: number;
  uniqueUserAgents: number;
  averageResponseTime: number;
  statusCodes: Record<string, number>;
  methods: Record<string, number>;
}

// Configuration
export interface TelescopeConfig {
  /** Enable/disable telescope */
  enabled?: boolean;
  
  /** Basic auth credentials */
  auth?: {
    username: string;
    password: string;
  };
  
  /** Maximum number of entries to store */
  maxEntries?: number;
  
  /** Auto-clear entries after specified time (in milliseconds) */
  autoClearAfter?: number;
  
  /** Enable/disable request body capture */
  captureRequestBody?: boolean;
  
  /** Enable/disable response body capture */
  captureResponseBody?: boolean;
  
  /** Enable/disable headers capture */
  captureHeaders?: boolean;
  
  /** Enable/disable query parameters capture */
  captureQuery?: boolean;
  
  /** Enable/disable IP address capture */
  captureIP?: boolean;
  
  /** Enable/disable user agent capture */
  captureUserAgent?: boolean;
}

// Default configuration
export const DEFAULT_TELESCOPE_CONFIG: TelescopeConfig = {
  enabled: true,
  maxEntries: 1000,
  autoClearAfter: 24 * 60 * 60 * 1000, // 24 hours
  captureRequestBody: true,
  captureResponseBody: true,
  captureHeaders: true,
  captureQuery: true,
  captureIP: true,
  captureUserAgent: true,
};
