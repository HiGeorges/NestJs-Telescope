export { NestTelescopeModule as TelescopeModule } from './nest-telescope.module';
export { TelescopeService } from './telescope.service';
export { TelescopeInterceptor } from './telescope.interceptor';
export { TelescopeBasicAuthGuard } from './telescope-basic-auth.guard';
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
export interface TelescopeConfig {
    enabled?: boolean;
    auth?: {
        username: string;
        password: string;
    };
    maxEntries?: number;
    autoClearAfter?: number;
    captureRequestBody?: boolean;
    captureResponseBody?: boolean;
    captureHeaders?: boolean;
    captureQuery?: boolean;
    captureIP?: boolean;
    captureUserAgent?: boolean;
}
export declare const DEFAULT_TELESCOPE_CONFIG: TelescopeConfig;
