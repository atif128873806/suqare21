import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';
import { LoginDto, RegisterDto, VerifyOtpDto, ResendOtpDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private resend;
    constructor(prisma: PrismaService, jwtService: JwtService);
    private generateOtp;
    private sendOtpEmail;
    register(dto: RegisterDto): Promise<{
        message: string;
        status: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            image: any;
        };
    }>;
    resendOtp(dto: ResendOtpDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            image: any;
        };
    }>;
    syncUser(dto: {
        email: string;
        name?: string;
        image?: string;
        googleId?: string;
        loginMethod: 'GOOGLE';
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            image: any;
        };
    }>;
    private generateToken;
}
