import type { 
  TelescopeEntry, 
  TelescopeStats, 
  TelescopeApiService
} from '../types';

const API_CONFIG = {
  /** Base URL for the telescope API */
  BASE_URL: '/telescope/api',
  
  /** Default timeout for requests */
  TIMEOUT: 10000,
  
  /** Auto-refresh interval in milliseconds */
  AUTO_REFRESH_INTERVAL: 5000,
} as const;

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

const API_BASE = '/telescope/api';

export async function getEntries() {
  const res = await fetch(`${API_BASE}/entries`);
  if (!res.ok) throw new Error('Failed to fetch entries');
  return res.json();
}

export async function getEntry(id: string) {
  const res = await fetch(`${API_BASE}/entries/${id}`);
  if (!res.ok) throw new Error('Failed to fetch entry');
  return res.json();
}

export async function clearEntries() {
  const res = await fetch(`${API_BASE}/entries`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to clear entries');
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
} 