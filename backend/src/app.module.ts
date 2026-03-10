import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { CloudinaryModule } from './common/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { PropertyModule } from './property/property.module';
import { LeadModule } from './lead/lead.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { UsersModule } from './users/users.module';
import { NewsModule } from './news/news.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SubscribersModule } from './subscribers/subscribers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    CloudinaryModule,
    AuthModule,
    PropertyModule,
    LeadModule,
    ChatbotModule,
    UsersModule,
    NewsModule,
    NotificationsModule,
    SubscribersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
