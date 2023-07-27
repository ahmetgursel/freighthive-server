import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  containerNumber?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  entryTime?: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  exitTime?: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  truckId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  organizationId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  facilityId?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  isInvoiceCreated?: boolean;
}
