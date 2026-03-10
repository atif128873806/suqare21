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
exports.LangChainService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const google_genai_1 = require("@langchain/google-genai");
const prisma_service_1 = require("./prisma.service");
const prompts_1 = require("@langchain/core/prompts");
const output_parsers_1 = require("@langchain/core/output_parsers");
const messages_1 = require("@langchain/core/messages");
let LangChainService = class LangChainService {
    configService;
    prisma;
    model;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        this.model = new google_genai_1.ChatGoogleGenerativeAI({
            apiKey,
            model: 'gemini-2.5-flash-lite',
            maxOutputTokens: 1024,
            temperature: 0.7,
        });
    }
    async generateResponse(visitorId, userMessage, history = []) {
        const safeHistory = Array.isArray(history) ? history : [];
        const extractedData = this.extractUserInfoStructured(safeHistory, userMessage);
        let propertyContext = '';
        if (extractedData.area ||
            extractedData.propertyType ||
            extractedData.intent) {
            const properties = await this.searchProperties(extractedData);
            if (properties.length > 0) {
                propertyContext =
                    '\nRELEVANT PROPERTIES FOUND:\n' +
                        properties
                            .map((p) => `- ${p.title} in ${p.location}: ${p.price} ${p.priceUnit} (${p.type}, ${p.purpose})`)
                            .join('\n');
            }
            else {
                propertyContext =
                    '\nNo specific matching properties found in database currently. Continue being helpful.';
            }
        }
        console.log(`[Chatbot] Turn for ${visitorId}. Extracted:`, extractedData);
        const prompt = prompts_1.ChatPromptTemplate.fromMessages([
            [
                'system',
                `You are a Senior Real Estate Consultant at Square21 Marketing, the premier agency in Islamabad. 
Your goal is to provide expert guidance and transition leads into high-value consultations.

ISLAMABAD GEOGRAPHICAL EXPERTISE:
- CDA Sectors: E-7 (Elite), F-6/F-7 (Premium), F-8/F-10/F-11 (Modern Hubs), G-11 (Emerging), I-8/I-9/I-10 (Solid Investment).
- Luxury Areas: Bahria Town (Phase 7 & 8 are high-demand), DHA (Phase 2 & 5 for families), Gulberg Greens (Farmhouses), Bani Gala (Scenic Views).
- Commercial Hubs: Blue Area (Financial district), Centaurus, Centrally located malls and plazas.

COMPANY IDENTITY:
Square21 is known for transparency, local expertise, and luxury portfolio access.

CONVERSATION MEMORY:
{memory_text}

{property_context}

CONSULTATION PROTOCOL (CRITICAL):
1. **The Expert Advisor Phase**:
   - Check the CONVERSATION MEMORY. If the user provides everything in one message (Name, Phone, Area, Budget, Intent):
     - **MOVE IMMEDIATELY TO THE FINISH LINE**.
   - Otherwise, ask only for the specific missing piece.

2. **The Lead Capture Phase**:
   - If Name or Phone is missing from memory, politely request them.

3. **The Professional Closing (The "Finish Line")**:
   - **TRIGGER**: If Name, Phone, and core requirements are in memory:
     - **MANDATORY MESSAGE**: "Thank you, [Name]. I have captured your requirements for [Area]. One of our senior consultants will reach out to you at [Phone] shortly to discuss the best options. In the meantime, you can browse our exclusive catalog here: https://wa.me/923083333818"
     - **RULE**: Once the lead is complete, DO NOT ask more questions.

4. **TONE**:
   - Senior expert, authoritative, extremely helpful, and concise (1-2 sentences).`,
            ],
            new prompts_1.MessagesPlaceholder('chat_history'),
            ['human', '{input}'],
        ]);
        const chatHistory = safeHistory.map((h) => h && h.role?.toLowerCase() === 'user'
            ? new messages_1.HumanMessage(h.text || '')
            : new messages_1.AIMessage(h.text || ''));
        const chain = prompt.pipe(this.model).pipe(new output_parsers_1.StringOutputParser());
        try {
            const response = await chain.invoke({
                input: userMessage,
                chat_history: chatHistory,
                memory_text: this.formatMemoryText(extractedData),
                property_context: propertyContext,
            });
            return { response, extractedData };
        }
        catch (error) {
            console.error('[Chatbot] AI Error:', error);
            if (error.message?.includes('429') || error.message?.includes('quota')) {
                return {
                    response: 'I apologize, but I am currently experiencing a high volume of inquiries. Please call us directly at +92 308 3333818 so our human consultants can assist you immediately.',
                    extractedData,
                };
            }
            throw error;
        }
    }
    async searchProperties(data) {
        try {
            return await this.prisma.property.findMany({
                where: {
                    OR: [
                        data.area
                            ? {
                                location: { contains: data.area, mode: 'insensitive' },
                            }
                            : {},
                        data.propertyType ? { type: data.propertyType } : {},
                        data.intent ? { purpose: data.intent } : {},
                    ].filter((cond) => Object.keys(cond).length > 0),
                },
                take: 3,
            });
        }
        catch (e) {
            console.error('[Chatbot] Property Search Error:', e);
            return [];
        }
    }
    extractUserInfoStructured(history, currentMessage) {
        const allMessages = [
            ...history
                .filter((m) => m && m.role?.toLowerCase() === 'user')
                .map((m) => m.text),
            currentMessage,
        ];
        const combinedText = allMessages.join(' ').toLowerCase();
        const result = {};
        if (combinedText.includes('rent'))
            result.intent = 'RENT';
        else if (combinedText.includes('buy') ||
            combinedText.includes('sale') ||
            combinedText.includes('purchase'))
            result.intent = 'SALE';
        const sectorRegex = /\b([efghi]|dha|bahria|blue|gulberg|bani gala)[-\s]?(\d+|area|town|ph\d+|gala)\b/gi;
        const sectorsFound = combinedText.match(sectorRegex);
        if (sectorsFound)
            result.area = Array.from(new Set(sectorsFound)).join(', ').toUpperCase();
        if (combinedText.includes('house'))
            result.propertyType = 'RESIDENTIAL';
        else if (combinedText.includes('apartment') ||
            combinedText.includes('flat'))
            result.propertyType = 'RESIDENTIAL';
        else if (combinedText.includes('office') ||
            combinedText.includes('shop') ||
            combinedText.includes('commercial'))
            result.propertyType = 'COMMERCIAL';
        else if (combinedText.includes('plot'))
            result.propertyType = 'RESIDENTIAL';
        const budgetMatch = combinedText.match(/(\d+)\s*(lac|lakh|cr|crore|thousand|k)/i);
        if (budgetMatch)
            result.budget = budgetMatch[0].toUpperCase();
        const phoneMatch = combinedText.match(/(?:\+92|0|92)?[-\s]?(\d{7,12})/);
        if (phoneMatch)
            result.phone = phoneMatch[0];
        const nameMatch = currentMessage.match(/(?:my name is|i am|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
        if (nameMatch)
            result.name = nameMatch[1];
        return result;
    }
    formatMemoryText(data) {
        const lines = [];
        if (data.intent)
            lines.push(`- Intent: ${data.intent}`);
        if (data.area)
            lines.push(`- Area: ${data.area}`);
        if (data.propertyType)
            lines.push(`- Type: ${data.propertyType}`);
        if (data.budget)
            lines.push(`- Budget: ${data.budget}`);
        if (data.phone)
            lines.push(`- Phone: ${data.phone}`);
        if (data.name)
            lines.push(`- Name: ${data.name}`);
        return lines.length > 0
            ? lines.join('\n')
            : '- No client details captured yet.';
    }
};
exports.LangChainService = LangChainService;
exports.LangChainService = LangChainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], LangChainService);
//# sourceMappingURL=langchain.service.js.map