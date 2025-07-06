import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TelescopeController } from './telescope.controller';
import { TelescopeExceptionFilter } from './telescope-exception.filter';
import { TelescopeInterceptor } from './telescope.interceptor';
import { TelescopeService } from './telescope.service';
import { TelescopeBasicAuthGuard } from './telescope-basic-auth.guard';

/**
 * NestJS Telescope Module
 * 
 * Provides a debugging interface for NestJS applications.
 * Collects HTTP requests and exceptions for real-time monitoring.
 * 
 * Features:
 * - Real-time HTTP request monitoring
 * - Exception tracking with automatic capture
 * - Web-based debugging interface
 * - Optional Basic Auth protection
 * 
 * Usage:
 * ```typescript
 * import { NestTelescopeModule } from '@telescope/core';
 * 
 * @Module({
 *   imports: [NestTelescopeModule],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
  controllers: [TelescopeController],
  providers: [
    TelescopeService,
    TelescopeBasicAuthGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: TelescopeInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: TelescopeExceptionFilter,
    },
  ],
  exports: [TelescopeService],
})
export class NestTelescopeModule {}
