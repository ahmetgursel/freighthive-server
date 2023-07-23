import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizationDto } from './dto';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  createNewOrganization(dto: CreateOrganizationDto, userId: string) {
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
}
