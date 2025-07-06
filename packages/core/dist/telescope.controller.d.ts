import { Response, Request } from 'express';
import { TelescopeService } from './telescope.service';
export declare class TelescopeController {
    private readonly telescopeService;
    constructor(telescopeService: TelescopeService);
    serveIndex(res: Response): Promise<void>;
    serveAssets(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    serveViteSvg(res: Response): Promise<void>;
    getEntries(): import("./telescope.service").TelescopeEntry[];
    getEntry(id: string): import("./telescope.service").TelescopeEntry;
    clearEntries(): {
        message: string;
    };
    getStats(): {
        total: number;
        requests: number;
        exceptions: number;
        averageResponseTime: number;
        uniqueIPs: number;
        uniqueUserAgents: number;
    };
}
