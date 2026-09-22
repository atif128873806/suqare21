import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LangChainService, ExtractedData, ChatResponse } from '../common/langchain.service';
import { CaptureChatLeadDto } from './dto/chatbot.dto';

@Injectable()
export class ChatbotService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private langChainService: LangChainService,
  ) {}

  async handleMessage(visitorId: string, message: string): Promise<ChatResponse> {
    const existingConvo = await this.prisma.chatConversation.findUnique({
      where: { visitorId },
    });

    const conversationHistory = existingConvo?.history
      ? (existingConvo.history as any[])
      : [];

    // Get previously extracted data
    const existingLead = await this.prisma.chatLead.findUnique({
      where: { visitorId },
    });

    const previousExtracted: ExtractedData = existingLead
      ? {
          name: existingLead.name !== 'Anonymous Visitor' ? existingLead.name : undefined,
          phone: existingLead.phone !== 'Not provided' ? existingLead.phone : undefined,
          budget: existingLead.budget || undefined,
          area: existingLead.area || undefined,
          intent: existingLead.intent || undefined,
          propertyType: existingLead.propertyType || undefined,
        }
      : {};

    const result = await this.langChainService.generateResponse(
      visitorId, message, conversationHistory, previousExtracted,
    );

    // Save conversation
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', text: message, timestamp: new Date().toISOString() },
      { role: 'model', text: result.message, timestamp: new Date().toISOString() },
    ];

    await this.prisma.chatConversation.upsert({
      where: { visitorId },
      update: { history: updatedHistory as any },
      create: { visitorId, history: updatedHistory as any },
    });

    // Save extracted data (upsert = no duplicates)
    const d = result.extractedData;
    if (d.name || d.phone || d.budget || d.area || d.intent) {
      await this.prisma.chatLead.upsert({
        where: { visitorId },
        update: {
          name: d.name || existingLead?.name || 'Anonymous Visitor',
          phone: d.phone || existingLead?.phone || 'Not provided',
          budget: d.budget || existingLead?.budget,
          area: d.area || existingLead?.area,
          intent: d.intent || existingLead?.intent,
          propertyType: d.propertyType || existingLead?.propertyType,
        },
        create: {
          visitorId,
          name: d.name || 'Anonymous Visitor',
          phone: d.phone || 'Not provided',
          budget: d.budget, area: d.area,
          intent: d.intent, propertyType: d.propertyType,
        },
      });

      // Create unified lead only once when we have real contact info
      if (d.name && d.phone) {
        const exists = await this.prisma.lead.findFirst({
          where: { phone: d.phone, source: 'CHATBOT' },
        });
        if (!exists) {
          await this.prisma.lead.create({
            data: {
              name: d.name, phone: d.phone,
              preferredArea: d.area, source: 'CHATBOT',
              message: `Budget: ${d.budget || 'N/A'}, Intent: ${d.intent || 'N/A'}, Type: ${d.propertyType || 'N/A'}`,
            },
          });
        }
      }
    }

    return result;
  }

  async captureLead(data: CaptureChatLeadDto) {
    return this.prisma.chatLead.upsert({
      where: { visitorId: data.visitorId },
      update: { name: data.name, phone: data.phone, budget: data.budget, area: data.area, intent: data.intent, propertyType: data.propertyType },
      create: { visitorId: data.visitorId, name: data.name, phone: data.phone, budget: data.budget, area: data.area, intent: data.intent, propertyType: data.propertyType },
    });
  }

  async getConversations() {
    return this.prisma.chatConversation.findMany({ orderBy: { updatedAt: 'desc' }, take: 50 });
  }

  async getChatLeads() {
    return this.prisma.chatLead.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
