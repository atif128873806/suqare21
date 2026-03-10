import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
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
