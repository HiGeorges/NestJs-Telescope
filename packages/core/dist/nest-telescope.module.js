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
const telescope_controller_1 = require("./telescope.controller");
const telescope_exception_filter_1 = require("./telescope-exception.filter");
const telescope_interceptor_1 = require("./telescope.interceptor");
const telescope_service_1 = require("./telescope.service");
const telescope_basic_auth_guard_1 = require("./telescope-basic-auth.guard");
let NestTelescopeModule = class NestTelescopeModule {
};
exports.NestTelescopeModule = NestTelescopeModule;
exports.NestTelescopeModule = NestTelescopeModule = __decorate([
    (0, common_1.Module)({
        controllers: [telescope_controller_1.TelescopeController],
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
        exports: [telescope_service_1.TelescopeService],
    })
], NestTelescopeModule);
//# sourceMappingURL=nest-telescope.module.js.map