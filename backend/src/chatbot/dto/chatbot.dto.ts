import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  visitorId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
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
