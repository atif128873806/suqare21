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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangChainService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const prisma_service_1 = require("./prisma.service");
const INTENT_MAP = {
    buy: 'SALE', purchase: 'SALE', invest: 'SALE', investment: 'SALE', khareed: 'SALE', kharidna: 'SALE',
    rent: 'RENT', lease: 'RENT', kiraya: 'RENT', kiray: 'RENT',
};
function detectArea(msg) {
    const m = msg.toLowerCase().replace(/\s+/g, ' ').trim();
    const sectorMatch = m.match(/\b([efgi])\s*[-/]?\s*(\d{1,2})\b/);
    if (sectorMatch) {
        const letter = sectorMatch[1].toUpperCase();
        const num = sectorMatch[2];
        return `${letter}-${num}`;
    }
    if (/dha|defence|defense/.test(m))
        return 'DHA';
    if (/bahria/.test(m))
        return 'Bahria Town';
    if (/blue\s*area/.test(m))
        return 'Blue Area';
    if (/gulberg/.test(m))
        return 'Gulberg';
    if (/pwd/.test(m))
        return 'PWD';
    const generalSector = m.match(/\b([efgi])\s*[-]?\s*sectors?\b/);
    if (generalSector)
        return generalSector[1].toUpperCase();
    return null;
}
let LangChainService = class LangChainService {
    configService;
    prisma;
    groq;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const apiKey = this.configService.get('GROQ_API_KEY');
        if (!apiKey)
            throw new Error('GROQ_API_KEY is required');
        this.groq = new groq_sdk_1.default({ apiKey });
    }
    async generateResponse(visitorId, userMessage, history = [], previousExtracted = {}) {
        const lowerMsg = userMessage.toLowerCase().trim();
        if (lowerMsg === 'change area' || lowerMsg === 'try another area') {
            return {
                message: 'Sure! Which area would you prefer?',
                properties: [],
                quickReplies: ['DHA', 'Bahria Town', 'F-Sectors', 'E-Sectors', 'I-Sectors', 'G-Sectors'],
                extractedData: { ...previousExtracted, area: undefined },
            };
        }
        const extractedData = this.extractFromKeywords(lowerMsg, previousExtracted);
        const needsAI = !extractedData.intent && !previousExtracted.intent;
        let aiUsed = false;
        if (needsAI || this.hasContactInfo(lowerMsg)) {
            const aiExtracted = await this.extractWithAI(lowerMsg, previousExtracted);
            Object.assign(extractedData, {
                name: aiExtracted.name || extractedData.name,
                phone: aiExtracted.phone || extractedData.phone,
                budget: aiExtracted.budget || extractedData.budget,
                area: aiExtracted.area || extractedData.area,
                intent: aiExtracted.intent || extractedData.intent,
                propertyType: aiExtracted.propertyType || extractedData.propertyType,
            });
            aiUsed = true;
        }
        let properties = [];
        if (extractedData.area && extractedData.intent) {
            properties = await this.searchProperties(extractedData);
        }
        const message = this.buildTemplateResponse(extractedData, properties);
        const quickReplies = this.getQuickReplies(extractedData, properties.length > 0);
        console.log(`[Chat] ${visitorId} | ai:${aiUsed} | data:`, extractedData, `| ${properties.length} props`);
        return { message, properties, quickReplies, extractedData };
    }
    hasContactInfo(msg) {
        return /\d{10,}/.test(msg.replace(/[\s-+]/g, '')) || /my name is|i am |i'm |mera naam/i.test(msg);
    }
    extractFromKeywords(msg, prev) {
        const result = { ...prev };
        for (const [keyword, value] of Object.entries(INTENT_MAP)) {
            if (msg.includes(keyword)) {
                result.intent = value;
                break;
            }
        }
        const detectedArea = detectArea(msg);
        if (detectedArea) {
            result.area = detectedArea;
        }
        if (/house|home|makaan|ghar|plot|flat|apartment/i.test(msg)) {
            result.propertyType = 'RESIDENTIAL';
        }
        else if (/shop|office|warehouse|commercial|dukaan/i.test(msg)) {
            result.propertyType = 'COMMERCIAL';
        }
        return result;
    }
    async extractWithAI(msg, prev) {
        try {
            const response = await this.groq.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: 'system',
                        content: `Extract info from this message. Return ONLY JSON.
Known: ${JSON.stringify(prev)}
{"name":null,"phone":null,"budget":null,"area":null,"intent":null,"propertyType":null}
buy/invest="SALE", rent="RENT", house/plot="RESIDENTIAL", shop/office="COMMERCIAL". Keep known values.`,
                    },
                    { role: 'user', content: msg },
                ],
                temperature: 0,
                max_tokens: 100,
            });
            const text = response.choices[0]?.message?.content || '';
            const match = text.match(/\{[\s\S]*\}/);
            if (match) {
                const parsed = JSON.parse(match[0]);
                return {
                    name: parsed.name || prev.name || undefined,
                    phone: parsed.phone || prev.phone || undefined,
                    budget: parsed.budget || prev.budget || undefined,
                    area: parsed.area || prev.area || undefined,
                    intent: parsed.intent || prev.intent || undefined,
                    propertyType: parsed.propertyType || prev.propertyType || undefined,
                };
            }
        }
        catch (e) {
            console.error('[Chat] AI extraction error:', e);
        }
        return prev;
    }
    buildTemplateResponse(data, properties) {
        const hasContact = data.name && data.phone;
        const hasPrefs = data.area && data.intent;
        if (hasContact) {
            return `Thank you ${data.name}! Our consultant will call you at ${data.phone} shortly. You can also WhatsApp us at +92 308 3333818.`;
        }
        if (hasPrefs && properties.length > 0) {
            return `Here are some options in ${data.area} for you. If you'd like more details, share your name and phone number and our consultant will assist you.`;
        }
        if (hasPrefs && properties.length === 0) {
            return `We don't have listings in ${data.area} right now, but our consultant can help find off-market options. Try another area or talk to our consultant directly.`;
        }
        if (data.intent && !data.area) {
            const action = data.intent === 'SALE' ? 'buy' : 'rent';
            return `Great choice! Which area in Islamabad would you like to ${action} in?`;
        }
        return "Welcome to Square21 Marketing! Are you looking to buy, rent, or invest in property?";
    }
    getQuickReplies(data, hasProperties) {
        if (!data.intent) {
            return ['Buy', 'Rent', 'Invest', 'Talk to Consultant'];
        }
        if (!data.area) {
            return ['DHA', 'Bahria Town', 'F-Sectors', 'E-Sectors', 'I-Sectors', 'G-Sectors'];
        }
        if (hasProperties) {
            return ['Talk to Consultant', 'Change Area'];
        }
        return ['DHA', 'Bahria Town', 'F-Sectors', 'E-Sectors', 'Talk to Consultant'];
    }
    async searchProperties(data) {
        try {
            const where = { status: 'AVAILABLE' };
            const conditions = [];
            if (data.area) {
                conditions.push({ location: { contains: data.area, mode: 'insensitive' } });
            }
            if (data.propertyType) {
                conditions.push({ type: data.propertyType });
            }
            if (data.intent) {
                conditions.push({ purpose: data.intent });
            }
            if (conditions.length > 0) {
                where.AND = conditions;
            }
            const properties = await this.prisma.property.findMany({
                where,
                take: 3,
                orderBy: { createdAt: 'desc' },
            });
            return properties.map((p) => ({
                id: p.id,
                title: p.title,
                price: p.price,
                priceUnit: p.priceUnit || 'PKR',
                location: p.location,
                type: p.type,
                purpose: p.purpose,
                area: p.area,
                areaUnit: p.areaUnit,
                image: p.images?.[0] || null,
                features: p.features?.slice(0, 3) || [],
            }));
        }
        catch (e) {
            console.error('[Chat] DB error:', e);
            return [];
        }
    }
};
exports.LangChainService = LangChainService;
exports.LangChainService = LangChainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], LangChainService);
//# sourceMappingURL=langchain.service.js.map