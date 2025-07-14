import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TelescopeService } from './telescope.service';
import { TelescopeBasicAuthGuard } from './telescope-basic-auth.guard';
import { TelescopeInterceptor } from './telescope.interceptor';
import { TelescopeExceptionFilter } from './telescope-exception.filter';
import { join } from 'path';
import { existsSync } from 'fs';

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
  // Pas d'exports, module totalement encapsulé
})
export class NestTelescopeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(async (req, res, next) => {
        if (!req.url.startsWith('/telescope')) return next();

        // Optionnel: Authentification basique
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

        // Servir l'UI
        if (req.url === '/telescope' || req.url === '/telescope/') {
          // Chercher le bon dossier public
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

        // Servir les assets
        if (req.url.startsWith('/telescope/assets/')) {
          const assetPath = req.url.replace(/^\/telescope\/assets\//, '');
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
        if (req.url === '/telescope/api/entries' && req.method === 'GET') {
          // @ts-ignore
          const entries = req.app.get(TelescopeService).getEntries();
          return res.json(entries);
        }
        if (req.url.match(/^\/telescope\/api\/entries\/[\w-]+$/) && req.method === 'GET') {
          const id = req.url.split('/').pop();
          // @ts-ignore
          const entry = req.app.get(TelescopeService).getEntryById?.(id);
          if (!entry) return res.status(404).json({ message: 'Entry not found' });
          return res.json(entry);
        }
        if (req.url === '/telescope/api/entries' && req.method === 'DELETE') {
          // @ts-ignore
          req.app.get(TelescopeService).clearEntries();
          return res.json({ message: 'Entries cleared successfully' });
        }
        if (req.url === '/telescope/api/stats' && req.method === 'GET') {
          // @ts-ignore
          const stats = req.app.get(TelescopeService).getStats();
          return res.json(stats);
        }

        // Sinon, 404
        return res.status(404).send('Not found');
      })
      .forRoutes('*');
  }
}
