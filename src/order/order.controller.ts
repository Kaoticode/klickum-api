import {
  BadRequestException,
  Body,
  Controller,
  ParseArrayPipe,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionInterceptor } from 'src/common/services/transaction.interceptor';
import { OrderService } from './order.service';
import { CreateItemDto } from '../item/domain/dto/createItem.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AuthorizationGuard } from 'src/auth/guard/authorization.guard';

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
}
