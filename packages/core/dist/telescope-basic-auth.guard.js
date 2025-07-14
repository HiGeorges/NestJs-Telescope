"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelescopeBasicAuthGuard = void 0;
const common_1 = require("@nestjs/common");
let TelescopeBasicAuthGuard = class TelescopeBasicAuthGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const isAuthEnabled = process.env.TELESCOPE_AUTH_ENABLED === 'true';
        const username = process.env.TELESCOPE_USER;
        const password = process.env.TELESCOPE_PASS;
        if (!isAuthEnabled || !username || !password) {
            return true;
        }
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            this.sendAuthChallenge(response);
            return false;
        }
        const credentials = this.decodeBasicAuth(authHeader);
        if (!credentials || credentials.username !== username || credentials.password !== password) {
            this.sendAuthChallenge(response);
            return false;
        }
        return true;
    }
    decodeBasicAuth(authHeader) {
        try {
            const base64Credentials = authHeader.replace('Basic ', '');
            const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
            const [username, password] = credentials.split(':');
            return { username, password };
        }
        catch (error) {
            return null;
        }
    }
    sendAuthChallenge(response) {
        response.setHeader('WWW-Authenticate', 'Basic realm="Telescope"');
        response.status(401).send('Authentication required.');
    }
};
exports.TelescopeBasicAuthGuard = TelescopeBasicAuthGuard;
exports.TelescopeBasicAuthGuard = TelescopeBasicAuthGuard = __decorate([
    (0, common_1.Injectable)()
], TelescopeBasicAuthGuard);
//# sourceMappingURL=telescope-basic-auth.guard.js.map