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
exports.TelescopeInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const telescope_service_1 = require("./telescope.service");
let TelescopeInterceptor = class TelescopeInterceptor {
    constructor(telescopeService) {
        this.telescopeService = telescopeService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const startTime = Date.now();
        const method = request.method;
        const path = request.url;
        if (path.startsWith('/telescope')) {
            return next.handle();
        }
        if (this.shouldSkipRequest(request)) {
            return next.handle();
        }
        return next.handle().pipe((0, operators_1.tap)((responseBody) => {
            const duration = Date.now() - startTime;
            const status = response.statusCode;
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
            const responseDetails = {
                statusCode: status,
                statusMessage: response.statusMessage || 'OK',
                headers: this.sanitizeHeaders(response.getHeaders()),
                body: this.sanitizeBody(responseBody),
                responseTime: duration,
            };
            this.telescopeService.addDetailedRequestEntry(requestDetails, responseDetails);
        }), (0, operators_1.catchError)((error) => {
            const duration = Date.now() - startTime;
            const status = error.status || 500;
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
            this.telescopeService.addDetailedExceptionEntry({
                name: error.name || 'Unknown Error',
                message: error.message || 'Unknown error',
                stack: error.stack,
                statusCode: status,
                timestamp: new Date(),
            }, requestDetails);
            throw error;
        }));
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
        return request.ip ||
            request.connection?.remoteAddress ||
            request.socket?.remoteAddress ||
            request.headers['x-forwarded-for']?.split(',')[0] ||
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
exports.TelescopeInterceptor = TelescopeInterceptor;
exports.TelescopeInterceptor = TelescopeInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [telescope_service_1.TelescopeService])
], TelescopeInterceptor);
//# sourceMappingURL=telescope.interceptor.js.map