import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { PrismaService } from './prisma.service';

export interface ExtractedData {
  name?: string;
  phone?: string;
  budget?: string;
  area?: string;
  intent?: string;
  propertyType?: string;
}

export interface PropertyCard {
  id: string;
  title: string;
  price: number;
  priceUnit: string;
  location: string;
  type: string;
  purpose: string;
  area: number | null;
  areaUnit: string | null;
  image: string | null;
  features: string[];
}

export interface ChatResponse {
  message: string;
  properties: PropertyCard[];
  quickReplies: string[];
  extractedData: ExtractedData;
}

// Areas where we currently have properties
const AVAILABLE_AREAS = ['I-10', 'I-9', 'F-11', 'F-8', 'G-11'];

const EXTRACTION_PROMPT = `You are a data extraction bot for Square21 Marketing, a real estate company in Islamabad, Pakistan.

YOUR ONLY JOB: Extract structured data from the user's message. Return ONLY a JSON object, nothing else.

CONTEXT - We have properties in these areas:
- I-10 (I-10/1, I-10/3, I-10/4) — Houses for sale, commercial buildings for rent/sale
- I-9 (I-9/2, I-9 Markaz) — Warehouses and industrial sheds for rent
- F-11 (F-11/1, F-11 Markaz) — Apartments for rent
- F-8 (F-8/3) — Commercial space for rent
- G-11 (G-11/3) — Apartments for rent

EXTRACTION RULES:
- "intent": "SALE" if user wants to buy/purchase/invest/khareedna. "RENT" if rent/lease/kiraya. null if unclear.
- "area": Normalize to sector format like "I-10", "F-11", "G-11". For general sector refs like "F sectors" or "I sector" use just the letter like "F" or "I". For named areas use: "DHA", "Bahria Town", "Blue Area", "Gulberg", "PWD". Handle typos and Urdu. null if not mentioned.
- "name": Person's name if they share it. null if not mentioned.
- "phone": Phone number if shared (any format). null if not mentioned.
- "budget": Budget amount if mentioned. null if not mentioned.
- "propertyType": null (do not set this, we show all types).

IMPORTANT:
- Understand Urdu/Roman Urdu: "ghar" = house, "kiraya" = rent, "khareedna" = buy, "dukaan" = shop
- Handle typos: "sectores", "I 10", "i10", "F-11/1", "f eight" = "F-8"
- "i want", "i need", "i am" — the word "i" here is the English pronoun, NOT sector I. Only extract area when user clearly refers to a location.
- If user says "hello/hi/salam" with no property info, return all nulls
- If user says a button label like "Buy", "Rent", "I-Sectors", extract the intent/area from it
- "I-Sectors" or "I sector" = area "I", "F-Sectors" = area "F", etc.
- ONLY return the JSON object. No explanation, no text before or after.

ALREADY KNOWN about this visitor: {{KNOWN}}

Return: {"intent":null,"area":null,"name":null,"phone":null,"budget":null,"propertyType":null}`;

