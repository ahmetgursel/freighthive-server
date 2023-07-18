import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateTruckDto } from './dto';
import { TruckService } from './truck.service';

@ApiTags('Trucks')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('trucks')
export class TruckController {
  constructor(private truck: TruckService) {}

  @Post()
  createNewTruck(@Body() dto: CreateTruckDto, @GetUser('id') userId: string) {
    return this.truck.createNewTruck(dto, userId);
  }
}
