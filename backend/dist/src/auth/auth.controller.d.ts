import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, SyncUserDto, VerifyOtpDto, ResendOtpDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        status: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            image: any;
        };
    }>;
    resendOtp(resendOtpDto: ResendOtpDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            image: any;
        };
    }>;
    syncUser(syncUserDto: SyncUserDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            image: any;
        };
    }>;
}
