import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class SubscribersService {
    constructor(private prisma: PrismaService) { }

    async create(email: string) {
        try {
            return await this.prisma.subscriber.create({
                data: { email },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('This email is already subscribed.');
            }
            throw error;
        }
    }

    async findAll() {
        return this.prisma.subscriber.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async remove(id: string) {
        return this.prisma.subscriber.delete({
            where: { id },
        });
    }
}
