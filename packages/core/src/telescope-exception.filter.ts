import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { TelescopeService } from './telescope.service';

/**
 * Telescope Exception Filter
 * 
 * Automatically captures all unhandled exceptions and stores them
 * in the Telescope service for display in the debugging interface.
 * 
 * This filter is automatically registered as a global exception filter
 * when the NestTelescopeModule is imported.
 */
@Injectable()
@Catch()
export class TelescopeExceptionFilter implements ExceptionFilter {
  constructor(private readonly telescopeService: TelescopeService) {}

  /**
   * Handles exceptions and logs them to Telescope
   * @param exception - The caught exception
   * @param host - The arguments host
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Skip telescope routes to avoid infinite loops
    if (request.url.startsWith('/telescope')) {
      this.handleException(exception, response);
      return;
    }

    // Skip browser automatic requests that pollute logs
    if (this.shouldSkipRequest(request)) {
      this.handleException(exception, response);
      return;
    }

    // Determine status code
    const status = this.getStatusCode(exception);
    
    // Extract exception details
    const exceptionDetails = this.extractExceptionDetails(exception);
    
    // Log to Telescope service
    this.telescopeService.addExceptionEntry(
      exceptionDetails.message,
      status,
      exceptionDetails.stack
    );

    // Handle the exception normally
    this.handleException(exception, response);
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
   * Determines the HTTP status code for the exception
   * @param exception - The exception to analyze
   * @returns HTTP status code
   */
  private getStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    
    // Default to 500 for unknown exceptions
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  /**
   * Extracts detailed information from the exception
   * @param exception - The exception to analyze
   * @returns Exception details object
   */
  private extractExceptionDetails(exception: unknown): {
    message: string;
    stack?: string;
    name?: string;
  } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const message = typeof response === 'string' 
        ? response 
        : (response as any)?.message || exception.message;
      
      return {
        message: message || 'HTTP Exception',
        stack: exception.stack,
        name: exception.name,
      };
    }

    if (exception instanceof Error) {
      return {
        message: exception.message || 'Unknown Error',
        stack: exception.stack,
        name: exception.name,
      };
    }

    // Handle non-Error exceptions
    return {
      message: String(exception) || 'Unknown Exception',
      stack: new Error().stack,
      name: 'Unknown',
    };
  }

  /**
   * Handles the exception response
   * @param exception - The exception
   * @param response - The HTTP response
   */
  private handleException(exception: unknown, response: Response): void {
    const status = this.getStatusCode(exception);
    const exceptionDetails = this.extractExceptionDetails(exception);

    response.status(status).json({
      statusCode: status,
      message: exceptionDetails.message,
      timestamp: new Date().toISOString(),
      path: response.req?.url,
    });
  }
} 