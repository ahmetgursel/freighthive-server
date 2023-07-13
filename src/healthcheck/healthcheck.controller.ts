import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('healthcheck')
export class HealthcheckController {
  @HttpCode(HttpStatus.OK)
  @Get()
  getHealthcheck() {
    return { status: 'OK' };
  }
}
