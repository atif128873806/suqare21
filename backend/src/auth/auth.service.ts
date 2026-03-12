import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';
import { LoginDto, RegisterDto, VerifyOtpDto, ResendOtpDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Resend } from 'resend';

@Injectable()
export class AuthService {
  private resend: Resend;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      console.warn('RESEND_API_KEY is not set. Emails will not be sent.');
    }
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
  }

  private async sendOtpEmail(email: string, otp: string, name: string) {
    if (!this.resend) {
      console.log(`[DEV] OTP for ${email} is: ${otp}`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: 'Square21 <noreply@square21marketing.com>',
        to: email,
        subject: 'Verify your Square21 account',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Welcome to Square21, ${name}!</h2>
            <p>Please use the following OTP to verify your account. It will expire in 10 minutes.</p>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send OTP email:', error);
    }
  }

  async register(dto: RegisterDto) {
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user && (user as any).status !== 'PENDING') {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const otp = this.generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    if (user && (user as any).status === 'PENDING') {
      // User exists but has not verified OTP. Update the OTP and resend.
      user = await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          password: hashedPassword,
          name: dto.name,
          otp,
          otpExpiresAt,
        } as any,
      });
    } else {
      // New user registration
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          loginMethod: 'EMAIL' as any,
          status: 'PENDING' as any,
          otp,
          otpExpiresAt,
        } as any,
      });
    }

    // Send email asynchronously
    this.sendOtpEmail(user.email, otp, user.name || 'User');

    return {
      message: 'OTP sent successfully. Please check your email.',
      status: 'PENDING',
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if ((user as any).status !== 'PENDING') {
      throw new BadRequestException('User is already verified or disabled');
    }

    if (!(user as any).otp || !(user as any).otpExpiresAt || (user as any).otp !== dto.otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (new Date() > (user as any).otpExpiresAt) {
      throw new UnauthorizedException('OTP has expired');
    }

    // Mark user as ACTIVE and clear OTP
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'ACTIVE' as any,
        otp: null,
        otpExpiresAt: null,
      } as any,
    });

    return this.generateToken(updatedUser);
  }

  async resendOtp(dto: ResendOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Don't leak whether user exists or not for security
      return { message: 'If the email is registered and pending, an OTP will be sent.' };
    }

    if ((user as any).status !== 'PENDING') {
      return { message: 'If the email is registered and pending, an OTP will be sent.' };
    }

    const otp = this.generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiresAt,
      } as any,
    });

    // Send email asynchronously
    this.sendOtpEmail(user.email, otp, user.name || 'User');

    return {
      message: 'If the email is registered and pending, an OTP will be sent.',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if ((user as any).status === 'PENDING') {
      throw new UnauthorizedException('Please verify your email address first by entering the OTP sent to your email.::PENDING');
    }

    if ((user as any).status === 'DISABLED') {
      throw new UnauthorizedException('Account is disabled');
    }

    if (!user.password) {
      throw new UnauthorizedException('Please login with Google');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    // Update last active
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() } as any,
    });

    return this.generateToken(user);
  }

  async syncUser(dto: {
    email: string;
    name?: string;
    image?: string;
    googleId?: string;
    loginMethod: 'GOOGLE';
  }) {
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      if ((user as any).status === 'DISABLED')
        throw new UnauthorizedException('Account is disabled');

      // Update existing user with Google info, but preserve their existing role
      user = await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          googleId: dto.googleId || (user as any).googleId,
          image: dto.image || (user as any).image,
          name: dto.name || user.name,
          lastActive: new Date(),
          // Note: role is intentionally NOT updated here to preserve ADMIN status
        } as any,
      });
    } else {
      // Create new Google user
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          image: dto.image,
          googleId: dto.googleId,
          loginMethod: 'GOOGLE' as any,
          role: 'USER' as any,
          lastActive: new Date(),
          preferences: {
            receiveAll: true,
          },
        } as any,
      });
    }

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    };
  }
}
