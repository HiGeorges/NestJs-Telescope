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
            this.handleException(exception, response);
            return;
        }
        if (this.shouldSkipRequest(request)) {
            this.handleException(exception, response);
            return;
        }
        const status = this.getStatusCode(exception);
        const exceptionDetails = this.extractExceptionDetails(exception);
        this.telescopeService.addExceptionEntry(exceptionDetails.message, status, exceptionDetails.stack);
        this.handleException(exception, response);
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
    getStatusCode(exception) {
        if (exception instanceof common_1.HttpException) {
            return exception.getStatus();
        }
        return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
    }
    extractExceptionDetails(exception) {
        if (exception instanceof common_1.HttpException) {
            const response = exception.getResponse();
            const message = typeof response === 'string'
                ? response
                : response?.message || exception.message;
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
        return {
            message: String(exception) || 'Unknown Exception',
            stack: new Error().stack,
            name: 'Unknown',
        };
    }
    handleException(exception, response) {
        const status = this.getStatusCode(exception);
        const exceptionDetails = this.extractExceptionDetails(exception);
        response.status(status).json({
            statusCode: status,
            message: exceptionDetails.message,
            timestamp: new Date().toISOString(),
            path: response.req?.url,
        });
    }
};
exports.TelescopeExceptionFilter = TelescopeExceptionFilter;
exports.TelescopeExceptionFilter = TelescopeExceptionFilter = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [telescope_service_1.TelescopeService])
], TelescopeExceptionFilter);
//# sourceMappingURL=telescope-exception.filter.js.map