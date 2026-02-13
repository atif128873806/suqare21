import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';

@Injectable()
export class PropertyService {
    constructor(private prisma: PrismaService) { }

    async create(createPropertyDto: CreatePropertyDto) {
        try {
            return await this.prisma.property.create({
                data: createPropertyDto,
            });
        } catch (error) {
            console.error('Prisma Create Error:', error);
            throw error;
        }
    }

    async findAll(filters: any) {
        const { type, purpose, minPrice, maxPrice, location, search } = filters;

        // Convert string filters to uppercase enum values
        const whereClause: any = {};

        if (type) {
            whereClause.type = type.toUpperCase();
        }

        if (purpose) {
            whereClause.purpose = purpose.toUpperCase();
        }

        if (location) {
            whereClause.location = { contains: location, mode: 'insensitive' };
        }

        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } },
                { features: { has: search } },
            ];
        }

        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price.gte = parseFloat(minPrice);
            if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
        }

        return this.prisma.property.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const property = await this.prisma.property.findUnique({
            where: { id },
        });
        if (!property) throw new NotFoundException('Property not found');
        return property;
    }

    async update(id: string, updatePropertyDto: UpdatePropertyDto) {
        try {
            return await this.prisma.property.update({
                where: { id },
                data: updatePropertyDto,
            });
        } catch (error) {
            console.error('Prisma Update Error:', error);
            throw error;
        }
    }

    async remove(id: string) {
        return this.prisma.property.delete({
            where: { id },
        });
    }
}
