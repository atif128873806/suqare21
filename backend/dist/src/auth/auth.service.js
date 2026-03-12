"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../common/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const resend_1 = require("resend");
let AuthService = class AuthService {
    prisma;
    jwtService;
    resend;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey) {
            this.resend = new resend_1.Resend(apiKey);
        }
        else {
            console.warn('RESEND_API_KEY is not set. Emails will not be sent.');
        }
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async sendOtpEmail(email, otp, name) {
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
        }
        catch (error) {
            console.error('Failed to send OTP email:', error);
        }
    }
    async register(dto) {
        let user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (user && user.status !== 'PENDING') {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const otp = this.generateOtp();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        if (user && user.status === 'PENDING') {
            user = await this.prisma.user.update({
                where: { email: dto.email },
                data: {
                    password: hashedPassword,
                    name: dto.name,
                    otp,
                    otpExpiresAt,
                },
            });
        }
        else {
            user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hashedPassword,
                    name: dto.name,
                    loginMethod: 'EMAIL',
                    status: 'PENDING',
                    otp,
                    otpExpiresAt,
                },
            });
        }
        this.sendOtpEmail(user.email, otp, user.name || 'User');
        return {
            message: 'OTP sent successfully. Please check your email.',
            status: 'PENDING',
        };
    }
    async verifyOtp(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (user.status !== 'PENDING') {
            throw new common_1.BadRequestException('User is already verified or disabled');
        }
        if (!user.otp || !user.otpExpiresAt || user.otp !== dto.otp) {
            throw new common_1.UnauthorizedException('Invalid OTP');
        }
        if (new Date() > user.otpExpiresAt) {
            throw new common_1.UnauthorizedException('OTP has expired');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                status: 'ACTIVE',
                otp: null,
                otpExpiresAt: null,
            },
        });
        return this.generateToken(updatedUser);
    }
    async resendOtp(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            return { message: 'If the email is registered and pending, an OTP will be sent.' };
        }
        if (user.status !== 'PENDING') {
            return { message: 'If the email is registered and pending, an OTP will be sent.' };
        }
        const otp = this.generateOtp();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                otp,
                otpExpiresAt,
            },
        });
        this.sendOtpEmail(user.email, otp, user.name || 'User');
        return {
            message: 'If the email is registered and pending, an OTP will be sent.',
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (user.status === 'PENDING') {
            throw new common_1.UnauthorizedException('Please verify your email address first by entering the OTP sent to your email.::PENDING');
        }
        if (user.status === 'DISABLED') {
            throw new common_1.UnauthorizedException('Account is disabled');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Please login with Google');
        }
        const isValid = await bcrypt.compare(dto.password, user.password);
        if (!isValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastActive: new Date() },
        });
        return this.generateToken(user);
    }
    async syncUser(dto) {
        let user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (user) {
            if (user.status === 'DISABLED')
                throw new common_1.UnauthorizedException('Account is disabled');
            user = await this.prisma.user.update({
                where: { email: dto.email },
                data: {
                    googleId: dto.googleId || user.googleId,
                    image: dto.image || user.image,
                    name: dto.name || user.name,
                    lastActive: new Date(),
                },
            });
        }
        else {
            user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,
                    image: dto.image,
                    googleId: dto.googleId,
                    loginMethod: 'GOOGLE',
                    role: 'USER',
                    lastActive: new Date(),
                    preferences: {
                        receiveAll: true,
                    },
                },
            });
        }
        return this.generateToken(user);
    }
    generateToken(user) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map