import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTruckDto, UpdateTruckDto } from './dto';

@Injectable()
export class TruckService {
  constructor(private prisma: PrismaService) {}

  async createNewTruck(dto: CreateTruckDto, userId: string) {
    try {
      const truck = await this.prisma.truck.create({
        data: {
          plateNumber: dto.plateNumber,
          driverName: dto.driverName,
          driverPhone: dto.driverPhone,
          capacity: dto.capacity,
          status: dto.status,
          createdById: userId,
        },
      });

      return truck;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Plate number already exists');
        }
      }
      throw error;
    }
  }

  async getAllTrucks(userId: string) {
    try {
      const trucks = await this.prisma.truck.findMany({
        where: {
          createdById: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          tickets: true,
        },
      });

      return trucks;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve trucks.');
    }
  }

  async getTruckById(userId: string, truckId: string) {
    try {
      const truck = await this.prisma.truck.findFirst({
        where: {
          createdById: userId,
          id: truckId,
        },
      });

      if (!truck) {
        throw new NotFoundException('Truck not found.');
      }
      return truck;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException('Failed to retrieve trucks.');
      } else {
        throw error;
      }
    }
  }

  async updateTruckById(userId: string, truckId: string, dto: UpdateTruckDto) {
    try {
      const truck = await this.prisma.truck.findUnique({
        where: {
          id: truckId,
        },
      });

      if (!truck) {
        throw new NotFoundException('Truck not found.');
      }

      if (truck.createdById !== userId) {
        throw new UnauthorizedException('Access to resources denied');
      }

      const updatedTruck = await this.prisma.truck.update({
        where: { id: truckId },
        data: {
          ...dto,
        },
      });

      return updatedTruck;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException('Failed to update truck.');
      } else {
        throw error;
      }
    }
  }

  async deleteTruckById(userId: string, truckId: string) {
    try {
      const truck = await this.prisma.truck.findUnique({
        where: {
          id: truckId,
        },
      });

      if (!truck) {
        throw new NotFoundException('Truck not found.');
      }

      if (truck.createdById !== userId) {
        throw new UnauthorizedException('Access to resources denied');
      }

      await this.prisma.truck.delete({
        where: {
          id: truckId,
        },
      });

      return { message: 'Truck deleted successfully.' };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException('Failed to delete truck.');
      } else {
        throw error;
      }
    }
  }
}
