import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
export declare class LangChainService {
    private configService;
    private prisma;
    private model;
    constructor(configService: ConfigService, prisma: PrismaService);
    generateResponse(visitorId: string, userMessage: string, history?: any[]): Promise<{
        response: string;
        extractedData: any;
    }>;
    private searchProperties;
    private extractUserInfoStructured;
    private formatMemoryText;
}
