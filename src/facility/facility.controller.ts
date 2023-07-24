import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateFacilityDto } from './dto';
import { FacilityService } from './facility.service';

@ApiTags('Facility')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('facility')
export class FacilityController {
  constructor(private facility: FacilityService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Facility created successfully',
  })
  @ApiBadRequestResponse({ description: 'Facility already exists' })
  createNewFacility(
    @Body() dto: CreateFacilityDto,
    @GetUser('id') userId: string,
  ) {
    return this.facility.createNewFacility(dto, userId);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get all facilities' })
  getAllFacilities(@GetUser('id') userId: string) {
    return this.facility.getAllFacilities(userId);
  }
}
