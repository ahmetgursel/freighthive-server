import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async createNewOrganization(dto: CreateOrganizationDto, userId: string) {
    try {
      const organization = await this.prisma.organization.create({
        data: {
          name: dto.name,
          address: dto.address,
          taxNumber: dto.taxNumber,
          taxOffice: dto.taxOffice,
          invoiceAddress: dto.invoiceAddress,
          createdById: userId,
        },
      });

      return organization;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Organization already exists');
        }
      }
      throw error;
    }
  }

  async getAllOrganizations(userId: string) {
    try {
      const organizations = await this.prisma.organization.findMany({
        where: {
          createdById: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return organizations;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve organizations.',
      );
    }
  }

  async getOrganizationById(userId: string, organizationId: string) {
    try {
      const organization = await this.prisma.organization.findFirst({
        where: {
          createdById: userId,
          id: organizationId,
        },
      });

      if (!organization) {
        throw new NotFoundException('Organization not found.');
      }

      return organization;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(
          'Failed to retrieve organization.',
        );
      } else {
        throw error;
      }
    }
  }

  async updateOrganizationById(
    userId: string,
    organizationId: string,
    dto: UpdateOrganizationDto,
  ) {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: {
          id: organizationId,
        },
      });

      if (!organization) {
        throw new NotFoundException('Organization not found');
      }

      if (organization.createdById !== userId) {
        throw new UnauthorizedException('Access to resources denied.');
      }

      const updatedOrganization = await this.prisma.organization.update({
        where: { id: organizationId },
        data: {
          ...dto,
        },
      });

      return updatedOrganization;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(
          'Failed to update organization.',
        );
      } else {
        throw error;
      }
    }
  }

  async deleteOrganizationById(userId: string, organizationId: string) {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: {
          id: organizationId,
        },
      });

      if (!organization) {
        throw new NotFoundException('Organization not found');
      }

      if (organization.createdById !== userId) {
        throw new UnauthorizedException('Access to resources denied.');
      }

      await this.prisma.organization.delete({
        where: {
          id: organizationId,
        },
      });

      return { message: 'Organization deleted successfully.' };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(
          'Failed to delete organization.',
        );
      } else {
        throw error;
      }
    }
  }
}
