import { IsString, IsOptional } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  visitorId: string;

  @IsString()
  message: string;
}

export class CaptureChatLeadDto {
  @IsString()
  visitorId: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  intent?: string;

  @IsOptional()
  @IsString()
  propertyType?: string;
}
