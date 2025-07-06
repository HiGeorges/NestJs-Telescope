import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { TelescopeService } from './telescope.service';
export declare class TelescopeExceptionFilter implements ExceptionFilter {
    private readonly telescopeService;
    constructor(telescopeService: TelescopeService);
    catch(exception: unknown, host: ArgumentsHost): void;
    private shouldSkipRequest;
    private getClientIP;
    private sanitizeHeaders;
    private sanitizeBody;
}
