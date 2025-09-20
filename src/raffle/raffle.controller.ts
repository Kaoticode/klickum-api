import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
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
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { AuthorizationGuard } from '../auth/guard/authorization.guard';
import { RaffleService } from './raffle.service';
import { TransactionInterceptor } from '../common/services/transaction.interceptor';
import { Permissions } from '../common/decorator/permissions.decorator';
import { Action } from '../role/domain/action.enum';
import { UpdateRaffleStatusDto } from './domain/dto/updateRaffleStatus.dto';
import { PaginatedGeneralReponseDto } from '../common/domain/dto/general.paginatation';

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
  @ApiResponse({ type: PaginatedGeneralReponseDto })
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
  @ApiResponse({ type: PaginatedGeneralReponseDto })
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

  @Patch('status/:id')
  @Permissions(Action.raffleUpdate)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateRaffleStatusDto: UpdateRaffleStatusDto,
  ) {
    return await this.raffleService.updateStatus(id, updateRaffleStatusDto);
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.raffleService.findOnebyId(id);
  }
}
