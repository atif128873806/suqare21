import { IsEnum, IsNumber, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { PropertyType, PropertyPurpose, PropertyStatus } from '@prisma/client';

export class CreatePropertyDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsEnum(PropertyType)
    type: PropertyType;

    @IsEnum(PropertyPurpose)
    purpose: PropertyPurpose;

    @IsEnum(PropertyStatus)
    @IsOptional()
    status?: PropertyStatus;

    @IsNumber()
    @IsOptional()
    area?: number;

    @IsString()
    @IsOptional()
    areaUnit?: string;

    @IsNumber()
    price: number;

    @IsString()
    @IsOptional()
    priceUnit?: string;

    @IsString()
    @IsOptional()
    priceType?: string;

    @IsString()
    location: string;

    @IsString()
    @IsOptional()
    mapHtml?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    videos?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    features?: string[];

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;
}

export class UpdatePropertyDto extends CreatePropertyDto { }
