import { PropertyType, PropertyPurpose, PropertyStatus } from '@prisma/client';
export declare class CreatePropertyDto {
    title: string;
    description: string;
    type: PropertyType;
    purpose: PropertyPurpose;
    status?: PropertyStatus;
    area?: number;
    areaUnit?: string;
    price: number;
    priceUnit?: string;
    priceType?: string;
    location: string;
    mapHtml?: string;
    images?: string[];
    videos?: string[];
    features?: string[];
    isFeatured?: boolean;
}
export declare class UpdatePropertyDto extends CreatePropertyDto {
}
