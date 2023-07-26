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
  @ApiProperty({ required: false })
  containerNumber?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  entryTime?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  exitTime?: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
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
