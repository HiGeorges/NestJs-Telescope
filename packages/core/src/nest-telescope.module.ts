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
      const possiblePaths = [
        join(__dirname, '..', 'public'),
        join(__dirname, 'public'),
        join(process.cwd(), 'node_modules', 'nestjs-telescope', 'packages', 'core', 'public'),
        join(process.cwd(), 'node_modules', 'nestjs-telescope', 'dist', 'public')
      ];
      for (const rootPath of possiblePaths) {
        if (existsSync(join(rootPath, 'index.html'))) {
          return res.sendFile('index.html', { root: rootPath });
        }
      }
      return res.status(500).send('Telescope interface files not found');
    }
    // Serve static assets
    if (req.url.startsWith('/telescope/assets/')) {
      const assetPath = req.url.replace(/^\/telescope\/assets\//, '');
      const { join } = require('path');
      const { existsSync } = require('fs');
      const possiblePaths = [
        join(__dirname, '..', 'public', 'assets'),
        join(__dirname, 'public', 'assets'),
        join(process.cwd(), 'node_modules', 'nestjs-telescope', 'packages', 'core', 'public', 'assets'),
        join(process.cwd(), 'node_modules', 'nestjs-telescope', 'dist', 'public', 'assets')
      ];
      for (const rootPath of possiblePaths) {
        if (existsSync(join(rootPath, assetPath))) {
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
  // No exports, module is fully encapsulated
})
export class NestTelescopeModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  onModuleInit() {
    const app = this.httpAdapterHost?.httpAdapter?.getInstance?.();
    const telescopeService = this.moduleRef.get(TelescopeService, { strict: false });
    if (app && typeof app.use === 'function' && telescopeService) {
      app.use(telescopeMiddlewareFactory(telescopeService));
    }
  }

  // Static method to attach the Telescope middleware (UI/API/auth)
  static setup(app: any) {
    const httpAdapter = app.getHttpAdapter?.();
    const instance = httpAdapter?.getInstance?.();
    const telescopeService = app.get?.(require('./telescope.service').TelescopeService, { strict: false });
    if (instance && typeof instance.use === 'function') {
      instance.use(telescopeMiddlewareFactory(telescopeService));
    }
  }
}
