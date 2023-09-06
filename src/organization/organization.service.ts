import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async createNewOrganization(dto: CreateOrganizationDto, userId: string) {
    try {
      const organization = this.prisma.organization.create({
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

      // Eğer organizasyonlar boşsa, hata fırlat
      if (organizations.length === 0) {
        throw new ForbiddenException(
          'No organizations found for the given user.',
        );
      }

      return organizations;
    } catch (error) {
      throw new ForbiddenException('Failed to retrieve organizations.');
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
        throw new ForbiddenException('Organization not found.');
      }

      return organization;
    } catch (error) {
      throw new ForbiddenException('Failed to retrieve organization.');
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

      if (!organization || organization.createdById !== userId) {
        throw new ForbiddenException('Access to resources denied.');
      }

      const updatedOrganization = await this.prisma.organization.update({
        where: { id: organizationId },
        data: {
          ...dto,
        },
      });

      return updatedOrganization;
    } catch (error) {
      throw new ForbiddenException('Failed to update organization.');
    }
  }

  async deleteOrganizationById(userId: string, organizationId: string) {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: {
          id: organizationId,
        },
      });

      if (!organization || organization.createdById !== userId) {
        throw new ForbiddenException('Access to resources denied.');
      }

      await this.prisma.organization.delete({
        where: {
          id: organizationId,
        },
      });

      return { message: 'Organization deleted successfully.' };
    } catch (error) {
      throw new ForbiddenException('Failed to delete organization.');
    }
  }
}
