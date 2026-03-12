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
        image: string | null;
        email: string;
        password: string | null;
        name: string | null;
        googleId: string | null;
        loginMethod: import(".prisma/client").$Enums.LoginMethod;
        otp: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastActive: Date | null;
        location: string | null;
        preferences: import("@prisma/client/runtime/client").JsonValue | null;
        status: import(".prisma/client").$Enums.UserStatus;
        role: import(".prisma/client").$Enums.UserRole;
        otpExpiresAt: Date | null;
    }>;
}
export {};
