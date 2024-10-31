import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './domain/dto/createTicket.dto';
import { TransactionInterceptor } from 'src/common/services/transaction.interceptor';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AuthorizationGuard } from 'src/auth/guard/authorization.guard';
import { Permissions } from 'src/common/decorator/permissions.decorator';
import { Action } from 'src/role/domain/action.enum';

@ApiTags('ticket')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Post()
  @Permissions(Action.ticketCreate)
  @UseInterceptors(TransactionInterceptor)
  async create(
    @Request() req,
    @Body()
    createTicketDto: CreateTicketDto,
  ) {
    return await this.ticketService.create(req.user.sub, createTicketDto);
  }

  @Get('history')
  @Permissions(Action.ticketRead)
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getUserTickets(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;

    return await this.ticketService.paginateUserTickets(req.user.sub, {
      page,
      limit,
    });
  }
  @Get()
  @Permissions(Action.ticketAdminRead)
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getAllTickets(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;

    return await this.ticketService.paginateAllTickets({
      page,
      limit,
    });
  }
}