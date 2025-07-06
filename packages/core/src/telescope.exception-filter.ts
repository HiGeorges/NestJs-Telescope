import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { TelescopeService, ExceptionDetails, RequestDetails } from './telescope.service';

/**
 * Telescope Exception Filter
 * 
 * Global exception filter that captures all unhandled exceptions
 * and logs them to the Telescope service for debugging purposes.
 */
@Catch()
export class TelescopeExceptionFilter implements ExceptionFilter {
  constructor(private readonly telescopeService: TelescopeService) {}

  /**
   * Catches and processes exceptions
   * @param exception - The caught exception
   * @param host - The arguments host
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Skip telescope routes to avoid infinite loops
    if (request.url.startsWith('/telescope')) {
      return;
    }

    // Skip browser automatic requests that pollute logs
    if (this.shouldSkipRequest(request)) {
      return;
    }

    // Determine status code
    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Create detailed exception information
    const exceptionDetails: ExceptionDetails = {
      name: exception instanceof Error ? exception.constructor.name : 'Unknown Error',
      message: exception instanceof Error ? exception.message : String(exception),
      stack: exception instanceof Error ? exception.stack : '',
      statusCode: status,
      timestamp: new Date(),
    };

    // Create detailed request information
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

    // Log to telescope service
    this.telescopeService.addDetailedExceptionEntry(exceptionDetails, requestDetails);

    // Send error response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof HttpException 
        ? exception.getResponse() 
        : 'Internal server error',
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Determines if a request should be skipped (browser automatic requests)
   * @param request - The HTTP request
   * @returns True if the request should be skipped
   */
  private shouldSkipRequest(request: Request): boolean {
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
  private getClientIP(request: Request): string {
    const xForwardedFor = request.headers['x-forwarded-for'];
    const forwardedIP = Array.isArray(xForwardedFor) 
      ? xForwardedFor[0] 
      : xForwardedFor?.split(',')[0];

    return request.ip || 
           (request as any).connection?.remoteAddress || 
           (request as any).socket?.remoteAddress || 
           forwardedIP || 
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
   * Sanitizes request body to prevent sensitive data exposure
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