import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Basic Authentication Guard for Telescope interface
 * 
 * This guard protects the Telescope interface with optional Basic Auth.
 * Authentication is disabled by default and can be enabled via environment variables.
 * 
 * Environment Variables:
 * - TELESCOPE_AUTH_ENABLED: Set to 'true' to enable authentication
 * - TELESCOPE_USER: Username for authentication
 * - TELESCOPE_PASS: Password for authentication
 */
@Injectable()
export class TelescopeBasicAuthGuard implements CanActivate {
  /**
   * Determines if the request can proceed
   * @param context - The execution context
   * @returns Promise<boolean> - True if authentication passes or is disabled
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('🔍 Telescope Guard: canActivate called');
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Check if authentication is enabled
    const isAuthEnabled = process.env.TELESCOPE_AUTH_ENABLED === 'true';
    const username = process.env.TELESCOPE_USER;
    const password = process.env.TELESCOPE_PASS;

    console.log('🔍 Telescope Guard: Auth enabled =', isAuthEnabled);
    console.log('🔍 Telescope Guard: Username configured =', !!username);
    console.log('🔍 Telescope Guard: Password configured =', !!password);

    // If auth is disabled or credentials are not configured, allow access
    if (!isAuthEnabled || !username || !password) {
      console.log('🔍 Telescope Guard: Auth disabled, allowing access');
      return true;
    }

    const authHeader = request.headers.authorization;
    
    // Check if Basic Auth header is present
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      this.sendAuthChallenge(response);
      return false;
    }

    // Decode and validate credentials
    const credentials = this.decodeBasicAuth(authHeader);
    if (!credentials || credentials.username !== username || credentials.password !== password) {
      this.sendAuthChallenge(response);
      return false;
    }

    return true;
  }

  /**
   * Decodes Basic Auth header
   * @param authHeader - The Authorization header
   * @returns Decoded credentials or null if invalid
   */
  private decodeBasicAuth(authHeader: string): { username: string; password: string } | null {
    try {
      const base64Credentials = authHeader.replace('Basic ', '');
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');
      
      return { username, password };
    } catch (error) {
      return null;
    }
  }

  /**
   * Sends authentication challenge to the client
   * @param response - The HTTP response object
   */
  private sendAuthChallenge(response: Response): void {
    response.setHeader('WWW-Authenticate', 'Basic realm="Telescope"');
    response.status(401).send('Authentication required.');
  }
} 