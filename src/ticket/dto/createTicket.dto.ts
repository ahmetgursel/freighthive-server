import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTicketDto {
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
  @IsNotEmpty()
  @ApiProperty()
  organizationId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  facilityId: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isInvoiceCreated: boolean;
}
