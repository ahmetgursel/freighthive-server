import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateTruckDto, UpdateTruckDto } from './dto';
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

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get truck by ID' })
  getTruckById(@GetUser('id') userId: string, @Param('id') truckId: string) {
    return this.truck.getTruckById(userId, truckId);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Updated truck by ID' })
  updateTruckById(
    @GetUser('id') userId: string,
    @Param('id') truckId: string,
    @Body() dto: UpdateTruckDto,
  ) {
    return this.truck.updateTruckById(userId, truckId, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Deleted truck by ID' })
  deleteTruckById(@GetUser('id') userId: string, @Param('id') truckId: string) {
    return this.truck.deleteTruckById(userId, truckId);
  }
}
