import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateTicketDto } from './dto';
import { TicketService } from './ticket.service';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('tickets')
export class TicketController {
  constructor(private ticket: TicketService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Tickets created successfully',
  })
  @ApiBadRequestResponse({ description: 'Container number already exists' })
  createNewTicket(@Body() dto: CreateTicketDto, @GetUser('id') userId: string) {
    return this.ticket.createNewTicket(dto, userId);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get all tickets.' })
  getAllTickets(@GetUser('id') userId: string) {
    return this.ticket.getAllTickets(userId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get ticket by ID' })
  getTicketById(@GetUser('id') userId: string, @Param('id') ticketId: string) {
    return this.ticket.getTicketById(userId, ticketId);
  }
}
