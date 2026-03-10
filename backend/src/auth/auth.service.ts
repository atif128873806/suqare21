import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        loginMethod: 'EMAIL' as any,
      },
    });

    return this.generateToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if ((user as any).status === 'DISABLED')
      throw new UnauthorizedException('Account is disabled');

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

      // Update existing user with Google info if not already set
      user = await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          googleId: dto.googleId || (user as any).googleId,
          image: dto.image || (user as any).image,
          name: dto.name || user.name,
          lastActive: new Date(),
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
