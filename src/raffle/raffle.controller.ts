import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateRaffleDto,
  UpdateRaffleDto,
} from './domain/dto/createRaffle.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { AuthorizationGuard } from '../auth/guard/authorization.guard';
import { RaffleService } from './raffle.service';
import { TransactionInterceptor } from '../common/services/transaction.interceptor';
import { Permissions } from '../common/decorator/permissions.decorator';
import { Action } from '../role/domain/action.enum';

@ApiTags('raffle')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('raffle')
export class RaffleController {
  constructor(private readonly raffleService: RaffleService) {}

  @Post()
  @Permissions(Action.raffleCreate)
  @UseInterceptors(TransactionInterceptor)
  async create(@Body() createRaffleDto: CreateRaffleDto, @Request() req) {
    return await this.raffleService.create(createRaffleDto);
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getAll(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;

    return await this.raffleService.paginateAll({ page, limit });
  }

  @Get('admin')
  @Permissions(Action.raffleRead)
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getAdminAll(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;

    return await this.raffleService.adminpaginateAll({ page, limit });
  }

  @Patch(':id')
  @Permissions(Action.raffleUpdate)
  async update(
    @Param('id') id: string,
    @Body() updateRaffleDto: UpdateRaffleDto,
  ) {
    return await this.raffleService.update(id, updateRaffleDto);
  }
}
