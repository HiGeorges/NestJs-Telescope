"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TELESCOPE_CONFIG = exports.TelescopeBasicAuthGuard = exports.TelescopeInterceptor = exports.TelescopeService = exports.TelescopeModule = void 0;
var nest_telescope_module_1 = require("./nest-telescope.module");
Object.defineProperty(exports, "TelescopeModule", { enumerable: true, get: function () { return nest_telescope_module_1.TelescopeModule; } });
var telescope_service_1 = require("./telescope.service");
Object.defineProperty(exports, "TelescopeService", { enumerable: true, get: function () { return telescope_service_1.TelescopeService; } });
var telescope_interceptor_1 = require("./telescope.interceptor");
Object.defineProperty(exports, "TelescopeInterceptor", { enumerable: true, get: function () { return telescope_interceptor_1.TelescopeInterceptor; } });
var telescope_basic_auth_guard_1 = require("./telescope-basic-auth.guard");
Object.defineProperty(exports, "TelescopeBasicAuthGuard", { enumerable: true, get: function () { return telescope_basic_auth_guard_1.TelescopeBasicAuthGuard; } });
exports.DEFAULT_TELESCOPE_CONFIG = {
    enabled: true,
    maxEntries: 1000,
    autoClearAfter: 24 * 60 * 60 * 1000,
    captureRequestBody: true,
    captureResponseBody: true,
    captureHeaders: true,
    captureQuery: true,
    captureIP: true,
    captureUserAgent: true,
};
//# sourceMappingURL=index.js.map