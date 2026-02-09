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
            where: { visitorId }
        });
        const conversationHistory = existingConvo?.history ? existingConvo.history : [];
        const { response, extractedData } = await this.langChainService.generateResponse(visitorId, message, conversationHistory);
        const updatedHistory = [
            ...conversationHistory,
            { role: 'user', text: message, timestamp: new Date().toISOString() },
            { role: 'model', text: response, timestamp: new Date().toISOString() }
        ];
        const conversation = await this.prisma.chatConversation.upsert({
            where: { visitorId },
            update: {
                history: updatedHistory
            },
            create: {
                visitorId,
                history: updatedHistory
            }
        });
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
    async captureLead(data) {
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
            take: 50
        });
    }
    async getChatLeads() {
        return this.prisma.chatLead.findMany({
            orderBy: { createdAt: 'desc' }
        });
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