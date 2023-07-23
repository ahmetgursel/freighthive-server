import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateOrganizationDto } from './dto';
import { OrganizationService } from './organization.service';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private organization: OrganizationService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
  })
  @ApiBadRequestResponse({ description: 'Organization already exists' })
  createNewOrganization(
    @Body() dto: CreateOrganizationDto,
    @GetUser('id') userId: string,
  ) {
    return this.organization.createNewOrganization(dto, userId);
  }
}
