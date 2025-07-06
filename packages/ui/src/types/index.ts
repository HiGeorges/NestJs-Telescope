/**
 * Telescope Entry Types
 * 
 * Defines the structure of telescope entries captured by the NestJS backend.
 * These types represent HTTP requests, responses, and exceptions that are
 * monitored and displayed in the Telescope UI.
 */

export interface TelescopeEntry {
  /** Unique identifier for the entry */
  id: string;
  
  /** Type of entry: 'request' or 'exception' */
  type: 'request' | 'exception';
  
  /** Timestamp when the entry was captured */
  timestamp: string;
  
  /** IP address of the client */
  ip: string;
  
  /** User agent string */
  userAgent: string;
  
  /** Request details (only for request entries) */
  request?: RequestData;
  
  /** Response details (only for request entries) */
  response?: ResponseData;
  
  /** Exception details (only for exception entries) */
  exception?: ExceptionData;
}

export interface RequestData {
  /** HTTP method */
  method: string;
  
  /** Request URL */
  url: string;
  
  /** Request headers */
  headers: Record<string, string>;
  
  /** Query parameters */
  query: Record<string, string>;
  
  /** Request body */
  body: unknown;
  
  /** Content type */
  contentType?: string;
}

export interface ResponseData {
  /** HTTP status code */
  statusCode: number;
  
  /** Response headers */
  headers: Record<string, string>;
  
  /** Response body */
  body: unknown;
  
  /** Content type */
  contentType?: string;
  
  /** Response time in milliseconds */
  responseTime?: number;
}

export interface ExceptionData {
  /** Exception name */
  name: string;
  
  /** Exception message */
  message: string;
  
  /** Stack trace */
  stack: string;
  
  /** Additional context */
  context?: Record<string, unknown>;
}

export interface TelescopeStats {
  /** Total number of entries */
  totalEntries: number;
  
  /** Number of requests */
  requests: number;
  
  /** Number of exceptions */
  exceptions: number;
  
  /** Unique IP addresses */
  uniqueIPs: number;
  
  /** Unique user agents */
  uniqueUserAgents: number;
  
  /** Average response time */
  averageResponseTime: number;
  
  /** Status code distribution */
  statusCodes: Record<string, number>;
  
  /** Method distribution */
  methods: Record<string, number>;
}

export interface ApiResponse<T> {
  /** Response data */
  data: T;
  
  /** Success status */
  success: boolean;
  
  /** Error message (if any) */
  error?: string;
}

/**
 * UI Component Props Types
 */

export interface RequestsListProps {
  /** Array of telescope entries to display */
  entries: TelescopeEntry[];
  
  /** Currently selected entry ID */
  selectedEntryId?: string;
  
  /** Callback when an entry is selected */
  onEntrySelect: (entryId: string) => void;
  
  /** Callback to clear all entries */
  onClearEntries: () => void;
  
  /** Loading state */
  isLoading?: boolean;
}

export interface RequestDetailsProps {
  /** The telescope entry to display */
  entry: TelescopeEntry;
  
  /** Callback to close the details view */
  onClose: () => void;
}

export interface HeaderProps {
  /** Current statistics */
  stats: TelescopeStats;
  
  /** Callback to clear all entries */
  onClearEntries: () => void;
  
  /** Loading state */
  isLoading?: boolean;
}

export interface SidebarLayoutProps {
  /** Header component */
  header: React.ReactNode;
  
  /** Sidebar content */
  sidebar: React.ReactNode;
  
  /** Main content */
  children: React.ReactNode;
}

/**
 * API Service Types
 */

export interface TelescopeApiService {
  /** Get all entries */
  getEntries(): Promise<TelescopeEntry[]>;
  
  /** Get a specific entry by ID */
  getEntry(id: string): Promise<TelescopeEntry | null>;
  
  /** Get statistics */
  getStats(): Promise<TelescopeStats>;
  
  /** Clear all entries */
  clearEntries(): Promise<void>;
}

/**
 * Hook Types
 */

export interface UseTelescopeDataReturn {
  /** All telescope entries */
  entries: TelescopeEntry[];
  
  /** Current statistics */
  stats: TelescopeStats;
  
  /** Loading state */
  isLoading: boolean;
  
  /** Error state */
  error: string | null;
  
  /** Refresh data */
  refresh: () => void;
  
  /** Clear all entries */
  clearEntries: () => void;
} 