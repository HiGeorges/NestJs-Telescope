import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TelescopeService, RequestDetails, ResponseDetails } from './telescope.service';

/**
 * Telescope Interceptor
 * 
 * Intercepts HTTP requests and responses to collect detailed data for the Telescope interface.
 * Captures comprehensive request/response information including headers, cookies, IP, etc.
 */
@Injectable()
export class TelescopeInterceptor implements NestInterceptor {
  constructor(private readonly telescopeService: TelescopeService) {}

  /**
   * Intercepts the request/response cycle
   * @param context - The execution context
   * @param next - The call handler
   * @returns Observable with the response
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const startTime = Date.now();
    const method = request.method;
    const path = request.url;

    // Skip telescope routes to avoid infinite loops
    if (path.startsWith('/telescope')) {
      return next.handle();
    }

    // Skip browser automatic requests that pollute logs
    if (this.shouldSkipRequest(request)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((responseBody) => {
        const duration = Date.now() - startTime;
        const status = response.statusCode;
        
        // Capture detailed request information
        const requestDetails: RequestDetails = {
          method: request.method,
          url: request.url,
          path: request.path || request.url,
          query: request.query || {},
          params: request.params || {},
          headers: this.sanitizeHeaders(request.headers),
          cookies: request.cookies || {},
          body: this.sanitizeBody(request.body),
          ip: this.getClientIP(request),
          userAgent: request.headers['user-agent'] || 'Unknown',
          referer: request.headers.referer,
          origin: request.headers.origin,
          hostname: request.hostname || request.headers.host || 'Unknown',
          protocol: request.protocol || 'http',
          timestamp: new Date(),
        };

        // Capture detailed response information
        const responseDetails: ResponseDetails = {
          statusCode: status,
          statusMessage: response.statusMessage || 'OK',
          headers: this.sanitizeHeaders(response.getHeaders()),
          body: this.sanitizeBody(responseBody),
          responseTime: duration,
        };

        this.telescopeService.addDetailedRequestEntry(requestDetails, responseDetails);
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const status = error.status || 500;
        
        // Capture request details for exception
        const requestDetails: RequestDetails = {
          method: request.method,
          url: request.url,
          path: request.path || request.url,
          query: request.query || {},
          params: request.params || {},
          headers: this.sanitizeHeaders(request.headers),
          cookies: request.cookies || {},
          body: this.sanitizeBody(request.body),
          ip: this.getClientIP(request),
          userAgent: request.headers['user-agent'] || 'Unknown',
          referer: request.headers.referer,
          origin: request.headers.origin,
          hostname: request.hostname || request.headers.host || 'Unknown',
          protocol: request.protocol || 'http',
          timestamp: new Date(),
        };

        this.telescopeService.addDetailedExceptionEntry(
          {
            name: error.name || 'Unknown Error',
            message: error.message || 'Unknown error',
            stack: error.stack,
            statusCode: status,
            timestamp: new Date(),
          },
          requestDetails
        );
        
        throw error;
      })
    );
  }

  /**
   * Determines if a request should be skipped (browser automatic requests)
   * @param request - The HTTP request
   * @returns True if the request should be skipped
   */
  private shouldSkipRequest(request: any): boolean {
    const skipPaths = [
      '/.well-known/appspecific/com.chrome.devtools.json',
      '/favicon.ico',
      '/robots.txt',
      '/sitemap.xml',
      '/.well-known/',
      '/__webpack_hmr',
      '/hot-update.json'
    ];

    return skipPaths.some(path => request.url.startsWith(path));
  }

  /**
   * Gets the real client IP address
   * @param request - The HTTP request
   * @returns Client IP address
   */
  private getClientIP(request: any): string {
    return request.ip || 
           request.connection?.remoteAddress || 
           request.socket?.remoteAddress || 
           request.headers['x-forwarded-for']?.split(',')[0] || 
           request.headers['x-real-ip'] || 
           'Unknown';
  }

  /**
   * Sanitizes headers to remove sensitive information
   * @param headers - Raw headers object
   * @returns Sanitized headers
   */
  private sanitizeHeaders(headers: any): Record<string, string> {
    const sanitized: Record<string, string> = {};
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];

    for (const [key, value] of Object.entries(headers)) {
      if (sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = String(value);
      }
    }

    return sanitized;
  }

  /**
   * Sanitizes request/response body to prevent sensitive data exposure
   * @param body - Raw body
   * @returns Sanitized body
   */
  private sanitizeBody(body: any): any {
    if (!body) return null;

    // If body is a string, try to parse it
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // If it's not JSON, return as is
        return body;
      }
    }

    // If body is an object, sanitize sensitive fields
    if (typeof body === 'object' && body !== null) {
      const sanitized = { ...body };
      const sensitiveFields = ['password', 'token', 'secret', 'key', 'api_key', 'auth'];

      for (const field of sensitiveFields) {
        if (sanitized[field]) {
          sanitized[field] = '[REDACTED]';
        }
      }

      return sanitized;
    }

    return body;
  }
}
