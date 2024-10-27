import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionInterceptor } from 'src/common/services/transaction.interceptor';
import { OrderService } from './order.service';
import { CreateItemDto } from '../item/domain/dto/createItem.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AuthorizationGuard } from 'src/auth/guard/authorization.guard';
import { ApiQuery } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async createOrder(
    @Body(new ParseArrayPipe({ items: CreateItemDto }))
    data: CreateItemDto[],
    @Request() req,
  ) {
    if (data.length === 0) {
      throw new BadRequestException('Data array must not be empty.');
    }
    return await this.orderService.create(req.user.sub, data);
  }

  @Get('history')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getUserOrders(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.orderService.paginateUserOrders(req.user.sub, {
      page,
      limit,
    });
  }
  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getAllOrders(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.orderService.paginateAllOrders({
      page,
      limit,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findOne(id);
  }
}
