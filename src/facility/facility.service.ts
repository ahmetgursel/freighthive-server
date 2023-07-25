import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFacilityDto } from './dto';

@Injectable()
export class FacilityService {
  constructor(private prisma: PrismaService) {}

  async createNewFacility(dto: CreateFacilityDto, userId: string) {
    try {
      const facility = this.prisma.facility.create({
        data: {
          name: dto.name,
          address: dto.address,
          city: dto.city,
          country: dto.country,
          createdById: userId,
        },
      });

      return facility;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Facility already exists');
        }
      }
      throw error;
    }
  }

  async getAllFacilities(userId: string) {
    try {
      const facilities = await this.prisma.facility.findMany({
        where: {
          createdById: userId,
        },
      });

      if (facilities.length === 0) {
        throw new ForbiddenException('No facilities found for the given user.');
      }

      return facilities;
    } catch (error) {
      throw new ForbiddenException('Failed to retrieve facilities.');
    }
  }

  async getFacilityById(userId: string, facilityId: string) {
    try {
      const facility = await this.prisma.facility.findFirst({
        where: {
          createdById: userId,
          id: facilityId,
        },
      });

      if (!facility) {
        throw new ForbiddenException('Facility not found');
      }

      return facility;
    } catch (error) {
      throw new ForbiddenException('Failed to retrieve facility.');
    }
  }
}
