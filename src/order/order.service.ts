import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { ItemService } from 'src/item/item.service';
import { CreateOrderItemDto } from './domain/dto/createOrderItem.dto';
import { UserTransaccionService } from 'src/user/user.transaccion.service';
@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private itemService: ItemService,
    private userservice: UserTransaccionService,
  ) {}

  async create(userId: string, items: CreateOrderItemDto[]) {
    const user = await this.userservice.getUser(userId);
    const order = await this.orderRepository.createOrder(user.id);
    await this.itemService.createItems(order.id, items);
    return order;
  }
}
