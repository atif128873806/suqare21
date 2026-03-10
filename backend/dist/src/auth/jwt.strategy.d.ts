import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: any): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.UserStatus;
        location: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        googleId: string | null;
        password: string | null;
        image: string | null;
        lastActive: Date | null;
        loginMethod: import(".prisma/client").$Enums.LoginMethod;
        preferences: import("@prisma/client/runtime/client").JsonValue | null;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
}
export {};
