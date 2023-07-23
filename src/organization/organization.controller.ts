import {
  Body,
  Controller,
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
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';
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

  @Get()
  @ApiResponse({ status: 200, description: 'Get all organizations' })
  getAllOrganizations(@GetUser('id') userId: string) {
    return this.organization.getAllOrganizations(userId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get organization by ID' })
  getOrganizationById(
    @GetUser('id') userId: string,
    @Param('id') organizationId: string,
  ) {
    return this.organization.getOrganizationById(userId, organizationId);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Updated organization by ID' })
  updateOrganizationById(
    @Body() dto: UpdateOrganizationDto,
    @GetUser('id') userId: string,
    @Param('id') organizationId: string,
  ) {
    return this.organization.updateOrganizationById(
      userId,
      organizationId,
      dto,
    );
  }
}
