import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
export interface ExtractedData {
    name?: string;
    phone?: string;
    budget?: string;
    area?: string;
    intent?: string;
    propertyType?: string;
}
export interface PropertyCard {
    id: string;
    title: string;
    price: number;
    priceUnit: string;
    location: string;
    type: string;
    purpose: string;
    area: number | null;
    areaUnit: string | null;
    image: string | null;
    features: string[];
}
export interface ChatResponse {
    message: string;
    properties: PropertyCard[];
    quickReplies: string[];
    extractedData: ExtractedData;
}
export declare class LangChainService {
    private configService;
    private prisma;
    private groq;
    constructor(configService: ConfigService, prisma: PrismaService);
    generateResponse(visitorId: string, userMessage: string, history?: any[], previousExtracted?: ExtractedData): Promise<ChatResponse>;
    private hasContactInfo;
    private extractFromKeywords;
    private extractWithAI;
    private buildTemplateResponse;
    private getQuickReplies;
    private searchProperties;
}
