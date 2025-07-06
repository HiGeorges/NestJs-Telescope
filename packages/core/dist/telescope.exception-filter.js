"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelescopeExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const telescope_service_1 = require("./telescope.service");
let TelescopeExceptionFilter = class TelescopeExceptionFilter {
    constructor(telescopeService) {
        this.telescopeService = telescopeService;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        if (request.url.startsWith('/telescope')) {
            return;
        }
        if (this.shouldSkipRequest(request)) {
            return;
        }
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionDetails = {
            name: exception instanceof Error ? exception.constructor.name : 'Unknown Error',
            message: exception instanceof Error ? exception.message : String(exception),
            stack: exception instanceof Error ? exception.stack : '',
            statusCode: status,
            timestamp: new Date(),
        };
        const requestDetails = {
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
        this.telescopeService.addDetailedExceptionEntry(exceptionDetails, requestDetails);
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception instanceof common_1.HttpException
                ? exception.getResponse()
                : 'Internal server error',
        };
        response.status(status).json(errorResponse);
    }
    shouldSkipRequest(request) {
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
    getClientIP(request) {
        const xForwardedFor = request.headers['x-forwarded-for'];
        const forwardedIP = Array.isArray(xForwardedFor)
            ? xForwardedFor[0]
            : xForwardedFor?.split(',')[0];
        return request.ip ||
            request.connection?.remoteAddress ||
            request.socket?.remoteAddress ||
            forwardedIP ||
            request.headers['x-real-ip'] ||
            'Unknown';
    }
    sanitizeHeaders(headers) {
        const sanitized = {};
        const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
        for (const [key, value] of Object.entries(headers)) {
            if (sensitiveHeaders.includes(key.toLowerCase())) {
                sanitized[key] = '[REDACTED]';
            }
            else {
                sanitized[key] = String(value);
            }
        }
        return sanitized;
    }
    sanitizeBody(body) {
        if (!body)
            return null;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            }
            catch {
                return body;
            }
        }
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
};
exports.TelescopeExceptionFilter = TelescopeExceptionFilter;
exports.TelescopeExceptionFilter = TelescopeExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [telescope_service_1.TelescopeService])
], TelescopeExceptionFilter);
//# sourceMappingURL=telescope.exception-filter.js.map