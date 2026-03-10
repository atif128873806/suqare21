import { PrismaService } from '../common/prisma.service';
import { CreateLeadDto } from './dto/lead.dto';
export declare class LeadService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createLeadDto: CreateLeadDto): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string | null;
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
            title: string;
            description: string;
            type: import(".prisma/client").$Enums.PropertyType;
            purpose: import(".prisma/client").$Enums.PropertyPurpose;
            status: import(".prisma/client").$Enums.PropertyStatus;
            area: number | null;
            areaUnit: string | null;
            price: number;
            priceUnit: string | null;
            priceType: string | null;
            location: string;
            images: string[];
            features: string[];
            isFeatured: boolean;
            createdAt: Date;
            updatedAt: Date;
            videos: string[];
            mapHtml: string | null;
        } | null;
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string | null;
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
            title: string;
            description: string;
            type: import(".prisma/client").$Enums.PropertyType;
            purpose: import(".prisma/client").$Enums.PropertyPurpose;
            status: import(".prisma/client").$Enums.PropertyStatus;
            area: number | null;
            areaUnit: string | null;
            price: number;
            priceUnit: string | null;
            priceType: string | null;
            location: string;
            images: string[];
            features: string[];
            isFeatured: boolean;
            createdAt: Date;
            updatedAt: Date;
            videos: string[];
            mapHtml: string | null;
        } | null;
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string | null;
        phone: string;
        preferredArea: string | null;
        budget: number | null;
        source: string;
        propertyId: string | null;
        message: string | null;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string | null;
        phone: string;
        preferredArea: string | null;
        budget: number | null;
        source: string;
        propertyId: string | null;
        message: string | null;
    }>;
}
