"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelescopeService = void 0;
const common_1 = require("@nestjs/common");
let TelescopeService = class TelescopeService {
    constructor() {
        this.entries = [];
        this.maxEntries = 100;
    }
    addEntry(entry) {
        const newEntry = {
            ...entry,
            id: this.generateId(),
            timestamp: new Date(),
        };
        this.entries.unshift(newEntry);
        if (this.entries.length > this.maxEntries) {
            this.entries.splice(this.maxEntries);
        }
    }
    addDetailedRequestEntry(requestDetails, responseDetails) {
        this.addEntry({
            type: 'request',
            request: requestDetails,
            response: responseDetails,
            method: requestDetails.method,
            path: requestDetails.path,
            status: responseDetails.statusCode,
            duration: responseDetails.responseTime,
            headers: requestDetails.headers,
            body: requestDetails.body,
        });
    }
    addDetailedExceptionEntry(exceptionDetails, requestDetails) {
        this.addEntry({
            type: 'exception',
            exception: exceptionDetails,
            request: requestDetails,
            message: exceptionDetails.message,
            status: exceptionDetails.statusCode,
            stack: exceptionDetails.stack,
        });
    }
    addRequestEntry(method, path, status, duration, headers, body) {
        this.addEntry({
            type: 'request',
            method,
            path,
            status,
            duration,
            headers,
            body,
        });
    }
    addExceptionEntry(message, status, stack) {
        this.addEntry({
            type: 'exception',
            message,
            status,
            stack,
        });
    }
    getEntries() {
        return [...this.entries];
    }
    getEntry(id) {
        return this.entries.find(entry => entry.id === id) || null;
    }
    clearEntries() {
        this.entries.length = 0;
    }
    getStats() {
        const requests = this.entries.filter(entry => entry.type === 'request');
        const exceptions = this.entries.filter(entry => entry.type === 'exception');
        const totalDuration = requests.reduce((sum, entry) => sum + (entry.duration || 0), 0);
        const averageResponseTime = requests.length > 0 ? Math.round(totalDuration / requests.length) : 0;
        const uniqueIPs = new Set(requests.map(r => r.request?.ip).filter(Boolean)).size;
        const uniqueUserAgents = new Set(requests.map(r => r.request?.userAgent).filter(Boolean)).size;
        return {
            total: this.entries.length,
            requests: requests.length,
            exceptions: exceptions.length,
            averageResponseTime,
            uniqueIPs,
            uniqueUserAgents,
        };
    }
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};
exports.TelescopeService = TelescopeService;
exports.TelescopeService = TelescopeService = __decorate([
    (0, common_1.Injectable)()
], TelescopeService);
//# sourceMappingURL=telescope.service.js.map