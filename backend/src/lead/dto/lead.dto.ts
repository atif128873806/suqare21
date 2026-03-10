import { IsString, IsOptional, IsEmail, IsNumber } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  preferredArea?: string;

  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsString()
  source: string; // "WEBSITE_FORM", "CHATBOT"

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  conversationId?: string;
}
