import { OnModuleInit } from '@nestjs/common';
import { ModuleRef, HttpAdapterHost } from '@nestjs/core';
import { TelescopeService } from './telescope.service';
export declare class TelescopeGlobalMiddlewareProvider implements OnModuleInit {
    private readonly httpAdapterHost;
    private readonly telescopeService;
    constructor(httpAdapterHost: HttpAdapterHost, telescopeService: TelescopeService);
    onModuleInit(): void;
}
export declare class NestTelescopeModule implements OnModuleInit {
    private readonly moduleRef;
    private readonly httpAdapterHost;
    constructor(moduleRef: ModuleRef, httpAdapterHost: HttpAdapterHost);
    onModuleInit(): void;
}
