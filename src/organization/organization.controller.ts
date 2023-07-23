import { Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';

@Controller('organizations')
export class OrganizationController {
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
  })
  @ApiBadRequestResponse({ description: 'Organization already exists' })
  createNewOrganization() {
    return 'createNewOrganization';
  }
}
