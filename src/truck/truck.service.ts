import { ForbiddenException, Injectable } from '@nestjs/common';
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
    const trucks = await this.prisma.truck.findMany({
      where: {
        createdById: userId,
      },
    });

    // TODO: check findMany return array or null

    if (!trucks) {
      throw new Error('Failed to retrieve trucks.');
    }

    return trucks;
  }

  async getTruckById(userId: string, truckId: string) {
    const truck = await this.prisma.truck.findFirst({
      where: {
        createdById: userId,
        id: truckId,
      },
    });

    if (!truck) {
      throw new Error('Truck not found.');
    }
    return truck;
  }

  async updateTruckById(userId: string, truckId: string, dto: UpdateTruckDto) {
    const truck = await this.prisma.truck.findUnique({
      where: {
        id: truckId,
      },
    });

    if (!truck || truck.createdById !== userId)
      throw new ForbiddenException('Access to resources denied');

    try {
      const updatedTruck = await this.prisma.truck.update({
        where: { id: truckId },
        data: {
          ...dto,
        },
      });

      return updatedTruck;
    } catch (error) {
      throw new Error('Failed to update truck.');
    }
  }
}
