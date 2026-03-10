export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto extends LoginDto {
    name: string;
}
export declare class SyncUserDto {
    email: string;
    googleId: string;
    name?: string;
    image?: string;
    loginMethod: 'GOOGLE';
}
