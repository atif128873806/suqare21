import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LangChainService } from '../common/langchain.service';
import { CaptureChatLeadDto } from './dto/chatbot.dto';

@Injectable()
export class ChatbotService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        private langChainService: LangChainService
    ) { }

    async handleMessage(visitorId: string, message: string) {
        // Get existing conversation for context
        const existingConvo = await this.prisma.chatConversation.findUnique({
            where: { visitorId }
        });

        // Extract conversation history
        const conversationHistory = existingConvo?.history ? (existingConvo.history as any[]) : [];

        // Generate AI response using LangChain (with RAG and Extraction)
        const { response, extractedData } = await this.langChainService.generateResponse(visitorId, message, conversationHistory);

        // Correctly append to JSON history (Prisma Json fields don't support 'push')
        const updatedHistory = [
            ...conversationHistory,
            { role: 'user', text: message, timestamp: new Date().toISOString() },
            { role: 'model', text: response, timestamp: new Date().toISOString() }
        ];

        // Save/Update conversation history
        const conversation = await this.prisma.chatConversation.upsert({
            where: { visitorId },
            update: {
                history: updatedHistory as any
            },
            create: {
                visitorId,
                history: updatedHistory as any
            }
        });

        // 30% COMPLETION KEY: Automated Lead Capture
        // If we have at least Name or Phone, try to capture/update a lead
        if (extractedData.phone || extractedData.name) {
            await this.captureLead({
                visitorId,
                name: extractedData.name || 'Anonymous Visitor',
                phone: extractedData.phone || 'Not provided',
                budget: extractedData.budget,
                area: extractedData.area,
                intent: extractedData.intent,
                propertyType: extractedData.propertyType
            });
        }

        return { response, conversationId: conversation.id };
    }

    async captureLead(data: CaptureChatLeadDto) {
        // Save lead from chatbot
        const chatLead = await this.prisma.chatLead.upsert({
            where: { visitorId: data.visitorId },
            update: {
                name: data.name,
                phone: data.phone,
                budget: data.budget,
                area: data.area,
                intent: data.intent,
                propertyType: data.propertyType
            },
            create: {
                visitorId: data.visitorId,
                name: data.name,
                phone: data.phone,
                budget: data.budget,
                area: data.area,
                intent: data.intent,
                propertyType: data.propertyType
            }
        });

        // Also create a Lead entry for unified lead management
        await this.prisma.lead.create({
            data: {
                name: data.name,
                phone: data.phone,
                preferredArea: data.area,
                source: 'CHATBOT',
                message: `Budget: ${data.budget || 'Not specified'}, Intent: ${data.intent || 'Not specified'}, Property Type: ${data.propertyType || 'Not specified'}`
            }
        });

        return chatLead;
    }

    async getConversations() {
        return this.prisma.chatConversation.findMany({
            orderBy: { updatedAt: 'desc' },
            take: 50 // Limit to recent 50 conversations
        });
    }

    async getChatLeads() {
        return this.prisma.chatLead.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
}
