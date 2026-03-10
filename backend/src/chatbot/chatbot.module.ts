import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { CommonModule } from '../common/common.module';
import { LangChainService } from '../common/langchain.service';

@Module({
  imports: [CommonModule],
  providers: [ChatbotService, LangChainService],
  controllers: [ChatbotController],
})
export class ChatbotModule {}