@Injectable()
export class LangChainService {
  private groq: Groq;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (!apiKey) throw new Error('GROQ_API_KEY is required');
    this.groq = new Groq({ apiKey });
  }

  async generateResponse(
    visitorId: string,
    userMessage: string,
    history: any[] = [],
    previousExtracted: ExtractedData = {},
  ): Promise<ChatResponse> {
    const msg = userMessage.trim();
    const lower = msg.toLowerCase();

    // Handle button shortcuts instantly (no AI needed)
    const buttonResult = this.handleButton(lower, previousExtracted);
    if (buttonResult) return buttonResult;

    // 1. AI extraction — 1 call per message, understands everything
    const extractedData = await this.extractWithAI(msg, previousExtracted);

    // 2. Search DB when we have both intent + area
    let properties: PropertyCard[] = [];
    if (extractedData.area && extractedData.intent) {
      properties = await this.searchProperties(extractedData);
    }

    // 3. Template response (no AI — predictable, professional)
    const message = this.buildResponse(extractedData, properties);

    // 4. Smart quick replies based on conversation state
    const quickReplies = this.getQuickReplies(extractedData, properties.length > 0);

    console.log(`[Chat] ${visitorId} | data:`, JSON.stringify(extractedData), `| ${properties.length} props`);

    return { message, properties, quickReplies, extractedData };
  }

  private handleButton(msg: string, prev: ExtractedData): ChatResponse | null {
    // Direct button clicks — instant response, no AI needed
    const buttonMap: Record<string, () => ChatResponse> = {
      'buy': () => this.makeResponse(
        'Great choice! Which area in Islamabad are you looking to buy in?',
        [], this.areaButtons(), { ...prev, intent: 'SALE' },
      ),
      'rent': () => this.makeResponse(
        'Sure! Which area would you like to rent in?',
        [], this.areaButtons(), { ...prev, intent: 'RENT' },
      ),
      'invest': () => this.makeResponse(
        'Smart move! Which area are you considering for investment?',
        [], this.areaButtons(), { ...prev, intent: 'SALE' },
      ),
      'talk to consultant': () => this.makeResponse(
        'Our property consultant will be happy to help! Please share your name and phone number, or WhatsApp us directly at +92 308 3333818.',
        [], [], { ...prev },
      ),
      'change area': () => this.makeResponse(
        'No problem! Which area would you prefer?',
        [], this.areaButtons(), { ...prev, area: undefined },
      ),
      'try another area': () => this.makeResponse(
        'No problem! Which area would you prefer?',
        [], this.areaButtons(), { ...prev, area: undefined },
      ),
    };

    if (buttonMap[msg]) return buttonMap[msg]();

    // Area buttons and free text — let AI flow handle them
    return null;
  }

  private async extractWithAI(msg: string, prev: ExtractedData): Promise<ExtractedData> {
    try {
      const knownData: Record<string, string | undefined> = {};
      if (prev.intent) knownData.intent = prev.intent;
      if (prev.area) knownData.area = prev.area;
      if (prev.name) knownData.name = prev.name;
      if (prev.phone) knownData.phone = prev.phone;
      if (prev.budget) knownData.budget = prev.budget;

      const systemPrompt = EXTRACTION_PROMPT.replace(
        '{{KNOWN}}',
        Object.keys(knownData).length > 0 ? JSON.stringify(knownData) : 'Nothing yet',
      );

      const response = await this.groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: msg },
        ],
        temperature: 0,
        max_tokens: 150,
      });

      const text = response.choices[0]?.message?.content || '';
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return {
          intent: this.clean(parsed.intent) || prev.intent,
          area: this.clean(parsed.area) || prev.area,
          name: this.clean(parsed.name) || prev.name,
          phone: this.clean(parsed.phone) || prev.phone,
          budget: this.clean(parsed.budget) || prev.budget,
          propertyType: prev.propertyType, // Don't let AI set this
        };
      }
    } catch (e: any) {
      console.error('[Chat] AI error:', e.message || e);
      // Fallback: try basic keyword extraction if AI fails
      return this.fallbackExtract(msg, prev);
    }
    return { ...prev };
  }

  private clean(val: any): string | undefined {
    if (!val || val === 'null' || val === 'N/A' || val === 'none') return undefined;
    return String(val).trim();
  }

  private fallbackExtract(msg: string, prev: ExtractedData): ExtractedData {
    const m = msg.toLowerCase();
    const result: ExtractedData = { ...prev };

    // Basic intent
    if (/buy|purchase|invest|khareed/i.test(m)) result.intent = 'SALE';
    else if (/rent|lease|kiraya/i.test(m)) result.intent = 'RENT';

    // Basic area: letter + number pattern
    const sector = m.match(/\b([efgi])\s*[-/]?\s*(\d{1,2})\b/);
    if (sector) result.area = `${sector[1].toUpperCase()}-${sector[2]}`;

    // Phone
    const phone = msg.replace(/[\s-]/g, '').match(/(?:\+?92|0)?3\d{9}/);
    if (phone) result.phone = phone[0];

    return result;
  }

  private buildResponse(data: ExtractedData, properties: PropertyCard[]): string {
    const hasContact = data.name && data.phone;
    const hasPrefs = data.area && data.intent;
    const action = data.intent === 'RENT' ? 'rent' : 'buy';

    // Contact captured — thank them
    if (hasContact) {
      return `Thank you, ${data.name}! Our property consultant will contact you at ${data.phone} shortly. You can also reach us on WhatsApp at +92 308 3333818.`;
    }

    // Have name but no phone
    if (data.name && !data.phone) {
      return `Thanks, ${data.name}! Could you also share your phone number so our consultant can reach you?`;
    }

    // Properties found
    if (hasPrefs && properties.length > 0) {
      return `We found ${properties.length} ${action === 'rent' ? 'rental' : ''} properties in ${data.area} for you. Share your name and phone number for personalized assistance from our consultant.`;
    }

    // No properties in this area
    if (hasPrefs && properties.length === 0) {
      const availableForIntent = data.intent === 'RENT'
        ? 'I-10, I-9, F-11, F-8, G-11'
        : 'I-10, I-10/1';
      return `We currently don't have ${action === 'rent' ? 'rental' : 'sale'} listings in ${data.area}. We have properties available in ${availableForIntent}. Would you like to explore another area, or talk to our consultant for off-market options?`;
    }

    // Have intent, need area
    if (data.intent && !data.area) {
      return `Which area in Islamabad are you interested in? We currently have properties in I-10, I-9, F-11, F-8, and G-11.`;
    }

    // Have area, need intent
    if (data.area && !data.intent) {
      return `Are you looking to buy or rent in ${data.area}?`;
    }

    // Fresh start
    return 'Welcome to Square21 Marketing! 👋 Are you looking to buy, rent, or invest in property in Islamabad?';
  }

  private getQuickReplies(data: ExtractedData, hasProperties: boolean): string[] {
    // Contact already captured
    if (data.name && data.phone) return [];

    // No intent yet
    if (!data.intent) return ['Buy', 'Rent', 'Invest', 'Talk to Consultant'];

    // No area yet
    if (!data.area) return ['I-Sectors', 'F-Sectors', 'G-Sectors', 'DHA', 'Bahria Town', 'Talk to Consultant'];

    // Have area + intent
    if (hasProperties) return ['Talk to Consultant', 'Change Area'];

    // No listings — suggest other areas
    return ['I-Sectors', 'F-Sectors', 'G-Sectors', 'Change Area', 'Talk to Consultant'];
  }

  private areaButtons(): string[] {
    return ['I-Sectors', 'F-Sectors', 'G-Sectors', 'DHA', 'Bahria Town', 'Talk to Consultant'];
  }

  private makeResponse(
    message: string, properties: PropertyCard[], quickReplies: string[], extractedData: ExtractedData,
  ): ChatResponse {
    return { message, properties, quickReplies, extractedData };
  }

  private async searchProperties(data: ExtractedData): Promise<PropertyCard[]> {
    try {
      const where: any = { status: 'AVAILABLE' };
      const conditions: any[] = [];

      if (data.area) {
        conditions.push({ location: { contains: data.area, mode: 'insensitive' } });
      }
      if (data.intent) {
        conditions.push({ purpose: data.intent });
      }

      if (conditions.length > 0) {
        where.AND = conditions;
      }

      const properties = await this.prisma.property.findMany({
        where,
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      return properties.map((p: any) => ({
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
    } catch (e) {
      console.error('[Chat] DB error:', e);
      return [];
    }
  }
}
