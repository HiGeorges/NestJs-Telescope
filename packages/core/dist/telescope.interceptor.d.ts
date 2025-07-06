import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TelescopeService } from './telescope.service';
export declare class TelescopeInterceptor implements NestInterceptor {
    private readonly telescopeService;
    constructor(telescopeService: TelescopeService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private shouldSkipRequest;
    private getClientIP;
    private sanitizeHeaders;
    private sanitizeBody;
}
