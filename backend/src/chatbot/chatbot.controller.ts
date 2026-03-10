import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatbotService } from './chatbot.service';
import { ChatMessageDto, CaptureChatLeadDto } from './dto/chatbot.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  async handleMessage(@Body() body: ChatMessageDto) {
    return this.chatbotService.handleMessage(body.visitorId, body.message);
  }

  @Post('capture-lead')
  async captureLead(@Body() body: CaptureChatLeadDto) {
    return this.chatbotService.captureLead(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('conversations')
  async getConversations() {
    return this.chatbotService.getConversations();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('leads')
  async getChatLeads() {
    return this.chatbotService.getChatLeads();
  }
}
