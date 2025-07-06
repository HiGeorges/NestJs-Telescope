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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelescopeController = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const telescope_service_1 = require("./telescope.service");
const telescope_basic_auth_guard_1 = require("./telescope-basic-auth.guard");
let TelescopeController = class TelescopeController {
    constructor(telescopeService) {
        this.telescopeService = telescopeService;
    }
    async serveIndex(res) {
        try {
            const possiblePaths = [
                (0, path_1.join)(__dirname, '..', 'public'),
                (0, path_1.join)(__dirname, 'public'),
                (0, path_1.join)(process.cwd(), 'node_modules', 'nestjs-telescope', 'packages', 'core', 'public'),
                (0, path_1.join)(process.cwd(), 'node_modules', 'nestjs-telescope', 'dist', 'public')
            ];
            for (const rootPath of possiblePaths) {
                try {
                    res.sendFile('index.html', { root: rootPath });
                    return;
                }
                catch (fileError) {
                    console.log(`Failed to serve from ${rootPath}:`, fileError.message);
                }
            }
            res.status(500).send('Telescope interface files not found');
        }
        catch (error) {
            console.error('Error serving Telescope index:', error);
            res.status(500).send('Error loading Telescope interface');
        }
    }
    async serveAssets(req, res) {
        if (!req.url) {
            return res.status(400).send('Invalid request URL');
        }
        const assetPath = req.url.replace(/^\/telescope\/assets\//, '');
        const fullPath = (0, path_1.join)(__dirname, '..', 'public', 'assets', assetPath);
        res.sendFile(fullPath, (err) => {
            if (err)
                res.status(404).send('Asset not found');
        });
    }
    async serveViteSvg(res) {
        res.sendFile('vite.svg', { root: (0, path_1.join)(__dirname, '..', 'public') });
    }
    getEntries() {
        return this.telescopeService.getEntries();
    }
    getEntry(id) {
        return this.telescopeService.getEntry(id);
    }
    clearEntries() {
        this.telescopeService.clearEntries();
        return { message: 'Entries cleared successfully' };
    }
    getStats() {
        return this.telescopeService.getStats();
    }
};
exports.TelescopeController = TelescopeController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(telescope_basic_auth_guard_1.TelescopeBasicAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelescopeController.prototype, "serveIndex", null);
__decorate([
    (0, common_1.Get)('assets/*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelescopeController.prototype, "serveAssets", null);
__decorate([
    (0, common_1.Get)('vite.svg'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelescopeController.prototype, "serveViteSvg", null);
__decorate([
    (0, common_1.Get)('api/entries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TelescopeController.prototype, "getEntries", null);
__decorate([
    (0, common_1.Get)('api/entries/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TelescopeController.prototype, "getEntry", null);
__decorate([
    (0, common_1.Delete)('api/entries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TelescopeController.prototype, "clearEntries", null);
__decorate([
    (0, common_1.Get)('api/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TelescopeController.prototype, "getStats", null);
exports.TelescopeController = TelescopeController = __decorate([
    (0, common_1.Controller)('telescope'),
    __metadata("design:paramtypes", [telescope_service_1.TelescopeService])
], TelescopeController);
//# sourceMappingURL=telescope.controller.js.map