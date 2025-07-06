/**
 * Telescope API Service
 * 
 * Handles all communication with the NestJS Telescope backend.
 * Provides a clean interface for fetching telescope entries, statistics,
 * and managing the telescope data.
 */

import type { 
  TelescopeEntry, 
  TelescopeStats, 
  TelescopeApiService
} from '../types';

/**
 * Configuration for the API service
 */
const API_CONFIG = {
  /** Base URL for the telescope API */
  BASE_URL: '/telescope/api',
  
  /** Default timeout for requests */
  TIMEOUT: 10000,
  
  /** Auto-refresh interval in milliseconds */
  AUTO_REFRESH_INTERVAL: 5000,
} as const;

/**
 * HTTP client for making API requests
 */
class HttpClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(this.timeout),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(this.timeout),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

/**
 * Implementation of the Telescope API Service
 */
export class TelescopeApiServiceImpl implements TelescopeApiService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(API_CONFIG.BASE_URL);
  }

  /**
   * Get all telescope entries
   */
  async getEntries(): Promise<TelescopeEntry[]> {
    try {
      const response = await this.httpClient.get<TelescopeEntry[]>('/entries');
      return response;
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      throw new Error('Failed to fetch telescope entries');
    }
  }

  /**
   * Get a specific entry by ID
   */
  async getEntry(id: string): Promise<TelescopeEntry | null> {
    try {
      const response = await this.httpClient.get<TelescopeEntry>(`/entries/${id}`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch entry ${id}:`, error);
      return null;
    }
  }

  /**
   * Get telescope statistics
   */
  async getStats(): Promise<TelescopeStats> {
    try {
      const response = await this.httpClient.get<TelescopeStats>('/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      throw new Error('Failed to fetch telescope statistics');
    }
  }

  /**
   * Clear all telescope entries
   */
  async clearEntries(): Promise<void> {
    try {
      await this.httpClient.delete<{ message: string }>('/entries');
    } catch (error) {
      console.error('Failed to clear entries:', error);
      throw new Error('Failed to clear telescope entries');
    }
  }
}

/**
 * Singleton instance of the API service
 */
export const telescopeApi = new TelescopeApiServiceImpl();

/**
 * Utility functions for API operations
 */
export const apiUtils = {
  /**
   * Format timestamp for display
   */
  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  },

  /**
   * Get status code color class
   */
  getStatusColor(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-600';
    if (statusCode >= 300 && statusCode < 400) return 'text-blue-600';
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-600';
    if (statusCode >= 500) return 'text-red-600';
    return 'text-gray-600';
  },

  /**
   * Get method color class
   */
  getMethodColor(method: string): string {
    const methodColors: Record<string, string> = {
      GET: 'bg-blue-100 text-blue-800',
      POST: 'bg-green-100 text-green-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      PATCH: 'bg-orange-100 text-orange-800',
      DELETE: 'bg-red-100 text-red-800',
    };
    return methodColors[method.toUpperCase()] || 'bg-gray-100 text-gray-800';
  },

  /**
   * Truncate text for display
   */
  truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  /**
   * Format response time
   */
  formatResponseTime(time: number): string {
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  },
}; 