import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(64)
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;
}

export class SyncUserDto {
  @IsEmail()
  email: string;

  @IsString()
  googleId: string;

  @IsString()
  name?: string;

  @IsString()
  image?: string;

  @IsString()
  loginMethod: 'GOOGLE';
}

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  otp: string;
}

export class ResendOtpDto {
  @IsEmail()
  email: string;
}
