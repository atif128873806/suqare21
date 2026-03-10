import { Module } from '@nestjs/common';
import { SubscribersController } from './subscribers.controller';
import { SubscribersService } from './subscribers.service';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    controllers: [SubscribersController],
    providers: [SubscribersService],
})
export class SubscribersModule { }
