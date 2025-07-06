import { Response } from 'express';
import { TelescopeService } from './telescope.service';
export declare class TelescopeController {
    private readonly telescopeService;
    constructor(telescopeService: TelescopeService);
    getInterface(res: Response): Promise<void>;
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
