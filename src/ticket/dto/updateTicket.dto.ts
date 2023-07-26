import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  containerNumber?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty()
  entryTime?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty()
  exitTime?: Date;

  @IsString()
  @IsOptional()
  @ApiProperty()
  truckId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  organizationId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  facilityId?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isInvoiceCreated?: boolean;
}
