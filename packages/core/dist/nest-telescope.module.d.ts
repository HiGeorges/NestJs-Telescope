import { OnModuleInit } from '@nestjs/common';
import { ModuleRef, HttpAdapterHost } from '@nestjs/core';
export declare class NestTelescopeModule implements OnModuleInit {
    private readonly moduleRef;
    private readonly httpAdapterHost;
    constructor(moduleRef: ModuleRef, httpAdapterHost: HttpAdapterHost);
    onModuleInit(): void;
    static setup(app: any): void;
}
