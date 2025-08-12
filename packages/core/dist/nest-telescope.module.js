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
var TelescopeModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelescopeModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const core_2 = require("@nestjs/core");
const telescope_service_1 = require("./telescope.service");
const telescope_basic_auth_guard_1 = require("./telescope-basic-auth.guard");
const telescope_interceptor_1 = require("./telescope.interceptor");
const telescope_exception_filter_1 = require("./telescope-exception.filter");
function telescopeMiddlewareFactory(telescopeService) {
    return async (req, res, next) => {
        if (!req.url.startsWith('/telescope'))
            return next();
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
        if (req.url === '/telescope' || req.url === '/telescope/') {
            const { join } = require('path');
            const { existsSync } = require('fs');
            const possiblePaths = [
                join(__dirname, '..', 'public'),
                join(__dirname, 'public'),
                join(process.cwd(), 'node_modules', 'nestjs-telescope', 'public'),
                join(process.cwd(), 'node_modules', 'nestjs-telescope', 'dist', 'public'),
                join(process.cwd(), 'node_modules', 'nestjs-telescope', 'packages', 'core', 'public'),
                join('/app', 'node_modules', 'nestjs-telescope', 'public'),
                join('/app', 'node_modules', 'nestjs-telescope', 'dist', 'public'),
                join(__dirname, '..', '..', 'public'),
                join(__dirname, '..', '..', 'dist', 'public')
            ];
            for (const rootPath of possiblePaths) {
                const htmlPath = join(rootPath, 'index.html');
                if (existsSync(htmlPath)) {
                    res.setHeader('Content-Type', 'text/html');
                    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                    return res.sendFile('index.html', { root: rootPath });
                }
            }
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Telescope UI files not found. Checked paths:', possiblePaths);
            }
            return res.status(500).send('Telescope interface files not found');
        }
        if (req.url.startsWith('/telescope/assets/')) {
            const assetPath = req.url.replace(/^\/telescope\/assets\//, '');
            const { join } = require('path');
            const { existsSync } = require('fs');
            const possiblePaths = [
                join(__dirname, '..', 'public', 'assets'),
                join(__dirname, 'public', 'assets'),
                join(process.cwd(), 'node_modules', 'nestjs-telescope', 'public', 'assets'),
                join(process.cwd(), 'node_modules', 'nestjs-telescope', 'dist', 'public', 'assets'),
                join(process.cwd(), 'node_modules', 'nestjs-telescope', 'packages', 'core', 'public', 'assets'),
                join('/app', 'node_modules', 'nestjs-telescope', 'public', 'assets'),
                join('/app', 'node_modules', 'nestjs-telescope', 'dist', 'public', 'assets'),
                join(__dirname, '..', '..', 'public', 'assets'),
                join(__dirname, '..', '..', 'dist', 'public', 'assets')
            ];
            for (const rootPath of possiblePaths) {
                const fullAssetPath = join(rootPath, assetPath);
                if (existsSync(fullAssetPath)) {
                    const ext = assetPath.split('.').pop()?.toLowerCase();
                    if (ext === 'css') {
                        res.setHeader('Content-Type', 'text/css');
                    }
                    else if (ext === 'js') {
                        res.setHeader('Content-Type', 'application/javascript');
                    }
                    res.setHeader('Cache-Control', 'public, max-age=31536000');
                    return res.sendFile(assetPath, { root: rootPath });
                }
            }
            return res.status(404).send('Asset not found');
        }
        if (telescopeService) {
            if (req.url === '/telescope/api/entries' && req.method === 'GET') {
                const entries = telescopeService.getEntries();
                return res.json(entries);
            }
            if (req.url.match(/^\/telescope\/api\/entries\/[\w-]+$/) && req.method === 'GET') {
                const id = req.url.split('/').pop();
                const entry = telescopeService.getEntry?.(id);
                if (!entry)
                    return res.status(404).json({ message: 'Entry not found' });
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
        return res.status(404).send('Not found');
    };
}
let TelescopeModule = TelescopeModule_1 = class TelescopeModule {
    constructor(moduleRef, httpAdapterHost) {
        this.moduleRef = moduleRef;
        this.httpAdapterHost = httpAdapterHost;
    }
    onModuleInit() {
        if (!process.env.TELESCOPE_STANDALONE_SETUP) {
            const app = this.httpAdapterHost?.httpAdapter?.getInstance?.();
            const telescopeService = this.moduleRef.get(telescope_service_1.TelescopeService, { strict: false });
            if (app && typeof app.use === 'function' && telescopeService) {
                app.use(telescopeMiddlewareFactory(telescopeService));
            }
        }
    }
    static setup(app) {
        process.env.TELESCOPE_STANDALONE_SETUP = 'true';
        const httpAdapter = app.getHttpAdapter?.();
        const instance = httpAdapter?.getInstance?.();
        try {
            const { TelescopeService } = require('./telescope.service');
            const telescopeService = new TelescopeService();
            const { TelescopeInterceptor } = require('./telescope.interceptor');
            const { TelescopeExceptionFilter } = require('./telescope-exception.filter');
            app.useGlobalInterceptors(new TelescopeInterceptor(telescopeService));
            app.useGlobalFilters(new TelescopeExceptionFilter(telescopeService));
            if (instance && typeof instance.use === 'function') {
                instance.use(telescopeMiddlewareFactory(telescopeService));
            }
        }
        catch (error) {
            console.warn('Failed to setup Telescope:', error.message);
        }
    }
    static forRoot() {
        return {
            module: TelescopeModule_1,
            providers: [
                telescope_service_1.TelescopeService,
                telescope_basic_auth_guard_1.TelescopeBasicAuthGuard,
                {
                    provide: core_2.APP_INTERCEPTOR,
                    useClass: telescope_interceptor_1.TelescopeInterceptor,
                },
                {
                    provide: core_2.APP_FILTER,
                    useClass: telescope_exception_filter_1.TelescopeExceptionFilter,
                },
            ],
            exports: [telescope_service_1.TelescopeService],
        };
    }
};
exports.TelescopeModule = TelescopeModule;
exports.TelescopeModule = TelescopeModule = TelescopeModule_1 = __decorate([
    (0, common_1.Module)({
        providers: [
            telescope_service_1.TelescopeService,
            telescope_basic_auth_guard_1.TelescopeBasicAuthGuard,
            {
                provide: core_2.APP_INTERCEPTOR,
                useClass: telescope_interceptor_1.TelescopeInterceptor,
            },
            {
                provide: core_2.APP_FILTER,
                useClass: telescope_exception_filter_1.TelescopeExceptionFilter,
            },
        ],
        exports: [telescope_service_1.TelescopeService],
    }),
    __metadata("design:paramtypes", [core_1.ModuleRef,
        core_1.HttpAdapterHost])
], TelescopeModule);
//# sourceMappingURL=nest-telescope.module.js.map