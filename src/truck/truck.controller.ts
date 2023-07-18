import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiResponse({
    status: 201,
    description: 'Truck created successfully',
  })
  @ApiBadRequestResponse({ description: 'Plate number already exists' })
  createNewTruck(@Body() dto: CreateTruckDto, @GetUser('id') userId: string) {
    return this.truck.createNewTruck(dto, userId);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get all trucks' })
  getAllTrucks(@GetUser('id') userId: string) {
    return this.truck.getAllTrucks(userId);
  }
}
