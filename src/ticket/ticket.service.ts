import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto';
import { UpdateTicketDto } from './dto/updateTicket.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async createNewTicket(dto: CreateTicketDto, userId: string) {
    try {
      const ticket = await this.prisma.ticket.create({
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
        include: {
          facility: true,
          truck: true,
          organization: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return tickets;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tickets.');
    }
  }

  async getTicketById(userId: string, ticketId: string) {
    try {
      const ticket = await this.prisma.ticket.findFirst({
        where: {
          createdById: userId,
          id: ticketId,
        },
        include: {
          facility: true,
          truck: true,
          organization: true,
        },
      });

      if (!ticket) {
        throw new NotFoundException('Ticket not found.');
      }

      return ticket;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException('Failed to retrieve ticket.');
      } else {
        throw error;
      }
    }
  }

  async updateTicketById(
    userId: string,
    ticketId: string,
    dto: UpdateTicketDto,
  ) {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: {
          id: ticketId,
        },
      });

      if (!ticket) {
        throw new NotFoundException('Ticket not found');
      }

      if (ticket.createdById !== userId) {
        throw new UnauthorizedException('Access to resources denied.');
      }

      const updatedTicket = await this.prisma.ticket.update({
        where: { id: ticketId },
        data: {
          ...dto,
        },
      });

      return updatedTicket;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException('Failed to update ticket.');
      } else {
        throw error;
      }
    }
  }

  async deleteTicketById(userId: string, ticketId: string) {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: {
          id: ticketId,
        },
      });

      if (!ticket) {
        throw new NotFoundException('Ticket not found');
      }

      if (ticket.createdById !== userId) {
        throw new UnauthorizedException('Access to resources denied.');
      }

      await this.prisma.ticket.delete({
        where: {
          id: ticketId,
        },
      });

      return { message: 'Ticket deleted successfully.' };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException('Failed to delete ticket.');
      } else {
        throw error;
      }
    }
  }
}
