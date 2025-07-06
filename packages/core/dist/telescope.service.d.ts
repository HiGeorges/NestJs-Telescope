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
export interface ResponseDetails {
    statusCode: number;
    statusMessage: string;
    headers: Record<string, string>;
    body: any;
    responseTime: number;
}
export interface ExceptionDetails {
    name: string;
    message: string;
    stack: string;
    statusCode: number;
    timestamp: Date;
    requestDetails?: RequestDetails;
}
export interface TelescopeEntry {
    id: string;
    type: 'request' | 'exception';
    timestamp: Date;
    request?: RequestDetails;
    response?: ResponseDetails;
    exception?: ExceptionDetails;
    method?: string;
    path?: string;
    status?: number;
    duration?: number;
    message?: string;
    headers?: Record<string, string>;
    body?: any;
    stack?: string;
}
export declare class TelescopeService {
    private readonly entries;
    private readonly maxEntries;
    addEntry(entry: Omit<TelescopeEntry, 'id' | 'timestamp'>): void;
    addDetailedRequestEntry(requestDetails: RequestDetails, responseDetails: ResponseDetails): void;
    addDetailedExceptionEntry(exceptionDetails: ExceptionDetails, requestDetails?: RequestDetails): void;
    addRequestEntry(method: string, path: string, status: number, duration: number, headers?: Record<string, string>, body?: any): void;
    addExceptionEntry(message: string, status: number, stack?: string): void;
    getEntries(): TelescopeEntry[];
    getEntry(id: string): TelescopeEntry | null;
    clearEntries(): void;
    getStats(): {
        total: number;
        requests: number;
        exceptions: number;
        averageResponseTime: number;
        uniqueIPs: number;
        uniqueUserAgents: number;
    };
    private generateId;
}
