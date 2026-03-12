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
        name: string;
        id: string;
        createdAt: Date;
        area: string | null;
        phone: string;
        budget: string | null;
        source: string;
        visitorId: string;
        intent: string | null;
        propertyType: string | null;
    }>;
    getConversations(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        visitorId: string;
        history: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getChatLeads(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        area: string | null;
        phone: string;
        budget: string | null;
        source: string;
        visitorId: string;
        intent: string | null;
        propertyType: string | null;
    }[]>;
}
