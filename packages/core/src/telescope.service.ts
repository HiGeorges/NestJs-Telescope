
import { Injectable } from '@nestjs/common';

/**
 * Detailed request information
 */
export interface RequestDetails {
  method: string;
  url: string;
  path: string;
  query: Record<string, any>;
  params: Record<string, any>;
  headers: Record<string, string>;
  cookies: Record<string, string>;
  body: any;
  ip: string;
  userAgent: string;
  referer?: string;
  origin?: string;
  hostname: string;
  protocol: string;
  timestamp: Date;
}

/**
 * Detailed response information
 */
export interface ResponseDetails {
  statusCode: number;
  statusMessage: string;
  headers: Record<string, string>;
  body: any;
  responseTime: number;
}

/**
 * Detailed exception information
 */
export interface ExceptionDetails {
  name: string;
  message: string;
  stack: string;
  statusCode: number;
  timestamp: Date;
  requestDetails?: RequestDetails;
}

/**
 * Entry interface for Telescope data
 */
export interface TelescopeEntry {
  id: string;
  type: 'request' | 'exception';
  timestamp: Date;
  
  // Request details
  request?: RequestDetails;
  
  // Response details (for requests)
  response?: ResponseDetails;
  
  // Exception details (for exceptions)
  exception?: ExceptionDetails;
  
  // Legacy fields for backward compatibility
  method?: string;
  path?: string;
  status?: number;
  duration?: number;
  message?: string;
  headers?: Record<string, string>;
  body?: any;
  stack?: string;
}

/**
 * Telescope Service
 * 
 * Manages the collection and storage of HTTP requests and exceptions
 * for the Telescope debugging interface.
 */
@Injectable()
export class TelescopeService {
  private readonly entries: TelescopeEntry[] = [];
  private readonly maxEntries = 100;

  /**
   * Adds a new entry to the telescope log
   * @param entry - The entry to add
   */
  addEntry(entry: Omit<TelescopeEntry, 'id' | 'timestamp'>): void {
    const newEntry: TelescopeEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date(),
    };

    // Add to beginning of array (most recent first)
    this.entries.unshift(newEntry);

    // Keep only the latest entries
    if (this.entries.length > this.maxEntries) {
      this.entries.splice(this.maxEntries);
    }
  }

  /**
   * Adds a detailed HTTP request entry
   * @param requestDetails - Complete request information
   * @param responseDetails - Complete response information
   */
  addDetailedRequestEntry(requestDetails: RequestDetails, responseDetails: ResponseDetails): void {
    this.addEntry({
      type: 'request',
      request: requestDetails,
      response: responseDetails,
      // Legacy fields for backward compatibility
      method: requestDetails.method,
      path: requestDetails.path,
      status: responseDetails.statusCode,
      duration: responseDetails.responseTime,
      headers: requestDetails.headers,
      body: requestDetails.body,
    });
  }

  /**
   * Adds a detailed exception entry
   * @param exceptionDetails - Complete exception information
   * @param requestDetails - Optional request details when exception occurred
   */
  addDetailedExceptionEntry(exceptionDetails: ExceptionDetails, requestDetails?: RequestDetails): void {
    this.addEntry({
      type: 'exception',
      exception: exceptionDetails,
      request: requestDetails,
      // Legacy fields for backward compatibility
      message: exceptionDetails.message,
      status: exceptionDetails.statusCode,
      stack: exceptionDetails.stack,
    });
  }

  /**
   * Legacy method for backward compatibility
   */
  addRequestEntry(
    method: string,
    path: string,
    status: number,
    duration: number,
    headers?: Record<string, string>,
    body?: any
  ): void {
    this.addEntry({
      type: 'request',
      method,
      path,
      status,
      duration,
      headers,
      body,
    });
  }

  /**
   * Legacy method for backward compatibility
   */
  addExceptionEntry(message: string, status: number, stack?: string): void {
    this.addEntry({
      type: 'exception',
      message,
      status,
      stack,
    });
  }

  /**
   * Retrieves all entries
   * @returns Array of telescope entries
   */
  getEntries(): TelescopeEntry[] {
    return [...this.entries];
  }

  /**
   * Retrieves a specific entry by ID
   * @param id - Entry ID
   * @returns Telescope entry or null if not found
   */
  getEntry(id: string): TelescopeEntry | null {
    return this.entries.find(entry => entry.id === id) || null;
  }

  /**
   * Clears all entries
   */
  clearEntries(): void {
    this.entries.length = 0;
  }

  /**
   * Gets statistics about the entries
   * @returns Statistics object
   */
  getStats(): {
    total: number;
    requests: number;
    exceptions: number;
    averageResponseTime: number;
    uniqueIPs: number;
    uniqueUserAgents: number;
  } {
    const requests = this.entries.filter(entry => entry.type === 'request');
    const exceptions = this.entries.filter(entry => entry.type === 'exception');
    
    const totalDuration = requests.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const averageResponseTime = requests.length > 0 ? Math.round(totalDuration / requests.length) : 0;

    // Get unique IPs and User Agents
    const uniqueIPs = new Set(requests.map(r => r.request?.ip).filter(Boolean)).size;
    const uniqueUserAgents = new Set(requests.map(r => r.request?.userAgent).filter(Boolean)).size;

    return {
      total: this.entries.length,
      requests: requests.length,
      exceptions: exceptions.length,
      averageResponseTime,
      uniqueIPs,
      uniqueUserAgents,
    };
  }

  /**
   * Generates a unique ID for entries
   * @returns Unique ID string
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
