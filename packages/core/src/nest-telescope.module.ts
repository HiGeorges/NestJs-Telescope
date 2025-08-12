import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef, HttpAdapterHost } from '@nestjs/core';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TelescopeService } from './telescope.service';
import { TelescopeBasicAuthGuard } from './telescope-basic-auth.guard';
import { TelescopeInterceptor } from './telescope.interceptor';
import { TelescopeExceptionFilter } from './telescope-exception.filter';

// Factorized middleware for UI/API/auth
function telescopeMiddlewareFactory(telescopeService?: any) {
  return async (req, res, next) => {
    if (!req.url.startsWith('/telescope')) return next();
    
    // Optional basic authentication
    const isAuthEnabled = process.env.TELESCOPE_AUTH_ENABLED === 'true';
    const username = process.env.TELESCOPE_USER;
    const password = process.env.TELESCOPE_PASS;
    if (isAuthEnabled) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Telescope"');
        return res.status(401).send('Authentication required');
      }
      const base64 = authHeader.split(' ')[1];
      const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');
      if (user !== username || pass !== password) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Telescope"');
        return res.status(401).send('Invalid credentials');
      }
    }

    // Serve the UI
    if (req.url === '/telescope' || req.url === '/telescope/') {
      const { join } = require('path');
      const { existsSync } = require('fs');
      
      // Enhanced path resolution for production deployment
      const possiblePaths = [
        // Development paths
        join(__dirname, '..', 'public'),
        join(__dirname, 'public'),
        // Production npm package paths
        join(process.cwd(), 'node_modules', 'nestjs-telescope', 'public'),
        join(process.cwd(), 'node_modules', 'nestjs-telescope', 'dist', 'public'),
        join(process.cwd(), 'node_modules', 'nestjs-telescope', 'packages', 'core', 'public'),
        // Docker/container paths
        join('/app', 'node_modules', 'nestjs-telescope', 'public'),
        join('/app', 'node_modules', 'nestjs-telescope', 'dist', 'public'),
        // Bundled paths
        join(__dirname, '..', '..', 'public'),
        join(__dirname, '..', '..', 'dist', 'public')
      ];
      
      for (const rootPath of possiblePaths) {
        const htmlPath = join(rootPath, 'index.html');
        if (existsSync(htmlPath)) {
          // Set proper headers for HTML
          res.setHeader('Content-Type', 'text/html');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          return res.sendFile('index.html', { root: rootPath });
        }
      }
      
      // Debug information in development
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Telescope UI files not found. Checked paths:', possiblePaths);
      }
      return res.status(500).send('Telescope interface files not found');
    }

    // Serve static assets
    if (req.url.startsWith('/telescope/assets/')) {
      const assetPath = req.url.replace(/^\/telescope\/assets\//, '');
      const { join } = require('path');
      const { existsSync } = require('fs');
      
      const possiblePaths = [
        // Development paths
        join(__dirname, '..', 'public', 'assets'),
        join(__dirname, 'public', 'assets'),
        // Production npm package paths
        join(process.cwd(), 'node_modules', 'nestjs-telescope', 'public', 'assets'),
        join(process.cwd(), 'node_modules', 'nestjs-telescope', 'dist', 'public', 'assets'),
        join(process.cwd(), 'node_modules', 'nestjs-telescope', 'packages', 'core', 'public', 'assets'),
        // Docker/container paths
        join('/app', 'node_modules', 'nestjs-telescope', 'public', 'assets'),
        join('/app', 'node_modules', 'nestjs-telescope', 'dist', 'public', 'assets'),
        // Bundled paths
        join(__dirname, '..', '..', 'public', 'assets'),
        join(__dirname, '..', '..', 'dist', 'public', 'assets')
      ];
      
      for (const rootPath of possiblePaths) {
        const fullAssetPath = join(rootPath, assetPath);
        if (existsSync(fullAssetPath)) {
          // Set proper MIME types
          const ext = assetPath.split('.').pop()?.toLowerCase();
          if (ext === 'css') {
            res.setHeader('Content-Type', 'text/css');
          } else if (ext === 'js') {
            res.setHeader('Content-Type', 'application/javascript');
          }
          res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
          return res.sendFile(assetPath, { root: rootPath });
        }
      }
      
      return res.status(404).send('Asset not found');
    }
    // API endpoints
    if (telescopeService) {
      if (req.url === '/telescope/api/entries' && req.method === 'GET') {
        const entries = telescopeService.getEntries();
        return res.json(entries);
      }
      if (req.url.match(/^\/telescope\/api\/entries\/[\w-]+$/) && req.method === 'GET') {
        const id = req.url.split('/').pop();
        const entry = telescopeService.getEntry?.(id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        return res.json(entry);
      }
      if (req.url === '/telescope/api/entries' && req.method === 'DELETE') {
        telescopeService.clearEntries();
        return res.json({ message: 'Entries cleared successfully' });
      }
      if (req.url === '/telescope/api/stats' && req.method === 'GET') {
        const stats = telescopeService.getStats();
        return res.json(stats);
      }
    }
    // Generic 404
    return res.status(404).send('Not found');
  };
}

@Module({
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
  exports: [TelescopeService], // Export service for standalone usage
})
export class TelescopeModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  onModuleInit() {
    // Only setup middleware if not using standalone setup
    if (!process.env.TELESCOPE_STANDALONE_SETUP) {
      const app = this.httpAdapterHost?.httpAdapter?.getInstance?.();
      const telescopeService = this.moduleRef.get(TelescopeService, { strict: false });
      if (app && typeof app.use === 'function' && telescopeService) {
        app.use(telescopeMiddlewareFactory(telescopeService));
      }
    }
  }

  /**
   * Simplified setup method - only call this in main.ts
   * This replaces the need to import the module in your AppModule
   */
  static setup(app: any) {
    // Mark as standalone setup to avoid double middleware registration
    process.env.TELESCOPE_STANDALONE_SETUP = 'true';
    
    const httpAdapter = app.getHttpAdapter?.();
    const instance = httpAdapter?.getInstance?.();
    
    try {
      // Create a standalone instance of TelescopeService
      const { TelescopeService } = require('./telescope.service');
      const telescopeService = new TelescopeService();
      
      // Register providers manually for standalone usage
      const { TelescopeInterceptor } = require('./telescope.interceptor');
      const { TelescopeExceptionFilter } = require('./telescope-exception.filter');
      
      // Apply interceptor globally
      app.useGlobalInterceptors(new TelescopeInterceptor(telescopeService));
      
      // Apply exception filter globally
      app.useGlobalFilters(new TelescopeExceptionFilter(telescopeService));
      
      // Apply middleware
      if (instance && typeof instance.use === 'function') {
        instance.use(telescopeMiddlewareFactory(telescopeService));
      }
      
    } catch (error) {
      console.warn('Failed to setup Telescope:', error.message);
    }
  }

  /**
   * Legacy method - kept for backward compatibility
   * @deprecated Use NestTelescopeModule.setup(app) instead
   */
  static forRoot() {
    return {
      module: TelescopeModule,
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
    };
  }
}
