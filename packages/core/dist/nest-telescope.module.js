"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestTelescopeModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const telescope_service_1 = require("./telescope.service");
const telescope_basic_auth_guard_1 = require("./telescope-basic-auth.guard");
const telescope_interceptor_1 = require("./telescope.interceptor");
const telescope_exception_filter_1 = require("./telescope-exception.filter");
const path_1 = require("path");
const fs_1 = require("fs");
let NestTelescopeModule = class NestTelescopeModule {
    configure(consumer) {
        consumer
            .apply(async (req, res, next) => {
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
                const possiblePaths = [
                    (0, path_1.join)(__dirname, '..', 'public'),
                    (0, path_1.join)(__dirname, 'public'),
                    (0, path_1.join)(process.cwd(), 'node_modules', 'nestjs-telescope', 'packages', 'core', 'public'),
                    (0, path_1.join)(process.cwd(), 'node_modules', 'nestjs-telescope', 'dist', 'public')
                ];
                for (const rootPath of possiblePaths) {
                    if ((0, fs_1.existsSync)((0, path_1.join)(rootPath, 'index.html'))) {
                        return res.sendFile('index.html', { root: rootPath });
                    }
                }
                return res.status(500).send('Telescope interface files not found');
            }
            if (req.url.startsWith('/telescope/assets/')) {
                const assetPath = req.url.replace(/^\/telescope\/assets\//, '');
                const possiblePaths = [
                    (0, path_1.join)(__dirname, '..', 'public', 'assets'),
                    (0, path_1.join)(__dirname, 'public', 'assets'),
                    (0, path_1.join)(process.cwd(), 'node_modules', 'nestjs-telescope', 'packages', 'core', 'public', 'assets'),
                    (0, path_1.join)(process.cwd(), 'node_modules', 'nestjs-telescope', 'dist', 'public', 'assets')
                ];
                for (const rootPath of possiblePaths) {
                    if ((0, fs_1.existsSync)((0, path_1.join)(rootPath, assetPath))) {
                        return res.sendFile(assetPath, { root: rootPath });
                    }
                }
                return res.status(404).send('Asset not found');
            }
            if (req.url === '/telescope/api/entries' && req.method === 'GET') {
                const entries = req.app.get(telescope_service_1.TelescopeService).getEntries();
                return res.json(entries);
            }
            if (req.url.match(/^\/telescope\/api\/entries\/[\w-]+$/) && req.method === 'GET') {
                const id = req.url.split('/').pop();
                const entry = req.app.get(telescope_service_1.TelescopeService).getEntryById?.(id);
                if (!entry)
                    return res.status(404).json({ message: 'Entry not found' });
                return res.json(entry);
            }
            if (req.url === '/telescope/api/entries' && req.method === 'DELETE') {
                req.app.get(telescope_service_1.TelescopeService).clearEntries();
                return res.json({ message: 'Entries cleared successfully' });
            }
            if (req.url === '/telescope/api/stats' && req.method === 'GET') {
                const stats = req.app.get(telescope_service_1.TelescopeService).getStats();
                return res.json(stats);
            }
            return res.status(404).send('Not found');
        })
            .forRoutes('*');
    }
};
exports.NestTelescopeModule = NestTelescopeModule;
exports.NestTelescopeModule = NestTelescopeModule = __decorate([
    (0, common_1.Module)({
        providers: [
            telescope_service_1.TelescopeService,
            telescope_basic_auth_guard_1.TelescopeBasicAuthGuard,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: telescope_interceptor_1.TelescopeInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: telescope_exception_filter_1.TelescopeExceptionFilter,
            },
        ],
    })
], NestTelescopeModule);
//# sourceMappingURL=nest-telescope.module.js.map