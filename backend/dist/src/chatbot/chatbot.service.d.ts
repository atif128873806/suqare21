import { PrismaService } from '../common/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LangChainService } from '../common/langchain.service';
import { CaptureChatLeadDto } from './dto/chatbot.dto';
export declare class ChatbotService {
    private prisma;
    private configService;
    private langChainService;
    constructor(prisma: PrismaService, configService: ConfigService, langChainService: LangChainService);
    handleMessage(visitorId: string, message: string): Promise<{
        response: string;
        conversationId: string;
    }>;
    captureLead(data: CaptureChatLeadDto): Promise<{
        id: string;
        name: string;
        area: string | null;
        createdAt: Date;
        visitorId: string;
        phone: string;
        budget: string | null;
        intent: string | null;
        propertyType: string | null;
        source: string;
    }>;
    getConversations(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        visitorId: string;
        history: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getChatLeads(): Promise<{
        id: string;
        name: string;
        area: string | null;
        createdAt: Date;
        visitorId: string;
        phone: string;
        budget: string | null;
        intent: string | null;
        propertyType: string | null;
        source: string;
    }[]>;
}
