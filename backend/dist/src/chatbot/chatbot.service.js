"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const config_1 = require("@nestjs/config");
const langchain_service_1 = require("../common/langchain.service");
let ChatbotService = class ChatbotService {
    prisma;
    configService;
    langChainService;
    constructor(prisma, configService, langChainService) {
        this.prisma = prisma;
        this.configService = configService;
        this.langChainService = langChainService;
    }
    async handleMessage(visitorId, message) {
        const existingConvo = await this.prisma.chatConversation.findUnique({
            where: { visitorId },
        });
        const conversationHistory = existingConvo?.history
            ? existingConvo.history
            : [];
        const existingLead = await this.prisma.chatLead.findUnique({
            where: { visitorId },
        });
        const previousExtracted = existingLead
            ? {
                name: existingLead.name !== 'Anonymous Visitor' ? existingLead.name : undefined,
                phone: existingLead.phone !== 'Not provided' ? existingLead.phone : undefined,
                budget: existingLead.budget || undefined,
                area: existingLead.area || undefined,
                intent: existingLead.intent || undefined,
                propertyType: existingLead.propertyType || undefined,
            }
            : {};
        const result = await this.langChainService.generateResponse(visitorId, message, conversationHistory, previousExtracted);
        const updatedHistory = [
            ...conversationHistory,
            { role: 'user', text: message, timestamp: new Date().toISOString() },
            { role: 'model', text: result.message, timestamp: new Date().toISOString() },
        ];
        await this.prisma.chatConversation.upsert({
            where: { visitorId },
            update: { history: updatedHistory },
            create: { visitorId, history: updatedHistory },
        });
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
    async captureLead(data) {
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
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        langchain_service_1.LangChainService])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map