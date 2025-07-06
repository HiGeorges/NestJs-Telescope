import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class TelescopeBasicAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
    private decodeBasicAuth;
    private sendAuthChallenge;
}
