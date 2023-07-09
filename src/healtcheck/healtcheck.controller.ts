import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('healtcheck')
export class HealtcheckController {
  @HttpCode(HttpStatus.OK)
  @Get()
  getHealtcheck() {
    return { status: 'OK' };
  }
}
