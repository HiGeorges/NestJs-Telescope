import { Controller, Get, Res, UseGuards, Delete, Param, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { join } from 'path';
import { TelescopeService } from './telescope.service';
import { TelescopeBasicAuthGuard } from './telescope-basic-auth.guard';

/**
 * Telescope Controller
 * 
 * Provides the web interface and API endpoints for the NestJS Telescope debugging tool.
 * This controller serves both the HTML interface and the REST API for managing
 * HTTP request logs and exception tracking.
 * 
 * Features:
 * - Real-time HTTP request monitoring
 * - Exception tracking with detailed stack traces
 * - Request/response data inspection
 * - Statistics and analytics
 * - Optional Basic Auth protection
 * 
 * Routes:
 * - GET /telescope - Main debugging interface
 * - GET /telescope/api/entries - List all entries
 * - GET /telescope/api/entries/:id - Get specific entry
 * - DELETE /telescope/api/entries - Clear all entries
 * - GET /telescope/api/stats - Get statistics
 */
@Controller('telescope')
export class TelescopeController {
  constructor(private readonly telescopeService: TelescopeService) {}

  /**
   * Serves the main Telescope debugging interface
   * 
   * This endpoint serves the HTML interface that provides real-time monitoring
   * of HTTP requests and exceptions. The interface includes:
   * - Live statistics dashboard
   * - Request/exception filtering
   * - Detailed entry inspection
   * - Real-time auto-refresh
   * 
   * @param res - Express response object for serving the HTML file
   */
 

  @Get()
  @UseGuards(TelescopeBasicAuthGuard)
  async serveIndex(@Res() res: Response) {
    console.log('🔍 Telescope: serveIndex called');
    try {
      // Try multiple possible paths for the public directory
      const possiblePaths = [
        join(__dirname, '..', 'public'),
        join(__dirname, 'public'),
        join(process.cwd(), 'node_modules', 'nestjs-telescope', 'packages', 'core', 'public'),
        join(process.cwd(), 'node_modules', 'nestjs-telescope', 'dist', 'public')
      ];

      console.log('🔍 Telescope: __dirname =', __dirname);
      console.log('🔍 Telescope: process.cwd() =', process.cwd());

      for (const rootPath of possiblePaths) {
        try {
          console.log('🔍 Telescope: Trying path:', rootPath);
          res.sendFile('index.html', { root: rootPath });
          console.log('🔍 Telescope: Successfully served from:', rootPath);
          return;
        } catch (fileError) {
          console.log(`🔍 Telescope: Failed to serve from ${rootPath}:`, fileError.message);
        }
      }
      
      // If all paths fail, send error
      console.log('🔍 Telescope: All paths failed');
      res.status(500).send('Telescope interface files not found');
    } catch (error) {
      console.error('🔍 Telescope: Error serving Telescope index:', error);
      res.status(500).send('Error loading Telescope interface');
    }
  }

  @Get('assets/*')
  async serveAssets(@Req() req: Request, @Res() res: Response) {
    if (!req.url) {
      return res.status(400).send('Invalid request URL');
    }
    
    const assetPath = req.url.replace(/^\/telescope\/assets\//, '');
    const fullPath = join(__dirname, '..', 'public', 'assets', assetPath);
    res.sendFile(fullPath, (err) => {
      if (err) res.status(404).send('Asset not found');
    });
  }

  @Get('vite.svg')
  async serveViteSvg(@Res() res: Response) {
    res.sendFile('vite.svg', { root: join(__dirname, '..', 'public') });
  }

  /**
   * Retrieves all telescope entries as JSON
   * 
   * Returns a list of all captured HTTP requests and exceptions,
   * ordered by timestamp (most recent first). Each entry contains
   * detailed information about the request/response or exception.
   * 
   * @returns Array of telescope entries with full details
   */
  @Get('api/entries')
  getEntries() {
    return this.telescopeService.getEntries();
  }

  /**
   * Retrieves a specific telescope entry by its unique ID
   * 
   * Returns detailed information about a single entry, including
   * complete request/response data or exception details with stack trace.
   * 
   * @param id - Unique identifier of the entry to retrieve
   * @returns Telescope entry with full details or null if not found
   */
  @Get('api/entries/:id')
  getEntry(@Param('id') id: string) {
    return this.telescopeService.getEntry(id);
  }

  /**
   * Clears all telescope entries from memory
   * 
   * Removes all stored HTTP requests and exceptions from the telescope log.
   * This operation cannot be undone and will reset all statistics.
   * 
   * @returns Success message confirming the operation
   */
  @Delete('api/entries')
  clearEntries() {
    this.telescopeService.clearEntries();
    return { message: 'Entries cleared successfully' };
  }

  /**
   * Returns comprehensive statistics about telescope entries
   * 
   * Provides analytics including:
   * - Total number of entries
   * - Request vs exception counts
   * - Unique IP addresses
   * - Unique user agents
   * - Performance metrics
   * 
   * @returns Statistics object with various metrics
   */
  @Get('api/stats')
  getStats() {
    return this.telescopeService.getStats();
  }
}
