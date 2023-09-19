import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFacilityDto, UpdateFacilityDto } from './dto';

@Injectable()
export class FacilityService {
  constructor(private prisma: PrismaService) {}

  async createNewFacility(dto: CreateFacilityDto, userId: string) {
    try {
      const facility = await this.prisma.facility.create({
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
        orderBy: {
          createdAt: 'desc',
        },
      });

      return facilities;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve facilities.');
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
        throw new NotFoundException('Facility not found');
      }

      return facility;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(
          'Failed to retrieve facilities.',
        );
      } else {
        throw error;
      }
    }
  }

  async updateFacilityById(
    dto: UpdateFacilityDto,
    userId: string,
    facilityId: string,
  ) {
    try {
      const facility = await this.prisma.facility.findUnique({
        where: {
          id: facilityId,
        },
      });

      if (!facility) {
        throw new NotFoundException('Facility not found');
      }

      if (facility.createdById !== userId) {
        throw new UnauthorizedException('Access to resources denied.');
      }

      const updatedFacility = await this.prisma.facility.update({
        where: {
          id: facilityId,
        },
        data: {
          ...dto,
        },
      });

      return updatedFacility;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException('Failed to update facility.');
      } else {
        throw error;
      }
    }
  }

  async deleteFacilityById(userId: string, facilityId: string) {
    try {
      const facility = await this.prisma.facility.findUnique({
        where: { id: facilityId },
      });

      if (!facility) {
        throw new NotFoundException('Facility not found');
      }

      if (facility.createdById !== userId) {
        throw new UnauthorizedException('Access to resources denied.');
      }

      await this.prisma.facility.delete({
        where: {
          id: facilityId,
        },
      });

      return { message: 'Facility deleted successfully.' };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException('Failed to delete facility.');
      } else {
        throw error;
      }
    }
  }
}
