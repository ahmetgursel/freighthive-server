import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  taxNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  taxOffice: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  invoiceAddress: string;
}
