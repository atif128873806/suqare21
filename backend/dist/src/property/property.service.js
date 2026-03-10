"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let PropertyService = class PropertyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPropertyDto) {
        try {
            return await this.prisma.property.create({
                data: createPropertyDto,
            });
        }
        catch (error) {
            console.error('Prisma Create Error:', error);
            throw error;
        }
    }
    async findAll(filters) {
        const { type, purpose, minPrice, maxPrice, location, search } = filters;
        const whereClause = {};
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
            if (minPrice)
                whereClause.price.gte = parseFloat(minPrice);
            if (maxPrice)
                whereClause.price.lte = parseFloat(maxPrice);
        }
        return await this.prisma.property.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const property = await this.prisma.property.findUnique({
            where: { id },
        });
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        return property;
    }
    async update(id, updatePropertyDto) {
        try {
            return await this.prisma.property.update({
                where: { id },
                data: updatePropertyDto,
            });
        }
        catch (error) {
            console.error('Prisma Update Error:', error);
            throw error;
        }
    }
    async remove(id) {
        return await this.prisma.property.delete({
            where: { id },
        });
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertyService);
//# sourceMappingURL=property.service.js.map