import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';

interface PropertyWhereClause {
  type?: string;
  purpose?: string;
  location?: { contains: string; mode: 'insensitive' };
  OR?: Array<{
    title?: { contains: string; mode: 'insensitive' };
    description?: { contains: string; mode: 'insensitive' };
    location?: { contains: string; mode: 'insensitive' };
    features?: { has: string };
  }>;
  price?: { gte?: number; lte?: number };
}

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async create(createPropertyDto: CreatePropertyDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return await (this.prisma as any).property.create({
        data: createPropertyDto,
      });
    } catch (error) {
      console.error('Prisma Create Error:', error);
      throw error;
    }
  }

  async findAll(filters: Record<string, string | undefined>) {
    const { type, purpose, minPrice, maxPrice, location, search } = filters;

    const whereClause: PropertyWhereClause = {};

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

    if (minPrice ?? maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await (this.prisma as any).property.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const property = await (this.prisma as any).property.findUnique({
      where: { id },
    });
    if (!property) throw new NotFoundException('Property not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return await (this.prisma as any).property.update({
        where: { id },
        data: updatePropertyDto,
      });
    } catch (error) {
      console.error('Prisma Update Error:', error);
      throw error;
    }
  }

  async remove(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await (this.prisma as any).property.delete({
      where: { id },
    });
  }
}
