import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('subscribers')
export class SubscribersController {
    constructor(private readonly subscribersService: SubscribersService) { }

    @Post()
    subscribe(@Body('email') email: string) {
        return this.subscribersService.create(email);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    findAll() {
        return this.subscribersService.findAll();
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    remove(@Param('id') id: string) {
        return this.subscribersService.remove(id);
    }
}
