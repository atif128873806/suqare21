import { PrismaService } from '../common/prisma.service';
import { CreateLeadDto } from './dto/lead.dto';
export declare class LeadService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createLeadDto: CreateLeadDto): Promise<{
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        preferredArea: string | null;
        budget: number | null;
        source: string;
        propertyId: string | null;
        message: string | null;
    }>;
    findAll(): Promise<({
        property: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            location: string;
            status: import(".prisma/client").$Enums.PropertyStatus;
            title: string;
            description: string;
            type: import(".prisma/client").$Enums.PropertyType;
            purpose: import(".prisma/client").$Enums.PropertyPurpose;
            area: number | null;
            areaUnit: string | null;
            price: number;
            priceUnit: string | null;
            priceType: string | null;
            mapHtml: string | null;
            images: string[];
            videos: string[];
            features: string[];
            isFeatured: boolean;
        } | null;
    } & {
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        preferredArea: string | null;
        budget: number | null;
        source: string;
        propertyId: string | null;
        message: string | null;
    })[]>;
    findOne(id: string): Promise<{
        property: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            location: string;
            status: import(".prisma/client").$Enums.PropertyStatus;
            title: string;
            description: string;
            type: import(".prisma/client").$Enums.PropertyType;
            purpose: import(".prisma/client").$Enums.PropertyPurpose;
            area: number | null;
            areaUnit: string | null;
            price: number;
            priceUnit: string | null;
            priceType: string | null;
            mapHtml: string | null;
            images: string[];
            videos: string[];
            features: string[];
            isFeatured: boolean;
        } | null;
    } & {
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        preferredArea: string | null;
        budget: number | null;
        source: string;
        propertyId: string | null;
        message: string | null;
    }>;
    updateStatus(id: string, status: string): Promise<{
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string;
        preferredArea: string | null;
        budget: number | null;
        source: string;
        propertyId: string | null;
        message: string | null;
    }>;
}
