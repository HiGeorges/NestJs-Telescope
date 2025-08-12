import { OnModuleInit } from '@nestjs/common';
import { ModuleRef, HttpAdapterHost } from '@nestjs/core';
import { TelescopeService } from './telescope.service';
import { TelescopeBasicAuthGuard } from './telescope-basic-auth.guard';
import { TelescopeInterceptor } from './telescope.interceptor';
import { TelescopeExceptionFilter } from './telescope-exception.filter';
export declare class TelescopeModule implements OnModuleInit {
    private readonly moduleRef;
    private readonly httpAdapterHost;
    constructor(moduleRef: ModuleRef, httpAdapterHost: HttpAdapterHost);
    onModuleInit(): void;
    static setup(app: any): void;
    static forRoot(): {
        module: typeof TelescopeModule;
        providers: (typeof TelescopeService | typeof TelescopeBasicAuthGuard | {
            provide: string;
            useClass: typeof TelescopeInterceptor;
        } | {
            provide: string;
            useClass: typeof TelescopeExceptionFilter;
        })[];
        exports: (typeof TelescopeService)[];
    };
}
