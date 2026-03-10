import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PrismaService } from './prisma.service';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';

@Injectable()
export class LangChainService {
  private model: ChatGoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.model = new ChatGoogleGenerativeAI({
      apiKey,
      model: 'gemini-2.5-flash-lite',
      maxOutputTokens: 1024,
      temperature: 0.7,
    });
  }

  async generateResponse(
    visitorId: string,
    userMessage: string,
    history: any[] = [],
  ) {
    // Safe history check
    const safeHistory = Array.isArray(history) ? history : [];

    // 1. Extract what we know so far as structured data
    const extractedData = this.extractUserInfoStructured(
      safeHistory,
      userMessage,
    );

    // 2. Search for relevant properties if user is looking for something
    let propertyContext = '';
    if (
      extractedData.area ||
      extractedData.propertyType ||
      extractedData.intent
    ) {
      const properties = await this.searchProperties(extractedData);
      if (properties.length > 0) {
        propertyContext =
          '\nRELEVANT PROPERTIES FOUND:\n' +
          properties
            .map(
              (p: any) =>
                `- ${p.title} in ${p.location}: ${p.price} ${p.priceUnit} (${p.type}, ${p.purpose})`,
            )
            .join('\n');
      } else {
        propertyContext =
          '\nNo specific matching properties found in database currently. Continue being helpful.';
      }
    }

    console.log(`[Chatbot] Turn for ${visitorId}. Extracted:`, extractedData);

    // 3. Prepare the Professional Consultant Prompt
    const prompt = ChatPromptTemplate.fromMessages([
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
      new MessagesPlaceholder('chat_history'),
      ['human', '{input}'],
    ]);

    // 4. Convert history to LangChain format
    const chatHistory = safeHistory.map((h) =>
      h && h.role?.toLowerCase() === 'user'
        ? new HumanMessage(h.text || '')
        : new AIMessage(h.text || ''),
    );

    // 5. Create and invoke the chain
    const chain = prompt.pipe(this.model).pipe(new StringOutputParser());

    try {
      const response = await chain.invoke({
        input: userMessage,
        chat_history: chatHistory,
        memory_text: this.formatMemoryText(extractedData),
        property_context: propertyContext,
      });
      return { response, extractedData };
    } catch (error: any) {
      console.error('[Chatbot] AI Error:', error);
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        return {
          response:
            'I apologize, but I am currently experiencing a high volume of inquiries. Please call us directly at +92 308 3333818 so our human consultants can assist you immediately.',
          extractedData,
        };
      }
      throw error;
    }
  }

  private async searchProperties(data: any) {
    try {
      return await this.prisma.property.findMany({
        where: {
          OR: [
            data.area
              ? {
                  location: { contains: data.area, mode: 'insensitive' as any },
                }
              : {},
            data.propertyType ? { type: data.propertyType } : {},
            data.intent ? { purpose: data.intent } : {},
          ].filter((cond) => Object.keys(cond).length > 0) as any,
        },
        take: 3,
      });
    } catch (e) {
      console.error('[Chatbot] Property Search Error:', e);
      return [];
    }
  }

  private extractUserInfoStructured(history: any[], currentMessage: string) {
    const allMessages = [
      ...history
        .filter((m) => m && m.role?.toLowerCase() === 'user')
        .map((m) => m.text),
      currentMessage,
    ];
    const combinedText = allMessages.join(' ').toLowerCase();

    const result: any = {};

    if (combinedText.includes('rent')) result.intent = 'RENT';
    else if (
      combinedText.includes('buy') ||
      combinedText.includes('sale') ||
      combinedText.includes('purchase')
    )
      result.intent = 'SALE';

    const sectorRegex =
      /\b([efghi]|dha|bahria|blue|gulberg|bani gala)[-\s]?(\d+|area|town|ph\d+|gala)\b/gi;
    const sectorsFound = combinedText.match(sectorRegex);
    if (sectorsFound)
      result.area = Array.from(new Set(sectorsFound)).join(', ').toUpperCase();

    if (combinedText.includes('house')) result.propertyType = 'RESIDENTIAL';
    else if (
      combinedText.includes('apartment') ||
      combinedText.includes('flat')
    )
      result.propertyType = 'RESIDENTIAL';
    else if (
      combinedText.includes('office') ||
      combinedText.includes('shop') ||
      combinedText.includes('commercial')
    )
      result.propertyType = 'COMMERCIAL';
    else if (combinedText.includes('plot')) result.propertyType = 'RESIDENTIAL'; // Usually residential unless specified

    const budgetMatch = combinedText.match(
      /(\d+)\s*(lac|lakh|cr|crore|thousand|k)/i,
    );
    if (budgetMatch) result.budget = budgetMatch[0].toUpperCase();

    const phoneMatch = combinedText.match(/(?:\+92|0|92)?[-\s]?(\d{7,12})/);
    if (phoneMatch) result.phone = phoneMatch[0];

    const nameMatch = currentMessage.match(
      /(?:my name is|i am|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    );
    if (nameMatch) result.name = nameMatch[1];

    return result;
  }

  private formatMemoryText(data: any): string {
    const lines = [];
    if (data.intent) lines.push(`- Intent: ${data.intent}`);
    if (data.area) lines.push(`- Area: ${data.area}`);
    if (data.propertyType) lines.push(`- Type: ${data.propertyType}`);
    if (data.budget) lines.push(`- Budget: ${data.budget}`);
    if (data.phone) lines.push(`- Phone: ${data.phone}`);
    if (data.name) lines.push(`- Name: ${data.name}`);

    return lines.length > 0
      ? lines.join('\n')
      : '- No client details captured yet.';
  }
}
