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
import { CreateRaffleDto } from './domain/dto/createRaffle.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AuthorizationGuard } from 'src/auth/guard/authorization.guard';
import { RaffleService } from './raffle.service';
import { TransactionInterceptor } from 'src/common/services/transaction.interceptor';
import { Permissions } from 'src/common/decorator/permissions.decorator';
import { Action } from 'src/role/domain/action.enum';

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
  @Permissions(Action.raffleRead)
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
}
