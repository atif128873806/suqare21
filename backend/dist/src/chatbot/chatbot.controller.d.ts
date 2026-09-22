import { ChatbotService } from './chatbot.service';
import { ChatMessageDto, CaptureChatLeadDto } from './dto/chatbot.dto';
export declare class ChatbotController {
    private readonly chatbotService;
    constructor(chatbotService: ChatbotService);
    handleMessage(body: ChatMessageDto): Promise<import("../common/langchain.service").ChatResponse>;
    captureLead(body: CaptureChatLeadDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        area: string | null;
        phone: string;
        budget: string | null;
        source: string;
        intent: string | null;
        propertyType: string | null;
        visitorId: string;
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
        intent: string | null;
        propertyType: string | null;
        visitorId: string;
    }[]>;
}
