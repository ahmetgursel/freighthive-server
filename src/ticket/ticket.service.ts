import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async createNewTicket(dto: CreateTicketDto, userId: string) {
    try {
      const ticket = this.prisma.ticket.create({
        data: {
          containerNumber: dto.containerNumber,
          entryTime: dto.entryTime,
          exitTime: dto.exitTime,
          truckId: dto.truckId,
          organizationId: dto.organizationId,
          facilityId: dto.facilityId,
          isInvoiceCreated: dto.isInvoiceCreated,
          createdById: userId,
        },
      });

      return ticket;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Container number already exists');
        }
      }
      throw error;
    }
  }

  async getAllTickets(userId: string) {
    try {
      const tickets = await this.prisma.ticket.findMany({
        where: {
          createdById: userId,
        },
      });

      if (tickets.length === 0) {
        throw new ForbiddenException('No tickets found for the given user.');
      }

      return tickets;
    } catch (error) {
      throw new ForbiddenException('Failed to retrieve tickets.');
    }
  }
}
