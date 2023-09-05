import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Healthcheck')
@Controller('healthcheck')
export class HealthcheckController {
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'App is working' })
  getHealthcheck() {
    return { status: 'OK' };
  }
}
