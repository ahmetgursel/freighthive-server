import { ApiProperty } from '@nestjs/swagger';
import { TruckStatus } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTruckDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  driverName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  driverPhone: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @ApiProperty({ enum: ['LOADED', 'UNLOADED'] })
  @IsString()
  @IsNotEmpty()
  status: TruckStatus;
}
