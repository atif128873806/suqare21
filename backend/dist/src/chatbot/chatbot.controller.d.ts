import { ChatbotService } from './chatbot.service';
import { ChatMessageDto, CaptureChatLeadDto } from './dto/chatbot.dto';
export declare class ChatbotController {
    private readonly chatbotService;
    constructor(chatbotService: ChatbotService);
    handleMessage(body: ChatMessageDto): Promise<{
        response: string;
        conversationId: string;
    }>;
    captureLead(body: CaptureChatLeadDto): Promise<{
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
