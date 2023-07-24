import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFacilityDto } from './dto';

@Injectable()
export class FacilityService {
  constructor(private prisma: PrismaService) {}

  createNewFacility(dto: CreateFacilityDto, userId: string) {
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
}
