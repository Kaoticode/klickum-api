import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './domain/dto/createTicket.dto';
import { TransactionInterceptor } from '../common/services/transaction.interceptor';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { AuthorizationGuard } from '../auth/guard/authorization.guard';
import { Permissions } from '../common/decorator/permissions.decorator';
import { Action } from '../role/domain/action.enum';
import { PaginatedGeneralReponseDto } from '../common/domain/dto/general.paginatation';

@ApiTags('ticket')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async create(
    @Request() req,
    @Body()
    createTicketDto: CreateTicketDto,
  ) {
    return await this.ticketService.create(req.user.sub, createTicketDto);
  }

  @Get('history')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ type: PaginatedGeneralReponseDto })
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

  @Get('admin')
  @Permissions(Action.ticketRead)
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

  @Get(':id')
  async findOneById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.ticketService.findOneById(id);
  }
}
